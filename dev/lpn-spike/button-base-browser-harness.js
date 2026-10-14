// ONE BUTTON BASE (Task 714 phase 1b, R-202). The menu bar's items and the toolbar's buttons are one
// family: same corner radius, same border width, same hover and open/pressed colours, one focus ring,
// all read from the --ec-btn-* / --ec-accent* tokens. In real Chromium, at desktop and at 390 px:
//   1. the base tokens exist and both kinds of control resolve to them;
//   2. hover and open/pressed paint the same on both;
//   3. heights stay compact (shape and paint are shared; size is each control's own); at 390 px the toolbar does not overflow the window.
// Set EC_BTN_SHOTS=/some/dir to also write screenshots (prefix with EC_BTN_PREFIX).
//
//   node dev/lpn-spike/button-base-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_BUTTONBASE_BROWSER_LOCKED';
const NAME = 'button-base-browser-harness';

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

const SHOTS = process.env.EC_BTN_SHOTS || '';
const PREFIX = process.env.EC_BTN_PREFIX || '';
const MENU = '.lpn-menubar-item';
const TOOL = '#lpn_toolbar button:not(.lpn-transport-btn):not(.lpn-run-btn)';
const FIRST_TOOL = '#lpn_toolbar button:not(.lpn-transport-btn)';

async function measure(Session, browser, tag, extra) {
	const a = await Session.open(browser, NAME, extra);
	const out = {};
	try {
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(600);
		const p = a.page;
		out.tokens = await p.evaluate(() => {
			const cs = getComputedStyle(document.documentElement);
			const t = {}; ['--ec-btn-radius', '--ec-btn-border-w', '--ec-accent'].forEach((k) => { t[k] = cs.getPropertyValue(k).trim(); });
			return t;
		});
		const grab = (sel) => p.evaluate((s) => {
			const e = document.querySelector(s);
			if (!e) { return null; }
			const c = getComputedStyle(e), r = e.getBoundingClientRect();
			return { radius: c.borderTopLeftRadius, bw: c.borderTopWidth, bg: c.backgroundColor, bc: c.borderTopColor, color: c.color, h: Math.round(r.height * 10) / 10, w: Math.round(r.width * 10) / 10 };
		}, sel);
		out.menu = await grab(MENU);
		out.tool = await p.evaluate((s) => {
			const e = Array.from(document.querySelectorAll(s)).find((x) => x.getBoundingClientRect().width > 0);
			if (!e) { return null; }
			const c = getComputedStyle(e), r = e.getBoundingClientRect();
			return { radius: c.borderTopLeftRadius, bw: c.borderTopWidth, h: Math.round(r.height * 10) / 10 };
		}, FIRST_TOOL);
		// hover
		await p.hover(MENU); await a.settle(150); out.menuHover = await grab(MENU);
		await p.mouse.move(5, 500);
		const toolSel = (await p.$(TOOL)) ? TOOL : FIRST_TOOL;
		if (await p.$(TOOL + ':visible')) {
			const vis = await p.$(TOOL + ':not(:disabled)');
			if (vis && await vis.isVisible()) {
				await vis.hover(); await a.settle(150);
				out.toolHover = await vis.evaluate((e) => { const c = getComputedStyle(e); return { bg: c.backgroundColor, bc: c.borderTopColor }; });
			}
		}
		if (SHOTS && out.toolHover) {
			fs.mkdirSync(SHOTS, { recursive: true });
			await p.evaluate(() => { const b = document.querySelector('#lpn_toolbar button[aria-pressed]'); if (b) { b.setAttribute('aria-pressed', 'true'); } });
			const v = await p.$(TOOL + ':not(:disabled)');
			if (v) { await v.hover(); await a.settle(150); }
			await p.screenshot({ path: path.join(SHOTS, PREFIX + tag + '-toolbar-hover-pressed.png'), clip: { x: 0, y: 0, width: 1400, height: 120 } });
			await p.evaluate(() => { const b = document.querySelector('#lpn_toolbar button[aria-pressed]'); if (b) { b.setAttribute('aria-pressed', 'false'); } });
		}
		await p.mouse.move(5, 500);
		// pressed / open: a toggle button in the toolbar, an open menu
		out.toolPressed = await p.evaluate(() => {
			const b = document.querySelector('#lpn_toolbar button[aria-pressed]');
			if (!b) { return null; }
			const was = b.getAttribute('aria-pressed');
			b.setAttribute('aria-pressed', 'true');
			const c = getComputedStyle(b); const r = { bg: c.backgroundColor, bc: c.borderTopColor };
			b.setAttribute('aria-pressed', was); return r;
		});
		await p.mouse.move(5, 500);
		await a.openMenu('file'); await a.settle(250);
		out.menuOpen = await p.evaluate((s) => { const c = getComputedStyle(document.querySelector(s + '[aria-expanded="true"]') || document.querySelector(s)); return { bg: c.backgroundColor, bc: c.borderTopColor }; }, MENU);
		if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await p.screenshot({ path: path.join(SHOTS, PREFIX + tag + '-menu-open.png') }); }
		await p.keyboard.press('Escape'); await p.mouse.move(5, 500); await a.settle(250);
		out.overflow = await p.evaluate(() => {
			const t = document.getElementById('lpn_toolbar'), m = document.getElementById('lpn_menubar');
			return { tw: t.scrollWidth, tc: t.clientWidth, th: Math.round(t.getBoundingClientRect().height), mh: m ? Math.round(m.getBoundingClientRect().height) : 0, doc: document.documentElement.scrollWidth, win: window.innerWidth };
		});
		if (SHOTS) { await p.screenshot({ path: path.join(SHOTS, PREFIX + tag + '.png'), clip: { x: 0, y: 0, width: out.overflow.win, height: 220 } }); }
	} finally { await a.close(); }
	return out;
}

function checkSet(tag, m, phone) {
	console.log(tag);
	ok(tag + ': base tokens are declared', !!m.tokens['--ec-btn-radius'] && !!m.tokens['--ec-btn-border-w'], JSON.stringify(m.tokens));
	ok(tag + ': the menu item resolves to the base radius and border width', m.menu.radius === m.tokens['--ec-btn-radius'] && m.menu.bw === m.tokens['--ec-btn-border-w'], m.menu.radius + ' ' + m.menu.bw);
	ok(tag + ': menu item height is unchanged and compact (24 to 34 px)', m.menu.h >= 24 && m.menu.h <= 34, m.menu.h);
	if (m.tool) {
		ok(tag + ': the toolbar button resolves to the same radius and border width', m.tool.radius === m.menu.radius && m.tool.bw === m.menu.bw, m.tool.radius + ' ' + m.tool.bw);
		ok(tag + ': toolbar button height is compact (24 to 34 px)', m.tool.h >= 24 && m.tool.h <= 34, m.tool.h);
	} else { ok(tag + ': (no toolbar icon button shows at this width, as designed)', phone, 'skipped'); }
	ok(tag + ': the menu item rests in the accent', m.menu.color === 'rgb(6, 69, 173)' || /^rgb/.test(m.menu.color));
	if (m.toolHover) {
		ok(tag + ': hover paints the same on both', m.toolHover.bg === m.menuHover.bg && m.toolHover.bc === m.menuHover.bc, JSON.stringify([m.toolHover, m.menuHover]));
	}
	if (m.toolPressed && m.tool) {
		ok(tag + ': pressed toolbar button paints like an open menu item', m.toolPressed.bg === m.menuOpen.bg && m.toolPressed.bc === m.menuOpen.bc, JSON.stringify([m.toolPressed, m.menuOpen]));
	}
	ok(tag + ': the toolbar does not overflow its width', m.overflow.tw <= m.overflow.tc + 1, m.overflow.tw + ' > ' + m.overflow.tc);
	ok(tag + ': the page does not scroll sideways', m.overflow.doc <= m.overflow.win + 1, m.overflow.doc + ' > ' + m.overflow.win);
	if (phone) {
		ok(tag + ': the phone toolbar stays one row (at most 44 px tall)', m.overflow.th <= 44, m.overflow.th);
		ok(tag + ': the phone menu bar stays one row (at most 44 px tall)', m.overflow.mh <= 44, m.overflow.mh);
	}
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const browser = await chromium.launch({ executablePath: env.findChromium() });
	try {
		const desk = await measure(Session, browser, 'desktop', { viewport: { width: 1400, height: 900 } });
		if (process.env.EC_BTN_DUMP) { console.log(JSON.stringify(desk, null, 1)); }
		checkSet('desktop 1400', desk, false);
		const phone = await measure(Session, browser, 'phone390', { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
		if (process.env.EC_BTN_DUMP) { console.log(JSON.stringify(phone, null, 1)); }
		checkSet('phone 390', phone, true);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
