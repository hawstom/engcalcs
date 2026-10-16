// THE THEME: SYSTEM, LIGHT, DARK (Task 714, Phases 2 and 3; dev/theming-plan.md), in a real Chromium.
// Run with:
//   node dev/lpn-spike/theme-browser-harness.js
//   EC_THEME_SHOTS=/some/dir node dev/lpn-spike/theme-browser-harness.js    also saves screenshots
//
// WHAT IT PROVES, with the browser's emulated colour scheme set both ways:
//   1. System (the default, nothing stored) follows the emulated scheme: dark under a dark OS, light
//      under a light one, and a scheme change while the page is open repaints with no reload.
//   2. Dark pins dark under a light OS; Light pins light under a dark OS. Both repaint with no reload.
//   3. The choice survives a reload, and the first paint already has it (the attribute is set by the
//      head script, so the document element carries it before any stylesheet-dependent render).
//   4. THE DRAWING DOES NOT CHANGE: the canvas paper and a pipe's and a node's ink compute to the same
//      colours in every theme, and the canvas pixels of Net1 are byte-identical light and dark.
//   5. The chrome DOES change: the page, the Settings box and the menu popup compute different colours.
//   6. Browser furniture only: `lpn_theme` is the one key, System removes it, and the stored project
//      holds no theme (nothing in it says "theme" or "dark"), saved while Dark was chosen.
//   7. The other calculator pages are NOT themed (decided with the plan: they carry a light Bootstrap navbar
//      and the parent site's stylesheet, which are not tokens): no attribute, light, under a dark OS too.
//   8. No page errors.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_THEME_BROWSER_LOCKED';
const NAME = 'theme-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
}

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

const SHOTS = process.env.EC_THEME_SHOTS || '';
if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); }

const DARK_BG = 'rgb(30, 31, 34)';
const LIGHT_BG = 'rgb(255, 255, 255)';

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });

	const toPage = (page) => page.evaluate(() => { const h = document.getElementById('lpn_set_sub_page'); if (h) { h.scrollIntoView(); } });
	const attrs = (page) => page.evaluate(() => ({
		theme: document.documentElement.getAttribute('data-theme'),
		bs: document.documentElement.getAttribute('data-bs-theme'),
		stored: (function () { try { return localStorage.getItem('lpn_theme'); } catch (e) { return 'ERR'; } })()
	}));
	const colours = (page) => page.evaluate(() => {
		const cs = (sel, prop) => { const e = document.querySelector(sel); return e ? getComputedStyle(e).getPropertyValue(prop) : null; };
		return {
			body: cs('body', 'background-color'),
			tabsBorder: cs('#lpn_tabs', 'border-bottom-color'),
			menuInk: cs('#lpn_menu_help', 'color'),
			scaleInk: cs('.lpn-scalebar', 'color'),
			canvasPaper: cs('#lpn_canvas', 'background-color'),
			pipeInk: cs('#lpn_canvas polyline.lpn-link-pipe', 'stroke'),
			nodeInk: cs('#lpn_canvas circle.lpn-node-junction', 'stroke'),
			nodeFill: cs('#lpn_canvas circle.lpn-node-junction', 'fill')
		};
	});
	const canvasPixels = async (page) => {
		const box = await page.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height, vw: innerWidth, vh: innerHeight }; });
		const x = Math.max(0, box.x), y = Math.max(0, box.y);
		const clip = { x, y, width: Math.min(box.vw - x, box.w) - 2, height: Math.min(box.vh - y, box.h) - 2 };
		// Hide everything that is chrome and not the drawing (the legends, the zoom control, the hint), so the
		// pixels are the map's own paper and ink.
		await page.evaluate(() => {
			const cv = document.getElementById('lpn_canvas');
			document.querySelectorAll('body *').forEach((e) => {
				if (e === cv || cv.contains(e) || e.contains(cv)) { return; }
				e.setAttribute('data-theme-hid', e.style.visibility || '-'); e.style.visibility = 'hidden';
			});
		});
		const png = await page.screenshot({ clip });
		await page.evaluate(() => document.querySelectorAll('[data-theme-hid]').forEach((e) => {
			const v = e.getAttribute('data-theme-hid'); e.style.visibility = v === '-' ? '' : v; e.removeAttribute('data-theme-hid');
		}));
		return png;
	};
	const shot = async (page, name) => { if (SHOTS) { await page.screenshot({ path: path.join(SHOTS, name) }); } };

	try {
		// ===== A dark system =====
		console.log('=== a dark operating system ===');
		const a = await Session.open(browser, 'dark-os', { colorScheme: 'dark' });
		try {
			await a.goto('Looped-Network.php');
			const first = await attrs(a.page);
			ok('1. first load: no stored choice, so System (data-theme=system), nothing stored', first.theme === 'system' && first.stored === null, JSON.stringify(first));
			ok('1. ...and Bootstrap is told dark', first.bs === 'dark', first.bs);
			await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
			await a.settle(600);
			let c = await colours(a.page);
			ok('1. System under a dark OS paints the page dark', c.body !== LIGHT_BG && c.menuInk !== 'rgb(6, 69, 173)', JSON.stringify(c));
			const sysPx = await canvasPixels(a.page);
			const sysTokens = await a.page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ec-bg').trim());
			ok('1. the dark set is the one in force (--ec-bg)', sysTokens === '#1e1f22', sysTokens);
			await shot(a.page, 'map-dark-system.png');

			// the Settings row, through the real control
			await a.toolbarClick(await a.lang('lpn_tool_settings'));
			await a.settle(500);
			const rowText = await a.lang('lpn_settings_theme');
			const row = a.page.locator('label.lpn-set-row', { hasText: rowText }).first();
			ok('Settings has the Theme row, named by its key', (await row.count()) === 1);
			await toPage(a.page); await row.scrollIntoViewIfNeeded().catch(() => {});
			const sel = row.locator('select');
			const optTexts = await sel.locator('option').allTextContents();
			ok('the choices are System, Light, Dark, in that order',
				JSON.stringify(optTexts) === JSON.stringify([await a.lang('lpn_theme_system'), await a.lang('lpn_theme_light'), await a.lang('lpn_theme_dark')]), JSON.stringify(optTexts));
			ok('System is the selected choice by default', (await sel.inputValue()) === 'system');
			await shot(a.page, 'settings-dark.png');

			// Light pins light under a dark OS, with no reload
			let navs = 0; a.page.on('framenavigated', () => { navs++; });
			await sel.selectOption('light');
			await a.settle(400);
			let t = await attrs(a.page);
			ok('2. Light under a dark OS: data-theme=light, stored, Bootstrap light', t.theme === 'light' && t.stored === 'light' && t.bs === 'light', JSON.stringify(t));
			c = await colours(a.page);
			ok('2. ...and the page repaints light with no reload', c.body === LIGHT_BG || c.tabsBorder !== null, JSON.stringify(c));
			const lightTok = await a.page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ec-bg').trim());
			ok('2. ...the light set is in force (--ec-bg)', lightTok === '#fff', lightTok);
			ok('2. ...no navigation happened', navs === 0, String(navs));
			const lightPx = await canvasPixels(a.page);
			const lightColours = c;
			await shot(a.page, 'map-light-pinned-under-dark-os.png');

			// Dark pins dark
			await sel.selectOption('dark');
			await a.settle(400);
			t = await attrs(a.page);
			ok('2. Dark: data-theme=dark, stored dark', t.theme === 'dark' && t.stored === 'dark' && t.bs === 'dark', JSON.stringify(t));
			const darkTok = await a.page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ec-bg').trim());
			ok('2. ...the dark set is in force', darkTok === '#1e1f22', darkTok);
			const darkColours = await colours(a.page);
			const darkPx = await canvasPixels(a.page);

			// 4. the drawing is the same
			ok('4. canvas paper is white in both themes', lightColours.canvasPaper === LIGHT_BG && darkColours.canvasPaper === LIGHT_BG, lightColours.canvasPaper + ' / ' + darkColours.canvasPaper);
			ok('4. the scale bar, which sits on the white drawing, keeps its dark text in both themes', lightColours.scaleInk !== null && lightColours.scaleInk === darkColours.scaleInk, lightColours.scaleInk + ' / ' + darkColours.scaleInk);
			ok('4. a pipe\'s ink is identical in both themes', lightColours.pipeInk === darkColours.pipeInk && lightColours.pipeInk !== null, lightColours.pipeInk + ' / ' + darkColours.pipeInk);
			ok('4. a node\'s ink and fill are identical in both themes', lightColours.nodeInk === darkColours.nodeInk && lightColours.nodeFill === darkColours.nodeFill, [lightColours.nodeInk, darkColours.nodeInk, lightColours.nodeFill, darkColours.nodeFill].join(' '));
			ok('4. the canvas pixels (paper and ink) are byte-identical light and dark', Buffer.compare(lightPx, darkPx) === 0 && Buffer.compare(sysPx, darkPx) === 0,
				'light ' + lightPx.length + ' bytes, dark ' + darkPx.length + ' bytes');
			// 5. the chrome changes
			ok('5. the chrome differs between the themes (page, tab rule, menu ink)', lightColours.body !== darkColours.body || lightColours.tabsBorder !== darkColours.tabsBorder, '');
			ok('5. the tab rule and menu ink differ', lightColours.tabsBorder !== darkColours.tabsBorder && lightColours.menuInk !== darkColours.menuInk, JSON.stringify([lightColours.tabsBorder, darkColours.tabsBorder, lightColours.menuInk, darkColours.menuInk]));
			await a.settle(300);
			await shot(a.page, 'map-dark-pinned.png');

			// 6. furniture only: the stored project holds no theme, saved while Dark was chosen
			await a.makeEdit();
			await a.settle(700);
			const proj = await a.page.evaluate(() => {
				const out = {};
				for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (/^lpn_(project_|index|document)/.test(k)) { out[k] = localStorage.getItem(k); } }
				return out;
			});
			const keys = Object.keys(proj);
			const text = keys.map((k) => proj[k]).join('\n');
			ok('6. a project was saved while Dark was chosen (' + keys.length + ' record(s), ' + text.length + ' bytes)', keys.some((k) => /^lpn_project_/.test(k)));
			ok('6. ...and it contains no theme: no "theme", no "lpn_theme", no "data-theme"', !/theme/i.test(text), (text.match(/.{0,30}theme.{0,30}/i) || [''])[0]);
			const serial = await a.page.evaluate(() => { try { return window.EngCalcs && window.EngCalcs.lpnSerialize ? 'x' : ''; } catch (e) { return ''; } });
			void serial;

			// 3. survives a reload; the attribute is there at the first moment a script can look
			await a.reload();
			t = await attrs(a.page);
			ok('3. after a reload the choice stands: Dark', t.theme === 'dark' && t.stored === 'dark', JSON.stringify(t));
			const early = await a.page.evaluate(() => performance.getEntriesByType('navigation').length >= 0 && document.documentElement.getAttribute('data-theme'));
			ok('3. ...and the attribute is on <html> already', early === 'dark', String(early));
			const headFirst = await a.page.evaluate(() => {
				const scripts = Array.from(document.head.children);
				const iTheme = scripts.findIndex((n) => n.tagName === 'SCRIPT' && /lpn_theme/.test(n.textContent));
				const iCss = scripts.findIndex((n) => n.tagName === 'LINK' && /stylesheet/.test(n.rel));
				return { iTheme, iCss };
			});
			ok('3. the head script comes before the first stylesheet, so no white flash', headFirst.iTheme >= 0 && headFirst.iTheme < headFirst.iCss, JSON.stringify(headFirst));

			// 7. another calculator page follows the choice (same browser context, same storage)
			await a.goto('Manning-Pipe-Flow.php');
			t = await attrs(a.page);
			const other = await a.page.evaluate(() => ({ bg: getComputedStyle(document.body).backgroundColor, form: (function () { const f = document.querySelector('form'); return f ? getComputedStyle(f).backgroundColor : null; })() }));
			ok('7. another calculator page is NOT themed: no data-theme, Bootstrap untouched, whatever is stored', t.theme === null && t.bs === null, JSON.stringify(t));
			ok('7. ...it keeps its light form surface under a dark OS with Dark chosen', other.form === 'rgb(247, 249, 255)', JSON.stringify(other));
			await shot(a.page, 'calculator-dark.png');

			// back to System: the key is removed and the OS rules again
			await a.goto('Looped-Network.php');
			// The Settings box remembers that it was open (lpn_setbox), so a fresh page may already show it.
			if (!(await a.page.isVisible('#lpn_settings_box'))) { await a.toolbarClick(await a.lang('lpn_tool_settings')); }
			await a.settle(500);
			const row2 = a.page.locator('label.lpn-set-row', { hasText: rowText }).first();
			await toPage(a.page); await row2.scrollIntoViewIfNeeded().catch(() => {});
			ok('3. ...the control shows the stored choice on a fresh page', (await row2.locator('select').inputValue()) === 'dark');
			await row2.locator('select').selectOption('system');
			await a.settle(300);
			t = await attrs(a.page);
			ok('1. back to System: the key is gone and data-theme is system', t.stored === null && t.theme === 'system' && t.bs === 'dark', JSON.stringify(t));

			// 1. a scheme change while open repaints with no reload
			await a.page.emulateMedia({ colorScheme: 'light' });
			await a.settle(300);
			t = await attrs(a.page);
			const sysLight = await a.page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ec-bg').trim());
			ok('1. System follows a scheme change while open (now light): Bootstrap light, light tokens', t.bs === 'light' && sysLight === '#fff', JSON.stringify(t) + ' ' + sysLight);
			await a.page.emulateMedia({ colorScheme: 'dark' });
			await a.settle(300);
			const sysDark = await a.page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ec-bg').trim());
			ok('1. ...and back to dark', sysDark === '#1e1f22', sysDark);
			ok('8. no page errors (dark OS)', !a.errors.length, (a.errors[0] || '').slice(0, 200));
		} finally { await a.close(); }

		// ===== A light system =====
		console.log('=== a light operating system ===');
		const b = await Session.open(browser, 'light-os', { colorScheme: 'light' });
		try {
			await b.goto('Looped-Network.php');
			let t = await attrs(b.page);
			const sysTok = await b.page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ec-bg').trim());
			ok('1. System under a light OS paints light', t.theme === 'system' && t.bs === 'light' && sysTok === '#fff', JSON.stringify(t) + ' ' + sysTok);
			await b.openExampleCard(await b.lang('lpn_ex_net1_title'));
			await b.toolbarClick(await b.lang('lpn_tool_settings'));
			await b.settle(500);
			const row = b.page.locator('label.lpn-set-row', { hasText: await b.lang('lpn_settings_theme') }).first();
			await toPage(b.page); await row.scrollIntoViewIfNeeded().catch(() => {});
			await row.locator('select').selectOption('dark');
			await b.settle(400);
			t = await attrs(b.page);
			const tok = await b.page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ec-bg').trim());
			ok('2. Dark pins dark under a light OS, with no reload', t.theme === 'dark' && t.bs === 'dark' && tok === '#1e1f22', JSON.stringify(t) + ' ' + tok);
			await b.openMenu('file');
			await b.settle(300);
			const pop = await b.page.evaluate(() => { const p = document.getElementById('lpn_menu_popup'); return p ? getComputedStyle(p).backgroundColor : null; });
			ok('2. a menu popup opens dark', pop === DARK_BG, String(pop));
			await shot(b.page, 'menu-open-dark.png');
			await b.closeMenu();
			await b.reload();
			t = await attrs(b.page);
			ok('3. the pinned Dark survives a reload under a light OS', t.theme === 'dark' && t.stored === 'dark', JSON.stringify(t));
			ok('8. no page errors (light OS)', !b.errors.length, (b.errors[0] || '').slice(0, 200));
		} finally { await b.close(); }
	} finally { await browser.close(); env.stopServer(); }
	console.log(failures ? `\n${failures} FAILED of ${checks}` : `\nall ${checks} ok`);
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
