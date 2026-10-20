// THE THEME: SYSTEM, LIGHT, DARK (Task 714, Phases 2 and 3; dev/theming-plan.md), in a real Chromium.
// Run with:
//   node dev/lpn-spike/theme-browser-harness.js
//   EC_THEME_SHOTS=/some/dir node dev/lpn-spike/theme-browser-harness.js    also saves screenshots
//
// WHAT IT PROVES, with the browser's emulated colour scheme set both ways:
//   1. System (the default, nothing stored) follows the emulated scheme: dark under a dark OS, light
//      under a light one, and a scheme change while the page is open repaints with no reload. Since Task
//      811 <html data-theme> carries the RESOLVED theme (dark or light here) and window.ecTheme.get() the
//      choice (system); the choice is made in the gallery, by a real click on its card
//      (theme-gallery-browser-harness.js proves the gallery itself).
//   2. Dark pins dark under a light OS; Light pins light under a dark OS. Both repaint with no reload.
//   3. The choice survives a reload, and the first paint already has it (the attribute is set by the
//      head script, so the document element carries it before any stylesheet-dependent render).
//   4. THE DRAWING FOLLOWS THE THEME ON SCREEN (Task 811 round 3, which reverses Task 714's white map): white
//      paper and the #1a6faf network in Light, Dark's own dark paper and lighter network ink in Dark, and
//      System under a dark device draws exactly what Dark draws (theme-design-browser-harness.js proves the
//      print and the exported files stay Light).
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
		choice: window.ecTheme ? window.ecTheme.get() : null,
		bs: document.documentElement.getAttribute('data-bs-theme'),
		stored: (function () { try { return localStorage.getItem('lpn_theme'); } catch (e) { return 'ERR'; } })()
	}));
	// A token written as color-mix() computes as color(srgb ...); read back in the rgb() spelling the light
	// set always printed, so the expected strings below stay what they were.
	const NORM = (v) => { const m = /^color\(srgb ([^)]*)\)$/.exec(v || ''); if (!m) { return v; } const p = m[1].split(/[\s/]+/).filter(Boolean).map(parseFloat); const c = p.slice(0, 3).map((x) => Math.round(x * 255)).join(', '); return p.length > 3 && p[3] < 1 ? 'rgba(' + c + ', ' + p[3] + ')' : 'rgb(' + c + ')'; };
	const colours = (page) => page.evaluate((normSrc) => {
		const norm = new Function('return ' + normSrc)();
		const cs = (sel, prop) => { const e = document.querySelector(sel); return e ? norm(getComputedStyle(e).getPropertyValue(prop)) : null; };
		return {
			body: cs('body', 'background-color'),
			tabsBorder: cs('#lpn_tabs', 'border-bottom-color'),
			menuInk: cs('#lpn_menu_help', 'color'),
			scaleInk: cs('.lpn-scalebar', 'color'),
			scaleBg: cs('.lpn-scalebar', 'background-color'),
			canvasPaper: cs('#lpn_canvas', 'background-color'),
			pipeInk: cs('#lpn_canvas polyline.lpn-link-pipe', 'stroke'),
			nodeInk: cs('#lpn_canvas circle.lpn-node-junction', 'stroke'),
			nodeFill: cs('#lpn_canvas circle.lpn-node-junction', 'fill')
		};
	}, NORM.toString());
	// Choose a theme the way a visitor does: the Theme button, then a real click on the card.
	const choose = async (page, t) => {
		await page.click('#lpn_set_theme');
		await page.waitForSelector('#lpn_theme_gallery', { state: 'visible' });
		await page.click('#lpn_theme_gallery .lpn-theme-choice[data-theme-name="' + t + '"]');
		await page.waitForSelector('#lpn_theme_gallery', { state: 'detached' });
	};
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

	// Text that sits on the map, not on a themed panel, is read against the map's own paper. For every
	// visible text element whose centre is over the canvas, walk up to the element that holds the canvas and
	// composite the backgrounds met on the way; an element on no background of its own is on the paper. A
	// themed panel (an overlay with its own background) is judged against that panel.
	const mapText = (page) => page.evaluate(() => {
		const cv = document.getElementById('lpn_canvas'), cr = cv.getBoundingClientRect();
		const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) { return [0, 0, 0, 0]; } const p = m[1].split(/[ ,\/]+/).map(parseFloat); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; };
		const lum = (c) => { const f = c.slice(0, 3).map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }); return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2]; };
		const over = (f, b) => [0, 1, 2].map((i) => f[i] * f[3] + b[i] * (1 - f[3])).concat([1]);
		const out = [];
		document.body.querySelectorAll('*').forEach((el) => {
			if (el.closest('svg') || el.closest('#lpn_menu_popup') || el.closest('.ec-consent')) { return; }
			const txt = Array.from(el.childNodes).filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join(' ');
			if (!txt) { return; }
			const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) { return; }
			const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
			if (cx < cr.left || cx > cr.right || cy < cr.top || cy > Math.min(cr.bottom, innerHeight)) { return; }
			const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none') { return; }
			const layers = []; let n = el, solid = false;
			while (n && n !== document.documentElement && !n.contains(cv)) { const bg = parse(getComputedStyle(n).backgroundColor); if (bg[3] > 0) { layers.push(bg); } if (bg[3] >= 1) { solid = true; break; } n = n.parentElement; }
			let base = parse(getComputedStyle(cv).backgroundColor); if (solid) { base = layers.pop(); }
			layers.reverse(); let b = base; layers.forEach((l) => { b = over(l, b); });
			let fg = parse(cs.color); fg = over([fg[0], fg[1], fg[2], fg[3] * (+cs.opacity || 1)], b);
			const a = lum(fg), bb = lum(b);
			out.push({ sel: el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className ? '.' + el.className.split(' ')[0] : ''), txt: txt.slice(0, 28), ratio: (Math.max(a, bb) + 0.05) / (Math.min(a, bb) + 0.05) });
		});
		return out;
	});
	const checkMapText = (label, rows, mustSee) => {
		const bad = rows.filter((x) => x.ratio < 4.5);
		ok(label + ': every text over the map reads at 4.5:1 or better (' + rows.length + ' read)', bad.length === 0, bad.map((x) => x.sel + ' "' + x.txt + '" ' + x.ratio.toFixed(2)).join('; '));
		mustSee.forEach((re) => ok(label + ': the scan saw ' + re, rows.some((x) => re.test(x.txt)), 'absent'));
	};

	// ONE TIP, IN BOTH THEMES: a name tip (hover) and an explanation (click on a ?) are both Bootstrap tooltips; both
	// must paint the token colours, and so match each other.
	const tipLook = async (page) => {
		const read = () => page.evaluate(() => { const t = Array.from(document.querySelectorAll('.tooltip .tooltip-inner')).pop(); if (!t) { return null; } const cs = getComputedStyle(t); return { bg: cs.backgroundColor, ink: cs.color, ring: cs.boxShadow }; });
		const res = {};
		await page.mouse.move(5, 300); await page.waitForTimeout(300);
		const btn = page.locator('#lpn_toolbar button[title], #lpn_toolbar button[data-bs-original-title]').first();
		await btn.hover(); await page.waitForTimeout(900);
		res.name = await read();
		await page.mouse.move(5, 300); await page.waitForTimeout(500);
		const q = page.locator('#lpn_settings_box .ec-tip').first();
		if (await q.count()) { await q.click({ force: true }).catch(() => {}); await page.waitForTimeout(700); res.explain = await read(); await page.keyboard.press('Escape'); }
		const tok = await page.evaluate(() => { const p = document.createElement('i'); document.body.appendChild(p); const g = (t) => { p.style.backgroundColor = 'var(--' + t + ')'; return getComputedStyle(p).backgroundColor; }; const r = { bg: g('ec-tip-bg'), ink: (p.style.color = 'var(--ec-tip-ink)', getComputedStyle(p).color) }; p.remove(); return r; });
		return { res, tok };
	};
	// A keyboard focus ring on a transport button and on the time drop-downs: a drawn outline, 2px, in the accent.
	const ringOf = async (page, sel) => {
		await page.keyboard.press('Shift');
		return page.evaluate((q) => { const e = document.querySelector(q); if (!e) { return null; } e.focus({ focusVisible: true }); const cs = getComputedStyle(e); const p = document.createElement('i'); document.body.appendChild(p); p.style.color = 'var(--ec-accent)'; const acc = getComputedStyle(p).color; p.remove(); return { style: cs.outlineStyle, width: cs.outlineWidth, color: cs.outlineColor, acc, vis: e.matches(':focus-visible') }; }, sel);
	};
	const checkRing = async (label, page) => {
		for (const [what, sel] of [['Play', '.lpn-transport-btn[data-icon="play"], #lpn_toolbar_run .lpn-transport-btn:nth-of-type(3)'], ['Go to start', '#lpn_toolbar_run .lpn-transport-btn'], ['the time step drop-down', '#lpn_toolbar select'], ['the speed drop-down', '#lpn_toolbar select:nth-of-type(2), #lpn_toolbar_run select:last-of-type']]) {
			const r = await ringOf(page, sel);
			ok(label + ': ' + what + ' shows a clear focus ring', !!r && r.vis && r.style === 'solid' && r.width === '2px' && r.color === r.acc, JSON.stringify(r));
		}
	};

	// The colour legend is a panel of chrome over the map (Tom: "doesn't respond to Dark"); its swatches are data and
	// never change. One is put on the map the way the page builds it (class names are the contract).
	const legendLook = (page) => page.evaluate((normSrc) => {
		const norm = new Function('return ' + normSrc)();
		let el = document.getElementById('lpn_theme_probe_legend');
		if (!el) {
			el = document.createElement('div'); el.id = 'lpn_theme_probe_legend'; el.className = 'lpn-color-legend'; el.style.cssText = 'right:60px;top:200px';
			el.innerHTML = 'Pressure (psi)<br><span class="lpn-color-swatch" style="background:#d73027"></span> 20 <span class="lpn-color-swatch" style="background:#1a9850"></span> 80';
			document.getElementById('lpn_canvas').parentElement.appendChild(el);
		}
		const cs = getComputedStyle(el), sw = getComputedStyle(el.querySelector('.lpn-color-swatch'));
		return { bg: norm(cs.backgroundColor), ink: norm(cs.color), swatch: norm(sw.backgroundColor), swatchEdge: norm(sw.borderTopColor) };
	}, NORM.toString());
	const shot = async (page, name) => { if (SHOTS) { await page.screenshot({ path: path.join(SHOTS, name) }); } };

	try {
		// ===== A dark system =====
		console.log('=== a dark operating system ===');
		const a = await Session.open(browser, 'dark-os', { colorScheme: 'dark' });
		try {
			await a.goto('Looped-Network.php');
			const first = await attrs(a.page);
			ok('1. first load: no stored choice, so System (resolved to data-theme=dark here), nothing stored', first.choice === 'system' && first.theme === 'dark' && first.stored === null, JSON.stringify(first));
			ok('1. ...and Bootstrap is told dark', first.bs === 'dark', first.bs);
			await a.settle(1200);
			checkMapText('9. gallery, dark', await mapText(a.page), [/Open a copy|example/i, /Privacy/, /Something wrong/]);
			const thumb = await a.page.evaluate(() => { const t = document.querySelector('.lpn-example-thumb'); return t ? getComputedStyle(t).backgroundColor : null; });
			ok('10. an example thumbnail keeps its white paper in dark', thumb === LIGHT_BG, String(thumb));
			await shot(a.page, 'gallery-dark.png');
			await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
			await a.settle(600);
			checkMapText('9. Net1 open, dark', await mapText(a.page), [/Something wrong/]);
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
			await a.page.click('#lpn_set_theme');
			await a.page.waitForSelector('#lpn_theme_gallery', { state: 'visible' });
			const optTexts = (await a.page.locator('#lpn_theme_gallery .lpn-theme-choice-name').allTextContents()).slice(0, 3);
			ok('the choices begin System, Light, Dark, in that order',
				JSON.stringify(optTexts) === JSON.stringify([await a.lang('lpn_theme_system'), await a.lang('lpn_theme_light'), await a.lang('lpn_theme_dark')]), JSON.stringify(optTexts));
			ok('System is the kept choice by default', (await a.page.getAttribute('#lpn_theme_gallery .lpn-theme-choice[data-theme-name="system"]', 'aria-pressed')) === 'true');
			await a.page.keyboard.press('Escape');
			await shot(a.page, 'settings-dark.png');

			// Light pins light under a dark OS, with no reload
			let navs = 0; a.page.on('framenavigated', () => { navs++; });
			await choose(a.page, 'light');
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
			await choose(a.page, 'dark');
			await a.settle(400);
			t = await attrs(a.page);
			ok('2. Dark: data-theme=dark, stored dark', t.theme === 'dark' && t.stored === 'dark' && t.bs === 'dark', JSON.stringify(t));
			const darkTok = await a.page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--ec-bg').trim());
			ok('2. ...the dark set is in force', darkTok === '#1e1f22', darkTok);
			const darkColours = await colours(a.page);
			const darkPx = await canvasPixels(a.page);

			// 4. the drawing follows the theme
			ok('4. canvas paper is white in Light and Dark\'s own dark in Dark', lightColours.canvasPaper === LIGHT_BG && darkColours.canvasPaper === DARK_BG, lightColours.canvasPaper + ' / ' + darkColours.canvasPaper);
			ok('4. the scale bar is themed chrome: light text on a dark panel in dark, dark on light in light', darkColours.scaleInk === 'rgb(213, 216, 220)' && darkColours.scaleBg === 'rgba(30, 31, 34, 0.8)' && lightColours.scaleBg === 'rgba(255, 255, 255, 0.8)' && lightColours.scaleInk !== darkColours.scaleInk, JSON.stringify([lightColours.scaleInk, lightColours.scaleBg, darkColours.scaleInk, darkColours.scaleBg]));
			ok('4. a pipe\'s ink is the theme\'s map ink: #1a6faf in Light, lighter in Dark', lightColours.pipeInk === 'rgb(26, 111, 175)' && darkColours.pipeInk === 'rgb(106, 174, 232)', lightColours.pipeInk + ' / ' + darkColours.pipeInk);
			ok('4. a node\'s ink follows it', lightColours.nodeInk === 'rgb(26, 111, 175)' && darkColours.nodeInk === 'rgb(106, 174, 232)', [lightColours.nodeInk, darkColours.nodeInk, lightColours.nodeFill, darkColours.nodeFill].join(' '));
			ok('4. the canvas pixels differ between Light and Dark, and System under a dark device is Dark to the byte', Buffer.compare(lightPx, darkPx) !== 0 && Buffer.compare(sysPx, darkPx) === 0,
				'light ' + lightPx.length + ' bytes, dark ' + darkPx.length + ' bytes, system ' + sysPx.length);
			// 5. the chrome changes
			ok('5. the chrome differs between the themes (page, tab rule, menu ink)', lightColours.body !== darkColours.body || lightColours.tabsBorder !== darkColours.tabsBorder, '');
			ok('5. the tab rule and menu ink differ', lightColours.tabsBorder !== darkColours.tabsBorder && lightColours.menuInk !== darkColours.menuInk, JSON.stringify([lightColours.tabsBorder, darkColours.tabsBorder, lightColours.menuInk, darkColours.menuInk]));
			await a.settle(300);
			await shot(a.page, 'map-dark-pinned.png');

			const lgD = await legendLook(a.page);
			ok('13. the colour legend is a dark panel with light text in dark', lgD.bg === 'rgba(30, 31, 34, 0.95)' && lgD.ink === 'rgb(213, 216, 220)', JSON.stringify(lgD));
			ok('13. ...and its swatches keep their data colours and hairline', lgD.swatch === 'rgb(215, 48, 39)' && lgD.swatchEdge === 'rgba(0, 0, 0, 0.45)', JSON.stringify(lgD));
			checkMapText('13. legend and scale bar over the map, dark', await mapText(a.page), [/Pressure \(psi\)/]);
			await shot(a.page, 'map-legend-dark.png');
			// 11. one tip look, and 12. the focus ring (Dark pinned)
			await a.page.keyboard.press('Escape');
			const tl = await tipLook(a.page);
			ok('11. the name tip paints the tip tokens in dark', !!tl.res.name && tl.res.name.bg === tl.tok.bg && tl.res.name.ink === tl.tok.ink, JSON.stringify(tl));
			ok('11. the explanation tip is the same look as the name tip', !tl.res.explain || (tl.res.explain.bg === tl.res.name.bg && tl.res.explain.ink === tl.res.name.ink), JSON.stringify(tl.res));
			ok('11. the tip has its edge ring', !!tl.res.name && tl.res.name.ring !== 'none', JSON.stringify(tl.res.name));
			await shot(a.page, 'tooltip-dark.png');
			await checkRing('12. dark', a.page);
			await shot(a.page, 'focus-ring-dark.png');

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
			ok('3. ...the control shows the stored choice on a fresh page', (await row2.locator('#lpn_set_theme').getAttribute('data-theme-choice')) === 'dark');
			await choose(a.page, 'system');
			await a.settle(300);
			t = await attrs(a.page);
			ok('1. back to System: the key is gone and the dark device decides', t.stored === null && t.choice === 'system' && t.theme === 'dark' && t.bs === 'dark', JSON.stringify(t));

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
			ok('1. System under a light OS paints light', t.choice === 'system' && t.theme === 'light' && t.bs === 'light' && sysTok === '#fff', JSON.stringify(t) + ' ' + sysTok);
			await b.settle(1200);
			checkMapText('9. gallery, light', await mapText(b.page), [/Open a copy|example/i, /Privacy/, /Something wrong/]);
			await b.openExampleCard(await b.lang('lpn_ex_net1_title'));
			checkMapText('9. Net1 open, light', await mapText(b.page), [/Something wrong/]);
			await checkRing('12. light', b.page);
			const lgL = await legendLook(b.page);
			ok('13. the colour legend is a light panel with dark text in light', lgL.bg === 'rgba(255, 255, 255, 0.85)' && lgL.ink === 'rgb(51, 51, 51)', JSON.stringify(lgL));
			checkMapText('13. legend and scale bar over the map, light', await mapText(b.page), [/Pressure \(psi\)/]);
			await shot(b.page, 'map-legend-light.png');
			await b.toolbarClick(await b.lang('lpn_tool_settings'));
			await b.settle(500);
			const row = b.page.locator('label.lpn-set-row', { hasText: await b.lang('lpn_settings_theme') }).first();
			await toPage(b.page); await row.scrollIntoViewIfNeeded().catch(() => {});
			await choose(b.page, 'dark');
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
