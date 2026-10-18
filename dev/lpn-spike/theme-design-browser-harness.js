// EVERY THEME IS A WHOLE LOOK, NOT ONLY A PALETTE (Task 811, round 2; dev/themes-plan.md), in a real Chromium.
// Run with:
//   node dev/lpn-spike/theme-design-browser-harness.js
//   EC_THEME_SHOTS=/some/dir node dev/lpn-spike/theme-design-browser-harness.js    also saves screenshots
//
// Tom's pass of the first round: "These appear to be pure color themes." A theme now carries type, corners,
// frames, rules, icon line weight and a picture behind the chrome as well. On the looped-network page with
// Net1 open and the Settings box open, for every theme the gallery offers (window.ecTheme.list), this proves:
//   1. THE THEME TAKES, AS DESIGNED: the page's face and text size, the menu bar's capitals, small capitals and
//      weight, the menu button's corner, a box's frame, corner and shadow, a box title's capitals and colour,
//      the tab strip's rule, an icon's line weight and line ends, the chrome's picture and the glow, each read
//      with getComputedStyle from the real element and compared with what the theme block states.
//   2. Light draws what the page drew before these were tokens (sans-serif at 16 px, a 5 px button corner,
//      square boxes with a 1 px ink frame, a 2 px round-ended icon line, no picture, no glow), and every other
//      theme but Dark differs from Light in at least three of these design properties, beyond its colours.
//   3. NOTHING IS UNREADABLE: the Settings box's text on its own surface, a box title on its surface and a menu
//      item's word on its fill each read at 4.5:1 or better (7:1 in High contrast).
//   4. THE MAP DOES NOT CHANGE: its lettering keeps the face and size it had (sans-serif, 16 px), and a label's
//      measured length is identical in every theme, so label placement and export cannot move with a theme.
//   5. PRINT IS LIGHT: with print emulated, the face, size, corners, frame, icon line and glow are Light's,
//      whatever theme was chosen.
//   6. A PHONE SURVIVES EVERY THEME: at 390 by 844 the page has no sideways scroll, and the menu bar and the
//      toolbar each fit inside the window.
//   7. The gallery card shows the theme's own lettering: its "Aa" sample is set in that theme's face.
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
const LOCK_ENV = 'EC_THEME_DESIGN_LOCKED';
const NAME = 'theme-design-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Re-run it alone.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}

let checks = 0, fails = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { fails++; }
	if (!cond || process.env.EC_VERBOSE) { console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail)); }
}
const SHOTS = process.env.EC_THEME_SHOTS || '';
if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); }

// What each theme block states, as the browser computes it. `face` is the first family of the page's face;
// `glow`, `picture` and `shadow` are only "some" or "none". A key left out is Light's value.
const LIGHT = { face: 'sans-serif', size: '16px', menuCase: 'none', menuCaps: 'normal', menuWeight: '400', btnRadius: '5px',
	boxRadius: '0px', boxFrame: '1px solid', shadow: 'some', titleCase: 'none', tabsRule: '1px solid', iconStroke: 2,
	iconCap: 'round', picture: 'none', glow: 'none' };
const DESIGN = {
	light: {},
	dark: {},
	hc: { boxFrame: '2px solid', shadow: 'none', tabsRule: '2px solid', iconStroke: 2.5 },
	rounded: { face: '-apple-system', menuWeight: '500', btnRadius: '999px', boxRadius: '14px', iconStroke: 1.75 },
	platinum: { face: 'Charcoal', size: '14px', menuWeight: '700', btnRadius: '2px', iconStroke: 1.75, iconCap: 'square', titlePicture: 'some' },
	newspaper: { face: 'Times New Roman', menuCaps: 'small-caps', btnRadius: '0px', boxFrame: '3px double', shadow: 'none',
		titleCase: 'uppercase', tabsRule: '3px double', iconStroke: 1.5, iconCap: 'butt' },
	amber: { face: 'ui-monospace', size: '15px', btnRadius: '0px', titleCase: 'uppercase', iconStroke: 2.25, iconCap: 'square', picture: 'some', glow: 'some' },
	green: { face: 'ui-monospace', size: '15px', btnRadius: '0px', titleCase: 'uppercase', iconStroke: 2.25, iconCap: 'square', picture: 'some', glow: 'some' },
	arcade: { face: 'Arial Rounded MT Bold', size: '15px', menuCase: 'uppercase', menuWeight: '700', btnRadius: '10px', boxRadius: '12px',
		boxFrame: '4px double', titleCase: 'uppercase', tabsRule: '4px double', iconStroke: 2.5, picture: 'some', titleInk: 'accent' },
	space: { face: 'Futura', size: '15px', menuCase: 'uppercase', btnRadius: '2px', boxRadius: '3px', titleCase: 'uppercase',
		iconStroke: 1.5, picture: 'some', titleInk: 'accent' }
};
const KEYS = ['face', 'size', 'menuCase', 'menuCaps', 'menuWeight', 'btnRadius', 'boxRadius', 'boxFrame', 'shadow', 'titleCase', 'tabsRule', 'iconStroke', 'iconCap', 'picture', 'glow'];

// In the page: the design properties of the real elements, and three text-on-surface contrasts.
function readDesign() {
	const cs = (el) => getComputedStyle(el);
	const parse = (c) => {
		let m = /rgba?\(([^)]+)\)/.exec(c);
		if (m) { const p = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; }
		m = /color\(srgb ([^)]*)\)/.exec(c);
		if (m) { const p = m[1].split(/[\s/]+/).filter(Boolean).map(parseFloat); return [p[0] * 255, p[1] * 255, p[2] * 255, p.length > 3 ? p[3] : 1]; }
		return [0, 0, 0, 0];
	};
	const lum = (c) => { const f = c.slice(0, 3).map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }); return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2]; };
	const surface = (el) => { let n = el; while (n) { const b = parse(cs(n).backgroundColor); if (b[3] >= 1) { return b; } n = n.parentElement; } return [255, 255, 255, 1]; };
	const ratio = (el) => { const a = lum(parse(cs(el).color)), b = lum(surface(el)); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };
	const first = (f) => f.split(',')[0].trim().replace(/^["']|["']$/g, '');
	const menu = document.querySelector('.lpn-menubar-item'), box = document.getElementById('lpn_settings_box');
	const title = box.querySelector('.lpn-setbox-title'), tabs = document.getElementById('lpn_tabs');
	const icon = document.querySelector('#lpn_toolbar button .ec-icon'), body = document.body;
	const sample = box.querySelector('.lpn-set-row label, .lpn-setbox-body label, label') || box;
	const probe = document.createElement('i'); probe.style.color = 'var(--ec-accent)'; body.appendChild(probe);
	const accent = cs(probe).color; probe.remove();
	const mc = cs(menu), bc = cs(box), tc = cs(title), ic = cs(icon), tb = cs(tabs);
	return {
		face: first(cs(body).fontFamily), faceFull: cs(body).fontFamily, size: cs(body).fontSize,
		menuCase: mc.textTransform, menuCaps: mc.fontVariantCaps, menuWeight: mc.fontWeight, btnRadius: mc.borderTopLeftRadius,
		boxRadius: bc.borderTopLeftRadius, boxFrame: bc.borderTopWidth + ' ' + bc.borderTopStyle, shadow: bc.boxShadow === 'none' ? 'none' : 'some',
		titleCase: tc.textTransform, titleInk: tc.color === accent ? 'accent' : 'ink', titlePicture: tc.backgroundImage === 'none' ? 'none' : 'some',
		tabsRule: tb.borderBottomWidth + ' ' + tb.borderBottomStyle, iconStroke: parseFloat(ic.strokeWidth), iconCap: ic.strokeLinecap,
		picture: cs(document.getElementById('lpn_menubar')).backgroundImage === 'none' ? 'none' : 'some', glow: cs(body).textShadow === 'none' ? 'none' : 'some',
		contrast: { box: ratio(sample), title: ratio(title), menu: ratio(menu) },
		map: (function () {
			const c = document.getElementById('lpn_canvas'), t = c.querySelector('text');
			return { face: cs(c).fontFamily, size: cs(c).fontSize, label: t ? Math.round(t.getComputedTextLength() * 100) / 100 : null, glow: cs(c).textShadow };
		})()
	};
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const summary = [];

	async function openPage(s) {
		await s.goto('Looped-Network.php');
		await s.page.click('.ec-consent-btn').catch(() => {});
		await s.openExampleCard(await s.lang('lpn_ex_net1_title'));
		await s.settle(600);
		if (!(await s.page.isVisible('#lpn_settings_box'))) { await s.toolbarClick(await s.lang('lpn_tool_settings')); }
		await s.settle(400);
	}

	try {
		const s = await Session.open(browser, 'design', { colorScheme: 'light' });
		let themes = [];
		try {
			await openPage(s);
			themes = (await s.page.evaluate(() => window.ecTheme.list)).filter((t) => t !== 'system');
			ok('the gallery offers every designed theme, and every theme offered is designed', JSON.stringify(themes.slice().sort()) === JSON.stringify(Object.keys(DESIGN).sort()), JSON.stringify(themes));
			let lightMap = null, lightGot = null;
			for (const t of themes) {
				await s.page.evaluate((x) => window.ecTheme.set(x), t);
				await s.settle(250);
				const attr = await s.page.evaluate(() => document.documentElement.getAttribute('data-theme'));
				ok(t + ': <html data-theme> is ' + t, attr === t, String(attr));
				const got = await s.page.evaluate(readDesign);
				const want = Object.assign({}, LIGHT, DESIGN[t] || {});
				// 1 and 2: as designed
				KEYS.concat(['titleInk', 'titlePicture'].filter((k) => k in want)).forEach((k) => {
					ok(t + ': ' + k + ' is ' + want[k], got[k] === want[k], 'got ' + JSON.stringify(got[k]) + (k === 'face' ? ' (' + got.faceFull + ')' : ''));
				});
				if (t === 'light') { lightMap = got.map; lightGot = got; }
				if (t !== 'light' && t !== 'dark' && lightGot) {
					const differ = KEYS.filter((k) => got[k] !== lightGot[k]);
					ok(t + ': differs from Light in at least three design properties beyond colour (' + differ.join(', ') + ')', differ.length >= 3);
				}
				// 3: readable
				const need = /^hc/.test(attr) ? 7 : 4.5;
				Object.keys(got.contrast).forEach((k) => ok(t + ': ' + k + ' text reads at ' + got.contrast[k].toFixed(2) + ':1 >= ' + need, got.contrast[k] >= need));
				// 4: the map
				ok(t + ': the map lettering keeps its face and size (sans-serif, 16px) and never glows', got.map.face === 'sans-serif' && got.map.size === '16px' && got.map.glow === 'none', JSON.stringify(got.map));
				ok(t + ': a map label measures the same as in Light (' + got.map.label + ')', lightMap && got.map.label !== null && got.map.label === lightMap.label, JSON.stringify(lightMap));
				// 7: the card
				const card = await s.page.evaluate((x) => {
					const c = document.createElement('span'); c.className = 'ec-theme-card'; c.setAttribute('data-theme', x);
					c.innerHTML = '<span class="ec-tc-panel"><b class="ec-tc-type">Aa</b></span>'; document.body.appendChild(c);
					const f = getComputedStyle(c.querySelector('.ec-tc-type')).fontFamily; c.remove(); return f;
				}, t);
				ok(t + ': the gallery card\'s "Aa" is set in the theme\'s face', card.split(',')[0].replace(/"/g, '').trim() === got.face, card);
				// 5: print
				await s.page.emulateMedia({ media: 'print' });
				await s.settle(100);
				const p = await s.page.evaluate(readDesign);
				await s.page.emulateMedia({ media: 'screen' });
				await s.settle(100);
				const off = ['face', 'size', 'menuCase', 'menuCaps', 'btnRadius', 'boxRadius', 'boxFrame', 'titleCase', 'iconStroke', 'iconCap', 'picture', 'glow'].filter((k) => p[k] !== LIGHT[k]);
				ok(t + ': printed, the design is Light\'s', !off.length, off.map((k) => k + '=' + JSON.stringify(p[k])).join(', '));
				if (SHOTS) { await s.page.screenshot({ path: path.join(SHOTS, 'design-' + t + '.png') }); }
				summary.push(t + ': ' + got.faceFull.split(',')[0] + ' ' + got.size + ', button corner ' + got.btnRadius + ', box ' + got.boxFrame + ' corner ' + got.boxRadius +
					', icon ' + got.iconStroke + ' ' + got.iconCap + ', contrast box/title/menu ' + [got.contrast.box, got.contrast.title, got.contrast.menu].map((x) => x.toFixed(1)).join('/'));
			}
			ok('no page errors (desktop)', !s.errors.length, (s.errors[0] || '').slice(0, 200));
		} finally { await s.close(); }

		// 6: a phone
		const ph = await Session.open(browser, 'phone', { colorScheme: 'light', viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
		try {
			await ph.goto('Looped-Network.php');
			await ph.page.click('.ec-consent-btn').catch(() => {});
			await ph.openExampleCard(await ph.lang('lpn_ex_net1_title'));
			await ph.settle(600);
			let lightBar = null;
			for (const t of themes) {
				await ph.page.evaluate((x) => window.ecTheme.set(x), t);
				await ph.settle(250);
				const m = await ph.page.evaluate(() => {
					const bar = document.getElementById('lpn_menubar'), tb = document.getElementById('lpn_toolbar');
					return { page: document.documentElement.scrollWidth - innerWidth, bar: bar.scrollWidth - bar.clientWidth, barRight: Math.round(bar.getBoundingClientRect().right),
						barH: Math.round(bar.getBoundingClientRect().height), tool: tb.scrollWidth - tb.clientWidth, w: innerWidth };
				});
				if (t === 'light') { lightBar = m.barH; }
				ok(t + ' (phone): no sideways scroll, the menu bar and the toolbar fit the window', m.page <= 0 && m.bar <= 0 && m.tool <= 0 && m.barRight <= m.w, JSON.stringify(m));
				ok(t + ' (phone): the menu bar stays one row (' + m.barH + ' px, Light ' + lightBar + ')', lightBar !== null && m.barH <= lightBar + 8, JSON.stringify(m));
				if (SHOTS) { await ph.page.screenshot({ path: path.join(SHOTS, 'design-phone-' + t + '.png') }); }
			}
			ok('no page errors (phone)', !ph.errors.length, (ph.errors[0] || '').slice(0, 200));
		} finally { await ph.close(); }
	} finally { await browser.close(); env.stopServer(); }
	summary.forEach((l) => console.log('  ' + l));
	console.log(fails ? `\n${fails} FAILED of ${checks}` : `\nall ${checks} ok`);
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
