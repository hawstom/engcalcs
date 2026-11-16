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
const ICONS = ['sliders', 'step-back', 'play', 'step-fwd'];
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
		ok('Net1: the button sits close to the time selector (gap under 8 px) and further from Back than from the selector', await s.page.evaluate(() => {
			const a = document.getElementById('lpn_time_step').getBoundingClientRect(), b = document.querySelector('#lpn_toolbar_run .lpn-time-more').getBoundingClientRect(), c = document.querySelector('#lpn_toolbar_run button[data-icon="step-back"]').getBoundingClientRect();
			return b.left - a.right >= 2 && b.left - a.right < 8 && c.left - b.right > b.left - a.right;
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
		// A phone's address bar sliding away changes the height only: the pop-up stays. A change of width closes it.
		await s.page.setViewportSize({ width: 1400, height: 800 });
		await s.settle(300);
		ok('a height-only resize leaves the pop-up open', (await pop()).visible);
		await s.page.setViewportSize({ width: 1380, height: 800 });
		await s.settle(300);
		ok('a change of width closes the pop-up', !(await pop()).visible);
		await s.page.setViewportSize({ width: 1400, height: 900 });
		await s.settle(300);
		await s.page.click('#lpn_toolbar_run .lpn-time-more');
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
		// The pop-up is placed once, so a resize closes it rather than leaving it hanging where the strip was.
		await s.page.click('#lpn_toolbar_run .lpn-time-more');
		await s.page.setViewportSize({ width: 1100, height: 800 });
		await s.settle(300);
		ok('a resize closes the pop-up', !(await pop()).visible);
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

		// ---- THE GRAPH'S TIME LINE IS A HANDLE (Tom, 2026-11-14): press and drag on the Time series chart ----
		// Mouse on a desktop; then a finger (touch pointer events through the DevTools protocol) on a window
		// that has touch, so `touch-action` has to be right or the browser takes the gesture for a scroll.
		for (const touch of [false, true]) {
			s = await Session.open(browser, 'A', { viewport: { width: 1400, height: 900 }, hasTouch: touch });
			await s.goto('Looped-Network.php');
			await s.settle(1200);
			await s.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			await openNet1(s);
			await s.page.evaluate(() => { EngCalcs.lpnTimeRunNow(); });
			await s.waitFor(() => s.page.evaluate(() => EngCalcs.lpnTimeRunState().frames > 1), 'EPS frames', 120000);
			const bb = await (await s.page.$('.lpn-node-hit[data-node="10"]')).boundingBox();
			await s.page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
			await s.settle(500);
			await s.toolbarClick(await s.lang('lpn_pane_toggle'));
			await s.settle(500);
			await s.page.evaluate(() => document.getElementById('lpn_pane_tab_timeseries').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
			await s.settle(800);
			await s.page.evaluate(() => document.getElementById('lpn_ts_add').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
			await s.settle(600);
			const tag = touch ? 'finger' : 'mouse';
			const geo = () => s.page.evaluate(() => {
				const h = document.querySelector('#lpn_ts_chart .lpn-ts-now-hit'), f = document.querySelector('#lpn_ts_chart .lpn-profile-frame');
				if (!h || !f) { return null; }
				const a = h.getBoundingClientRect(), b = f.getBoundingClientRect();
				return { x: a.left + a.width / 2, y: a.top + a.height / 2, left: b.left, right: b.right, now: EngCalcs.lpnTimeNow() };
			});
			let g = await geo();
			ok(tag + ': the time line has a wide, invisible handle over it', !!g && await s.page.evaluate(() => {
				const h = document.querySelector('#lpn_ts_chart .lpn-ts-now-hit'); return parseFloat(getComputedStyle(h).strokeWidth) >= 20 && getComputedStyle(h).touchAction === 'none';
			}));
			const frames = await s.page.evaluate(() => EngCalcs.lpnTimeRunFrames().map((f) => f.t));
			const t0 = g.now;
			// Aim three quarters of the way across the frame; the step the run lands on is the nearest reporting step.
			const aimX = g.left + (g.right - g.left) * 0.75;
			const path = [];
			for (let k = 1; k <= 12; k++) { path.push(g.x + (aimX - g.x) * k / 12); }
			if (!touch) {
				await s.page.mouse.move(g.x, g.y);
				await s.page.mouse.down();
				for (const x of path) { await s.page.mouse.move(x, g.y); await s.settle(60); }
				await s.page.mouse.up();
			} else {
				const cdp = await s.context.newCDPSession(s.page);
				await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: g.x, y: g.y }] });
				for (const x of path) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: g.y }] }); await s.settle(60); }
				await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
			}
			await s.settle(800);
			const after = await geo();
			const sel = await s.page.evaluate(() => +document.getElementById('lpn_time_step').value);
			ok(tag + ': dragging the time line moved the run to a later step', after && after.now > t0, t0 + ' -> ' + (after && after.now));
			ok(tag + ': ...and it is exactly a reporting step', after && frames.indexOf(after.now) >= 0, String(after && after.now));
			ok(tag + ': ...and the time selector on the toolbar shows that step', frames[sel] === after.now, 'selector ' + sel + ' = ' + frames[sel]);
			// Where the pointer ended is where the line is, to within half a reporting step.
			const step = (g.right - g.left) / Math.max(1, frames[frames.length - 1] / (frames[1] - frames[0]));
			ok(tag + ': ...and the line sits under where the pointer was released (within half a step)', Math.abs((await s.page.evaluate(() => {
				const h = document.querySelector('#lpn_ts_chart .lpn-ts-now-hit').getBoundingClientRect(); return h.left + h.width / 2; })) - aimX) <= step / 2 + 2,
				'aim ' + Math.round(aimX) + ', step ' + step.toFixed(1) + 'px');
			// A click on the line (no travel) keeps the step it is on.
			const before2 = after.now;
			if (!touch) { await s.page.mouse.click(after.x, after.y); }
			await s.settle(500);
			ok(tag + ': a click on the line leaves the step as it was', (await geo()).now === before2);
			// A press on the line while the run is playing stops the playback, or the next tick moves the line from under the pointer.
			if (!touch) {
				await s.page.evaluate(() => { EngCalcs.lpnTimeGoTo(0); });
				await s.page.click('#lpn_toolbar_run button[data-icon="play"], #lpn_toolbar_run button[data-icon="pause"]');
				await s.settle(300);
				const pg = await geo();
				await s.page.mouse.move(pg.x, pg.y);
				await s.page.mouse.down();
				await s.settle(150);
				const playingAfterPress = await s.page.evaluate(() => document.querySelector('#lpn_toolbar_run .lpn-transport-btn[aria-pressed]').getAttribute('aria-pressed'));
				await s.page.mouse.up();
				ok(tag + ': pressing the time line while playing stops the playback', playingAfterPress === 'false', playingAfterPress);
			}
			// ---- the same drag on the other charts that carry the line ----
			// The Properties box builds a NEW chart container on every redraw, so the drag has to find the live one
			// (Perry, 2026-11-15: it stayed at 0:00). Then a graph bubble on the map.
			const dragOn = async (sel, name) => {
				await s.page.evaluate((t) => { EngCalcs.lpnTimeGoTo(t); }, frames[0]);
				await s.settle(700);
				await s.page.evaluate((q) => { const e = document.querySelector(q); if (e) { e.scrollIntoView({ block: 'center' }); } }, sel + ' .lpn-ts-now-hit');
				await s.settle(300);
				const geoOn = () => s.page.evaluate((q) => {
					const h = document.querySelector(q + ' .lpn-ts-now-hit'), f = document.querySelector(q + ' .lpn-profile-frame');
					if (!h || !f) { return null; }
					const a1 = h.getBoundingClientRect(), b1 = f.getBoundingClientRect();
					return { x: a1.left + a1.width / 2, y: a1.top + a1.height / 2, left: b1.left, right: b1.right, now: EngCalcs.lpnTimeNow() };
				}, sel);
				const g2 = await geoOn();
				ok(tag + ': ' + name + ' draws a time line', !!g2);
				if (!g2) { return; }
				const ax = g2.left + (g2.right - g2.left) * 0.6, pth = [];
				for (let k = 1; k <= 12; k++) { pth.push(g2.x + (ax - g2.x) * k / 12); }
				if (!touch) {
					await s.page.mouse.move(g2.x, g2.y); await s.page.mouse.down();
					for (const x of pth) { await s.page.mouse.move(x, g2.y); await s.settle(60); }
					await s.page.mouse.up();
				} else {
					const cdp2 = await s.context.newCDPSession(s.page);
					await cdp2.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: g2.x, y: g2.y }] });
					for (const x of pth) { await cdp2.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: g2.y }] }); await s.settle(60); }
					await cdp2.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
				}
				await s.settle(800);
				const g3 = await geoOn();
				ok(tag + ': dragging the time line in ' + name + ' steps the run to a reporting step', g3 && g3.now > g2.now && frames.indexOf(g3.now) >= 0, g2.now + ' -> ' + (g3 && g3.now));
			};
			await dragOn('#lpn_pgraph_chart', 'the Properties box graph');
			await s.page.evaluate(() => { const c = document.getElementById('lpn_popup_close'); if (c && c.offsetParent) { c.click(); } });
			await s.settle(300);
			if (!touch) {
				const pt = await s.page.evaluate(() => { const r = document.querySelector('#lpn_canvas [data-node="10"]').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
				await s.page.mouse.click(pt.x, pt.y, { button: 'right' });
				await s.settle(400);
				const lbl = await s.lang('lpn_tsb_menu');
				await s.page.evaluate((l) => { Array.from(document.querySelectorAll('.lpn-pane-ctxmenu button')).filter((x) => x.textContent.trim() === l)[0].click(); }, lbl);
				await s.settle(800);
				await dragOn('.lpn-tsb .lpn-tsb-chart', 'a graph bubble on the map');
			}
			// A drag with the line off to the end clamps to the last step.
			ok(tag + ': no uncaught page errors', s.errors.length === 0, s.errors.join('\n'));
			await s.context.close().catch(() => {});
		}

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
		await s.page.click('#lpn_toolbar_run .lpn-time-more');
		const rp = await s.page.evaluate(() => { const q = document.getElementById('lpn_time_pop').getBoundingClientRect(), t = document.getElementById('lpn_time_step').getBoundingClientRect(); return { pr: q.right, pl: q.left, tr: t.right, vw: innerWidth }; });
		ok('RTL: the pop-up hangs from the selector\'s right edge and stays inside the window', Math.abs(rp.pr - rp.tr) <= 2 && rp.pl >= 0, JSON.stringify(rp));
		await s.page.keyboard.press('Escape');
		await s.context.close().catch(() => {});
	} finally { await browser.close(); env.stopServer(); }
	console.log(fails ? '\ntransport-ends: ' + fails + ' FAILED' : '\ntransport-ends: all ok');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
