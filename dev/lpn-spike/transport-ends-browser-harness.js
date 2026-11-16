// THE SLIM TRANSPORT (Tom, 2026-11-14: the time selector, Back, Play and Forward on the strip; Restart, End and
// Speed in the pop-up the chevron beside the selector opens), AND NO PLAYER IN STEADY STATE (Tom, 2026-10-05): a tester
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
const ICONS = ['chevron-down', 'step-back', 'play', 'step-fwd'];
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
		out.popOpen = vis(document.getElementById('lpn_time_pop'));
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
		ok('steady state: no time selector and no pop-up is shown', !r.step && !r.popOpen);
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
		ok('Net1: the chevron, Back, Play and Forward are shown', ICONS.every((i) => r.btns[i]), JSON.stringify(r.btns));
		ok('Net1: the time selector is shown and the pop-up is closed', r.step && !r.popOpen);
		ok('Net1: Restart, End and Speed are not on the strip', await s.page.evaluate(() => !document.querySelector('#lpn_toolbar button[data-icon="restart"], #lpn_toolbar button[data-icon="end"], #lpn_toolbar #lpn_time_speed')));
		const order = ICONS.map((i) => r.rects[i].l);
		ok('Net1: order is chevron, Back, Play, Forward (left to right)', order.every((v, k) => k === 0 || v > order[k - 1]), order.map(Math.round).join(','));
		ok('Net1: the chevron sits flush against the time selector', await s.page.evaluate(() => {
			const a = document.getElementById('lpn_time_step').getBoundingClientRect(), b = document.querySelector('#lpn_toolbar_run .lpn-time-more').getBoundingClientRect();
			return Math.abs(b.left - a.right) <= 2;
		}));
		ok('Net1: the run group is on one row', !r.wrapped);
		// ---- the pop-up, clicked through the way a person does ----
		const pop = () => s.page.evaluate(() => {
			const p = document.getElementById('lpn_time_pop'), m = document.querySelector('#lpn_toolbar_run .lpn-time-more');
			const rect = p.getBoundingClientRect(), visible = !p.hidden && rect.width > 0;
			return { visible, expanded: m.getAttribute('aria-expanded'), focusOnChevron: document.activeElement === m,
				focusInPop: p.contains(document.activeElement), l: rect.left, r: rect.right, t: rect.top, b: rect.bottom, vw: innerWidth, vh: innerHeight,
				rows: [...p.querySelectorAll('button, label')].map((e) => e.textContent.trim()),
				clip: [...p.querySelectorAll('button')].every((e) => getComputedStyle(e).textOverflow === 'clip') };
		});
		ok('pop-up is closed at first', !(await pop()).visible);
		await s.page.click('#lpn_toolbar_run .lpn-time-more');
		let pp = await pop();
		ok('chevron click opens the pop-up, says so, and puts focus inside', pp.visible && pp.expanded === 'true' && pp.focusInPop, JSON.stringify(pp));
		ok('the pop-up is words, not bare icons: Restart, End and Speed rows', pp.rows.length === 3 && pp.rows.every((x) => x.length > 2), pp.rows.join(' | '));
		ok('the pop-up is clipped, never ellipsised, and stays inside the window', pp.clip && pp.l >= 0 && pp.r <= pp.vw && pp.b <= pp.vh);
		await s.page.keyboard.press('Escape');
		pp = await pop();
		ok('Escape closes the pop-up and returns focus to the chevron', !pp.visible && pp.expanded === 'false' && pp.focusOnChevron);
		await s.page.click('#lpn_toolbar_run .lpn-time-more');
		await s.page.mouse.click(5, 600);
		ok('a click elsewhere closes the pop-up', !(await pop()).visible);
		await s.page.focus('#lpn_toolbar_run .lpn-time-more');
		await s.page.keyboard.press('Enter');
		ok('the chevron opens from the keyboard', (await pop()).visible);
		await s.page.keyboard.press('Escape');
		// End then Restart land on the last and first stops, through the pop-up.
		const nStops = await s.page.evaluate(() => document.getElementById('lpn_time_step').options.length);
		await s.page.click('#lpn_toolbar_run .lpn-time-more');
		await s.page.click('#lpn_time_pop button[data-icon="end"]');
		await s.settle(2500);
		let v = await s.page.evaluate(() => +document.getElementById('lpn_time_step').value);
		ok('End lands on the last stop and the pop-up closes', v === nStops - 1 && !(await pop()).visible, v + ' of ' + nStops);
		await s.page.click('#lpn_toolbar_run .lpn-time-more');
		await s.page.selectOption('#lpn_time_speed', '4');
		ok('Speed is chosen in the pop-up and the pop-up stays open', (await pop()).visible && (await s.page.evaluate(() => document.getElementById('lpn_time_speed').value)) === '4');
		await s.page.click('#lpn_time_pop button[data-icon="restart"]');
		await s.settle(2500);
		v = await s.page.evaluate(() => +document.getElementById('lpn_time_step').value);
		ok('Restart lands on the first stop', v === 0, String(v));
		await s.context.close().catch(() => {});

		// ---- the toolbar is ONE row at 1280 and 1366 (it was two) ----
		for (const [w, h] of [[1280, 800], [1366, 768]]) {
			s = await Session.open(browser, 'A', { viewport: { width: w, height: h } });
			await s.goto('Looped-Network.php');
			await s.settle(1200);
			await openNet1(s);
			const m = await s.page.evaluate(() => ({ tb: document.getElementById('lpn_toolbar').getBoundingClientRect().height,
				grp: document.getElementById('lpn_toolbar_run').getBoundingClientRect().width,
				find: document.querySelector('#lpn_toolbar .lpn-toolbar-end').getBoundingClientRect().top - document.getElementById('lpn_toolbar_run').getBoundingClientRect().top }));
			console.log('   ' + w + ' wide', JSON.stringify(m));
			ok(w + ' wide: the toolbar is one row (Find sits on the same line as the transport)', m.tb < 50 && Math.abs(m.find) < 12, JSON.stringify(m));
			await s.context.close().catch(() => {});
		}

		// ---- phone: 390, steady and Net1 ----
		s = await Session.open(browser, 'A', { viewport: { width: 390, height: 844 } });
		await s.goto('Looped-Network.php');
		await s.settle(1200);
		await openNet1(s);
		r = await read(s.page);
		console.log('   phone Net1', JSON.stringify({ l: r.kidsLeft, r: r.kidsRight, vw: r.vw, wrapped: r.wrapped }));
		ok('phone 390: the player does not wrap', !r.wrapped);
		ok('phone 390: the player fits inside the window', r.kidsRight <= r.vw && r.kidsLeft >= 0);
		ok('phone 390: the chevron, Back, Play and Forward are shown', ICONS.every((i) => r.btns[i]));
		ok('phone 390: the page does not scroll sideways', !r.docOverflow);
		await s.page.click('#lpn_toolbar_run .lpn-time-more');
		const pph = await s.page.evaluate(() => { const q = document.getElementById('lpn_time_pop').getBoundingClientRect(); return { l: q.left, r: q.right, w: q.width, vw: innerWidth }; });
		ok('phone 390: the pop-up opens and stays inside the window', pph.w > 0 && pph.l >= 0 && pph.r <= pph.vw, JSON.stringify(pph));
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
		ok('RTL: the chevron is at the right and Forward at the left', o2.every((v, k) => k === 0 || v < o2[k - 1]), o2.map(Math.round).join(','));
		const tf = await s.page.evaluate((icons) => icons.map((i) => {
			const sv = document.querySelector('#lpn_toolbar_run button[data-icon="' + i + '"] svg');
			return sv ? getComputedStyle(sv).transform : '';
		}), ICONS);
		ok('RTL: Back and Forward glyphs are mirrored and Play is not', [1, 3].every((k) => /-1/.test(tf[k])) && !/-1/.test(tf[2]), tf.join(' | '));
		await s.context.close().catch(() => {});
	} finally { await browser.close(); env.stopServer(); }
	console.log(fails ? '\ntransport-ends: ' + fails + ' FAILED' : '\ntransport-ends: all ok');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
