// NO-VISIBLE-CHANGE PROOF for the theming work (Task 714). Screenshots a fixed set of chrome states
// and pixel-diffs two such sets, so a token rewrite that silently moved a colour cannot ship.
//
//   node dev/browser-pass/pixel-shots.js shoot /tmp/before     # serve THIS checkout, write PNGs
//   node dev/browser-pass/pixel-shots.js shoot /tmp/after
//   node dev/browser-pass/pixel-shots.js diff /tmp/before /tmp/after     # exit 1 on any pixel
//
// Run `shoot` under `flock /tmp/engcalcs-browser.lock`. Network is cut for anything but our own
// server, animations are stopped, and the window is a fixed 1400x1000, so two runs of one tree agree.
const fs = require('fs');
const path = require('path');
const { startServer, stopServer, pageUrl, launchBrowser } = require('./lib/env');
const { readPng } = require('./lib/png');

const FREEZE = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}';

async function shoot(dir) {
	fs.mkdirSync(dir, { recursive: true });
	const playwright = require('playwright-core');
	await startServer();
	const browser = await launchBrowser(playwright);
	const ctx = await browser.newContext({ viewport: { width: 1400, height: 1000 } });
	await ctx.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (r) => r.abort());
	const page = await ctx.newPage();
	const snap = async (name) => {
		// Wait until two consecutive frames agree: the menu bar finishes laying out a moment after load.
		let prev = null, buf = null;
		for (let i = 0; i < 8; i++) {
			await page.waitForTimeout(400);
			buf = await page.screenshot();
			if (prev && prev.equals(buf)) { break; }
			prev = buf;
		}
		fs.writeFileSync(path.join(dir, name + '.png'), buf);
		console.log('shot', name);
	};
	const open = async (rel) => {
		await page.goto(pageUrl(rel), { waitUntil: 'load' });
		await page.addStyleTag({ content: FREEZE });
		await page.waitForTimeout(2500);
	};
	const rowClick = async (menu, label) => {
		await page.click('#lpn_menu_' + menu);
		await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		const rows = await page.$$('#lpn_menu_list button.lpn-menu-row');
		for (const r of rows) {
			const t = (await r.evaluate((e) => { const a = e.querySelector('.lpn-menu-arrow'); return (a ? e.textContent.replace(a.textContent, '') : e.textContent).trim(); }));
			if (t === label) { await r.click(); await page.waitForTimeout(500); return; }
		}
		throw new Error('no row ' + label);
	};
	try {
		for (const [name, rel] of [['calc-manning-pipe-flow', 'Manning-Pipe-Flow.php'], ['calc-hazen-williams', 'Hazen-Williams.php'], ['calc-micro-hydro', 'Micro-Hydro-Power.php']]) {
			await open(rel); await snap(name);
		}
		await open('Looped-Network.php');
		await snap('lpn-empty-gallery');
		await page.hover('#lpn_menu_file'); await snap('lpn-menubar-hover');
		await page.mouse.move(5, 5);
		await page.click('#lpn_menu_file'); await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		await snap('lpn-file-menu-open');
		await open('Looped-Network.php');
		const cards = await page.$$('#lpn_examples_pane .lpn-example-card');
		let net3 = null;
		for (const c of cards) { const t = await c.$eval('.lpn-example-title', (e) => e.textContent.trim()); if (t === 'EPANET Net3') { net3 = c; } }
		await cards[1].hover(); await snap('lpn-gallery-card-hover');
		await net3.evaluate((e) => e.click()); await page.waitForTimeout(2500);
		await page.mouse.move(5, 5);
		await snap('lpn-net3');
		await rowClick('project', 'Settings'); await snap('lpn-net3-settings');
		await rowClick('project', 'Tables'); await snap('lpn-net3-tables');
		await rowClick('edit', 'Find and replace'); await snap('lpn-net3-find');
		await page.click('#lpn_settings_box button[aria-label], #lpn_settings_box .lpn-popover-x', { timeout: 2000 }).catch(() => {});
		await page.evaluate(() => { for (const id of ['lpn_settings_box', 'lpn_findbox']) { const e = document.getElementById(id); if (e) { e.style.display = 'none'; } } });
		const pt = await page.evaluate(() => { for (const n of document.querySelectorAll('#lpn_canvas .lpn-node')) { const r = n.getBoundingClientRect(); if (r.x > 480 && r.x < 780 && r.y > 200 && r.y < 560) { return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; } } return null; });
		await page.mouse.click(pt.x, pt.y); await snap('lpn-net3-selected-properties');
		await page.click('#lpn_menu_help'); await page.waitForSelector('#lpn_menu_popup', { state: 'visible' }); await snap('lpn-help-menu-open');
		await page.hover('#lpn_toolbar button >> nth=3'); await snap('lpn-toolbar-hover');
	} finally { await browser.close(); stopServer(); }
}

function diff(a, b) {
	let bad = 0;
	for (const f of fs.readdirSync(a).filter((x) => x.endsWith('.png')).sort()) {
		if (!fs.existsSync(path.join(b, f))) { console.log('MISSING', f); bad++; continue; }
		const A = readPng(fs.readFileSync(path.join(a, f))), B = readPng(fs.readFileSync(path.join(b, f)));
		if (A.w !== B.w || A.h !== B.h) { console.log('SIZE', f); bad++; continue; }
		let n = 0, x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
		for (let i = 0; i < A.w * A.h; i++) {
			let d = false;
			for (let k = 0; k < A.bpp; k++) { if (A.data[i * A.bpp + k] !== B.data[i * B.bpp + k]) { d = true; } }
			if (d) { n++; const x = i % A.w, y = (i / A.w) | 0; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
		}
		console.log((n ? 'DIFF ' : 'same ') + f + (n ? '  ' + n + ' px in box ' + [x0, y0, x1, y1].join(',') : ''));
		if (n) { bad++; }
	}
	return bad;
}

(async () => {
	const [cmd, a, b] = process.argv.slice(2);
	if (cmd === 'shoot') { await shoot(a); }
	else if (cmd === 'diff') { process.exit(diff(a, b) ? 1 : 0); }
	else { console.error('usage: shoot DIR | diff DIR1 DIR2'); process.exit(2); }
})().catch((e) => { console.error(e); stopServer(); process.exit(1); });
