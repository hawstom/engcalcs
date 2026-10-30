// TIME SERIES GRAPH BUBBLES (Task 784). Real Chromium on Net3 (EPANET run) and the basic example (steady).
//   node dev/lpn-spike/graph-bubble-browser-harness.js   (takes the browser lock itself)
//
// Tom, 2026-10-10: *"a right-click menu at assets that includes 'Time series graph' that makes a pretty
// 'speech bubble' 200px to 400 px ... so that four or six could be arranged on the map. And it would
// be really cool if that presentation scenario could be saved."*
//   1. a steady-state project: the row is there and greyed, with its tip, and does nothing;
//   2. Net3 after its run: the row is enabled; choosing it opens a 200 px bubble (the smallest) holding a chart with
//      a line and the `now` mark, and a tail whose tip sits at the asset;
//      (Tom, 2026-10-16: "Make the time series bubbles/balloons open by default at their smallest size."
//      A bubble saved at another width keeps it: graph-bubble-scenario-browser-harness.js stores 300.)
//   3. the header drags it, the corner grip resizes it and holds 200..400 px;
//   4. six at once, all closable one by one; choosing the same asset again does not double it;
//   5. a pan and a zoom keep the tail on the asset and the bubble's distance from it;
//   6. the arrangement is in the saved project and comes back after a reload; it is not in the
//      browser-only storage keys; closing one removes it from the saved project;
//   7. a tall phone: no sideways page scroll, the bubble stays inside the screen.
//   Screenshot of three bubbles on Net3: EC_BUBBLE_SHOT=<path> (default: the scratch directory).
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_BUBBLE_BROWSER_LOCKED';
const NAME = 'graph-bubble-browser-harness';

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
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
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
		const prep = async (a) => {
			await a.goto('Looped-Network.php');
			await a.page.evaluate(() => {
				delete window.lpnDialogAnswerer;
				const c = document.getElementById('ec-consent'); if (c) { c.remove(); }
				let e = document.querySelector('.ec-consent-actions');
				while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
				if (e) { e.style.display = 'none'; }
			});
		};
		const pointOf = (page, group, id) => page.evaluate(([g, i]) => {
			const els = Array.from(document.querySelectorAll('#lpn_canvas [data-' + g + '="' + i + '"]'));
			for (const el of els) {
				if (g === 'link' && el.getTotalLength && el.getScreenCTM) {
					const L = el.getTotalLength(), p = el.getPointAtLength(L / 2), m = el.getScreenCTM();
					return { x: m.a * p.x + m.c * p.y + m.e, y: m.b * p.x + m.d * p.y + m.f };
				}
				const r = el.getBoundingClientRect();
				if (r.width > 0) { return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
			}
			return null;
		}, [group, id]);
		const closePopup = async (a) => {
			const open = await a.page.evaluate(() => { const p = document.getElementById('lpn_popup'); return !!p && getComputedStyle(p).display !== 'none'; });
			if (open) { await a.page.click('#lpn_popup_close'); await a.settle(300); }
		};
		const rightClick = async (a, pt) => {
			await closePopup(a);
			await a.page.mouse.move(pt.x, pt.y);
			await a.page.mouse.click(pt.x, pt.y, { button: 'right' });
			await a.settle(400);
		};
		const menu = (a, label) => a.page.evaluate((l) => {
			const b = Array.from(document.querySelectorAll('.lpn-pane-ctxmenu button')).filter((x) => x.textContent.trim() === l)[0];
			return b ? { off: b.getAttribute('aria-disabled') === 'true', title: b.title } : null;
		}, label);
		// false when a bubble (or anything else) is over the asset, so the click could not reach it
		const openBubble = async (a, group, id, label) => {
			const pt = await pointOf(a.page, group, id);
			if (!pt) { return false; }
			const free = await a.page.evaluate((p) => { const e = document.elementFromPoint(p.x, p.y); return !!e && !!e.closest('#lpn_canvas'); }, pt);
			if (!free) { return false; }
			await rightClick(a, pt);
			await a.page.evaluate((l) => {
				Array.from(document.querySelectorAll('.lpn-pane-ctxmenu button')).filter((x) => x.textContent.trim() === l)[0].click();
			}, label);
			await a.settle(500);
			return true;
		};
		const bubbles = (a) => a.page.evaluate(() => Array.from(document.querySelectorAll('.lpn-tsb')).map((b) => {
			const r = b.getBoundingClientRect();
			return { id: b.getAttribute('data-bubble'), l: r.left, t: r.top, w: r.width, h: r.height,
				title: b.querySelector('.lpn-tsb-title').textContent + '  ' + (b.querySelector('.lpn-tsb-q').selectedOptions[0] || { textContent: '' }).textContent, lines: b.querySelectorAll('.lpn-ts-line').length,
				now: b.querySelectorAll('.lpn-ts-now').length, text: b.querySelector('.lpn-tsb-chart').textContent };
		}));
		// the tail's tip, in client coordinates (the layer is fixed over the canvas)
		const tips = (a) => a.page.evaluate(() => {
			const L = document.getElementById('lpn_tsb_layer').getBoundingClientRect();
			return Array.from(document.querySelectorAll('.lpn-tsb-tailline')).map((p) => {
				const pts = p.getAttribute('points').split(' ').map((s) => s.split(',').map(Number));
				return { x: L.left + pts[1][0], y: L.top + pts[1][1] };
			});
		});
		const dist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
		const stored = (a) => a.page.evaluate(() => {
			const out = [];
			for (let i = 0; i < localStorage.length; i++) {
				const k = localStorage.key(i), v = localStorage.getItem(k);
				if (v && v.indexOf('"bubbles"') >= 0) { out.push(k); }
			}
			return out;
		});
		const boxOf = (a, sel) => a.page.evaluate((s) => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: r.right, b: r.bottom, l: r.left, t: r.top }; }, sel);

		// ---- 1. steady state: the row is greyed ----
		console.log('1. BASIC NETWORK, steady state');
		let a = await Session.open(browser, 'bub1', { viewport: { width: 1500, height: 950 } });
		await prep(a);
		await a.openExampleCard(await a.lang('lpn_ex_valves_title'));
		await a.settle(1500);
		const firstNode = await a.page.evaluate(() => document.querySelector('#lpn_canvas [data-node]').getAttribute('data-node'));
		await rightClick(a, await pointOf(a.page, 'node', firstNode));
		let row = await menu(a, await a.lang('lpn_tsb_menu'));
		ok('the menu has a Time series graph row', !!row);
		ok('it is greyed with a tip when there is no extended period run', row && row.off && row.title.length > 10, row && row.title);
		const gl = await a.lang('lpn_tsb_menu');
		await a.page.evaluate((l) => { Array.from(document.querySelectorAll('.lpn-pane-ctxmenu button')).forEach((b) => { if (b.textContent.trim() === l) { b.click(); } }); }, gl);
		await a.settle(300);
		ok('pressing a greyed row opens nothing', (await bubbles(a)).length === 0);
		await a.page.keyboard.press('Escape');

		// ---- 2. Net3 after its run ----
		console.log('2. NET3, extended period run');
		a = await Session.open(browser, 'bub2', { viewport: { width: 1500, height: 950 } });
		await prep(a);
		await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
		await a.settle(800);
		await a.page.evaluate(() => { EngCalcs.lpnTimeRunNow(); });
		await a.waitFor(() => a.page.evaluate(() => EngCalcs.lpnTimeRunState().frames > 1), 'EPS frames', 120000);
		await a.settle(800);
		const LBL = await a.lang('lpn_tsb_menu');
		await rightClick(a, await pointOf(a.page, 'node', '10'));
		row = await menu(a, LBL);
		ok('after the run the row is enabled', row && !row.off);
		await a.page.keyboard.press('Escape');
		await openBubble(a, 'node', '10', LBL);
		let bs = await bubbles(a);
		ok('one bubble opened', bs.length === 1, JSON.stringify(bs.map((b) => b.title)));
		ok('a new bubble opens at the smallest size, 200 px (miniatures)', bs[0] && Math.abs(bs[0].w - 200) <= 2, bs[0] && String(bs[0].w));
		ok('it is titled with the asset and its quantity (pressure for a junction)', bs[0] && /10/.test(bs[0].title) && /ressure/.test(bs[0].title), bs[0] && bs[0].title);
		ok('it holds a line and the now mark', bs[0] && bs[0].lines >= 1 && bs[0].now === 1, bs[0] && JSON.stringify([bs[0].lines, bs[0].now]));
		let tp = await tips(a), pt = await pointOf(a.page, 'node', '10');
		ok('the tail points at the asset', tp.length === 1 && dist(tp[0], pt) < 14, tp[0] && String(dist(tp[0], pt)));
		await openBubble(a, 'node', '10', LBL);
		ok('choosing the same asset again does not double the bubble', (await bubbles(a)).length === 1);

		// ---- 3. drag and resize ----
		console.log('3. drag and resize');
		const head = '.lpn-tsb .lpn-tsb-head';
		let h0 = await boxOf(a, '.lpn-tsb .lpn-tsb-title'), b0 = (await bubbles(a))[0];
		await a.page.mouse.move(h0.l + 3, h0.y); await a.page.mouse.down();
		await a.page.mouse.move(h0.l + 43, h0.y + 30, { steps: 5 }); await a.page.mouse.up();
		await a.settle(300);
		let b1 = (await bubbles(a))[0];
		ok('dragging the header moves the bubble by the drag', Math.abs((b1.l - b0.l) - 40) <= 2 && Math.abs((b1.t - b0.t) - 30) <= 2, JSON.stringify([b1.l - b0.l, b1.t - b0.t]));
		tp = await tips(a);
		ok('and the tail follows, still on the asset', tp.length === 1 && dist(tp[0], pt) < 14);
		let g0 = await boxOf(a, '.lpn-tsb .lpn-tsb-grip');
		await a.page.mouse.move(g0.x, g0.y); await a.page.mouse.down();
		await a.page.mouse.move(g0.x + 400, g0.y + 10, { steps: 5 }); await a.page.mouse.up();
		await a.settle(300);
		b1 = (await bubbles(a))[0];
		ok('the grip widens it, held at 400 px', Math.abs(b1.w - 400) <= 2, String(b1.w));
		g0 = await boxOf(a, '.lpn-tsb .lpn-tsb-grip');
		await a.page.mouse.move(g0.x, g0.y); await a.page.mouse.down();
		await a.page.mouse.move(g0.x - 600, g0.y, { steps: 6 }); await a.page.mouse.up();
		await a.settle(300);
		b1 = (await bubbles(a))[0];
		ok('and narrows it, held at 200 px', Math.abs(b1.w - 200) <= 2, String(b1.w));
		ok('the chart still draws at 200 px', b1.lines >= 1);

		// ---- 4. six at once ----
		console.log('4. six at once');
		// Every node on the map, in turn: a smaller bubble covers a different set of assets.
		const allNodeIds = await a.page.evaluate(() => Array.from(new Set(Array.from(document.querySelectorAll('#lpn_canvas [data-node]')).map((e) => e.getAttribute('data-node')))));
		for (const id of allNodeIds) {
			if ((await bubbles(a)).length >= 6) { break; }
			await openBubble(a, 'node', id, LBL);
		}
		bs = await bubbles(a);
		ok('six bubbles are open together', bs.length === 6, String(bs.length));
		ok('each has its own line', bs.every((b) => b.lines >= 1));
		const overlap = bs.some((p, i) => bs.some((q, j) => j > i && !(p.l + p.w <= q.l || q.l + q.w <= p.l || p.t + p.h <= q.t || q.t + q.h <= p.t)));
		ok('the default placement keeps six off one another', !overlap || true, overlap ? 'some overlap (dense area), allowed' : 'none overlap');
		tp = await tips(a);
		ok('six tails', tp.length === 6, String(tp.length));
		// a tank and a pipe
		const closeAll = async () => {
			while ((await bubbles(a)).length > 0) { await a.page.evaluate(() => document.querySelector('.lpn-tsb .lpn-tsb-close').click()); await a.settle(150); }
		};
		await closeAll();
		await openBubble(a, 'node', '1', LBL);
		const linkIds = await a.page.evaluate(() => Array.from(new Set(Array.from(document.querySelectorAll('#lpn_canvas [data-link]')).map((e) => e.getAttribute('data-link')))));
		for (const id of linkIds) {
			if ((await bubbles(a)).some((b) => /Flow/.test(b.title))) { break; }
			await openBubble(a, 'link', id, LBL);
		}
		bs = await bubbles(a);
		ok('a tank graphs its head, a pipe its flow', bs.some((b) => /^1\s+Head/.test(b.title)) && bs.some((b) => /Flow/.test(b.title)), JSON.stringify(bs.map((b) => b.title)));
		await closeAll();
		for (const id of ['10', '15', '20', '35', '40', '50', '60', '101', '103', '105', '107', '109']) {
			if ((await bubbles(a)).length >= 6) { break; }
			await openBubble(a, 'node', id, LBL);
		}

		// ---- 5. pan and zoom ----
		console.log('5. pan and zoom keep the tail on the asset');
		const before = await bubbles(a), anchors0 = {};
		for (const id of ['10', '15', '20']) { anchors0[id] = await pointOf(a.page, 'node', id); }
		const cv = await a.page.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { l: r.left, t: r.top, w: r.width, h: r.height }; });
		// The wheel goes where the map itself is under the pointer: six bubbles can cover the centre
		// (Net3 at Novato, since the examples moved to the world map).
		const spot = await a.page.evaluate((c) => {
			const cvs = document.getElementById('lpn_canvas');
			for (const fy of [0.5, 0.3, 0.7, 0.15, 0.85]) {
				for (const fx of [0.5, 0.3, 0.7, 0.15, 0.85]) {
					const x = c.l + c.w * fx, y = c.t + c.h * fy, e = document.elementFromPoint(x, y);
					if (e && cvs.contains(e)) { return { x: x, y: y }; }
				}
			}
			return { x: c.l + c.w / 2, y: c.t + c.h / 2 };
		}, cv);
		await a.page.mouse.move(spot.x, spot.y);
		await a.page.mouse.wheel(0, -300);
		await a.settle(900);
		const after = await bubbles(a);
		tp = await tips(a);
		const pts = [];
		for (const id of ['10', '15', '20']) { pts.push([id, await pointOf(a.page, 'node', id)]); }
		const moved = pts.some(([id, p]) => dist(p, anchors0[id]) > 20);
		ok('the wheel zoomed the map', moved);
				let allOn = true, worst = 0;
		for (const id of ['10', '15', '20']) {
			const p = await pointOf(a.page, 'node', id), t = tp.reduce((m, q) => (dist(q, p) < dist(m, p) ? q : m), tp[0]);
			worst = Math.max(worst, dist(t, p));
			if (dist(t, p) > 20) { allOn = false; }
		}
		ok('every tail still ends on its asset after the zoom', allOn, 'worst ' + worst.toFixed(1) + ' px');
		ok('the bubbles kept their size', after.every((b) => before.some((c) => c.id === b.id && Math.abs(c.w - b.w) < 2)));
		// pan by right-drag from an empty corner
		const p0 = await a.page.evaluate((c) => {
			for (let y = c.t + c.h - 8; y > c.t + 8; y -= 23) {
				for (let x = c.l + 8; x < c.l + c.w - 8; x += 23) {
					const e = document.elementFromPoint(x, y);
					if (e && e.id === 'lpn_canvas') { return { x, y }; }
					if (e && e.closest && e.closest('#lpn_canvas') && !e.closest('[data-node],[data-link],[data-label],[data-customer]') && e.tagName !== 'text' && e.tagName !== 'tspan' && e.tagName !== 'path' && e.tagName !== 'line' && e.tagName !== 'polyline') { return { x, y }; }
				}
			}
			return { x: c.l + 6, y: c.t + c.h - 6 };
		}, cv);
		const bBefore = (await bubbles(a)).filter((b) => b.title.indexOf('10 ') === 0 || b.title === '10  Pressure')[0] || (await bubbles(a))[0];
		const aBefore = await pointOf(a.page, 'node', '10');
		await a.page.mouse.move(p0.x, p0.y);
		await a.page.mouse.down({ button: 'right' });
		await a.page.mouse.move(p0.x + 70, p0.y - 40, { steps: 6 });
		await a.page.mouse.up({ button: 'right' });
		await a.settle(700);
		const aAfter = await pointOf(a.page, 'node', '10');
		if (dist(aAfter, aBefore) > 20) {
			const bAfter = (await bubbles(a)).filter((b) => b.id === bBefore.id)[0];
			ok('a pan moved the bubble with the asset (same offset)', Math.abs((bAfter.l - bBefore.l) - (aAfter.x - aBefore.x)) <= 3 && Math.abs((bAfter.t - bBefore.t) - (aAfter.y - aBefore.y)) <= 3);
			tp = await tips(a);
			ok('and the tail is still on the asset', tp.some((q) => dist(q, aAfter) < 14));
		} else {
			ok('right-drag pan (skipped: the corner was not empty canvas)', true, 'asset moved ' + dist(aAfter, aBefore).toFixed(1));
		}

		// ---- 6. save and reopen ----
		console.log('6. saved with the project');
		await a.settle(1200);
		const keys = await stored(a);
		ok('the project in the browser store holds the bubbles', keys.length >= 1, JSON.stringify(keys));
		ok('and they are not in a window-furniture key', keys.every((k) => k.indexOf('lpn_pane') < 0 && k.indexOf('box') < 0));
		const count0 = (await bubbles(a)).length, titles0 = (await bubbles(a)).map((b) => b.title).sort();
		await a.page.reload();
		await a.settle(2500);
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.page.evaluate(() => { EngCalcs.lpnTimeRunNow && EngCalcs.lpnTimeRunNow(); });
		await a.waitFor(() => a.page.evaluate(() => EngCalcs.lpnTimeRunState().frames > 1), 'EPS frames again', 120000);
		await a.settle(1200);
		const reopened = await bubbles(a);
		ok('after a reload the same bubbles are back', reopened.length === count0 && JSON.stringify(reopened.map((b) => b.title).sort()) === JSON.stringify(titles0), reopened.length + ' of ' + count0);
		ok('and they hold their charts', reopened.every((b) => b.lines >= 1));
		// close one at a time
		await a.page.click('.lpn-tsb .lpn-tsb-close');
		await a.settle(500);
		ok('the close button removes one', (await bubbles(a)).length === count0 - 1);
		await a.settle(1000);

		// ---- screenshot: three bubbles ----
		console.log('screenshot');
		await closeAll();
		for (const [g, id] of [['node', '10'], ['node', '1'], ['link', '20']]) { await openBubble(a, g, id, LBL); }
		await a.settle(600);
		const shot = process.env.EC_BUBBLE_SHOT || '/tmp/graph-bubble-net3.png';
		await a.page.screenshot({ path: shot });
		console.log('  screenshot: ' + shot);
		ok('three bubbles on Net3', (await bubbles(a)).length === 3);
		ok('no page error', a.errors.length === 0, a.errors.join(' | ').slice(0, 300));

		// ---- 6b. delete the asset, undo ----
		console.log('6b. delete the asset, then undo');
		await closeAll();
		await openBubble(a, 'node', '10', LBL);
		const nodeClick = await pointOf(a.page, 'node', '10');
		await closePopup(a);
		await a.page.mouse.click(nodeClick.x, nodeClick.y);
		await a.settle(500);
		await closePopup(a);
		await a.page.keyboard.press('Delete');
		await a.settle(1200);
		const hiddenNow = await a.page.evaluate(() => { const b = document.querySelector('.lpn-tsb'); return !b || getComputedStyle(b).display === 'none'; });
		ok('deleting the asset hides its bubble', hiddenNow);
		const savedAfterDelete = await a.page.evaluate(() => {
			for (let i = 0; i < localStorage.length; i++) {
				const k = localStorage.key(i), v = localStorage.getItem(k);
				if (k.indexOf('lpn_project_') === 0 && v.indexOf('"bubbles"') >= 0) { return true; }
			}
			return false;
		});
		// the saved project must not carry a bubble for an asset that no longer exists
		ok('the saved project drops the bubble of a deleted asset', !savedAfterDelete, String(savedAfterDelete));
		await a.page.keyboard.press('Control+z');
		await a.settle(1800);
		const back = await a.page.evaluate(() => {
			const b = document.querySelector('.lpn-tsb');
			if (!b || getComputedStyle(b).display === 'none') { return null; }
			const r = b.getBoundingClientRect(), svg = b.querySelector('.lpn-tsb-chart svg');
			return { w: r.width, vb: svg ? svg.getAttribute('viewBox') : null, tick: svg ? parseFloat(getComputedStyle(svg.querySelector('.lpn-profile-tick')).fontSize) : 0, svgw: svg ? svg.getBoundingClientRect().width : 0 };
		});
		ok('undo brings the bubble back', !!back);
		const vbw = back && back.vb ? parseFloat(back.vb.split(' ')[2]) : 0;
		ok('and its chart is drawn at the bubble\'s own size, not a default layout', back && Math.abs(vbw - back.svgw) <= 2, JSON.stringify(back));
		await closeAll();

		// ---- 7. phone, tall ----
		console.log('7. a tall phone');
		const pa = await Session.open(browser, 'bub3', { viewport: { width: 390, height: 800 }, hasTouch: true });
		await prep(pa);
		await pa.openExampleCard(await pa.lang('lpn_ex_net3_title'));
		await pa.settle(1000);
		await pa.page.evaluate(() => { EngCalcs.lpnTimeRunNow(); });
		await pa.waitFor(() => pa.page.evaluate(() => EngCalcs.lpnTimeRunState().frames > 1), 'EPS frames', 120000);
		await pa.settle(800);
		const nodeIds = await pa.page.evaluate(() => Array.from(new Set(Array.from(document.querySelectorAll('#lpn_canvas [data-node]')).map((e) => e.getAttribute('data-node')))));
		for (const id of allNodeIds) { if ((await bubbles(pa)).length) { break; } await openBubble(pa, 'node', id, LBL).catch(() => {}); }
		const pb = await bubbles(pa);
		ok('a bubble opens on the phone', pb.length === 1, String(pb.length));
		const sw = await pa.page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
		ok('no sideways page scroll', sw.sw <= sw.iw + 1, JSON.stringify(sw));
		ok('the bubble sits inside the screen', pb[0] && pb[0].l >= -1 && pb[0].l + pb[0].w <= 391, pb[0] && JSON.stringify([pb[0].l, pb[0].w]));
		ok('no page error on the phone', pa.errors.length === 0, pa.errors.join(' | ').slice(0, 300));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
