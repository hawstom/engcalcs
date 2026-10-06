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
//   6. on a phone, a tap takes the whole map;
//   7. the dragged rectangle is half opaque (Tom, 2026-10-05: "Try 50%.");
//   8. the Screenshot box opens with the snip, stays usable above the veil, and its magnification
//      sets the picture's pixel size, remembered in this browser as `lpn_snipbox`;
//   9. nothing is added to the picture: no tile credit, even with tiles in it (Tom, 2026-10-05:
//      "Give the user exactly what they snip. Don't add anything including the Mapbox credits.").
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
	// Every string any canvas paints, so a credit drawn in as text is caught by its words.
	window.__snipTexts = [];
	const ft = CanvasRenderingContext2D.prototype.fillText;
	CanvasRenderingContext2D.prototype.fillText = function (t) { window.__snipTexts.push(String(t)); return ft.apply(this, arguments); };
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
// A capture now opens the markup view; the picture reaches the clipboard when Copy is pressed.
async function waitBlobs(page, n) {
	await page.waitForSelector('#lpn_snip_copy', { state: 'visible', timeout: 15000 });
	await page.click('#lpn_snip_copy');
	await page.waitForFunction((k) => (window.__snipBlobs || []).length >= k, n, { timeout: 15000 });
	await page.keyboard.press('Escape');   // close the markup view
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
		// 8a. The box opens with the mode, at 3x, and stays usable above the veil.
		const sbox = await page.evaluate(() => {
			const b = document.getElementById('lpn_snip_box'), sel = document.getElementById('lpn_snip_scale');
			if (!b || getComputedStyle(b).display === 'none') { return null; }
			const r = sel.getBoundingClientRect(), hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
			return { scale: sel.value, options: Array.from(sel.options).map((o) => o.value).join(','), onTop: b.contains(hit),
				title: document.getElementById('lpn_snip_title').textContent.trim() };
		});
		ok('the Screenshot box opens with the snip', !!sbox, JSON.stringify(sbox));
		ok('...titled Screenshot, offering 1x to 4x, at 3x', !!sbox && sbox.title === LABEL && sbox.options === '1,2,3,4' && sbox.scale === '3', JSON.stringify(sbox));
		ok('...and its control is above the veil, so it can be used during the snip', !!sbox && sbox.onTop, JSON.stringify(sbox));
		ok('nothing is written to this browser just by opening it', (await page.evaluate(() => localStorage.getItem('lpn_snipbox'))) === null);
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
		const opacity = await page.$eval('.lpn-snip-rect', (e) => getComputedStyle(e).opacity);
		ok('the dragged rectangle is half opaque (0.5)', opacity === '0.5', opacity);
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

		// 4b. Tiles in the picture carry NO credit (Tom, 2026-10-05: "Give the user exactly what they
		// snip. Don't add anything including the Mapbox credits."). Net1 is a grid drawing, so one
		// light tile is laid under the whole map in the basemap layer, exactly where real tiles live,
		// and the credit's own set is shown on screen, where it stays.
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
		await page.evaluate(() => { window.__snipTexts = []; });
		await startSnip(a, LABEL);
		await page.mouse.click(map.x + map.w / 2, map.y + map.h / 2);
		await waitBlobs(page, 3);
		png = await page.evaluate(LAST_PNG);
		ok('with tiles drawn the picture carries them', !!png && png.ink > 1000, png && png.ink + ' pixels off the background');
		ok('...and nothing is painted into its bottom-right corner, where a credit would go', !!png && png.cornerDark === 0,
			png && png.cornerDark + ' dark pixels');
		const texts = await page.evaluate(() => window.__snipTexts);
		ok('...and no credit text is drawn into it', !texts.some((t) => /OpenStreetMap|Mapbox|\u00a9|Maxar/i.test(t)),
			JSON.stringify(texts.filter((t) => /OpenStreetMap|Mapbox|\u00a9|Maxar/i.test(t))));
		if (process.env.SNIP_SHOTS) {
			const b64 = await page.evaluate(async () => { const b = window.__snipBlobs[window.__snipBlobs.length - 1]; const u = new Uint8Array(await b.arrayBuffer()); let s = ''; for (let i = 0; i < u.length; i += 8192) { s += String.fromCharCode.apply(null, u.subarray(i, i + 8192)); } return btoa(s); });
			require('fs').writeFileSync(path.join(process.env.SNIP_SHOTS, 'screenshot-tiles.png'), Buffer.from(b64, 'base64'));
		}
		await page.evaluate(() => document.getElementById('snip_fake_tile').remove());

		// 8b. The box's magnification sets the picture's size: 2x for the whole map, 4x for a drag.
		await startSnip(a, LABEL);
		await page.selectOption('#lpn_snip_scale', '2');
		await page.mouse.click(map.x + map.w / 2, map.y + map.h / 2);
		await waitBlobs(page, 4);
		png = await page.evaluate(LAST_PNG);
		ok('at 2x a click gives the whole map at 2x (' + Math.round(map.w * 2) + ' x ' + Math.round(map.h * 2) + ')',
			!!png && png.w === Math.round(map.w * 2) && png.h === Math.round(map.h * 2), png && (png.w + ' x ' + png.h));
		const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('lpn_snipbox') || 'null'));
		ok('...and the choice is remembered in this browser as lpn_snipbox', !!stored && stored.scale === 2 && !('open' in stored), JSON.stringify(stored));
		await startSnip(a, LABEL);
		await page.selectOption('#lpn_snip_scale', '4');
		const r4 = { x: Math.round(map.x + map.w * 0.3), y: Math.round(map.y + map.h * 0.3), w: 200, h: 150 };
		await page.mouse.move(r4.x, r4.y);
		await page.mouse.down();
		await page.mouse.move(r4.x + r4.w, r4.y + r4.h, { steps: 6 });
		await page.mouse.up();
		await waitBlobs(page, 5);
		png = await page.evaluate(LAST_PNG);
		ok('at 4x a drag gives 4x the rectangle (800 x 600)', !!png && png.w === 800 && png.h === 600, png && (png.w + ' x ' + png.h));
		// 8c. The box's own Screenshot button repeats the shot at the chosen magnification.
		await page.selectOption('#lpn_snip_scale', '2');
		const before = await page.evaluate(() => window.__snipBlobs.length);
		const againLabel = await page.evaluate(() => document.getElementById('lpn_snip_again') && document.getElementById('lpn_snip_again').textContent.trim());
		ok('the box has a button labelled Screenshot', againLabel === LABEL, againLabel);
		await page.focus('#lpn_snip_again');
		await page.keyboard.press('Enter');
		await waitBlobs(page, before + 1);
		await page.click('#lpn_snip_again');
		await waitBlobs(page, before + 2);
		const two = await page.evaluate(() => window.__snipBlobs.length);
		png = await page.evaluate(LAST_PNG);
		ok('pressing it twice (keyboard, then mouse) makes two pictures', two === before + 2, before + ' -> ' + two);
		ok('...each the whole map at the chosen 2x', !!png && png.w === Math.round(map.w * 2) && png.h === Math.round(map.h * 2), png && (png.w + ' x ' + png.h));
		ok('...with no veil left over', await page.evaluate(() => !document.querySelector('.lpn-snip-veil')));
		const keptOpen = await page.evaluate(() => getComputedStyle(document.getElementById('lpn_snip_box')).display !== 'none');
		ok('the box stays open after the snip', keptOpen);
		await page.click('#lpn_snip_close');
		ok('its x closes it', await page.evaluate(() => getComputedStyle(document.getElementById('lpn_snip_box')).display === 'none'));

		// 4c. Docking the box while a snip waits narrows the map: the veil and the drag follow it.
		await startSnip(a, LABEL);
		await page.click('#lpn_snip_box .lpn-corner-btn[data-dock="right"]');
		await a.settle(600);
		const VEIL = () => { const v = document.querySelector('.lpn-snip-veil'), r = v.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; };
		const mapD = await page.evaluate(MAP_RECT), veilD = await page.evaluate(VEIL);
		ok('docking the box narrows the map', mapD.w < map.w - 50, map.w + ' -> ' + mapD.w);
		ok('...and the veil follows the map\'s new rectangle',
			Math.abs(veilD.x - mapD.x) < 1.5 && Math.abs(veilD.y - mapD.y) < 1.5 && Math.abs(veilD.w - mapD.w) < 1.5 && Math.abs(veilD.h - mapD.h) < 1.5,
			JSON.stringify(veilD) + ' vs ' + JSON.stringify(mapD));
		await page.mouse.move(mapD.x + 100, mapD.y + 100);
		await page.mouse.down();
		await page.mouse.move(mapD.x + mapD.w + 150, mapD.y + 200, { steps: 6 });
		const over = await page.$eval('.lpn-snip-rect', (e) => { const r = e.getBoundingClientRect(); return { right: r.right }; });
		ok('a drag past the map edge is held to the map', over.right <= mapD.x + mapD.w + 1.5, over.right + ' vs map right ' + (mapD.x + mapD.w));
		await page.mouse.up();
		await waitBlobs(page, 6);
		png = await page.evaluate(LAST_PNG);
		ok('...and the picture is no wider than the map allows', !!png && png.w <= Math.round((mapD.w - 100) * 4) + 8, png && png.w);
		await page.click('#lpn_snip_box .lpn-corner-btn[data-dock="float"]');
		await a.settle(400);
		await startSnip(a, LABEL);
		const mapF = await page.evaluate(MAP_RECT), veilF = await page.evaluate(VEIL);
		ok('floating it again gives the map back, and a new veil matches', Math.abs(veilF.w - mapF.w) < 1.5 && mapF.w > mapD.w + 50, JSON.stringify(veilF));
		await page.keyboard.press('Escape');
		await page.click('#lpn_snip_close');

		// 5. No clipboard: a download, and a notice that says so.
		await page.evaluate(() => { delete navigator.clipboard; Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }); });
		await startSnip(a, LABEL);
		await page.mouse.click(map.x + map.w / 2, map.y + map.h / 2);
		await page.waitForSelector('#lpn_snip_copy', { state: 'visible', timeout: 15000 });
		const [dl] = await Promise.all([
			page.waitForEvent('download', { timeout: 15000 }),
			page.click('#lpn_snip_copy')
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
		ok('on a phone the box does not open over the map it would cover',
			await page.evaluate(() => getComputedStyle(document.getElementById('lpn_snip_box')).display === 'none'));
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
