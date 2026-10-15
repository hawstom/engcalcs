// NO HALO EVER COVERS ANY LABEL'S INK, AND THE INK IS CRISP (Task 791, Tom's browser pass:
// R-393, "In a pipe label, the halo of the separator comma can hide what's near it, and vice
// versa", and R-405, "our tiny halos were making our text look fuzzy, not clear").
//   node dev/lpn-spike/halo-under-ink-browser-harness.js            (takes the browser lock itself)
//   node dev/lpn-spike/halo-under-ink-browser-harness.js --timing   (adds the cost table: minutes)
//
// In real Chromium, on Net1 with every node and link label field on and one Text at 3x:
//   * STRUCTURE: the halo is ONE filter on the label layer (#lpn-lbl-halo: widen the layer's
//     coverage, flood it with paper, merge it under the layer); the ink has no stroke at all;
//     leaders live in their own layer just below, so no hairline is haloed; the radius is half of
//     Text halo width times the text size, in screen pixels at the zoom in force; while the map
//     moves the old stroke stands in and the filter returns when it stops; Masks off takes the
//     filter off; a Text at 3x sits in a nested size group whose filters add up to three radii.
//   * PIXELS: with everything but the lettering hidden, every pixel of ink drawn with the halo off
//     is still ink with the halo on -- around a separator comma, where two labels are made to
//     overlap, and where a Text at 3x overlaps a node label. The same probes with the old per-label
//     stroke (injected) must LOSE ink, or the probes prove nothing.
//   * WIDTH: on a black canvas the halo measured in pixels is the radius asked for, at 1x and 3x.
//   * SCREENSHOT: Map > Screenshot carries the halo (a snip with masks on differs from one with
//     masks off where labels cross the drawing).
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
// The halo as it was before Task 791, for the reference probes: a stroke under each piece of text.
const OLD_STROKE = '.lpn-lbl-layer, .lpn-lbl-size { filter: none !important; } ' +
	'.lpn-lbl { paint-order: stroke fill; stroke: #fff; stroke-width: calc(var(--lpn-halo, 0.4) * 1em); stroke-linejoin: round; } ' +
	'.lpn-masks-off .lpn-lbl { stroke: none; }';
const LETTERING_ONLY = '.lpn-symbols, .lpn-customers, .lpn-shapes, .lpn-leaders, .lpn-lbl-hit { display: none !important; }';

function projectText(file, bigText) {
	const d = JSON.parse(fs.readFileSync(file, 'utf8'));
	d.settings = Object.assign({}, d.settings, { labelMaxWidth: null });
	d.labelSettings = d.labelSettings || {};
	d.labelSettings.separator = ', ';   // Tom's: a comma between the values
	d.labelSettings.node = {}; NODE_FIELDS.forEach((k) => { d.labelSettings.node[k] = true; });
	d.labelSettings.link = {}; LINK_FIELDS.forEach((k) => { d.labelSettings.link[k] = true; });
	if (bigText && d.labels && d.labels.length) { d.labels[0].sizeMult = 3; }
	return JSON.stringify(d);
}

async function open(Session, browser, file, opts) {
	opts = opts || {};
	const a = await Session.open(browser, NAME, { serviceWorkers: 'block' });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php?ec_nolog=1');
	await a.page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_haloink', txt); }, projectText(file, opts.bigText));
	const cdp = await a.context.newCDPSession(a.page);
	await cdp.send('Performance.enable');
	await a.reload();
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	if (opts.old) { await a.page.addStyleTag({ content: OLD_STROKE }); }
	await a.settle(2500);
	a.cdp = cdp;
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
			out.push({ w: im.width, h: im.height, d: Array.from(g.getImageData(0, 0, im.width, im.height).data) });
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
	const [A, B] = (await decode(a, [on, off])).map((x) => x.d);
	let ink = 0, lost = 0;
	for (let i = 0; i < B.length; i += 4) {
		const lb = (B[i] + B[i + 1] + B[i + 2]) / 3, la = (A[i] + A[i + 1] + A[i + 2]) / 3;
		if (lb < 128) { ink++; if (la > lb + 60) { lost++; } }
	}
	return { ink, lost };
}

// A pipe label whose separator sits between two values, as a client rectangle around the comma
// and a character either side.
function commaRect(a) {
	return a.page.evaluate(() => {
		const ts = Array.from(document.querySelectorAll('text.lpn-lbl[data-linklbl] tspan')).filter((t) =>
			/^\s*[,;|\/]\s*$/.test(t.textContent || '') && t.previousSibling && t.nextSibling &&
			getComputedStyle(t.parentNode).visibility !== 'hidden');
		const t = ts[0];
		if (!t) { return null; }
		const r = t.getBoundingClientRect(), fs = r.height;
		return { x: r.left - fs, y: r.top - 2, w: r.width + 2 * fs, h: r.height + 4, n: ts.length, sep: t.textContent };
	});
}
// Lay the first visible label matching selB half over the first matching selA; the pair's client box.
function overlap(a, selA, selB) {
	return a.page.evaluate(([sa, sb]) => {
		const vis = (t) => t.textContent.trim() && getComputedStyle(t).visibility !== 'hidden';
		const A = Array.from(document.querySelectorAll(sa)).filter(vis)[0];
		const B = Array.from(document.querySelectorAll(sb)).filter((t) => vis(t) && t !== A)[0];
		const ra = A.getBoundingClientRect(), rb = B.getBoundingClientRect(), k = 1 / A.getScreenCTM().a;
		const dx = (ra.left + ra.width * 0.2 - rb.left) * k, dy = (ra.top + ra.height * 0.45 - rb.top) * k;
		const t0 = B.getAttribute('transform');
		B.setAttribute('transform', 'translate(' + dx + ' ' + dy + ')' + (t0 ? ' ' + t0 : ''));
		const r2 = B.getBoundingClientRect();
		const x = Math.min(ra.left, r2.left) - 2, y = Math.min(ra.top, r2.top) - 2;
		return { x, y, w: Math.max(ra.right, r2.right) - x + 4, h: Math.max(ra.bottom, r2.bottom) - y + 4 };
	}, [selA, selB]);
}

// The halo's width in pixels, on a black canvas with only the lettering showing: where each row's
// ink ends (from a shot with the halo off), and the run of white beyond it (with the halo on),
// taken along the rows that reach the label's right-most ink.
async function haloWidthPx(a, sel) {
	const rect = await a.page.evaluate((s) => {
		const t = Array.from(document.querySelectorAll(s)).filter((e) => e.textContent.trim() && getComputedStyle(e).visibility !== 'hidden')[0];
		const r = t.getBoundingClientRect();
		return { x: r.left, y: r.top, w: r.width, h: r.height };
	}, sel);
	const clip = { x: Math.floor(rect.x), y: Math.floor(rect.y), width: Math.ceil(rect.w + rect.h), height: Math.ceil(rect.h) };
	const st = await a.page.addStyleTag({ content: LETTERING_ONLY + ' #lpn_canvas { background: #000 !important; } .lpn-basemap, .lpn-backdrop { display: none !important; }' });
	await frame(a);
	const on = (await a.page.screenshot({ clip })).toString('base64');
	await a.page.evaluate(() => document.getElementById('lpn_canvas').classList.add('lpn-masks-off'));
	await frame(a);
	const off = (await a.page.screenshot({ clip })).toString('base64');
	await a.page.evaluate(() => document.getElementById('lpn_canvas').classList.remove('lpn-masks-off'));
	await st.evaluate((n) => n.remove());
	const [A, B] = await decode(a, [on, off]);
	const v = (img, x, y) => { const i = (y * img.w + x) * 4; return (img.d[i] + img.d[i + 1] + img.d[i + 2]) / 3; };
	const rows = [];
	for (let y = 0; y < B.h; y++) {
		let lastInk = -1;
		for (let x = 0; x < B.w; x++) { if (v(B, x, y) > 30) { lastInk = x; } }
		if (lastInk < 0) { continue; }
		let run = 0;
		for (let x = lastInk + 1; x < A.w && v(A, x, y) > 128; x++) { run++; }
		rows.push({ lastInk, run });
	}
	const far = Math.max.apply(null, rows.map((r) => r.lastInk));
	const runs = rows.filter((r) => r.lastInk >= far - 1).map((r) => r.run).sort((p, q) => p - q);
	return runs[Math.floor(runs.length / 2)];
}

async function structure(a) {
	return a.page.evaluate(() => {
		const first = document.querySelector('text.lpn-lbl[data-linklbl]');
		const L = first && first.parentNode, svg = document.getElementById('lpn_canvas');
		const f = document.getElementById('lpn-lbl-halo');
		const texts = Array.from(L.querySelectorAll('text.lpn-lbl'));
		const stroked = texts.filter((t) => { const cs = getComputedStyle(t); return cs.stroke !== 'none' || cs.paintOrder !== 'normal'; }).length;
		const big = document.querySelector('text.lpn-lbl[data-lbl]');
		const bigGroups = [];
		for (let g = big && big.parentNode; g && g !== L; g = g.parentNode) { bigGroups.push(g); }
		const rad = (g) => { const id = (g.getAttribute('filter') || '').replace(/^url\(#|\)$/g, ''); const ff = document.getElementById(id); return ff ? +ff.querySelector('feMorphology').getAttribute('radius') : NaN; };
		const R = window.EngCalcs.lpnLabelHaloRadius(), ctm = L.getScreenCTM().a;
		return {
			layerClass: L.getAttribute('class'), layerFilter: getComputedStyle(L).filter,
			chain: Array.from(f.children).map((c) => c.tagName).join(' '),
			morphIn: f.querySelector('feMorphology').getAttribute('in'),
			flood: getComputedStyle(f.querySelector('feFlood')).floodColor,
			radius: +f.querySelector('feMorphology').getAttribute('radius'), R, radiusPx: R * ctm,
			fontPx: parseFloat(getComputedStyle(first).fontSize) * ctm,
			halo: parseFloat(getComputedStyle(svg).getPropertyValue('--lpn-halo')),
			labels: texts.length, stroked,
			leadersInLayer: L.querySelectorAll('line.lpn-leader').length,
			leaders: document.querySelectorAll('.lpn-leaders line.lpn-leader').length,
			leadersBelow: !!(L.previousElementSibling && L.previousElementSibling.classList.contains('lpn-leaders')),
			bigDepth: bigGroups.length,
			bigCum: bigGroups.reduce((s, g) => s + rad(g), 0) + R,
			bigFirst: bigGroups.length > 0 && bigGroups.every((g) => g.parentNode.querySelector(':scope > g, :scope > text') === g)
		};
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
		console.log('=== Net1, every node and link field on, one Text at 3x ===');
		const a = await open(Session, browser, NET1, { bigText: true });
		const s = await structure(a);
		console.log('  ' + JSON.stringify(s));
		ok('the label layer wears the one halo filter', s.layerClass === 'lpn-lbl-layer' && /#lpn-lbl-halo/.test(s.layerFilter), s.layerFilter);
		ok('the filter widens the coverage, floods it with paper and merges it under the layer',
			s.chain === 'feMorphology feFlood feComposite feMerge' && s.morphIn === 'SourceAlpha' && s.flood === 'rgb(255, 255, 255)', s.chain + ' / ' + s.flood);
		ok('the ink has no stroke: every label is a plain fill', s.labels > 20 && s.stroked === 0, s.stroked + ' of ' + s.labels + ' stroked');
		ok('leaders are in their own layer just under the labels, not haloed', s.leadersInLayer === 0 && s.leaders > 0 && s.leadersBelow, s.leaders + ' leaders');
		ok('the radius is half of Text halo width times the text size, in screen pixels',
			Math.abs(s.radiusPx - s.halo / 2 * s.fontPx) < 0.01 && Math.abs(s.radius - s.R) < 1e-4, s.radiusPx.toFixed(3) + ' px for ' + s.fontPx.toFixed(2) + ' px text at ' + s.halo);
		ok('a Text at 3x sits in a size group, first in its parent, whose filters add up to 3 radii',
			s.bigDepth >= 1 && s.bigFirst && Math.abs(s.bigCum - 3 * s.R) < 1e-4, s.bigDepth + ' deep, ' + (s.bigCum / s.R).toFixed(3) + ' radii');

		// Zoom: the radius follows, so it stays the same number of screen pixels.
		const z = await a.page.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + 400 }; });
		await a.page.mouse.move(z.x, z.y);
		for (let k = 0; k < 3; k++) { await a.page.mouse.wheel(0, -100); await a.page.waitForTimeout(60); }
		await a.settle(1500);
		const s2 = await structure(a);
		ok('after a zoom the halo is still the same screen width',
			Math.abs(s2.radiusPx - s.radiusPx) < 0.01 && Math.abs(s2.radius - s.radius) > 1e-4,
			s2.radiusPx.toFixed(3) + ' px, radius ' + s.radius + ' -> ' + s2.radius);
		for (let k = 0; k < 3; k++) { await a.page.mouse.wheel(0, 100); await a.page.waitForTimeout(60); }
		await a.settle(1500);

		// While the map moves, the old stroke stands in; the filter is back once it stops.
		const look = () => a.page.evaluate(() => {
			const svg = document.getElementById('lpn_canvas'), L = document.querySelector('.lpn-lbl-layer'), t = L.querySelector('text.lpn-lbl');
			return { cls: svg.classList.contains('lpn-moving'), filter: getComputedStyle(L).filter, stroke: getComputedStyle(t).stroke };
		});
		const o = await a.page.evaluate(() => {
			const svg = document.getElementById('lpn_canvas'), r = svg.getBoundingClientRect();
			for (let y = r.top + 200; y < Math.min(r.bottom, innerHeight) - 50; y += 13) {
				for (let x = r.left + 20; x < r.right - 300; x += 17) { if (document.elementFromPoint(x, y) === svg) { return { x, y }; } }
			}
			return null;
		});
		await a.page.mouse.move(o.x, o.y); await a.page.mouse.down();
		await a.page.mouse.move(o.x + 10, o.y + 4); await a.page.mouse.move(o.x + 20, o.y + 8);
		const during = await look();
		await a.page.mouse.move(o.x, o.y); await a.page.mouse.up();
		await a.page.waitForTimeout(500);
		const mv = { during, after: await look() };
		console.log('  moving: ' + JSON.stringify(mv));
		ok('while the map moves, the cheap stroke halo stands in for the filter', mv.during.cls && mv.during.filter === 'none' && /255, 255, 255/.test(mv.during.stroke), JSON.stringify(mv.during));
		ok('...and once it stops, the filter is back and the ink is unstroked', !mv.after.cls && /lpn-lbl-halo/.test(mv.after.filter) && mv.after.stroke === 'none', JSON.stringify(mv.after));

		const offs = await a.page.evaluate(() => {
			const svg = document.getElementById('lpn_canvas'), L = document.querySelector('.lpn-lbl-layer'), G = document.querySelector('.lpn-lbl-size');
			svg.classList.add('lpn-masks-off');
			const m = getComputedStyle(L).filter + ' ' + (G ? getComputedStyle(G).filter : 'none');
			svg.classList.remove('lpn-masks-off');
			return m;
		});
		ok('Masks off takes the halo off the layer and the size groups', offs === 'none none', offs);

		const w1 = await haloWidthPx(a, 'text.lpn-lbl[data-nodelbl]');
		const w3 = await haloWidthPx(a, 'text.lpn-lbl[data-lbl]');
		console.log('  halo measured: 1x ' + w1 + ' px, 3x ' + w3 + ' px (asked ' + s.radiusPx.toFixed(2) + ' and ' + (3 * s.radiusPx).toFixed(2) + ')');
		ok('the halo measured on screen is the radius asked for (within 1.5 px)', Math.abs(w1 - s.radiusPx) <= 1.5, w1 + ' px');
		ok('a Text at 3x has a halo about three times as wide (within 2 px)', Math.abs(w3 - 3 * s.radiusPx) <= 2 && w3 > w1, w3 + ' px');

		const snip = await snipHaloDiff(a);
		console.log('  snip: ' + JSON.stringify(snip));
		ok('Map > Screenshot carries the halo (masks on and off differ where labels cross the drawing)', snip && snip.diff > 200, JSON.stringify(snip));

		const cr = await commaRect(a);
		ok('a pipe label with a separator between two values is on the map', !!cr, cr && (cr.n + ' separators, "' + cr.sep + '"'));
		const fixedComma = cr ? await lostInk(a, cr) : null;
		console.log('  comma probe:            ' + JSON.stringify(fixedComma));
		ok('around the separator, no ink is lost to a halo', fixedComma && fixedComma.ink > 20 && fixedComma.lost === 0, JSON.stringify(fixedComma));
		const fixedOver = await lostInk(a, await overlap(a, 'text.lpn-lbl[data-linklbl]', 'text.lpn-lbl[data-linklbl]'));
		console.log('  overlap probe:          ' + JSON.stringify(fixedOver));
		ok('where two labels overlap, neither halo covers the other label\'s ink', fixedOver.ink > 20 && fixedOver.lost === 0, JSON.stringify(fixedOver));
		const bigOver = await lostInk(a, await overlap(a, 'text.lpn-lbl[data-nodelbl]', 'text.lpn-lbl[data-lbl]'));
		console.log('  3x Text overlap probe:  ' + JSON.stringify(bigOver));
		ok('where a Text at 3x overlaps a node label, neither halo covers the other\'s ink', bigOver.ink > 20 && bigOver.lost === 0, JSON.stringify(bigOver));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.join('\n').slice(0, 300));
		await a.close();

		console.log('=== the same probes with the old per-label stroke (the defect Tom saw) ===');
		const b = await open(Session, browser, NET1, { bigText: true, old: true });
		const crb = await commaRect(b);
		const refComma = crb ? await lostInk(b, crb) : null;
		console.log('  comma probe (stroke):   ' + JSON.stringify(refComma));
		const bOver = await lostInk(b, await overlap(b, 'text.lpn-lbl[data-linklbl]', 'text.lpn-lbl[data-linklbl]'));
		console.log('  overlap probe (stroke): ' + JSON.stringify(bOver));
		ok('with the old stroke the comma probe DOES find ink lost, so the probe can see the defect', refComma && refComma.lost > 0, JSON.stringify(refComma));
		ok('with the old stroke the overlap probe DOES find ink lost', bOver && bOver.lost > 0, JSON.stringify(bOver));
		await b.close();

		if (TIMING) { await timing(Session, browser); }
	} finally { await browser.close(); env.stopServer(); }
	console.log('\n' + NAME + ': ' + (checks - fails) + '/' + checks + ' checks passed');
	process.exit(fails ? 1 : 0);
}

// The cost table (printed, not asserted): this tree's layer halo against the same tree with the
// old per-label stroke injected, alternating, medians of 3. Main-thread time from the Performance
// domain; raster time from a trace, because a filter costs at raster rather than in script.
async function timing(Session, browser) {
	const KEYS = ['TaskDuration', 'ScriptDuration', 'LayoutDuration', 'RecalcStyleDuration'];
	const diff = (x, y) => { const o = {}; KEYS.forEach((k) => { o[k] = x[k] - y[k]; }); return o; };
	const med = (xs) => { const v = xs.slice().sort((p, q) => p - q); return v[Math.floor(v.length / 2)]; };
	for (const [title, BIG] of [['Net3 (Novato), 97 nodes, 119 pipes', path.join(REPO, 'dev', 'water-network-examples', 'Net3.lwn')],
		['600 junctions, 1000 pipes', path.join(REPO, 'dev', 'lpn-spike', 'fixtures', 'plain-downtown-n600-seed71.lwn')]]) {
		console.log('=== cost: ' + title + ', every field on (ms, printed only) ===');
		const rows = { layer: [], stroke: [] };
		for (let round = 0; round < 3; round++) {
			for (const kind of (round % 2 ? ['stroke', 'layer'] : ['layer', 'stroke'])) {
				const p = await open(Session, browser, BIG, { old: kind === 'stroke' });
				const m0 = await metrics(p);
				const cen = await p.page.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + 400 }; });
				await p.page.mouse.move(cen.x, cen.y);
				const events = [];
				const h = (d) => { events.push.apply(events, d.value); };
				p.cdp.on('Tracing.dataCollected', h);
				await p.cdp.send('Tracing.start', { categories: 'devtools.timeline,disabled-by-default-devtools.timeline,cc', transferMode: 'ReportEvents' });
				const zooms = [];
				for (const n of [-3, -3, 3, 3]) {
					const z0 = await metrics(p);
					for (let k = 0; k < 3; k++) { await p.page.mouse.wheel(0, n < 0 ? -100 : 100); await p.page.waitForTimeout(60); }
					await p.settle(2000);
					zooms.push(diff(await metrics(p), z0));
				}
				const done = new Promise((r) => p.cdp.once('Tracing.tracingComplete', r));
				await p.cdp.send('Tracing.end');
				await done;
				const raster = events.filter((e) => e.ph === 'X' && e.name === 'RasterTask').reduce((s, e) => s + e.dur / 1000, 0);
				rows[kind].push({ open: m0, zooms, raster });
				await p.close();
			}
		}
		const fmt = (R, pick) => KEYS.map((k) => k.replace('Duration', '') + ' ' + med(R.map((r) => pick(r)[k])).toFixed(0)).join(', ');
		for (const k of ['stroke', 'layer']) {
			const R = rows[k];
			console.log('  ' + (k === 'layer' ? 'LAYER HALO' : 'old per-label stroke') + ', medians of 3 runs:');
			console.log('      open the project:        ' + fmt(R, (r) => r.open));
			console.log('      zoom in, new scale (x2): ' + fmt(R, (r) => { const o = {}; KEYS.forEach((q) => { o[q] = (r.zooms[0][q] + r.zooms[1][q]) / 2; }); return o; }));
			console.log('      zoom out, revisit (x2):  ' + fmt(R, (r) => { const o = {}; KEYS.forEach((q) => { o[q] = (r.zooms[2][q] + r.zooms[3][q]) / 2; }); return o; }));
			console.log('      raster, all four zooms:  ' + med(R.map((r) => r.raster)).toFixed(0));
		}
	}
}
main().catch((e) => { console.log('  FAIL threw: ' + (e && e.stack || e)); process.exit(1); });
