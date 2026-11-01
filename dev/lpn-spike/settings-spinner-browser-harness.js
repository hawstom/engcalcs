// THE SETTINGS BOX HAS NO SPINNER ARROWS (Tom, 2026-10-23: "The spinners spin out of control. It would be
// better not to have them ... If phone knows they are numeric, maybe it's better just to remove the spinners").
//   node dev/lpn-spike/settings-spinner-browser-harness.js   (takes the browser lock itself)
// In real Chromium: every number box in the Settings box draws no spin button (the pseudo-element is
// appearance:none and the box's content width is not narrowed by one), a nonnegative one carries a numeric
// inputmode, a held mouse on a box's right edge changes nothing, a wheel notch over a focused box does not
// step it, and a typed value still saves (it reaches the live setting on change).
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SETSPIN_LOCKED';
if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '180', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.status === 75) { console.error('settings-spinner-browser-harness: NOT RUN -- lock held 180 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const browser = await chromium.launch({ executablePath: env.findChromium() });
	try {
		const a = await Session.open(browser, 'settings-spinner');
		await a.goto('Looped-Network.php');
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(800);
		await a.toolbarClick(await a.lang('lpn_tool_settings'));
		await a.settle(500);

		const audit = await a.page.evaluate(() => {
			const boxes = Array.from(document.querySelectorAll('#lpn_settings_box input[type="number"]'));
			return boxes.map((i) => {
				const ps = getComputedStyle(i, '::-webkit-inner-spin-button');
				return {
					id: i.id || (i.closest('.lpn-set-row') || { textContent: '' }).textContent.trim().slice(0, 30),
					spin: ps.webkitAppearance || ps.appearance, min: i.min, im: i.getAttribute('inputmode'),
					cls: i.className
				};
			});
		});
		console.log('  number boxes in Settings: ' + audit.length);
		ok('the Settings box has number boxes to test', audit.length >= 8, audit.length);
		ok('no box still carries the old ec-spin class', audit.every((x) => x.cls.indexOf('ec-spin') < 0));
		const nonneg = audit.filter((x) => x.min !== '' && +x.min >= 0);
		ok('there are nonnegative boxes', nonneg.length >= 4, nonneg.length);
		ok('every nonnegative box carries a numeric inputmode',
			nonneg.every((x) => x.im === 'decimal' || x.im === 'numeric'),
			JSON.stringify(nonneg.filter((x) => !(x.im === 'decimal' || x.im === 'numeric')).slice(0, 5)));

		// A mouse held on the right edge of each box that used to spin (and a Labels digit box) changes nothing.
		const grab = (lab) => a.page.evaluate((l) => {
			const row = Array.from(document.querySelectorAll('.lpn-set-row')).find((r) => (r.textContent || '').indexOf(l) >= 0);
			const i = row.querySelector('input'); i.scrollIntoView({ block: 'center' });
			const b = i.getBoundingClientRect();
			window.__box = i; window.__inputs = 0; i.addEventListener('input', () => { window.__inputs++; });
			return { right: b.right, top: b.top, h: b.height, v: i.value };
		}, lab);
		for (const key of ['lpn_settings_text_size', 'lpn_settings_symbol_size', 'lpn_settings_link_width', 'lpn_settings_text_halo', 'lpn_settings_readability_bias']) {
			const lab = await a.lang(key);
			const g = await grab(lab);
			await a.page.mouse.move(g.right - 6, g.top + g.h / 4);
			await a.page.mouse.down();
			await a.page.waitForTimeout(1200);
			await a.page.mouse.up();
			const after = await a.page.evaluate(() => ({ v: window.__box.value, n: window.__inputs }));
			ok('held mouse on the right edge of "' + lab + '" does not run the value', after.v === g.v && after.n === 0, g.v + ' -> ' + after.v + ', ' + after.n + ' input events');
		}
		const label = await a.lang('lpn_settings_text_size');
		const g = await grab(label);

		// Wheel over a focused box does not step it.
		await a.page.evaluate(() => { window.__box.focus(); });
		const g2 = await a.page.evaluate(() => { const b = window.__box.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2, v: window.__box.value }; });
		await a.page.mouse.move(g2.x, g2.y);
		await a.page.mouse.wheel(0, -300);
		await a.page.waitForTimeout(300);
		await a.page.mouse.wheel(0, 300);
		await a.page.waitForTimeout(300);
		const v2 = await a.page.evaluate(() => window.__box.value);
		ok('a wheel notch over a focused box leaves its value alone', v2 === g2.v, g2.v + ' -> ' + v2);

		// A typed value still saves.
		const before = await a.page.evaluate(() => { const l = document.querySelector('text.lpn-lbl'); return l ? getComputedStyle(l).fontSize : null; });
		await a.page.evaluate(() => { window.__box.focus(); });
		await a.page.keyboard.press('Control+A');
		await a.page.keyboard.type('17');
		await a.page.keyboard.press('Tab');
		await a.settle(400);
		const typed = await a.page.evaluate(() => {
			const l = document.querySelector('text.lpn-lbl');
			return { v: window.__box.value, fs: l ? getComputedStyle(l).fontSize : null, stored: Object.keys(localStorage).some((k) => /^lpn_/.test(k) && (localStorage.getItem(k) || '').indexOf('"textSize":17') >= 0) };
		});
		ok('a typed 17 stands in the box', typed.v === '17', typed.v);
		ok('...reaches the drawing (label font size changed)', typed.fs !== before, before + ' -> ' + typed.fs);
		ok('...and is stored', typed.stored);
		ok('no uncaught page errors', a.errors.length === 0, a.errors.join('\n'));
	} finally { await browser.close(); env.stopServer(); }
	console.log(fails ? '\n' + fails + ' settings spinner check(s) FAILED' : '\nSettings spinner harness: all checks passed.');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.log('  FAIL threw: ' + (e && e.stack || e)); process.exit(1); });
