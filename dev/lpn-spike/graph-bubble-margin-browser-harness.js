// THE TIME SERIES BUBBLE'S MARGINS IN EVERY THEME. Real Chromium on Net3 after its run.
//   node dev/lpn-spike/graph-bubble-margin-browser-harness.js   (takes the browser lock itself)
//
// Tom, 2026-10-19, on the Rounded theme: "...leaves 0 margin at the lower right corner of the time series
// bubbles or even cut off the x-axis value there. There is excess spacing between the y axis title and the
// y axis... Also, the resizing icon ... overlaps the lower right x axis grid value."
// For each of the gallery's themes, at the smallest (200 px) and the largest (400 px) bubble, this proves:
//   1. the last time label lies wholly inside the bubble, with at least 2 px to spare at the right and bottom;
//   2. it lies wholly inside the chart's own SVG, so nothing clips it;
//   3. it does not touch the resize grip's drawn corner;
//   4. the gap between the y title and the widest y number is at most 12 px (no room kept "for long elevations").
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_BUBBLE_MARGIN_LOCKED';
const NAME = 'graph-bubble-margin-browser-harness';
if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	if (!cond || process.env.EC_VERBOSE) { console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail)); }
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
		const a = await Session.open(browser, 'bubm', { viewport: { width: 1500, height: 950 } });
		await a.goto('Looped-Network.php');
		await a.page.evaluate(() => {
			delete window.lpnDialogAnswerer;
			const c = document.getElementById('ec-consent'); if (c) { c.remove(); }
			let e = document.querySelector('.ec-consent-actions');
			while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
			if (e) { e.style.display = 'none'; }
		});
		await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
		await a.settle(800);
		await a.page.evaluate(() => { EngCalcs.lpnTimeRunNow(); });
		await a.waitFor(() => a.page.evaluate(() => EngCalcs.lpnTimeRunState().frames > 1), 'EPS frames', 120000);
		await a.settle(800);
		const LBL = await a.lang('lpn_tsb_menu');
		const pt = await a.page.evaluate(() => {
			const el = document.querySelector('#lpn_canvas [data-node="10"]'); const r = el.getBoundingClientRect();
			return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		});
		await a.page.mouse.click(pt.x, pt.y, { button: 'right' });
		await a.settle(400);
		await a.page.evaluate((l) => {
			Array.from(document.querySelectorAll('.lpn-pane-ctxmenu button')).filter((x) => x.textContent.trim() === l)[0].click();
		}, LBL);
		await a.settle(600);
		const themes = await a.page.evaluate(() => window.ecTheme.list.slice());
		ok('the gallery offers 13 themes', themes.length === 13, String(themes.length));
		const measure = () => a.page.evaluate(() => {
			const root = document.querySelector('.lpn-tsb'), svg = root.querySelector('svg.lpn-profile-svg');
			const R = root.getBoundingClientRect(), S = svg.getBoundingClientRect(), G = root.querySelector('.lpn-tsb-grip').getBoundingClientRect();
			const xs = Array.from(svg.querySelectorAll('text.lpn-profile-tick')).filter((t) => t.getAttribute('text-anchor') === 'middle');
			const ys = Array.from(svg.querySelectorAll('text.lpn-profile-tick')).filter((t) => t.getAttribute('text-anchor') === 'end');
			const last = xs.reduce((m, t) => (!m || t.getBoundingClientRect().right > m.getBoundingClientRect().right ? t : m), null);
			const L = last.getBoundingClientRect();
			const title = svg.querySelector('.lpn-profile-axistitle').getBoundingClientRect();
			const yl = Math.min.apply(null, ys.map((t) => t.getBoundingClientRect().left));
			return { w: R.width, label: last.textContent, lr: L.right, lb: L.bottom, ll: L.left, lt: L.top, Rr: R.right, Rb: R.bottom, Sr: S.right, Sb: S.bottom,
				gl: G.right - 11, gr: G.right - 3, gt: G.bottom - 11, gb: G.bottom - 3, gap: yl - title.right, n: xs.length };
		});
		for (const t of themes) {
			await a.page.evaluate((n) => window.ecTheme.set(n), t);
			await a.settle(500);
			for (const w of [200, 400]) {
				await a.page.evaluate((ww) => {
					const g = document.querySelector('.lpn-tsb-grip'), r = g.getBoundingClientRect(), root = document.querySelector('.lpn-tsb').getBoundingClientRect();
					g._want = ww; return [r, root];
				}, w);
				const root = await a.page.evaluate(() => { const r = document.querySelector('.lpn-tsb').getBoundingClientRect(); return { w: r.width }; });
				const g = await a.page.evaluate(() => { const r = document.querySelector('.lpn-tsb-grip').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
				await a.page.mouse.move(g.x, g.y); await a.page.mouse.down();
				await a.page.mouse.move(g.x + (w - root.w), g.y, { steps: 4 }); await a.page.mouse.up();
				await a.settle(300);
				const m = await measure(); if (process.env.EC_BUBBLE_SHOTS && w === 200) { const bb = await a.page.evaluate(() => { const r = document.querySelector('.lpn-tsb').getBoundingClientRect(); return { x: r.left - 4, y: r.top - 4, width: r.width + 8, height: r.height + 8 }; }); await a.page.screenshot({ path: process.env.EC_BUBBLE_SHOTS + '/' + t + '.png', clip: bb }); }
				const tag = t + ' @' + w;
				ok(tag + ': the bubble is ' + w + ' px', Math.abs(m.w - w) <= 2, String(m.w));
				ok(tag + ': last time label (' + m.label + ') inside the bubble with 2 px to spare', m.lr <= m.Rr - 2 && m.lb <= m.Rb - 2, JSON.stringify([m.lr, m.Rr, m.lb, m.Rb]));
				ok(tag + ': last time label inside the chart svg', m.lr <= m.Sr + 0.5 && m.lb <= m.Sb + 0.5, JSON.stringify([m.lr, m.Sr, m.lb, m.Sb]));
				const hit = m.lr > m.gl && m.ll < m.gr && m.lb > m.gt && m.lt < m.gb;
				ok(tag + ': last time label clear of the resize grip', !hit, JSON.stringify([m.ll, m.lr, m.lt, m.lb, m.gl, m.gr, m.gt, m.gb]));
				ok(tag + ': y title to y numbers gap is 12 px or less', m.gap <= 12 && m.gap >= 0, String(m.gap));
			}
		}
		console.log(NAME + ': ' + (checks - failures) + '/' + checks + ' ok');
	} finally { await browser.close(); env.stopServer(); }
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
