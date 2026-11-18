// RESTART AND END ON THE RUN TRANSPORT, AND NO PLAYER IN STEADY STATE (Tom, 2026-10-05): a tester
// asked for Restart and End; Tom: "tight real estate... Maybe the buttons can be smaller" and
// "Maybe the EPS controls can disappear for steady state. Many users never do EPS." Real Chromium.
// THE TIME SERIES CHART READS AND SETS THE TIME (Tom, 2026-11-17): hover crosshair and readout, click or tap, drag, by mouse and finger.
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

		// ---- THE CHART READS AND SETS THE TIME (Tom, 2026-11-17): thin line, hover crosshair, click or tap, drag ----
		// Mouse on a desktop; then a finger (touch pointer events through the DevTools protocol) on a window that has
		// touch, so `touch-action` has to be right or the browser takes the gesture for a scroll.
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
			const cdp = touch ? await s.context.newCDPSession(s.page) : null;
			const tp = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts });
			const geoOn = (q) => s.page.evaluate((q) => {
				const h = document.querySelector(q + ' .lpn-ts-now'), f = document.querySelector(q + ' .lpn-profile-frame');
				if (!h || !f) { return null; }
				const a = h.getBoundingClientRect(), b = f.getBoundingClientRect();
				const xb = document.querySelector(q + ' svg')._tsNow.xB;
				return { x: a.left + a.width / 2, y: b.top + b.height / 2, top: b.top, left: b.left, right: b.right, xmax: xb.max * 3600, now: EngCalcs.lpnTimeNow() };
			}, q);
			const geo = () => geoOn('#lpn_ts_chart');
			const crossOn = (q) => s.page.evaluate((q) => {
				const c = document.querySelector(q + ' .lpn-ts-cross');
				return c ? { text: c.textContent, line: c.querySelector('.lpn-ts-cross-line').getBoundingClientRect().left, now: EngCalcs.lpnTimeNow() } : null;
			}, q);
			// press-and-hold helpers: a click or tap, and a drag along y from x0 to x1 (steps as given)
			const tapAt = async (x, y) => { if (!touch) { await s.page.mouse.click(x, y); } else { await tp('touchStart', [{ x, y }]); await tp('touchEnd', []); } };
			const dragTo = async (x0, y, x1, n, endIt) => {
				if (!touch) {
					await s.page.mouse.move(x0, y); await s.page.mouse.down();
					for (let k = 1; k <= n; k++) { await s.page.mouse.move(x0 + (x1 - x0) * k / n, y); await s.settle(50); }
					if (endIt !== false) { await s.page.mouse.up(); }
				} else {
					await tp('touchStart', [{ x: x0, y }]);
					for (let k = 1; k <= n; k++) { await tp('touchMove', [{ x: x0 + (x1 - x0) * k / n, y }]); await s.settle(50); }
					if (endIt !== false) { await tp('touchEnd', []); }
				}
			};
			let g = await geo();
			ok(tag + ': there is a time line, and no triangle, knob or wide handle', !!g && await s.page.evaluate(() =>
				!document.querySelector('#lpn_ts_chart .lpn-ts-now-knob, #lpn_ts_chart .lpn-ts-now-hit, #lpn_ts_chart .lpn-ts-plot-hit, #lpn_ts_chart polygon')));
			// What a visitor sees at 0:00, where the line lies on the chart's left frame (Tom, 2026-11-17: "I don't see a time line").
			const seen = await s.page.evaluate(() => {
				const q = (c) => document.querySelector('#lpn_ts_chart ' + c);
				const line = q('.lpn-ts-now'), halo = q('.lpn-ts-now-halo'), fr = q('.lpn-profile-frame');
				if (!line || !fr) { return null; }
				const fb = fr.getBoundingClientRect(), lb = line.getBoundingClientRect(), cs = getComputedStyle(line), fs = getComputedStyle(fr), hs = halo && getComputedStyle(halo);
				return { lw: parseFloat(cs.strokeWidth), fw: parseFloat(fs.strokeWidth), lc: cs.stroke, fc: fs.stroke, hc: hs && hs.stroke, lx: lb.left + lb.width / 2, fl: fb.left, lt: lb.top, ft: fb.top, now: EngCalcs.lpnTimeNow() };
			});
			ok(tag + ': at 0:00 the line is thin, in a chrome colour, and not the frame (another colour, standing above its top edge, on a halo)',
				!!seen && seen.now === 0 && seen.lw <= 2 && seen.lc !== seen.fc && seen.lt < seen.ft - 2 && !!seen.hc && seen.hc !== seen.lc, JSON.stringify(seen));
			ok(tag + ': ...and it lies on the left edge of the plot, which is where 0:00 is', !!seen && Math.abs(seen.lx - seen.fl) < 1.5);
			const mapText = () => s.page.evaluate(() => document.getElementById('lpn_canvas').textContent.replace(/\s+/g, ' '));
			const frames = await s.page.evaluate(() => EngCalcs.lpnTimeRunFrames().map((f) => f.t));
			const stepPx = (g.right - g.left) / Math.max(1, g.xmax / (frames[1] - frames[0]));
			const xOf = (t) => g.left + (g.right - g.left) * t / g.xmax;
			const py = g.y + 15;
			// ---- hover (mouse): a crosshair and a readout, and nothing changes ----
			if (!touch) {
				const mapBefore0 = await mapText();
				await s.page.mouse.move(xOf(frames[5]) + 2, py);
				await s.settle(300);
				const cr = await crossOn('#lpn_ts_chart');
				ok('mouse: hovering the plot draws a crosshair on the nearest reporting time', !!cr && Math.abs(cr.line - xOf(frames[5])) <= 2, JSON.stringify(cr && { line: cr.line, want: xOf(frames[5]) }));
				ok('mouse: ...the readout gives the time and the series value there', !!cr && cr.text.indexOf(await s.page.evaluate((t) => EngCalcs.lpnFormatTime(t), frames[5])) >= 0 && /10\s+-?[\d.]+/.test(cr.text), cr && cr.text);
				ok('mouse: ...and the run, the time selector and the map did not change', !!cr && cr.now === 0 && (await mapText()) === mapBefore0 && (await s.page.evaluate(() => +document.getElementById('lpn_time_step').value)) === 0);
				await s.page.mouse.move(g.right + 60, py);
				await s.settle(200);
				ok('mouse: leaving the plot removes the crosshair', !(await crossOn('#lpn_ts_chart')));
			}
			// ---- a click or tap sets the nearest reporting time ----
			await tapAt(xOf(frames[6]) + 3, py);
			await s.settle(600);
			let after = await geo();
			ok(tag + ': a ' + (touch ? 'tap' : 'click') + ' on the plot sets the run to the nearest reporting time', after.now === frames[6], after.now + ' vs ' + frames[6]);
			ok(tag + ': ...and the time selector on the toolbar shows it', (await s.page.evaluate(() => +document.getElementById('lpn_time_step').value)) === 6);
			// ---- a drag scrubs; map and selector follow ----
			await s.page.evaluate((t) => { EngCalcs.lpnTimeGoTo(t); }, frames[0]);
			await s.settle(600);
			g = await geo();
			const mapBefore = await mapText();
			const aimX = g.left + (g.right - g.left) * 0.75;
			await dragTo(xOf(frames[2]), py, aimX, 12, false);
			// while the pointer is still down the readout shows (a phone has no hover)
			const down = await crossOn('#lpn_ts_chart');
			ok(tag + ': while the ' + (touch ? 'finger' : 'button') + ' is down the readout shows', !!down && /\d/.test(down.text), down && down.text);
			if (!touch) { await s.page.mouse.up(); } else { await tp('touchEnd', []); }
			await s.settle(800);
			after = await geo();
			const sel = await s.page.evaluate(() => +document.getElementById('lpn_time_step').value);
			ok(tag + ': dragging along the plot moved the run to a later step', after.now > frames[2], frames[2] + ' -> ' + after.now);
			ok(tag + ': ...and the map shows different results (its labels changed)', (await mapText()) !== mapBefore);
			ok(tag + ': ...and it is exactly a reporting step, shown on the selector', frames.indexOf(after.now) >= 0 && frames[sel] === after.now, 'selector ' + sel);
			ok(tag + ': ...and the line sits under where the pointer was released (within half a step)', Math.abs(after.x - aimX) <= stepPx / 2 + 2, 'aim ' + Math.round(aimX) + ', step ' + stepPx.toFixed(1) + 'px, at ' + Math.round(after.x));
			if (touch) { ok('finger: the readout goes when the finger lifts', !(await crossOn('#lpn_ts_chart'))); }
			// A drag may begin on the line itself or anywhere else on the plot.
			await s.page.evaluate((t) => { EngCalcs.lpnTimeGoTo(t); }, frames[8]);
			await s.settle(500);
			// Dragging off either end clamps to the first and the last step.
			for (const [name, xTo, want] of [['left', g.left - 80, frames[0]], ['right', g.right + 80, frames[frames.length - 1]]]) {
				const gg = await geo();
				await dragTo(gg.x, py, xTo, 8);
				await s.settle(500);
				ok(tag + ': a drag off the ' + name + ' end clamps to the ' + (name === 'right' ? 'last' : 'first') + ' step', (await geo()).now === want, (await geo()).now + ' vs ' + want);
			}
			// A press while the run is playing stops the playback, or the next tick moves the line from under the pointer.
			if (!touch) {
				await s.page.evaluate(() => { EngCalcs.lpnTimeGoTo(0); });
				await s.page.click('#lpn_toolbar_run button[data-icon="play"], #lpn_toolbar_run button[data-icon="pause"]');
				await s.settle(300);
				const pg = await geo();
				await s.page.mouse.move(pg.x + 200, py);
				await s.page.mouse.down();
				await s.settle(150);
				const playingAfterPress = await s.page.evaluate(() => document.querySelector('#lpn_toolbar_run .lpn-transport-btn[aria-pressed]').getAttribute('aria-pressed'));
				await s.page.mouse.up();
				ok(tag + ': pressing the plot while playing stops the playback', playingAfterPress === 'false', playingAfterPress);
			}
			// ---- the same behaviour on the other charts that carry the line ----
			// The Properties box builds a NEW chart container on every redraw, so the drag has to find the live one
			// (Perry, 2026-11-15: it stayed at 0:00). Then a graph bubble on the map.
			const behaveOn = async (sel, name) => {
				await s.page.evaluate((t) => { EngCalcs.lpnTimeGoTo(t); }, frames[0]);
				await s.settle(700);
				await s.page.evaluate((q) => { const e = document.querySelector(q + ' .lpn-ts-now'); if (e) { e.scrollIntoView({ block: 'center' }); } }, sel);
				await s.settle(300);
				const g2 = await geoOn(sel);
				ok(tag + ': ' + name + ' draws a time line', !!g2);
				if (!g2) { return; }
				const px2 = g2.left + (g2.right - g2.left) * 0.3, py2 = g2.y + 10;
				await tapAt(px2, py2);
				await s.settle(700);
				const g2b = await geoOn(sel);
				ok(tag + ': a ' + (touch ? 'tap' : 'click') + ' in ' + name + ' sets a reporting time', g2b && g2b.now > 0 && frames.indexOf(g2b.now) >= 0, String(g2b && g2b.now));
				await s.page.evaluate((t) => { EngCalcs.lpnTimeGoTo(t); }, frames[0]);
				await s.settle(700);
				const g2c = await geoOn(sel);
				const ax = g2c.left + (g2c.right - g2c.left) * 0.6;
				await dragTo(g2c.x + 20, py2, ax, 12);
				await s.settle(800);
				const g3 = await geoOn(sel);
				ok(tag + ': dragging in ' + name + ' steps the run to a reporting step', g3 && g3.now > g2c.now && frames.indexOf(g3.now) >= 0, g2c.now + ' -> ' + (g3 && g3.now));
				if (!touch) {
					await s.page.mouse.move(g3.left + 40, g3.y + 12);
					await s.settle(300);
					ok(tag + ': hovering ' + name + ' shows the readout', !!(await crossOn(sel)));
					await s.page.mouse.move(5, 5);
				}
			};
			await behaveOn('#lpn_pgraph_chart', 'the Properties box graph');
			await s.page.evaluate(() => { const c = document.getElementById('lpn_popup_close'); if (c && c.offsetParent) { c.click(); } });
			await s.settle(300);
			if (!touch) {
				const pt = await s.page.evaluate(() => { const r = document.querySelector('#lpn_canvas [data-node="10"]').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
				await s.page.mouse.click(pt.x, pt.y, { button: 'right' });
				await s.settle(400);
				const lbl = await s.lang('lpn_tsb_menu');
				await s.page.evaluate((l) => { Array.from(document.querySelectorAll('.lpn-pane-ctxmenu button')).filter((x) => x.textContent.trim() === l)[0].click(); }, lbl);
				await s.settle(800);
				await behaveOn('.lpn-tsb .lpn-tsb-chart', 'a graph bubble on the map');
			}
			ok(tag + ': no uncaught page errors', s.errors.length === 0, s.errors.join('\n'));
			await s.context.close().catch(() => {});
		}

		// ---- A PHONE: a vertical swipe on the Properties box graph scrolls the box; a sideways one scrubs ----
		{
			s = await Session.open(browser, 'A', { viewport: { width: 390, height: 844 }, hasTouch: true });
			await s.goto('Looped-Network.php');
			await s.settle(1200);
			await s.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			await openNet1(s);
			await s.page.evaluate(() => { EngCalcs.lpnTimeRunNow(); });
			await s.waitFor(() => s.page.evaluate(() => EngCalcs.lpnTimeRunState().frames > 1), 'EPS frames', 120000);
			const bb = await (await s.page.$('.lpn-node-hit[data-node="10"]')).boundingBox();
			await s.page.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
			await s.settle(900);
			const frames = await s.page.evaluate(() => EngCalcs.lpnTimeRunFrames().map((f) => f.t));
			await s.page.evaluate(() => { const e = document.querySelector('#lpn_pgraph_chart .lpn-ts-now'); if (e) { e.scrollIntoView({ block: 'center' }); } });
			await s.settle(400);
			const cdp = await s.context.newCDPSession(s.page);
			const tp = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts });
			const pg = () => s.page.evaluate(() => {
				const h = document.querySelector('#lpn_pgraph_chart .lpn-ts-now'), f = document.querySelector('#lpn_pgraph_chart .lpn-profile-frame');
				if (!h || !f) { return null; }
				let sc = f.parentElement; while (sc && sc.scrollHeight <= sc.clientHeight + 1) { sc = sc.parentElement; }
				const b = f.getBoundingClientRect();
				return { left: b.left, right: b.right, top: b.top, h: b.height, scroll: sc ? sc.scrollTop : -1, now: EngCalcs.lpnTimeNow(), vh: window.innerHeight };
			});
			let p0 = await pg();
			ok('phone: the Properties box graph draws a thin time line', !!p0);
			if (p0) {
				// The graph in view and mid-box: a vertical swipe from the middle of the plot.
				const x = p0.left + (p0.right - p0.left) * 0.5, y0 = Math.min(p0.top + p0.h * 0.5, p0.vh - 20);
				const sc0 = p0.scroll;
				await tp('touchStart', [{ x, y: y0 }]);
				for (let k = 1; k <= 10; k++) { await tp('touchMove', [{ x: x + (k % 2), y: y0 + k * 8 }]); await s.settle(30); }
				await tp('touchEnd', []);
				await s.settle(500);
				const p1 = await pg();
				ok('phone: a vertical swipe on the plot scrolls the box', p1 && (p1.scroll !== sc0 || Math.abs(p1.top - p0.top) > 5), 'scroll ' + sc0 + ' -> ' + (p1 && p1.scroll) + ', top ' + Math.round(p0.top) + ' -> ' + Math.round(p1 && p1.top));
				ok('phone: ...and it set no time', p1 && p1.now === 0, String(p1 && p1.now));
				const p2 = await pg(), y1 = Math.min(p2.top + p2.h * 0.5, p2.vh - 20), xs = p2.left + (p2.right - p2.left) * 0.1, xe = p2.left + (p2.right - p2.left) * 0.8;
				await tp('touchStart', [{ x: xs, y: y1 }]);
				for (let k = 1; k <= 12; k++) { await tp('touchMove', [{ x: xs + (xe - xs) * k / 12, y: y1 }]); await s.settle(50); }
				const mid = await s.page.evaluate(() => { const c = document.querySelector('#lpn_pgraph_chart .lpn-ts-cross'); return c ? c.textContent : null; });
				await tp('touchEnd', []);
				await s.settle(600);
				const p3 = await pg();
				ok('phone: a sideways drag on the plot scrubs the run, and the readout shows while the finger is down', p3 && p3.now > 0 && frames.indexOf(p3.now) >= 0 && !!mid, (p3 && p3.now) + ' readout ' + mid);
				ok('phone: ...and the page itself did not move sideways', await s.page.evaluate(() => window.scrollX === 0 && document.documentElement.scrollWidth <= window.innerWidth));
			}
			ok('phone: no uncaught page errors', s.errors.length === 0, s.errors.join('\n'));
			await s.context.close().catch(() => {});
		}

		// ---- DENSE CHART (about 1 px a step) AND A STATISTIC SHOWING ----
		{
			s = await Session.open(browser, 'A', { viewport: { width: 1400, height: 900 } });
			await s.goto('Looped-Network.php');
			await s.settle(1200);
			await s.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			await openNet1(s);
			await s.toolbarClick(await s.lang('lpn_tool_settings'));
			await s.settle(600);
			const setTime = (key, text) => s.page.evaluate(([k, t]) => {
				const row = Array.from(document.querySelectorAll('#lpn_set_time_fields .lpn-time-row')).filter((r) => JSON.parse(r.getAttribute('data-lpn-setting'))[0][1] === k)[0];
				const inp = row.querySelector('input'); inp.value = t; inp.dispatchEvent(new Event('change', { bubbles: true }));
			}, [key, text]);
			await setTime('duration', '12:00');
			await setTime('hydraulicStep', '0:01');
			await setTime('reportStep', '0:01');
			await s.settle(500);
			await s.page.evaluate(() => { const sel = document.getElementById('lpn_set_time_statistic'); sel.value = 'MAXIMUM'; sel.dispatchEvent(new Event('change', { bubbles: true })); });
			await s.settle(300);
			await s.page.evaluate(() => { EngCalcs.lpnTimeRunNow(); });
			await s.waitFor(() => s.page.evaluate(() => EngCalcs.lpnTimeRunState().frames > 600), 'dense EPS frames', 240000);
			const bb2 = await (await s.page.$('.lpn-node-hit[data-node="10"]')).boundingBox();
			await s.page.mouse.click(bb2.x + bb2.width / 2, bb2.y + bb2.height / 2);
			await s.settle(500);
			await s.toolbarClick(await s.lang('lpn_pane_toggle'));
			await s.settle(500);
			await s.page.evaluate(() => document.getElementById('lpn_pane_tab_timeseries').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
			await s.settle(800);
			await s.page.evaluate(() => document.getElementById('lpn_ts_add').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
			await s.settle(600);
			await s.page.evaluate(() => { const c = document.getElementById('lpn_popup_close'); if (c && c.offsetParent) { c.click(); } });
			await s.settle(300);
			const stops = await s.page.evaluate(() => EngCalcs.lpnTimeStops());
			const mid = stops[Math.floor(stops.length / 2)];
			await s.page.evaluate((t) => { EngCalcs.lpnTimeGoTo(t); }, mid);
			await s.settle(700);
			const dg = () => s.page.evaluate(() => {
				const h = document.querySelector('#lpn_ts_chart .lpn-ts-now'), f = document.querySelector('#lpn_ts_chart .lpn-profile-frame');
				const a = h.getBoundingClientRect(), b = f.getBoundingClientRect();
				return { x: a.left + a.width / 2, y: b.top + b.height / 2 + 12, w: b.width, now: EngCalcs.lpnTimeNow(), n: EngCalcs.lpnTimeStops().length };
			});
			let d = await dg();
			console.log('   dense chart: ' + (d.w / d.n).toFixed(2) + ' px a step, ' + d.n + ' steps');
			ok('dense: the chart is about a pixel a step or less', d.w / d.n <= 2, (d.w / d.n).toFixed(2));
			await s.page.mouse.click(d.x + 8, d.y);
			await s.settle(500);
			const c8 = (await dg()).now;
			ok('dense: a click 8 px right of the line sets a stop to its right (within 8 steps)', stops.indexOf(c8) > stops.indexOf(mid) && stops.indexOf(c8) - stops.indexOf(mid) <= 10, mid + ' -> ' + c8);
			// A lost button release must not leave the chart following the pointer.
			d = await dg();
			await s.page.mouse.move(d.x, d.y);
			await s.page.mouse.down();
			await s.page.mouse.move(d.x + 60, d.y);
			await s.settle(300);
			const dragged = (await dg()).now;
			ok('dense: a real drag moves the run (to a stop of the transport)', dragged !== c8 && stops.indexOf(dragged) >= 0, c8 + ' -> ' + dragged);
			await s.page.evaluate(() => { window.dispatchEvent(new Event('blur')); });
			await s.page.mouse.move(d.x + 200, d.y);
			await s.settle(300);
			ok('dense: after the window loses focus, moving the pointer does not scrub', (await dg()).now === dragged);
			await s.page.mouse.up();
			// A click on the plot while a Statistic is showing takes the run to a time and leaves the Statistic.
			await s.page.evaluate(() => {
				const sel = document.getElementById('lpn_time_step'); sel.value = 'stat'; sel.dispatchEvent(new Event('change', { bubbles: true }));
			});
			await s.settle(600);
			const statOn = () => s.page.evaluate(() => !!EngCalcs.lpnTimeStatisticLabel());
			ok('dense: the Statistic is showing', await statOn());
			d = await dg();
			await s.page.mouse.move(d.x - 100, d.y);
			await s.settle(300);
			ok('dense: hovering with a Statistic showing changes nothing', await statOn());
			// (left of the line: the floating Settings box lies over the plot's right part)
			await s.page.mouse.click(d.x - 100, d.y);
			await s.settle(2500);
			ok('dense: a click on the plot then sets a time (the Statistic is left)', !(await statOn()));
			ok('dense: no uncaught page errors', s.errors.length === 0, s.errors.join('\n'));
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
