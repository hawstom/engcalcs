// RESTART AND END ON THE RUN TRANSPORT, AND NO PLAYER IN STEADY STATE (Tom, 2026-10-05): a tester
// asked for Restart and End; Tom: "tight real estate... Maybe the buttons can be smaller" and
// "Maybe the EPS controls can disappear for steady state. Many users never do EPS." Real Chromium.
//   node dev/lpn-spike/transport-ends-browser-harness.js
// DO NOT PREFIX THIS WITH `flock`: it takes /tmp/engcalcs-browser.lock itself.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
if (process.env.EC_TENDS_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { EC_TENDS_LOCKED: '1' }) });
		if (r.status === 75) { console.error('transport-ends-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}
const ICONS = ['restart', 'step-back', 'play', 'step-fwd', 'end'];
// What the browser drew in the run group: each player button's box, the selects, the group itself.
function read(page) {
	return page.evaluate((icons) => {
		const g = document.getElementById('lpn_toolbar_run');
		const vis = (e) => !!e && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0;
		const out = { group: g ? vis(g) : false, btns: {}, rects: {} };
		icons.forEach((i) => {
			const b = g && g.querySelector('button[data-icon="' + i + '"]');
			out.btns[i] = vis(b);
			if (b) { const r = b.getBoundingClientRect(); out.rects[i] = { l: r.left, r: r.right, w: r.width, h: r.height, t: r.top }; }
		});
		const run = g && g.querySelector('button[data-icon="run"]');
		out.run = vis(run);
		out.runRule = !!run && getComputedStyle(run).display;
		out.autoRun = typeof EngCalcs.lpnTimeAutoRun === 'function' ? null : null;
		out.step = vis(document.getElementById('lpn_time_step'));
		out.speed = vis(document.getElementById('lpn_time_speed'));
		out.sel = g ? (g.querySelector('#lpn_time_step') || {}).value : null;
		const kids = g ? Array.from(g.children).filter(vis) : [];
		const bar = document.getElementById('lpn_toolbar').getBoundingClientRect();
		out.wrapped = kids.length > 0 && kids.some((k) => Math.abs((k.getBoundingClientRect().top + k.getBoundingClientRect().bottom) - (kids[0].getBoundingClientRect().top + kids[0].getBoundingClientRect().bottom)) > 16);
		out.docOverflow = document.documentElement.scrollWidth > window.innerWidth;
		out.kidsRight = kids.length ? Math.max.apply(null, kids.map((k) => k.getBoundingClientRect().right)) : 0;
		out.kidsLeft = kids.length ? Math.min.apply(null, kids.map((k) => k.getBoundingClientRect().left)) : 0;
		out.vw = window.innerWidth;
		return out;
	}, ICONS);
}
async function openNet1(s) {
	await s.page.evaluate(() => {
		const cards = [...document.querySelectorAll('#lpn_examples_pane .lpn-example-card')];
		(cards.find((c) => /Net1/.test(c.textContent || '')) || cards[0]).click();
	});
	await s.settle(2500);
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
		// ---- desktop: steady state, then Net1 ----
		let s = await Session.open(browser, 'A', { viewport: { width: 1400, height: 900 } });
		await s.goto('Looped-Network.php');
		await s.settle(1200);
		let r = await read(s.page);
		ok('steady state: no player button is shown', ICONS.every((i) => !r.btns[i]), JSON.stringify(r.btns));
		ok('steady state: neither selector is shown', !r.step && !r.speed);
		const autoRun = await s.page.evaluate(() => !(document.querySelector('#lpn_toolbar_run button[data-icon="run"]') || {}).style.display);
		ok('steady state: Run follows its own rule (shown exactly when auto-run is off)', r.run === autoRun, 'run shown=' + r.run);
		ok('steady state: no empty group is left drawing a divider', r.run || !r.group);
		const tipSteady = await s.page.evaluate(() => {
			// the Project menu row's tip is what the pageConfig says for a no-period project
			return EngCalcs.pageConfig.lpn_time_no_period;
		});
		ok('the no-period sentence exists to be shown on the Run menu row', !!tipSteady);

		await openNet1(s);
		r = await read(s.page);
		ok('Net1: all five player buttons are shown', ICONS.every((i) => r.btns[i]), JSON.stringify(r.btns));
		ok('Net1: both selectors are shown', r.step && r.speed);
		const order = ICONS.map((i) => r.rects[i].l);
		ok('Net1: order is Restart, Back, Play, Forward, End (left to right)', order.every((v, k) => k === 0 || v > order[k - 1]), order.map(Math.round).join(','));
		ok('Net1: buttons are small (<= 36 wide, narrower than the old 44)', ICONS.every((i) => r.rects[i].w <= 36),
			ICONS.map((i) => Math.round(r.rects[i].w) + 'x' + Math.round(r.rects[i].h)).join(' '));
		ok('Net1: the run group is on one row', !r.wrapped);
		// End then Restart land on the last and first stops.
		const nStops = await s.page.evaluate(() => document.getElementById('lpn_time_step').options.length);
		await s.page.click('#lpn_toolbar_run button[data-icon="end"]');
		await s.settle(2500);
		let v = await s.page.evaluate(() => +document.getElementById('lpn_time_step').value);
		ok('End lands on the last stop', v === nStops - 1, v + ' of ' + nStops);
		await s.page.click('#lpn_toolbar_run button[data-icon="restart"]');
		await s.settle(2500);
		v = await s.page.evaluate(() => +document.getElementById('lpn_time_step').value);
		ok('Restart lands on the first stop', v === 0, String(v));
		await s.context.close().catch(() => {});

		// ---- phone: 390, steady and Net1 ----
		s = await Session.open(browser, 'A', { viewport: { width: 390, height: 844 } });
		await s.goto('Looped-Network.php');
		await s.settle(1200);
		await openNet1(s);
		r = await read(s.page);
		console.log('   phone Net1', JSON.stringify({ l: r.kidsLeft, r: r.kidsRight, vw: r.vw, wrapped: r.wrapped }));
		ok('phone 390: the player does not wrap', !r.wrapped);
		ok('phone 390: the player fits inside the window', r.kidsRight <= r.vw && r.kidsLeft >= 0);
		ok('phone 390: all five buttons are shown', ICONS.every((i) => r.btns[i]));
		ok('phone 390: the page does not scroll sideways', !r.docOverflow);
		await s.context.close().catch(() => {});

		// ---- right to left ----
		s = await Session.open(browser, 'A', { viewport: { width: 1400, height: 900 }, locale: 'ar' });
		await s.goto('Looped-Network.php?lang=ar');
		await s.settle(1200);
		const dir = await s.page.evaluate(() => document.documentElement.getAttribute('dir'));
		ok('the Arabic page is right to left', dir === 'rtl', String(dir));
		await openNet1(s);
		r = await read(s.page);
		const o2 = ICONS.map((i) => r.rects[i] ? r.rects[i].l : NaN);
		ok('RTL: Restart is at the right and End at the left', o2[0] > o2[4] && o2.every((v, k) => k === 0 || v < o2[k - 1]), o2.map(Math.round).join(','));
		const tf = await s.page.evaluate((icons) => icons.map((i) => {
			const sv = document.querySelector('#lpn_toolbar_run button[data-icon="' + i + '"] svg');
			return sv ? getComputedStyle(sv).transform : '';
		}), ICONS);
		ok('RTL: the four direction glyphs are mirrored and Play is not', [0, 1, 3, 4].every((k) => /-1/.test(tf[k])) && !/-1/.test(tf[2]), tf.join(' | '));
		await s.context.close().catch(() => {});
	} finally { await browser.close(); env.stopServer(); }
	console.log(fails ? '\ntransport-ends: ' + fails + ' FAILED' : '\ntransport-ends: all ok');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
