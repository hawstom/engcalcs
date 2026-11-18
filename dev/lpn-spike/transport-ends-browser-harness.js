// RESTART AND END ON THE RUN TRANSPORT, AND NO PLAYER IN STEADY STATE (Tom, 2026-10-05): a tester
// asked for Restart and End; Tom: "tight real estate... Maybe the buttons can be smaller" and
// "Maybe the EPS controls can disappear for steady state. Many users never do EPS." Real Chromium.
// THE GRAPH'S TIME LINE IS ALSO A HANDLE (Tom, 2026-11-16): a press and drag on it steps the run, by mouse and finger.
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

		// ---- THE GRAPH'S TIME LINE IS A HANDLE (Tom, 2026-11-16): press and drag on the Time series chart ----
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
			// What a visitor sees at 0:00, where the line lies on the chart's left frame (Tom, 2026-11-17: "I don't see a time line").
			const seen = await s.page.evaluate(() => {
				const q = (c) => document.querySelector('#lpn_ts_chart ' + c);
				const line = q('.lpn-ts-now'), knob = q('.lpn-ts-now-knob'), fr = q('.lpn-profile-frame');
				if (!line || !knob || !fr) { return null; }
				const kb = knob.getBoundingClientRect(), fb = fr.getBoundingClientRect(), lb = line.getBoundingClientRect(), cs = getComputedStyle(line), fs = getComputedStyle(fr);
				return { kw: kb.width, kh: kb.height, kBelowTop: kb.bottom <= fb.top + 1, kAbove: kb.top < fb.top, kx: kb.left + kb.width / 2, lx: lb.left, fl: fb.left, fr: fb.right,
					lw: parseFloat(cs.strokeWidth), fw: parseFloat(fs.strokeWidth), lc: cs.stroke, fc: fs.stroke, lh: lb.height, fh: fb.height, cursor: getComputedStyle(q('.lpn-ts-now-hit')).cursor, now: EngCalcs.lpnTimeNow() };
			});
			ok(tag + ': at 0:00 the time line and its knob are drawn', !!seen && seen.now === 0 && seen.lh > 20 && seen.kw >= 10 && seen.kh >= 8, JSON.stringify(seen));
			ok(tag + ': ...the knob sits above the plot frame, inside the chart, on the line', !!seen && seen.kAbove && seen.kBelowTop && Math.abs(seen.kx - seen.lx) < 1.5);
			ok(tag + ': ...and the line is not the frame: thicker and another colour, so it shows over the frame at 0:00', !!seen && seen.lw > seen.fw && seen.lc !== seen.fc, seen && (seen.lw + ' ' + seen.lc + ' vs ' + seen.fw + ' ' + seen.fc));
			ok(tag + ': ...and it shows the resize cursor', !!seen && seen.cursor === 'ew-resize');
			const mapText = () => s.page.evaluate(() => document.getElementById('lpn_canvas').textContent.replace(/\s+/g, ' '));
			const mapBefore = await mapText();
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
			ok(tag + ': ...and the map shows different results (its labels changed)', (await mapText()) !== mapBefore);
			ok(tag + ': ...and it is exactly a reporting step', after && frames.indexOf(after.now) >= 0, String(after && after.now));
			ok(tag + ': ...and the time selector on the toolbar shows that step', frames[sel] === after.now, 'selector ' + sel + ' = ' + frames[sel]);
			// Where the pointer ended is where the line is, to within half a reporting step.
			const step = (g.right - g.left) / Math.max(1, frames[frames.length - 1] / (frames[1] - frames[0]));
			ok(tag + ': ...and the line sits under where the pointer was released (within half a step)', Math.abs((await s.page.evaluate(() => {
				const h = document.querySelector('#lpn_ts_chart .lpn-ts-now-hit').getBoundingClientRect(); return h.left + h.width / 2; })) - aimX) <= step / 2 + 2,
				'aim ' + Math.round(aimX) + ', step ' + step.toFixed(1) + 'px');
			// A mouse press anywhere on the plot (not only on the line) takes the line along; without travel it moves nothing.
			if (!touch) {
				await s.page.evaluate((t) => { EngCalcs.lpnTimeGoTo(t); }, frames[0]);
				await s.settle(500);
				const pg0 = await geo(), py = pg0.y - 20, px = pg0.left + (pg0.right - pg0.left) * 0.3;
				await s.page.mouse.click(px, py);
				await s.settle(400);
				ok(tag + ': a click on the plot away from the line moves nothing', (await geo()).now === frames[0]);
				await s.page.mouse.move(px, py); await s.page.mouse.down();
				for (let k = 1; k <= 8; k++) { await s.page.mouse.move(px + k * 12, py); await s.settle(50); }
				await s.page.mouse.up();
				await s.settle(500);
				ok(tag + ': a press and drag on the plot away from the line moves the run', (await geo()).now > frames[0], String((await geo()).now));
				await s.page.evaluate((t) => { EngCalcs.lpnTimeGoTo(t); }, after.now);
				await s.settle(500);
			}
			// A click on the line (no travel) keeps the step it is on.
			const before2 = after.now;
			if (!touch) { await s.page.mouse.click(after.x, after.y); }
			else {
				const cdpT = await s.context.newCDPSession(s.page);
				await cdpT.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: after.x, y: after.y }] });
				await cdpT.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
			}
			await s.settle(500);
			ok(tag + ': a ' + (touch ? 'tap' : 'click') + ' on the line leaves the step as it was', (await geo()).now === before2);
			// (The Properties box floats over the right of the chart, so the next checks stand the line well to the left.)
			await s.page.evaluate((t) => { EngCalcs.lpnTimeGoTo(t); }, frames[8]);
			await s.settle(500);
			// The handle is on top of the series: where a dot sits on the time line, the press lands on the handle.
			ok(tag + ': at a dot on the time line, the handle is the top element', await s.page.evaluate(() => {
				const h = document.querySelector('#lpn_ts_chart .lpn-ts-now-hit'), hb = h.getBoundingClientRect(), mid = hb.left + hb.width / 2;
				const d = Array.from(document.querySelectorAll('#lpn_ts_chart .lpn-ts-dot')).map((c) => c.getBoundingClientRect()).filter((r) => Math.abs(r.left + r.width / 2 - mid) < 1)[0];
				if (!d) { return false; }
				const top = document.elementFromPoint(d.left + d.width / 2, d.top + d.height / 2);
				return !!top && top.classList.contains('lpn-ts-now-hit');
			}));
			// Dragging off either end clamps to the first and the last step.
			for (const [name, xTo, want] of [['left', g.left - 80, frames[0]], ['right', g.right + 80, frames[frames.length - 1]]]) {
				const gg = await geo();
				if (!touch) {
					await s.page.mouse.move(gg.x, gg.y); await s.page.mouse.down();
					for (let k = 1; k <= 8; k++) { await s.page.mouse.move(gg.x + (xTo - gg.x) * k / 8, gg.y); await s.settle(40); }
					await s.page.mouse.up();
				} else {
					const cdpE = await s.context.newCDPSession(s.page);
					await cdpE.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: gg.x, y: gg.y }] });
					for (let k = 1; k <= 8; k++) { await cdpE.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: gg.x + (xTo - gg.x) * k / 8, y: gg.y }] }); await s.settle(40); }
					await cdpE.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
				}
				await s.settle(500);
				ok(tag + ': a drag off the ' + name + ' end clamps to the ' + (name === 'right' ? 'last' : 'first') + ' step', (await geo()).now === want, (await geo()).now + ' vs ' + want);
			}
			await s.page.evaluate((t) => { EngCalcs.lpnTimeGoTo(t); }, before2);
			await s.settle(500);
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

		// ---- A PRESS THAT DOES NOT TRAVEL MOVES NOTHING, ON A DENSE CHART (about 1 px a step) AND WITH A STATISTIC SHOWING ----
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
				const h = document.querySelector('#lpn_ts_chart .lpn-ts-now-hit'), f = document.querySelector('#lpn_ts_chart .lpn-profile-frame');
				const a = h.getBoundingClientRect(), b = f.getBoundingClientRect();
				return { x: a.left + a.width / 2, y: a.top + a.height / 2, w: b.width, now: EngCalcs.lpnTimeNow(), n: EngCalcs.lpnTimeStops().length };
			});
			let d = await dg();
			console.log('   dense chart: ' + (d.w / d.n).toFixed(2) + ' px a step, ' + d.n + ' steps');
			ok('dense: the chart is about a pixel a step or less', d.w / d.n <= 2, (d.w / d.n).toFixed(2));
			// A click 8 px off the line (a press on the handle, which is 24 px wide) with no travel.
			await s.page.mouse.click(d.x + 8, d.y);
			await s.settle(500);
			ok('dense: a click 8 px off the line leaves the step unchanged', (await dg()).now === mid, mid + ' -> ' + (await dg()).now);
			await s.page.mouse.click(d.x - 8, d.y);
			await s.settle(500);
			ok('dense: ...and 8 px the other way too', (await dg()).now === mid);
			// Where a series line crosses the time line, the press lands on the handle.
			ok('dense: where the series line crosses the time line, the handle is the top element', await s.page.evaluate(() => {
				const h = document.querySelector('#lpn_ts_chart .lpn-ts-now-hit'), hb = h.getBoundingClientRect(), mx = hb.left + hb.width / 2;
				const pl = document.querySelector('#lpn_ts_chart polyline.lpn-ts-line'), svg = pl.ownerSVGElement, ctm = pl.getScreenCTM();
				let best = null;
				for (let i = 0; i < pl.points.numberOfItems; i++) {
					const q = pl.points.getItem(i), sx = q.x * ctm.a + q.y * ctm.c + ctm.e, sy = q.x * ctm.b + q.y * ctm.d + ctm.f;
					if (best === null || Math.abs(sx - mx) < Math.abs(best.sx - mx)) { best = { sx, sy }; }
				}
				if (!best || Math.abs(best.sx - mx) > 2) { return false; }
				const top = document.elementFromPoint(best.sx, best.sy);
				return !!top && top.classList.contains('lpn-ts-now-hit');
			}));
			// A lost button release must not leave the chart following the pointer.
			await s.page.mouse.move(d.x, d.y);
			await s.page.mouse.down();
			await s.page.mouse.move(d.x + 60, d.y);
			await s.settle(300);
			const dragged = (await dg()).now;
			ok('dense: a real drag moves the run (to a stop of the transport)', dragged !== mid && stops.indexOf(dragged) >= 0, mid + ' -> ' + dragged);
			await s.page.evaluate(() => { window.dispatchEvent(new Event('blur')); });
			await s.page.mouse.move(d.x + 200, d.y);
			await s.settle(300);
			ok('dense: after the window loses focus, moving the pointer does not scrub', (await dg()).now === dragged);
			await s.page.mouse.up();
			// A bare click on the line while a Statistic is showing leaves the Statistic.
			await s.page.evaluate(() => {
				const sel = document.getElementById('lpn_time_step'); sel.value = 'stat'; sel.dispatchEvent(new Event('change', { bubbles: true }));
			});
			await s.settle(600);
			const statOn = () => s.page.evaluate(() => !!EngCalcs.lpnTimeStatisticLabel());
			ok('dense: the Statistic is showing', await statOn());
			d = await dg();
			await s.page.mouse.click(d.x, d.y);
			await s.settle(500);
			ok('dense: a click on the line leaves the Statistic showing', await statOn());
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
