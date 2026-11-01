// SETTINGS: RESIZING THE BOX KEEPS THE INDEX'S SECTION AT THE TOP OF THE CONTENT PANE (Tom, round 11:
// "Units is highlighted in the index. But when I resize, scrolling changes; the units section goes off
// the screen"). Real Chromium. Select Units in the index, then change the box's width and height in
// steps (the way an edge drag does: width/height style set, a layout and a resize observer between
// steps), docked and floating. During and after, the heading of the highlighted section sits at the top
// of the content pane (under the sticky section heading for a sub-heading), within 6 px.
//   node dev/lpn-spike/settings-resize-keeps-section-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
if (process.env.EC_SRK_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], { stdio: 'inherit', env: Object.assign({}, process.env, { EC_SRK_LOCKED: '1' }) });
		if (r.status === 75) { console.error('NOT RUN -- browser lock held.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0, checks = 0;
function ok(name, cond, extra) { checks++; if (!cond) { fails++; } console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra)); }
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'A');
		const page = a.page;
		await page.setViewportSize({ width: 1300, height: 900 });
		await a.goto('Looped-Network.php');
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1200);
		await page.evaluate(() => { let e = document.querySelector('.ec-consent-actions'); while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; } if (e) { e.style.display = 'none'; } });
		await a.toolbarClick(await a.lang('lpn_tool_settings'));
		await page.waitForSelector('#lpn_settings_box', { state: 'visible' });
		await a.settle(800);
		const pick = () => page.evaluate(() => {
			const links = Array.from(document.querySelectorAll('#lpn_setbox_index .lpn-setbox-link'));
			const u = links.find((b) => b.getAttribute('data-sub') === 'lpn_set_sub_units') || links.find((b) => /^Units$/i.test(b.textContent.trim()));
			if (!u) { return false; } u.click(); return u.textContent;
		});
		const state = () => page.evaluate(() => {
			const c = document.getElementById('lpn_setbox_content'), box = document.getElementById('lpn_settings_box');
			const sel = document.querySelector('#lpn_setbox_index .lpn-setbox-link[aria-current]');
			const b = sel || null;
			const t = b && document.getElementById(b.getAttribute('data-sec') || b.getAttribute('data-sub'));
			if (!t) { return { none: true, cls: Array.from(document.querySelectorAll('#lpn_setbox_index .lpn-setbox-link')).slice(0, 3).map((x) => x.className) }; }
			const cr = c.getBoundingClientRect(), hr = t.getBoundingClientRect();
			let covered = 0;
			if (b.getAttribute('data-sub')) { covered = t.closest('.lpn-set-sec').querySelector('.lpn-set-head').getBoundingClientRect().height; }
			return { top: hr.top - cr.top, want: covered, w: Math.round(box.getBoundingClientRect().width), h: Math.round(box.getBoundingClientRect().height), name: b.textContent.trim() };
		});
		for (const mode of ['floating', 'docked']) {
			if (mode === 'docked') {
				await page.evaluate(() => { const b = document.querySelector('#lpn_settings_box [data-dock="right"]'); if (b) { b.click(); } });
				await a.settle(400);
			}
			ok(mode + ': Units found in the index', !!(await pick()));
			await a.settle(300);
			const s0 = await state();
			if (s0.none) { ok(mode + ': a highlighted index row is detectable', false, JSON.stringify(s0)); continue; }
			ok(mode + ': Units at the top after selecting', Math.abs(s0.top - s0.want) <= 6, JSON.stringify(s0));
			const steps = [[-120, 0], [-120, 0], [0, -150], [200, 0], [150, 150], [-200, -100]];
			for (const st of steps) {
				if (mode === 'floating') {
					await page.evaluate((st) => {
						const box = document.getElementById('lpn_settings_box'), r = box.getBoundingClientRect();
						box.style.width = Math.max(300, r.width + st[0]) + 'px';
						box.style.height = Math.max(250, r.height + st[1]) + 'px';
					}, st);
				} else {
					// A docked box is resized by its edge grip: a real mouse drag, in three moves so the pane re-lays out during it.
					const g = await page.evaluate(() => { const e = document.querySelector('.lpn-dock-grip-live:not(.lpn-dock-hgrip)'); if (!e) { return null; } const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
					if (!g) { ok('docked: the width grip exists', false); continue; }
					const side = await page.evaluate(() => document.getElementById('lpn_settings_box').getBoundingClientRect().left < window.innerWidth / 2 ? 1 : -1);
					await page.mouse.move(g.x, g.y); await page.mouse.down();
					for (let k = 1; k <= 3; k++) { await page.mouse.move(g.x + side * st[0] * k / 3, g.y); await a.settle(60); }
					await page.mouse.up();
				}
				await a.settle(250);
				const s = await state();
				ok(mode + ': after resize by ' + st + ' the section is still at the top', !s.none && Math.abs(s.top - s.want) <= 6, JSON.stringify(s));
			}
		}
		console.log('settings-resize-keeps-section-browser-harness: ' + (checks - fails) + '/' + checks + ' ok');
	} finally { await browser.close(); env.stopServer(); }
}
main().then(() => process.exit(fails ? 1 : 0), (e) => { console.error(e); process.exit(1); });
