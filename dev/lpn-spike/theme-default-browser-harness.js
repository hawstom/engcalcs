// THE BETTER DEFAULT (Task 811; dev/themes-plan.md "the same, but better"), in a real Chromium.
//   node dev/lpn-spike/theme-default-browser-harness.js
// Net3 open and Settings open. Proves, for the default look and every theme the gallery offers:
//   1. At 360 px wide the page does not scroll sideways (Light, Dark, and every theme).
//   2. Every theme still applies its tokens: the Settings box wears --ec-box-bg, --ec-box-radius and the
//      colour of --ec-box-border, and the page's ink is --ec-ink.
//   3. A keyboard ring is visible on a text box, a drop-down, a transport button, a link and a menu-bar item
//      (outline drawn, 2 px or more, in the accent), in Light and Dark.
//   4. Light's boxes are the calmer ones (6 px corner, a grey hairline, a two-layer shadow); a text box has the
//      small corner; the square themes (High contrast, Amber, Green, Platinum, Newspaper) keep square boxes.
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_THEME_DEFAULT_LOCKED';
const NAME = 'theme-default-browser-harness';
if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], { stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' }) });
		if (r.status === 75) { console.error(NAME + ': NOT RUN, browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0;
function ok(label, cond, detail) { console.log((cond ? 'PASS ' : 'FAIL ') + label + (cond ? '' : '  ' + (detail || ''))); if (!cond) { fails++; } }
const SQUARE = ['hc', 'hc-dark', 'amber', 'green', 'platinum', 'newspaper'];

function readBox() {
	const cs = (e) => getComputedStyle(e);
	const tok = (n, prop) => { const p = document.createElement('i'); p.style[prop] = 'var(' + n + ')'; document.body.appendChild(p); const v = cs(p)[prop]; p.remove(); return v; };
	const box = document.getElementById('lpn_settings_box'), c = cs(box);
	const inp = document.querySelector('.lpn-setbox-search input');
	return {
		boxBg: c.backgroundColor, wantBg: tok('--ec-box-bg', 'backgroundColor'),
		radius: c.borderTopLeftRadius, wantRadius: tok('--ec-box-radius', 'width'),
		borderColor: c.borderTopColor, borderW: c.borderTopWidth, shadow: c.boxShadow,
		ink: cs(document.body).color, wantInk: tok('--ec-ink', 'color'),
		inputRadius: cs(inp).borderTopLeftRadius,
		overflow: document.documentElement.scrollWidth - window.innerWidth
	};
}
async function ring(s, sel) {
	return s.page.evaluate((q) => {
		const el = Array.from(document.querySelectorAll(q)).find((e) => e.getBoundingClientRect().width > 0);
		if (!el) { return { skipped: true }; }
		el.focus({ focusVisible: true });
		const c = getComputedStyle(el);
		return { style: c.outlineStyle, w: parseFloat(c.outlineWidth), color: c.outlineColor, matches: el.matches(':focus-visible') };
	}, sel);
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	for (const scheme of ['light', 'dark']) {
		const s = await Session.open(browser, 'def-' + scheme, { colorScheme: scheme, viewport: { width: 1400, height: 900 } });
		await s.goto('Looped-Network.php');
		await s.page.click('.ec-consent-btn').catch(() => {});
		await s.openExampleCard(await s.lang('lpn_ex_net3_title'));
		await s.settle(800);
		if (!(await s.page.isVisible('#lpn_settings_box'))) { await s.toolbarClick(await s.lang('lpn_tool_settings')); }
		await s.settle(500);
		await s.page.setViewportSize({ width: 360, height: 740 });
		await s.settle(600);
		const themes = (await s.page.evaluate(() => window.ecTheme.list)).filter((t) => t !== 'system');
		await s.page.keyboard.press('Tab');
		for (const t of themes) {
			await s.page.evaluate((x) => window.ecTheme.set(x), t);
			await s.settle(900);
			const r = await s.page.evaluate(readBox);
			ok(scheme + '/' + t + ': no sideways scroll at 360 px (' + r.overflow + ')', r.overflow <= 0, JSON.stringify(r));
			ok(scheme + '/' + t + ': the box wears its tokens (surface, corner, ink)', r.boxBg === r.wantBg && r.radius === r.wantRadius && (t === 'light' || t === 'dark' || r.ink === r.wantInk), JSON.stringify(r));
			if (SQUARE.indexOf(t) >= 0) { ok(t + ': square boxes', r.radius === '0px', r.radius); }
			if (t === 'light' || (t === 'dark')) {
				ok(t + ': box corner 6 px, a 1 px hairline, a two-layer shadow', r.radius === '6px' && r.borderW === '1px' && (r.shadow.match(/rgba?\(/g) || []).length === 2, JSON.stringify(r));
				ok(t + ': a text box has the small corner', r.inputRadius === '4px', r.inputRadius);
			}
			if (t === scheme) {
				for (const sel of ['.lpn-setbox-search input', '#lpn_toolbar select', '#lpn_toolbar_run .lpn-transport-btn', '.lpn-menubar-item', '#lpn_toolbar button:not(.lpn-transport-btn)', 'a[href]']) {
					const f = await ring(s, sel);
					ok(t + ': keyboard ring on ' + sel + (f.skipped ? ' (none shown at 360 px; skipped)' : ''), f.skipped || (f.style !== 'none' && f.w >= 2), JSON.stringify(f));
				}
			}
		}
		ok(scheme + ': no page errors', !s.errors.length, s.errors.join(' | ').slice(0, 300));
		await s.close();
	}
	await browser.close(); env.stopServer();
	console.log(NAME + ': ' + (fails ? fails + ' FAILED' : 'all passed'));
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
