// THE WELL'S SYMBOL, IN A REAL CHROME. Run with:
//   node dev/lpn-spike/well-symbol-browser-harness.js
//
// Task 822, round 8 (Tom, 2026-11-14: "There should be no box. But I think there should be a water level horizontal line in the hole." and "Equal to
// reservoir and tank, I hope?"): the Well's map symbol has a short horizontal line across the narrow hole at the drawdown level and no box; the tint
// inside its holes is the same fill, at the same strength, as the reservoir's and the tank's symbols. The "box" Tom saw was the pump's and the drawdown
// valve's own solid symbols: choosing a curve rebuilds those links, and a link built after buildDom() drew its symbol over the Well (found in this page,
// round 8). So the walk here chooses both curves and asks again what is drawn on the Well.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_WELL_SYMBOL_LOCKED';
const NAME = 'well-symbol-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a failure of what this measures; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error(NAME + ': no `flock` binary found -- running WITHOUT the browser lock.');
}

let checks = 0, failures = 0, Session;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	({ Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js')));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, NAME, Object.assign({ viewport: { width: 1400, height: 1000 } }, process.env.EC_WELL_SHOT ? { deviceScaleFactor: 3 } : {}));
		const P = a.page;
		await P.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await P.evaluate(() => { localStorage.clear(); localStorage.setItem('lpn_hovercard', 'off'); });
		await a.reload(); await a.answerTrainingPanel().catch(() => {});
		await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(1200);
		await P.setInputFiles('#lpn_project_file', path.join(REPO, 'dev', 'lpn-spike', 'well-test-net1.lwn'));
		await a.settle(2500);
		// Net1 already draws a reservoir (9) and a tank (2) as symbols; the Well goes on open ground below it.
		await a.menuClickSub('Insert', 'Well', 'project');
		const free = await P.evaluate(() => { for (let r = 0; r < 700; r += 30) { for (let k = 0; k < 24; k++) { const x = 1100 + r * Math.cos(k * Math.PI / 12), y = 800 + r * Math.sin(k * Math.PI / 12), e = document.elementFromPoint(x, y); if (e && e.closest && e.closest('#lpn_canvas') && !e.closest('[data-node],[data-link],.lpn-node-symbol-box,.lpn-link-symbol,text') && x > 300 && y > 250 && x < 1300 && y < 900) { return { x: x, y: y }; } } } return null; });
		await P.mouse.click(free.x, free.y); await a.settle(900);
		await P.keyboard.press('Escape'); await P.keyboard.press('Escape'); await a.settle(500);
		const wc = () => P.evaluate(() => { const e = Array.from(document.querySelectorAll('#lpn_canvas [data-node="W1"]')).filter((x) => x.getBoundingClientRect().width > 0)[0]; const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		// What is drawn within 30 px of the Well's centre: the pump's and the drawdown valve's own symbols must not be.
		const drawnLinkSymbols = async () => { const c = await wc(); return P.evaluate((c) => Array.from(document.querySelectorAll('#lpn_canvas .lpn-link-symbol')).filter((g) => { const b = g.getBoundingClientRect(); return getComputedStyle(g).display !== 'none' && b.width > 0 && Math.abs(b.left + b.width / 2 - c.x) < 30 && Math.abs(b.top + b.height / 2 - c.y) < 30; }).map((g) => g.getAttribute('class')), c); };
		ok('a new Well draws no pump or valve symbol of its own', (await drawnLinkSymbols()).length === 0, JSON.stringify(await drawnLinkSymbols()));
		// Choosing the two curves rebuilds the pump and the valve; a solve follows. That is when the pump's solid symbol used to appear over the Well.
		const c0 = await wc();
		await P.mouse.click(c0.x, c0.y); await a.settle(900);
		const setSel = async (idx, text) => { await P.evaluate(([i, t]) => { const s = document.querySelectorAll('#lpn_popup_fields select')[i]; const o = Array.from(s.options).find((x) => x.textContent.indexOf(t) >= 0); s.value = o.value; s.dispatchEvent(new Event('change', { bubbles: true })); }, [idx, text]); await a.settle(500); };
		await setSel(0, 'Drawdown'); await setSel(1, 'WellPump');
		await P.keyboard.press('Escape'); await a.settle(2500);
		ok('with both curves chosen and a solve done, still no pump or valve symbol is drawn over the Well (Tom: "no box")', (await drawnLinkSymbols()).length === 0, JSON.stringify(await drawnLinkSymbols()));
		// The drawing the map holds for a Well: its non-backdrop paths and the backdrop's d.
		const drawn = () => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas .lpn-node-symbol-well')).filter((e) => e.getBoundingClientRect().width > 0 && getComputedStyle(e).display !== 'none' && !e.closest('.lpn-asm-hid')).map((w) => {
			const b = w.querySelector('.lpn-node-symbol-backdrop'), r = b.getBoundingClientRect();
			return { back: b.getAttribute('d'), paths: Array.from(w.querySelectorAll('path')).filter((p) => !/backdrop/.test(p.getAttribute('class') || '')).map((p) => p.getAttribute('d')), box: { l: r.left, t: r.top, w: r.width, h: r.height } };
		}));
		const symbols = await P.evaluate(() => {
			const fill = (sel) => { const e = document.querySelector(sel); if (!e) { return null; } const cs = getComputedStyle(e); return { fill: cs.fill, op: cs.fillOpacity, cls: e.getAttribute('class') }; };
			return { well: fill('#lpn_canvas .lpn-node-symbol-well .lpn-node-symbol-backdrop'), tank: fill('#lpn_canvas .lpn-node-symbol-tank .lpn-node-symbol-backdrop'), reservoir: fill('#lpn_canvas .lpn-node-symbol-reservoir .lpn-node-symbol-backdrop') };
		});
		console.log('        ' + JSON.stringify(symbols));
		ok('the Well, the Tank and the Reservoir are all drawn as symbols', !!symbols.well && !!symbols.tank && !!symbols.reservoir);
		ok('the tint inside the Well is the Tank\'s and the Reservoir\'s: the same class, the same fill, the same strength', symbols.well && symbols.well.cls === symbols.tank.cls && symbols.well.cls === symbols.reservoir.cls && symbols.well.fill === symbols.tank.fill && symbols.well.fill === symbols.reservoir.fill && symbols.well.op === symbols.tank.op, JSON.stringify(symbols));
		const icons = await P.evaluate(() => ({ well: EngCalcs.icons.well, welltank: EngCalcs.icons.welltank, welltankp: EngCalcs.icons.welltankp }));
		const firstD = (svg) => /^<path [^>]*? ?d="([^"]+)"/.exec(svg)[1];
		const ds = await drawn();
		const alone = ds.filter((d) => d.back === firstD(icons.well));
		ok('a Well alone is drawn as the circle with its vertical arrow (round 12: Tom\'s N1): the circle, the arrow, and nothing else', alone.length === 1 && alone[0].paths.length === 2 && /a4\.3 4\.3/.test(alone[0].paths[0]) && /V3M/.test(alone[0].paths[1]), JSON.stringify(ds));
		// The circle stands on the Well's node: with the circle alone the silhouette's middle is the click.
		ok('and the circle stands on the point the Well was placed at', alone.length === 1 && Math.abs((alone[0].box.l + alone[0].box.w / 2) - free.x) < 2 && Math.abs((alone[0].box.t + alone[0].box.h / 2) - free.y) < 2, JSON.stringify([alone[0] && alone[0].box, free]));
		// **THE ARROW STANDS CLEAR OF THE CIRCLE, AND NONE OF THE THREE IS A PUMP AT TOOLBAR SIZE** (Tom: "N1 has the arrow too close to the circle. But N2 and N3 are good."):
		// rasterize each toolbar icon at 17, 21 and 24 px; the gap between the arrow's wings and the circle's top is clear beside the shaft, and the drawing is not the pump's.
		const px = await P.evaluate(async () => {
			const raster = async (name, size) => {
				const svg = EngCalcs.iconOpenTag.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" ').replace('stroke="currentColor"', 'stroke="#000"') + EngCalcs.icons[name] + '</svg>';
				const img = new Image(); img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
				await img.decode();
				const cv = document.createElement('canvas'); cv.width = size; cv.height = size;
				const g = cv.getContext('2d'); g.drawImage(img, 0, 0);
				return { g, d: g.getImageData(0, 0, size, size).data };
			};
			const out = {}, ax = { well: 12, welltank: 7, welltankp: 7 };
			for (const size of [17, 21, 24]) {
				const pump = await raster('pump', size), k = size / 24;
				for (const name of ['well', 'welltank', 'welltankp']) {
					const r = await raster(name, size);
					// beside the shaft at x +-1.6, the wing's stroke ends near y 5.7 there and the circle's begins at 9.0, so y 7.4 is open at every size
					const a = (x, y) => r.g.getImageData(Math.floor(x * k), Math.floor(y * k), 1, 1).data[3] / 255;
					let diff = 0, dark = 0;
					for (let i = 3; i < r.d.length; i += 4) { const x = r.d[i] > 90, y = pump.d[i] > 90; if (x) { dark++; } if (x !== y) { diff++; } }
					out[name + size] = { gap: Math.max(a(ax[name] + 1.6, 7.4), a(ax[name] - 1.6, 7.4)), shaft: a(ax[name], 7.4), diff: diff / Math.max(1, dark) };
				}
			}
			return out;
		});
		for (const name of ['well', 'welltank', 'welltankp']) {
			for (const size of [17, 21, 24]) {
				const r = px[name + size];
				ok('at ' + size + ' px the ' + name + ' icon\'s arrow stands clear of the circle (open beside the shaft) and the shaft shows', r.gap < 0.5 && r.shaft > 0.4 && r.diff > 0.6, JSON.stringify(r));
			}
		}
		// The joined forms: place a Well with tank and a Well with pressure tank (three presses each: the well, the tee, the tank) and read what the map draws for each.
		const spots = await P.evaluate(() => { const out = []; for (let y = 330; y < 880 && out.length < 12; y += 40) { for (let x = 330; x < 1300 && out.length < 12; x += 45) { const e = document.elementFromPoint(x, y); if (e && e.closest && e.closest('#lpn_canvas') && !e.closest('[data-node],[data-link],.lpn-node-symbol-box,.lpn-link-symbol,text')) { if (out.every((q) => Math.hypot(q.x - x, q.y - y) > 170)) { out.push({ x: x, y: y }); } } } } return out; });
		const far = spots.filter((q) => Math.hypot(q.x - free.x, q.y - free.y) > 170);
		ok('the walk found open ground for the two joined forms', far.length >= 6, JSON.stringify(far.length));
		const forms = [['Well with tank', far.slice(0, 3), 'welltank', 'W2'], ['Well with pressure tank', far.slice(3, 6), 'welltankp', 'W3']];
		for (const [label, pts, kind, id] of forms) {
			await a.menuClickSub('Insert', label, 'project');
			await P.mouse.click(pts[0].x, pts[0].y); await a.settle(700);
			const first = (await drawn()).filter((d) => d.back === firstD(icons.well)).length;
			await P.mouse.click(pts[1].x, pts[1].y); await a.settle(500);
			await P.mouse.click(pts[2].x, pts[2].y); await a.settle(900);
			await P.keyboard.press('Escape'); await P.keyboard.press('Escape'); await a.settle(500);
			const all = await drawn(), mine = all.filter((d) => d.back === firstD(icons[kind]));
			ok(label + ': after the well press the symbol is the Well alone, and once the tank is placed it is redrawn as the joined symbol', first === 2 && mine.length === 1, JSON.stringify([first, all.map((d) => d.back && d.back.slice(0, 40))]));
			ok(label + ': the joined symbol is the circle, the arrow and the run to ' + (kind === 'welltank' ? 'a rectangle' : 'a capsule'), mine.length === 1 && mine[0].paths.length === 3 && /V3M/.test(mine[0].paths[1]) && /^M11\.3 14H13\.5$/.test(mine[0].paths[2]) && (kind === 'welltank' ? /h9v10h-9Z/ : /a4\.5 4\.5 0 0 1 9 0v7/).test(mine[0].paths[0]), JSON.stringify(mine[0] && mine[0].paths));
			const m = mine[0] && mine[0].box;
			// the circle (left edge at x 2.7 of 24, centre at 7, the whole drawing 19.8 wide) stands on the well's press
			ok(label + ': the circle stands on the point the Well was placed at, the vessel reaching out to the right', !!m && Math.abs((pts[0].x - m.l) / m.w - 4.3 / 19.8) < 0.03 && m.w > m.h * 0.9, JSON.stringify([m, pts[0]]));
			// picking: a press on the vessel part selects the Well; a press on the tank node's own symbol selects the tank (what the branch selected before)
			await P.mouse.click(m.l + m.w * 0.85, m.t + m.h * 0.5); await a.settle(700);
			const sel = await P.evaluate(() => ({ explode: !!document.querySelector('[data-assembly-explode]'), head: (document.querySelector('#lpn_popup_fields .lpn-asm-head') || {}).textContent }));
			ok(label + ': a press on its vessel selects the Well (its box with Explode)', sel.explode, JSON.stringify(sel));
			await P.keyboard.press('Escape'); await a.settle(300);
			await P.mouse.click(pts[2].x, pts[2].y); await a.settle(700);
			const tsel = await P.evaluate(() => ({ explode: !!document.querySelector('[data-assembly-explode]'), note: !!document.querySelector('#lpn_popup_fields .lpn-owned-note') }));
			ok(label + ': a press on the tank itself still selects the tank (its box, with the sentence naming the Well)', !tsel.explode && tsel.note, JSON.stringify(tsel));
			await P.keyboard.press('Escape'); await a.settle(300);
			if (process.env.EC_WELL_SHOT_DIR) {   // a picture of the whole assembly on Net1's ground, for Tom: EC_WELL_SHOT_DIR=/path
				const xs = pts.map((q) => q.x), ys = pts.map((q) => q.y), x0 = Math.max(0, Math.min.apply(null, xs) - 90), y0 = Math.max(0, Math.min.apply(null, ys) - 110);
				await P.screenshot({ path: path.join(process.env.EC_WELL_SHOT_DIR, 'r13-' + kind + '.png'), clip: { x: x0, y: y0, width: Math.min(1400 - x0, Math.max.apply(null, xs) + 120 - x0), height: Math.min(1000 - y0, Math.max.apply(null, ys) + 110 - y0) } });
			}
		}
		if (process.env.EC_WELL_SHOT) {   // a picture of the Well's symbol, for a review: EC_WELL_SHOT=/path/to.png
			const c = await wc();
			if (process.env.EC_WELL_THEME) { await P.evaluate((t) => { document.documentElement.setAttribute('data-theme', t); }, process.env.EC_WELL_THEME); await a.settle(500); }   // EC_WELL_THEME=dark for the picture in a dark theme
			await P.screenshot({ path: process.env.EC_WELL_SHOT, clip: { x: Math.max(0, c.x - 60), y: Math.max(0, c.y - 60), width: 120, height: 120 } });
		}
		if (process.env.EC_WELL_SHOT_DIR) { await P.screenshot({ path: path.join(process.env.EC_WELL_SHOT_DIR, 'r13-well.png'), clip: { x: Math.max(0, free.x - 120), y: Math.max(0, free.y - 120), width: 240, height: 240 } }); }
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exit(1); });
