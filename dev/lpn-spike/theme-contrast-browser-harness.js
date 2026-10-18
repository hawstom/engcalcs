// EVERY THEME READS, MEASURED IN A REAL CHROMIUM (Task 811; dev/themes-plan.md). Run with:
//   node dev/lpn-spike/theme-contrast-browser-harness.js
//   EC_THEME_SHOTS=/some/dir node dev/lpn-spike/theme-contrast-browser-harness.js    also saves screenshots
//
// dev/scripts/theme_contrast_check.js reads the stylesheet and does the arithmetic itself. This asks the
// browser instead, on the looped-network page with Net1 open, the Settings box open and a notice showing,
// for every theme the page head can write (High contrast in both of its palettes):
//   1. EVERY TOKEN PAIR the check lists, resolved by Chromium (getComputedStyle on a probe painted with
//      var(--ec-...)), meets its ratio: text 7:1 in High contrast (WCAG 1.4.6, AAA), 4.5:1 elsewhere
//      (1.4.3), borders and disabled text 3:1 (1.4.11). Light shipped before this and is reported only.
//   2. Chromium and the check agree on every token's colour to within one 8-bit step, so the check's own
//      color-mix() arithmetic is the browser's.
//   3. EVERY TEXT ON THE PAGE that a token paints is readable where it actually sits: each visible text
//      element's colour against the backgrounds actually composited under it (over the map, the map's own
//      paper), at 4.5:1. Elements the browser draws for itself (a native button or drop-down) and the
//      map's own labels are left out: neither is chrome a theme paints.
//   4. The theme took: <html data-theme> is that theme and the page's surface is that theme's form colour.
//   5. TEXT ON THE MAP'S PAPER (anything over the drawing with no surface of its own: "Something wrong
//      here?", its "?", a label legend's words) reads at 4.5:1 against that paper in EVERY theme, Light too.
//   6. PRINT IS LIGHT: with print emulated, every --ec-* token resolves to its Light value whatever theme was
//      chosen, the page's own text is Bootstrap's light ink, and the label legend prints on white.
//   7. The hover card (Settings, Show all properties on hover) is opaque: nothing reads through it.
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
const LOCK_ENV = 'EC_THEME_CONTRAST_LOCKED';
const NAME = 'theme-contrast-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename].concat(process.argv.slice(2)), {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.status === 75) { console.error(NAME + ': NOT RUN, browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}

const check = require(path.join(REPO, 'dev', 'scripts', 'theme_contrast_check.js'));
const SHOTS = process.env.EC_THEME_SHOTS || '';
if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); }

let checks = 0, fails = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { fails++; }
	if (!cond || process.env.EC_VERBOSE) { console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail)); }
}

// In the page: each token name resolved to [r, g, b, a], channels 0-255.
function resolveTokens(names) {
	const probe = document.createElement('i');
	probe.style.cssText = 'position:absolute;width:1px;height:1px;left:-9px;top:-9px';
	document.body.appendChild(probe);
	const parse = (s) => {
		let m = /^rgba?\(([^)]*)\)$/.exec(s);
		if (m) { const p = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; }
		m = /^color\(srgb ([^)]*)\)$/.exec(s);
		if (m) { const p = m[1].split(/[\s/]+/).filter(Boolean).map(parseFloat); return [p[0] * 255, p[1] * 255, p[2] * 255, p.length > 3 ? p[3] : 1]; }
		return null;
	};
	const out = {};
	names.forEach((n) => { probe.style.backgroundColor = 'var(--' + n + ')'; out[n] = parse(getComputedStyle(probe).backgroundColor); });
	probe.remove();
	return out;
}

// In the page: every visible text element a stylesheet paints, its colour and the composited background
// under it. A native control (button, select, input, option) is drawn by the browser and left out unless a
// rule gives it a background of its own; SVG text is the map's own ink and left out.
function scanText() {
	const cv = document.getElementById('lpn_canvas'), cr = cv ? cv.getBoundingClientRect() : null;
	const parse = (c) => {
		let m = /rgba?\(([^)]+)\)/.exec(c);
		if (m) { const p = m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat); return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1]; }
		m = /color\(srgb ([^)]*)\)/.exec(c);
		if (m) { const p = m[1].split(/[\s/]+/).filter(Boolean).map(parseFloat); return [p[0] * 255, p[1] * 255, p[2] * 255, p.length > 3 ? p[3] : 1]; }
		return [0, 0, 0, 0];
	};
	const over = (f, b) => [0, 1, 2].map((i) => f[i] * f[3] + b[i] * (1 - f[3])).concat([1]);
	const lum = (c) => { const f = c.slice(0, 3).map((x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); }); return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2]; };
	const NATIVE = /^(BUTTON|SELECT|INPUT|OPTION|TEXTAREA)$/;
	const out = [];
	document.body.querySelectorAll('*').forEach((el) => {
		if (el.closest('svg') || el.closest('.ec-theme-card') || el.closest('.tooltip')) { return; }
		const txt = Array.from(el.childNodes).filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join(' ');
		if (!txt) { return; }
		const r = el.getBoundingClientRect();
		if (r.width < 2 || r.height < 2 || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) { return; }
		const cs = getComputedStyle(el);
		if (cs.visibility !== 'visible' || el.closest('[hidden]')) { return; }
		let opacity = 1, n = el, base = null; const layers = [];
		const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
		const onMap = cr && cx >= cr.left && cx <= cr.right && cy >= cr.top && cy <= Math.min(cr.bottom, innerHeight);
		let native = false, paper = false;
		while (n && n !== document.documentElement) {
			const ns = getComputedStyle(n);
			opacity *= +ns.opacity;
			if (NATIVE.test(n.tagName) && n.tagName !== 'BUTTON') { native = true; }
			if (n.tagName === 'BUTTON' && !n.className) { native = true; }
			if (onMap && n.contains(cv)) { base = [255, 255, 255, 1]; paper = true; break; }
			const bg = parse(ns.backgroundColor);
			if (bg[3] > 0) { if (bg[3] >= 1) { base = bg; break; } layers.push(bg); }
			n = n.parentElement;
		}
		if (native || opacity < 0.5 || el.disabled || el.closest(':disabled')) { return; }
		if (!base) { base = parse(getComputedStyle(document.body).backgroundColor); if (base[3] < 1) { base = [255, 255, 255, 1]; } }
		let b = base; layers.reverse().forEach((l) => { b = over(l, b); });
		let fg = parse(cs.color); fg = over([fg[0], fg[1], fg[2], fg[3] * opacity], b);
		const x = lum(fg), y = lum(b);
		const where = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/)[0] : '');
		out.push({ where, paper, txt: txt.slice(0, 30), ratio: (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05) });
	});
	return out;
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const tokenNames = Array.from(new Set([].concat(...Object.keys(check.THEMES).map((t) => check.pairs(t).map((p) => [p[0], p[1]]))).reduce((a, p) => a.concat(p), [])));
	const summary = [];
	const allTokens = Object.keys(check.themeDecls('light', fs.readFileSync(path.join(REPO, 'css', 'engcalcs.css'), 'utf8'))).map((n) => n)
		.filter((n) => !/radius|border-w|bevel/.test(n));
	let lightRef = null, lightLegend = null;

	async function measure(s, choice, theme) {
		await s.page.evaluate((t) => window.ecTheme.set(t), choice);
		await s.settle(250);
		const attr = await s.page.evaluate(() => document.documentElement.getAttribute('data-theme'));
		ok(theme + ': <html data-theme> is ' + theme, attr === theme, String(attr));
		const strict = theme !== 'light';
		const got = await s.page.evaluate(resolveTokens, tokenNames);
		const want = check.themeTokens(theme);
		const page = got['ec-bg'];
		// The page's own surface is the calculator form that holds it, painted --ec-form-bg.
		const surface = await s.page.evaluate(() => { const p = document.createElement('i'); document.body.appendChild(p); p.style.backgroundColor = 'var(--ec-form-bg)'; const w = getComputedStyle(p).backgroundColor; p.remove(); return { form: getComputedStyle(document.getElementById('formInput')).backgroundColor, want: w }; });
		ok(theme + ': the page is painted in the theme (the form surface is --ec-form-bg)', surface.form === surface.want, JSON.stringify(surface));
		let disagree = [];
		tokenNames.forEach((n) => {
			const g = got[n], w = want(n);
			if (!g || [0, 1, 2].some((i) => Math.abs(g[i] - w[i]) > 1) || Math.abs(g[3] - w[3]) > 0.01) { disagree.push(n + ' browser ' + JSON.stringify(g && g.map((v) => Math.round(v * 100) / 100)) + ' check ' + JSON.stringify(w.map((v) => Math.round(v * 100) / 100))); }
		});
		ok(theme + ': Chromium and theme_contrast_check.js agree on all ' + tokenNames.length + ' tokens', !disagree.length, disagree.slice(0, 4).join('; '));
		let worst = 99, worstLabel = '', n = 0;
		check.pairs(theme).forEach(([fg, bg, need, why]) => {
			if (!got[fg] || !got[bg]) { ok(theme + ': ' + fg + ' and ' + bg + ' resolve', false); return; }
			const r = check.contrast(got[fg], got[bg], page);
			n++;
			if (r < worst) { worst = r; worstLabel = fg + ' on ' + bg; }
			if (strict) { ok(theme + ': ' + fg + ' on ' + bg + ' ' + r.toFixed(2) + ':1 >= ' + need + ' (' + why + ')', r >= need); }
		});
		const rows = await s.page.evaluate(scanText);
		const bad = rows.filter((x) => x.ratio < 4.5);
		if (strict) {
			ok(theme + ': every text on the page reads at 4.5:1 or better where it sits (' + rows.length + ' read)', bad.length === 0,
				bad.slice(0, 8).map((x) => x.where + ' "' + x.txt + '" ' + x.ratio.toFixed(2)).join('; '));
		}
		const onPaper = rows.filter((x) => x.paper), badPaper = onPaper.filter((x) => x.ratio < 4.5);
		ok(theme + ': every text on the map\'s own paper reads at 4.5:1 against it (' + onPaper.length + ' read)', badPaper.length === 0 && onPaper.some((x) => /wrong/i.test(x.where + x.txt)),
			badPaper.slice(0, 8).map((x) => x.where + ' "' + x.txt + '" ' + x.ratio.toFixed(2)).join('; ') || JSON.stringify(onPaper.map((x) => x.txt)));
		// 7. the hover card
		const node = await s.page.evaluate(() => { const c = document.querySelector('#lpn_canvas circle.lpn-node-junction'); const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		await s.page.mouse.move(5, 300);
		await s.settle(200);
		await s.page.mouse.move(node.x, node.y, { steps: 3 });
		await s.page.waitForSelector('.tooltip.lpn-hovercard.show', { timeout: 4000 }).catch(() => {});
		await s.settle(400);
		const card = await s.page.evaluate(() => { const t = document.querySelector('.tooltip.lpn-hovercard'); if (!t) { return null; } const i = t.querySelector('.tooltip-inner'); return { opacity: getComputedStyle(t).opacity, bg: getComputedStyle(i).backgroundColor }; });
		ok(theme + ': the hover card is opaque (opacity 1, a solid surface)', !!card && card.opacity === '1' && !/rgba\(|\/ 0\./.test(card.bg), JSON.stringify(card));
		await s.page.mouse.move(5, 300);
		await s.settle(200);
		// 6. print
		await s.page.emulateMedia({ media: 'print' });
		await s.settle(150);
		const printed = await s.page.evaluate(resolveTokens, allTokens);
		const pbody = await s.page.evaluate(() => ({ ink: getComputedStyle(document.body).color, legend: (function () { const l = document.getElementById('lpn_labels_legend'); return l ? getComputedStyle(l).backgroundColor : null; })() }));
		await s.page.emulateMedia({ media: 'screen' });
		await s.settle(150);
		const off = allTokens.filter((t) => !printed[t] || !lightRef[t] || [0, 1, 2, 3].some((i) => Math.abs(printed[t][i] - lightRef[t][i]) > (i < 3 ? 0.6 : 0.002)));
		ok(theme + ': printed, every one of ' + allTokens.length + ' tokens is its Light value', !off.length, off.slice(0, 6).join(', '));
		ok(theme + ': printed, the page\'s text is Bootstrap\'s light ink and the label legend is on white', pbody.ink === 'rgb(33, 37, 41)' && pbody.legend === lightLegend, JSON.stringify(pbody) + ' light legend ' + lightLegend);
		ok(theme + ': the page scan read the Settings box and the menu bar', rows.some((x) => /^span|^div|^h/.test(x.where)) && rows.length > 40, String(rows.length));
		summary.push(theme + ': ' + n + ' pairs, worst ' + worst.toFixed(2) + ':1 (' + worstLabel + '), ' + rows.length + ' texts' + (strict ? '' : ', information only (' + bad.length + ' under 4.5)'));
		if (SHOTS) { await s.page.screenshot({ path: path.join(SHOTS, 'theme-' + theme + '.png') }); }
	}

	async function openPage(s) {
		await s.goto('Looped-Network.php');
		await s.openExampleCard(await s.lang('lpn_ex_net1_title'));
		await s.settle(600);
		if (!(await s.page.isVisible('#lpn_settings_box'))) { await s.toolbarClick(await s.lang('lpn_tool_settings')); }
		await s.settle(400);
		await s.page.evaluate(() => { const h = document.getElementById('lpn_set_theme'); if (h) { h.scrollIntoView({ block: 'center' }); } });
	}

	try {
		const a = await Session.open(browser, 'light-os', { colorScheme: 'light' });
		try {
			await openPage(a);
			await a.page.click('.ec-consent-btn').catch(() => {});
			await a.page.evaluate(() => window.ecTheme.set('light'));
			await a.settle(200);
			lightRef = await a.page.evaluate(resolveTokens, allTokens);
			lightLegend = await a.page.evaluate(() => { const l = document.getElementById('lpn_labels_legend'); return l ? getComputedStyle(l).backgroundColor : null; });
			for (const t of ['light', 'dark', 'hc', 'amber', 'green', 'platinum']) { await measure(a, t, t); }
			ok('no page errors (light device)', !a.errors.length, (a.errors[0] || '').slice(0, 200));
		} finally { await a.close(); }
		const b = await Session.open(browser, 'dark-os', { colorScheme: 'dark' });
		try {
			await openPage(b);
			await b.page.click('.ec-consent-btn').catch(() => {});
			await measure(b, 'hc', 'hc-dark');
			ok('no page errors (dark device)', !b.errors.length, (b.errors[0] || '').slice(0, 200));
		} finally { await b.close(); }
	} finally { await browser.close(); env.stopServer(); }
	summary.forEach((l) => console.log('  ' + l));
	console.log(fails ? `\n${fails} FAILED of ${checks}` : `\nall ${checks} ok`);
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
