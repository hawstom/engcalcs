// NO PIECE OF A LABEL'S HALO COVERS ANOTHER PIECE'S INK (Task 791, Tom's browser pass R-393: "In a
// pipe label, the halo of the separator comma can hide what's near it, and vice versa").
//   node dev/lpn-spike/halo-under-ink-browser-harness.js            (takes the browser lock itself)
//   node dev/lpn-spike/halo-under-ink-browser-harness.js --timing   (adds a cost table: minutes)
//
// The halo is `paint-order: stroke fill`, which the browser paints piece by piece, one tspan at a
// time: a tspan's white stroke lands on the ink of the tspans before it. setMultilineText() now
// writes a row's plain segments as ONE run, so within a run every stroke is laid before any ink.
// In real Chromium, on Net1 with every node and link label field on and the separator ", ":
//   * STRUCTURE: no two pieces of a row sit in separate tspans; the halo is still the white stroke
//     under the ink.
//   * PIXELS: with everything but the lettering hidden, every pixel of ink drawn with the halo off
//     is still ink with the halo on, around a separator comma and around a unit mark (5280'), in
//     every pipe label. The same probes on the page as it was (a tspan per segment, by rewriting the served script)
//     must LOSE ink, or the probes prove nothing.
//   * WHERE TWO LABELS OVERLAP the later one's halo still covers the earlier one's ink. That is
//     printed, not asserted: the placer keeps labels apart, and the cure that would also cover this
//     (one SVG filter on the whole label layer) was tried and measured -- in Chromium it erased every
//     label on a latitude/longitude map and cost 5 to 10 times the raster time on 1,600 labels.
//   * SCREENSHOT: Map > Screenshot carries the halo.
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_HALO_INK_LOCKED';
const NAME = 'halo-under-ink-browser-harness';
if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename].concat(process.argv.slice(2)), {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let checks = 0, fails = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}
const NODE_FIELDS = ['id', 'demand', 'elev', 'head', 'pressure'];
const LINK_FIELDS = ['id', 'length', 'diameter', 'roughness', 'flow', 'velocity'];
const TIMING = process.argv.indexOf('--timing') >= 0;
// The one line that joins a plain segment onto the run before it; the reference run disables it.
const MERGE = 'if (plain) { plain.textContent += seg.text;';
const LETTERING_ONLY = '.lpn-symbols, .lpn-customers, .lpn-shapes, .lpn-leader, .lpn-lbl-hit { display: none !important; }';

function projectText(file) {
	const d = JSON.parse(fs.readFileSync(file, 'utf8'));
	d.settings = Object.assign({}, d.settings, { labelMaxWidth: null });
	d.labelSettings = d.labelSettings || {};
	d.labelSettings.separator = ', ';   // Tom's: a comma between the values
	d.labelSettings.node = {}; NODE_FIELDS.forEach((k) => { d.labelSettings.node[k] = true; });
	d.labelSettings.link = {}; LINK_FIELDS.forEach((k) => { d.labelSettings.link[k] = true; });
	return JSON.stringify(d);
}

async function open(Session, browser, file, merged) {
	const a = await Session.open(browser, NAME, { serviceWorkers: 'block' });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	let rewritten = 0;
	await a.page.route(/\/js\/looped-network\.js/, async (route) => {
		const resp = await route.fetch();
		let body = await resp.text();
		if (!merged) { rewritten += body.split(MERGE).length - 1; body = body.split(MERGE).join('if (false) { plain.textContent += seg.text;'); }
		await route.fulfill({ response: resp, body: body });
	});
	await a.goto('Looped-Network.php?ec_nolog=1');
	await a.page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_haloink', txt); }, projectText(file));
	const cdp = await a.context.newCDPSession(a.page);
	await cdp.send('Performance.enable');
	await a.reload();
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.settle(2500);
	a.cdp = cdp; a.rewritten = rewritten;
	return a;
}
async function metrics(a) {
	const m = await a.cdp.send('Performance.getMetrics'), o = {};
	['TaskDuration', 'ScriptDuration', 'LayoutDuration', 'RecalcStyleDuration'].forEach((k) => {
		const t = m.metrics.find((x) => x.name === k); o[k] = t ? t.value * 1000 : NaN;
	});
	return o;
}
const frame = (a) => a.page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
async function decode(a, b64s) {
	return a.page.evaluate(async (list) => {
		const out = [];
		for (const b64 of list) {
			const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode();
			const c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
			const g = c.getContext('2d'); g.drawImage(im, 0, 0);
			out.push(Array.from(g.getImageData(0, 0, im.width, im.height).data));
		}
		return out;
	}, b64s);
}

// Ink pixels lost when the halo is switched on, over a client rectangle. Everything but the
// lettering is hidden, so a dark pixel IS ink; the halo is switched off by the project's own
// masking class. A pixel dark with the halo off and pale with it on is ink a halo painted over.
async function lostInk(a, rect) {
	const st = await a.page.addStyleTag({ content: LETTERING_ONLY });
	const clip = { x: Math.floor(rect.x), y: Math.floor(rect.y), width: Math.ceil(rect.w), height: Math.ceil(rect.h) };
	await frame(a);
	const on = (await a.page.screenshot({ clip })).toString('base64');
	await a.page.evaluate(() => document.getElementById('lpn_canvas').classList.add('lpn-masks-off'));
	await frame(a);
	const off = (await a.page.screenshot({ clip })).toString('base64');
	await a.page.evaluate(() => document.getElementById('lpn_canvas').classList.remove('lpn-masks-off'));
	await st.evaluate((n) => n.remove());
	const [A, B] = await decode(a, [on, off]);
	let ink = 0, lost = 0;
	for (let i = 0; i < B.length; i += 4) {
		const lb = (B[i] + B[i + 1] + B[i + 2]) / 3, la = (A[i] + A[i + 1] + A[i + 2]) / 3;
		if (lb < 128) { ink++; if (la > lb + 60) { lost++; } }
	}
	return { ink, lost };
}

// Every visible pipe label carrying `re` in its words, as client rectangles: the whole label, so a
// probe sees the separator or unit mark and the characters either side of it.
function labelRects(a, re) {
	return a.page.evaluate((src) => {
		const rx = new RegExp(src);
		return Array.from(document.querySelectorAll('text.lpn-lbl[data-linklbl]'))
			.filter((t) => rx.test(t.textContent || '') && getComputedStyle(t).visibility !== 'hidden')
			.map((t) => { const r = t.getBoundingClientRect(); return { x: r.left - 2, y: r.top - 2, w: r.width + 4, h: r.height + 4, text: t.textContent }; });
	}, re);
}
async function probeAll(a, re) {
	const rects = await labelRects(a, re);
	const out = { labels: rects.length, ink: 0, lost: 0 };
	for (const r of rects) {
		const p = await lostInk(a, r);
		out.ink += p.ink; out.lost += p.lost;
		if (process.env.HALO_DEBUG) { console.log('    ' + p.lost + ' of ' + p.ink + ' ' + r.text); }
	}
	return out;
}

async function structure(a) {
	return a.page.evaluate(() => {
		const ls = Array.from(document.querySelectorAll('text.lpn-lbl[data-linklbl], text.lpn-lbl[data-nodelbl]'))
			.filter((t) => (t.textContent || '').trim());
		// A tspan with no `x` of its own continues the row before it: that is a row split in two.
		let splitPlain = 0, tspans = 0;
		ls.forEach((t) => {
			const ts = Array.from(t.children);
			tspans += ts.length;
			ts.forEach((s, i) => { if (i > 0 && !s.hasAttribute('x')) { splitPlain++; } });
		});
		const cs = getComputedStyle(ls[0]);
		return { labels: ls.length, tspans, splitPlain,
			paint: cs.paintOrder, stroke: cs.stroke, sw: parseFloat(cs.strokeWidth) / parseFloat(cs.fontSize) };
	});
}

// Map > Screenshot twice, with the halo and without, through the page's own clipboard path; the
// count of pixels that differ. Labels lie over pipes in Net1, so a halo shows as pipe erased.
async function snipHaloDiff(a) {
	await a.page.evaluate(() => {
		window.__haloBlobs = [];
		Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { write: async (items) => { window.__haloBlobs.push(await items[0].getType('image/png')); } } });
	});
	const label = await a.lang('lpn_screenshot_menu');
	const map = await a.page.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + Math.min(r.height, innerHeight - r.top) / 2 }; });
	async function one(n) {
		await a.menuClick(label, 'map');
		await a.page.waitForSelector('.lpn-snip-veil', { state: 'visible' });
		await a.page.mouse.click(map.x, map.y);
		await a.page.waitForSelector('#lpn_snip_copy', { state: 'visible', timeout: 15000 });
		await a.page.click('#lpn_snip_copy');
		await a.page.waitForFunction((k) => window.__haloBlobs.length >= k, n, { timeout: 15000 });
		await a.page.keyboard.press('Escape');
		await a.settle(300);
	}
	await one(1);
	await a.page.evaluate(() => document.getElementById('lpn_canvas').classList.add('lpn-masks-off'));
	await one(2);
	await a.page.evaluate(() => document.getElementById('lpn_canvas').classList.remove('lpn-masks-off'));
	return a.page.evaluate(async () => {
		async function px(b) {
			const bm = await createImageBitmap(b), c = document.createElement('canvas'); c.width = bm.width; c.height = bm.height;
			const g = c.getContext('2d'); g.drawImage(bm, 0, 0); return { w: bm.width, h: bm.height, d: g.getImageData(0, 0, bm.width, bm.height).data };
		}
		const A = await px(window.__haloBlobs[0]), B = await px(window.__haloBlobs[1]);
		if (A.w !== B.w || A.h !== B.h) { return null; }
		let diff = 0;
		for (let i = 0; i < A.d.length; i += 4) {
			if (Math.abs(A.d[i] - B.d[i]) + Math.abs(A.d[i + 1] - B.d[i + 1]) + Math.abs(A.d[i + 2] - B.d[i + 2]) > 90) { diff++; }
		}
		return { w: A.w, h: A.h, diff };
	});
}
// Lay the second visible pipe label half over the first; the pair's client box.
function overlap(a) {
	return a.page.evaluate(() => {
		const ls = Array.from(document.querySelectorAll('text.lpn-lbl[data-linklbl]')).filter((t) => t.textContent.trim() && getComputedStyle(t).visibility !== 'hidden');
		const A = ls[0], B = ls[1], ra = A.getBoundingClientRect(), rb = B.getBoundingClientRect(), k = 1 / A.getScreenCTM().a;
		const t0 = B.getAttribute('transform');
		B.setAttribute('transform', 'translate(' + ((ra.left + ra.width * 0.2 - rb.left) * k) + ' ' + ((ra.top + ra.height * 0.45 - rb.top) * k) + ')' + (t0 ? ' ' + t0 : ''));
		const r2 = B.getBoundingClientRect(), x = Math.min(ra.left, r2.left) - 2, y = Math.min(ra.top, r2.top) - 2;
		return { x, y, w: Math.max(ra.right, r2.right) - x + 4, h: Math.max(ra.bottom, r2.bottom) - y + 4 };
	});
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found; SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const NET1 = path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn');
	try {
		const src = fs.readFileSync(path.join(REPO, 'js', 'looped-network.js'), 'utf8');
		ok('the merge is where the reference run expects it, once', src.split(MERGE).length - 1 === 1);

		console.log('=== Net1, every node and link field on, separator ", " ===');
		const a = await open(Session, browser, NET1, true);
		const s = await structure(a);
		console.log('  ' + JSON.stringify(s));
		ok('no two pieces of a row sit in separate tspans', s.labels > 20 && s.splitPlain === 0, s.splitPlain + ' split, ' + s.tspans + ' tspans in ' + s.labels + ' labels');
		ok('the halo is still the white stroke painted under the ink', /^stroke/.test(s.paint) && /255, 255, 255/.test(s.stroke) && Math.abs(s.sw - 0.4) < 0.01, s.paint + ' ' + s.stroke + ' ' + s.sw);

		const comma = await probeAll(a, ', ');
		console.log('  separator probe:        ' + JSON.stringify(comma));
		ok('in every pipe label with a ", " separator, no ink is lost to a halo', comma.labels > 3 && comma.ink > 200 && comma.lost === 0, JSON.stringify(comma));
		const unit = await probeAll(a, '\\d[\'"]');
		console.log('  unit-mark probe:        ' + JSON.stringify(unit));
		ok('in every pipe label with a unit mark (5280\', 12"), no ink is lost to a halo', unit.labels > 3 && unit.ink > 200 && unit.lost === 0, JSON.stringify(unit));

		const snip = await snipHaloDiff(a);
		console.log('  snip: ' + JSON.stringify(snip));
		ok('Map > Screenshot carries the halo (masks on and off differ where labels cross the drawing)', snip && snip.diff > 200, JSON.stringify(snip));

		const over = await lostInk(a, await overlap(a));
		console.log('  two labels overlapping: ' + JSON.stringify(over) + '   (printed only: a later label\'s halo still covers an earlier one\'s ink)');
		ok('no uncaught page errors', a.errors.length === 0, a.errors.join('\n').slice(0, 300));
		await a.close();

		console.log('=== the same probes on the page as it was: a tspan per segment (the defect Tom saw) ===');
		const b = await open(Session, browser, NET1, false);
		ok('the reference run really served the page without the merge (both loads)', b.rewritten === 2, b.rewritten);
		const refComma = await probeAll(b, ', ');
		const refUnit = await probeAll(b, '\\d[\'"]');
		console.log('  separator probe:        ' + JSON.stringify(refComma));
		console.log('  unit-mark probe:        ' + JSON.stringify(refUnit));
		ok('as it was, the probes DO find ink lost in pipe labels, so they can see the defect', refComma.lost + refUnit.lost > 0, (refComma.lost + refUnit.lost) + ' pixels');
		await b.close();

		if (TIMING) { await timing(Session, browser); }
	} finally { await browser.close(); env.stopServer(); }
	console.log('\n' + NAME + ': ' + (checks - fails) + '/' + checks + ' checks passed');
	process.exit(fails ? 1 : 0);
}

// The merge's own cost (printed, not asserted): this tree against the same tree with the merge
// switched off, alternating, medians of 3, every field on.
async function timing(Session, browser) {
	const KEYS = ['TaskDuration', 'ScriptDuration', 'LayoutDuration', 'RecalcStyleDuration'];
	const diff = (x, y) => { const o = {}; KEYS.forEach((k) => { o[k] = x[k] - y[k]; }); return o; };
	const med = (xs) => { const v = xs.slice().sort((p, q) => p - q); return v[Math.floor(v.length / 2)]; };
	for (const [title, BIG] of [['Net3 (Novato), 97 nodes, 119 pipes', path.join(REPO, 'dev', 'water-network-examples', 'Net3.lwn')],
		['600 junctions, 1000 pipes', path.join(REPO, 'dev', 'lpn-spike', 'fixtures', 'plain-downtown-n600-seed71.lwn')]]) {
		console.log('=== cost: ' + title + ', every field on (main-thread ms, printed only) ===');
		const rows = { merged: [], split: [] };
		for (let round = 0; round < 3; round++) {
			for (const merged of (round % 2 ? [false, true] : [true, false])) {
				const p = await open(Session, browser, BIG, merged);
				const m0 = await metrics(p);
				const cen = await p.page.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + 400 }; });
				await p.page.mouse.move(cen.x, cen.y);
				const zooms = [];
				for (const n of [-3, -3, 3, 3]) {
					const z0 = await metrics(p);
					for (let k = 0; k < 3; k++) { await p.page.mouse.wheel(0, n < 0 ? -100 : 100); await p.page.waitForTimeout(60); }
					await p.settle(2000);
					zooms.push(diff(await metrics(p), z0));
				}
				rows[merged ? 'merged' : 'split'].push({ open: m0, zooms });
				await p.close();
			}
		}
		const fmt = (R, pick) => KEYS.map((k) => k.replace('Duration', '') + ' ' + med(R.map((r) => pick(r)[k])).toFixed(0)).join(', ');
		for (const k of ['split', 'merged']) {
			const R = rows[k];
			console.log('  ' + (k === 'merged' ? 'ONE RUN PER ROW' : 'a tspan per segment (before)') + ', medians of 3 runs:');
			console.log('      open the project:        ' + fmt(R, (r) => r.open));
			console.log('      zoom in, new scale (x2): ' + fmt(R, (r) => { const o = {}; KEYS.forEach((q) => { o[q] = (r.zooms[0][q] + r.zooms[1][q]) / 2; }); return o; }));
			console.log('      zoom out, revisit (x2):  ' + fmt(R, (r) => { const o = {}; KEYS.forEach((q) => { o[q] = (r.zooms[2][q] + r.zooms[3][q]) / 2; }); return o; }));
		}
	}
}
main().catch((e) => { console.log('  FAIL threw: ' + (e && e.stack || e)); process.exit(1); });
