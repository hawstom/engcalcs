// BOX DESIGN, ROUND 7 (Tom's 2026-10-30 browser pass on round 6). Run with:
//   node dev/lpn-spike/box-phone7-browser-harness.js   (takes the browser lock itself)
//   A. no name column is crushed: on a phone (touch), at 390, 360 and 320 px wide (Tom's phone showed Settings > Page one letter wide), every Settings section's names are at least 5 characters wide,
//      and so are the names of Properties, Find and replace, Fire flow and Criticality;
//   B. a phone flyout opens tall (the column's whole height, less the room its bottom pill needs) (a dragged `dockH` still wins: box-phone5 C and box-phone6 C);
//   C. at 390, 360 and 320 px no Settings section scrolls sideways (scrollWidth <= clientWidth + 1 on the pane);
//   D. the flyout's bottom pill lies wholly on screen and dragging it up shortens the box, on short screens (320 x 640, 320 x 700, 360 x 640).
// EC_SHOTS=<dir> saves box7-*.png there.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_BP7_LOCKED';
const NAME = 'box-phone7-browser-harness';
const SHOTS = process.env.EC_SHOTS || '';
if (process.env[LOCK_ENV] !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' }) });
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
const MIN_CHARS = 5;
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const net1 = fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8');
	const shot = (S, n) => SHOTS ? S.page.screenshot({ path: path.join(SHOTS, n) }) : Promise.resolve();
	const openNet1 = async (S, scale, keep) => {
		await S.page.addInitScript(() => { window.EC_DEFAULT_DOCKS = true; });
		await S.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
		await S.goto('Looped-Network.php?ec_nolog=1');
		if (!keep) { await S.page.evaluate((t) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', t); localStorage.setItem('lpn_hovercard', 'off'); }, net1); }
		await S.reload();
		await S.answerTrainingPanel().catch(() => {});
		await S.page.evaluate((sc) => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } if (sc !== 100) { document.documentElement.style.fontSize = sc + '%'; } }, scale);
		await S.settle(2500);
	};
	// The narrowest visible name, in characters (its width over its own font size's character width, about .5 em).
	const narrowest = (S, scope, sel) => S.page.evaluate((a) => {
		const root = document.querySelector(a.scope);
		if (!root) { return null; }
		const r0 = root.getBoundingClientRect();
		const worst = Array.from(root.querySelectorAll(a.sel)).filter((e) => {
			const r = e.getBoundingClientRect();
			return r.width > 0 && r.height > 0 && r.bottom > r0.top && r.top < r0.bottom && e.textContent.trim().length > 0;
		}).map((e) => ({ w: e.getBoundingClientRect().width, ch: e.getBoundingClientRect().width / (parseFloat(getComputedStyle(e).fontSize) * 0.5), t: e.textContent.trim().slice(0, 18) }))
			.sort((a, b) => a.ch - b.ch)[0];
		return worst || null;
	}, { scope, sel });
	try {
		for (const vw of [390, 360, 320]) {
			const scale = 100;
			console.log('\n--- A. Settings, every section, ' + vw + ' x 844 touch ---');
			const S = await Session.open(browser, NAME + '-a' + vw, { viewport: { width: vw, height: 844 }, hasTouch: true, isMobile: true });
			await openNet1(S, scale);
			await S.menuClick(await S.lang('lpn_tool_settings'), 'project');
			await S.settle(900);
			const P = S.page;
			const n = await P.evaluate(() => document.querySelectorAll('#lpn_setbox_index .lpn-setbox-link').length);
			ok('the Settings index lists its sections', n >= 15, String(n));
			let bad = [], wide = [];
			for (let i = 0; i < n; i++) {
				await P.evaluate(() => { const b = document.querySelector('#lpn_setbox_jump'); if (b) { b.click(); } });
				await S.settle(200);
				const t = await P.evaluate((k) => { const b = document.querySelectorAll('#lpn_setbox_index .lpn-setbox-link')[k]; b.click(); return b.textContent.trim(); }, i);
				await S.settle(450);
				const m = await narrowest(S, '#lpn_setbox_content', '.lpn-set-row > :first-child, .lpn-set-name');
				if (process.env.EC_DEBUG && m) { console.log('    ' + t + ' ' + JSON.stringify(m)); }
				if (m && m.ch < MIN_CHARS) { bad.push(t + ' "' + m.t + '" ' + Math.round(m.w) + 'px'); }
				const sw = await P.evaluate(() => ['lpn_setbox_content', 'lpn_setbox_index'].map((id) => { const e = document.getElementById(id); return e ? e.scrollWidth - e.clientWidth : 0; }));
				if (Math.max.apply(null, sw) > 1) { wide.push(t + ' +' + Math.max.apply(null, sw) + 'px'); }
				if (t === 'Page') { await shot(S, 'box7-settings-page-phone' + (vw === 390 ? '' : '-' + vw) + '.png'); }
			}
			ok('no Settings name is narrower than ' + MIN_CHARS + ' characters in any of the ' + n + ' sections', bad.length === 0, bad.join(' | '));
			ok('C. no Settings section scrolls sideways at ' + vw + ' px (scrollWidth <= clientWidth + 1)', wide.length === 0, wide.join(' | '));
			ok('no page error', S.errors.length === 0, S.errors.join(' | '));
			await S.close();
		}

		console.log('\n--- A2. Properties, Find and replace, Fire flow and Criticality keep a readable name column (320 px) ---');
		{
			const S = await Session.open(browser, NAME + '-a2', { viewport: { width: 320, height: 844 }, hasTouch: true, isMobile: true });
			await openNet1(S, 100);
			const L = (k) => S.lang(k);
			const analyze = await L('lpn_analyze_menu');
			const doors = [
				['Find and replace', '#lpn_find_popup', async () => { await S.menuClick(await L('lpn_find_menu'), 'edit'); }],
				['Fire flow', '#lpn_ff_box', async () => { await S.menuClickSub(analyze, await L('lpn_ff_menu'), 'project'); }],
				['Criticality', '#lpn_crit_box', async () => { await S.menuClickSub(analyze, await L('lpn_crit_menu'), 'project'); }]];
			const at = await S.page.evaluate(() => { const r = document.querySelector('#lpn_canvas .lpn-link-hit[data-link="10"]').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
			await S.page.touchscreen.tap(at.x, at.y);
			await S.settle(1100);
			let m = await narrowest(S, '#lpn_popup', '.lpn-gname');
			ok('Properties: narrowest name is at least ' + MIN_CHARS + ' characters', !!m && m.ch >= MIN_CHARS, m && (m.t + ' ' + Math.round(m.w) + 'px'));
			await S.page.keyboard.press('Escape'); await S.settle(300);
			for (const [what, boxSel, door] of doors) {
				await door();
				await S.settle(900);
				m = await narrowest(S, boxSel, '.lpn-gname');
				ok(what + ': narrowest name is at least ' + MIN_CHARS + ' characters', !!m && m.ch >= MIN_CHARS, m && (m.t + ' ' + Math.round(m.w) + 'px'));
				await S.page.keyboard.press('Escape'); await S.settle(300);
			}
			await S.close();
		}

		console.log('\n--- B. a phone flyout opens tall ---');
		{
			const S = await Session.open(browser, NAME + '-b', { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
			await openNet1(S, 100);
			await S.menuClick(await S.lang('lpn_tool_settings'), 'project');
			await S.settle(900);
			const g = await S.page.evaluate(() => { const b = document.getElementById('lpn_settings_box').getBoundingClientRect(); const c = document.getElementById('lpn_canvas').getBoundingClientRect(); return { top: b.top, bottom: b.bottom, h: b.height, vh: window.innerHeight, ctop: c.top, cbottom: c.bottom }; });
			console.log('  ' + JSON.stringify(g));
			ok('the Settings flyout is at least 75% of the map column tall', g.h >= 0.75 * (g.cbottom - g.ctop), Math.round(g.h) + ' of ' + Math.round(g.cbottom - g.ctop));
			await shot(S, 'box7-settings-phone.png');
			await S.close();
		}

		console.log('\n--- D. the bottom pill on short screens ---');
		for (const [w, h] of [[320, 640], [320, 700], [360, 640]]) {
			const S = await Session.open(browser, NAME + '-d' + w + 'x' + h, { viewport: { width: w, height: h }, hasTouch: true, isMobile: true });
			await openNet1(S, 100);
			await S.menuClick(await S.lang('lpn_tool_settings'), 'project');
			await S.settle(900);
			const info = () => S.page.evaluate(() => { const b = document.getElementById('lpn_settings_box').getBoundingClientRect(), g = document.getElementById('lpn_dock_hgrip'), r = g.getBoundingClientRect();
				return { h: Math.round(b.height), gt: r.top, gb: r.bottom, x: r.left + r.width / 2, y: r.top + r.height / 2, shown: getComputedStyle(g).display !== 'none', vh: innerHeight }; });
			const z = await info();
			ok(w + 'x' + h + ': the bottom pill is there and its touch strip lies wholly on screen', z.shown && z.gb <= z.vh, JSON.stringify(z));
			const cdp = await S.page.context().newCDPSession(S.page);
			const tp = (type, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x: z.x, y, id: 1 }] });
			await tp('touchStart', z.y);
			for (let i = 1; i <= 8; i++) { await tp('touchMove', z.y - i * 30); await S.settle(30); }
			await tp('touchEnd', 0);
			await S.settle(400);
			const z2 = await info();
			ok(w + 'x' + h + ': dragging the pill up makes the box shorter', z2.h < z.h - 100, z.h + ' -> ' + z2.h);
			ok('no page error', S.errors.length === 0, S.errors.join(' | '));
			await S.close();
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' passed' + (failures ? ', ' + failures + ' FAILED' : ''));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(NAME + ': ' + (e && e.stack || e)); process.exit(1); });
