// NO HALO EVER COVERS ANY LABEL'S INK (Task 791, Tom's browser pass R-393, 2026-10-15: "In a pipe
// label, the halo of the separator comma can hide what's near it, and vice versa.")
//   node dev/lpn-spike/halo-under-ink-browser-harness.js   (takes the browser lock itself)
//
// In real Chromium, on Net1 with every node and link label field on:
//   * STRUCTURE: the label layer paints halo only (fill-opacity 0) and the layer directly after it
//     holds one fill-only copy of every label, same words, same box, carrying no `lpn-lbl` class
//     and no data-* attribute, so nothing that looks a label up can find a copy;
//   * IN STEP: a moved label, a re-selected one and a removed one are followed by their copy;
//   * PIXELS: with everything but the lettering hidden, every pixel of ink drawn with the halo off
//     is still ink with the halo on -- around a separator comma, and where two labels are made to
//     overlap. The same probe on the page as it was (the split switched off by rewriting the served
//     script) must LOSE ink, or the probe proves nothing.
// It then prints, on a 600-junction, 1000-pipe drawing with every field on, the main-thread time of
// opening the project and of zoom settles, with the split and without it. Printed, not asserted.
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
const SPLIT = 'splitLabelInk(labelsLayer);';
const NODE_FIELDS = ['id', 'demand', 'elev', 'head', 'pressure'];
const LINK_FIELDS = ['id', 'length', 'diameter', 'roughness', 'flow', 'velocity'];
const TIMING = process.argv.indexOf('--timing') >= 0;   // the cost table: minutes, so not in the suite

function projectText(file) {
	const d = JSON.parse(fs.readFileSync(file, 'utf8'));
	d.settings = Object.assign({}, d.settings, { labelMaxWidth: null });
	d.labelSettings = d.labelSettings || {};
	d.labelSettings.separator = ', ';   // Tom's: a comma between the values
	d.labelSettings.node = {}; NODE_FIELDS.forEach((k) => { d.labelSettings.node[k] = true; });
	d.labelSettings.link = {}; LINK_FIELDS.forEach((k) => { d.labelSettings.link[k] = true; });
	return JSON.stringify(d);
}

async function open(Session, browser, file, split) {
	const a = await Session.open(browser, NAME, { serviceWorkers: 'block' });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	let rewritten = 0;
	await a.page.route(/\/js\/looped-network\.js/, async (route) => {
		const resp = await route.fetch();
		let body = await resp.text();
		if (!split) { rewritten += body.split(SPLIT).length - 1; body = body.split(SPLIT).join('void 0;'); }
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
async function taskMs(a) { return (await metrics(a)).TaskDuration; }

// Ink pixels lost when the halo is switched on, over a client rectangle. Everything but the
// lettering is hidden first, so a dark pixel IS ink; the halo is switched off by the project's own
// masking class. A pixel dark with the halo off and pale with it on is ink a halo painted over.
async function lostInk(a, rect) {
	await a.page.addStyleTag({ content: '.lpn-symbols, .lpn-customers, .lpn-shapes, .lpn-leader, .lpn-lbl-hit { display: none !important; }' });
	const clip = { x: Math.floor(rect.x), y: Math.floor(rect.y), width: Math.ceil(rect.w), height: Math.ceil(rect.h) };
	const frame = () => a.page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
	await frame();
	const on = (await a.page.screenshot({ clip })).toString('base64');
	await a.page.evaluate(() => document.getElementById('lpn_canvas').classList.add('lpn-masks-off'));
	await frame();
	const off = (await a.page.screenshot({ clip })).toString('base64');
	await a.page.evaluate(() => document.getElementById('lpn_canvas').classList.remove('lpn-masks-off'));
	return a.page.evaluate(async ([pOn, pOff]) => {
		async function px(b64) {
			const im = new Image(); im.src = 'data:image/png;base64,' + b64; await im.decode();
			const c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
			const g = c.getContext('2d'); g.drawImage(im, 0, 0);
			return g.getImageData(0, 0, im.width, im.height).data;
		}
		const A = await px(pOn), B = await px(pOff);
		let ink = 0, lost = 0;
		for (let i = 0; i < B.length; i += 4) {
			const lb = (B[i] + B[i + 1] + B[i + 2]) / 3, la = (A[i] + A[i + 1] + A[i + 2]) / 3;
			if (lb < 128) { ink++; if (la > lb + 60) { lost++; } }
		}
		return { ink, lost };
	}, [on, off]);
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

async function structure(a) {
	return a.page.evaluate(() => {
		const first = document.querySelector('text.lpn-lbl[data-linklbl]');
		const L = first && first.parentNode, ink = L && L.nextElementSibling;
		const src = Array.from(L.children).filter((e) => e.tagName === 'text' && e.classList.contains('lpn-lbl'));
		const cp = ink ? Array.from(ink.children) : [];
		const vis = (e) => getComputedStyle(e).visibility !== 'hidden' && getComputedStyle(e).display !== 'none';
		let sameText = src.length === cp.length, sameBox = sameText, sameVis = sameText, maxD = 0;
		if (sameText) {
			src.forEach((s, i) => {
				if (s.textContent !== cp[i].textContent) { sameText = false; }
				if (vis(s) !== vis(cp[i])) { sameVis = false; }
				if (vis(s) && (s.textContent || '').trim()) {
					const p = s.getBoundingClientRect(), q = cp[i].getBoundingClientRect();
					const d = Math.max(Math.abs(p.left - q.left), Math.abs(p.top - q.top), Math.abs(p.width - q.width), Math.abs(p.height - q.height));
					maxD = Math.max(maxD, d); if (d > 0.5) { sameBox = false; }
				}
			});
		}
		const kinds = { link: src.filter((s) => s.hasAttribute('data-linklbl') && vis(s) && s.textContent.trim()).length,
			node: src.filter((s) => s.hasAttribute('data-nodelbl') && vis(s) && s.textContent.trim()).length,
			text: src.filter((s) => s.hasAttribute('data-lbl') && vis(s) && s.textContent.trim()).length };
		const s0 = src.find((s) => vis(s) && s.textContent.trim()), c0 = s0 && cp[src.indexOf(s0)];
		return {
			inkClass: ink && ink.getAttribute('class'), sources: src.length, copies: cp.length, kinds,
			sameText, sameBox, sameVis, maxD,
			srcFillOpacity: s0 && getComputedStyle(s0).fillOpacity, srcStroke: s0 && getComputedStyle(s0).stroke,
			cpStroke: c0 && getComputedStyle(c0).stroke, cpFillOpacity: c0 && getComputedStyle(c0).fillOpacity, cpFill: c0 && getComputedStyle(c0).fill,
			leaky: cp.filter((c) => c.classList.contains('lpn-lbl') || c.classList.contains('lpn-draglbl') ||
				Array.from(c.attributes).some((x) => /^data-|^id$/.test(x.name))).length,
			queryHits: document.querySelectorAll('.lpn-lbl').length === document.querySelectorAll('.lpn-lbl:not(.lpn-lbl-ink)').length &&
				!document.querySelector('.lpn-lbl-inks [data-linklbl], .lpn-lbl-inks [data-nodelbl], .lpn-lbl-inks [data-lbl]')
		};
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
		ok('the split is called where the reference run expects it (the drawing and every fresh drawing)', src.split(SPLIT).length - 1 === 2);

		console.log('=== Net1, every node and link field on ===');
		const a = await open(Session, browser, NET1, true);
		const s = await structure(a);
		console.log('  ' + JSON.stringify(s));
		ok('the layer after the labels is the ink layer', s.inkClass === 'lpn-lbl-inks', s.inkClass);
		ok('one ink copy per label', s.sources > 0 && s.sources === s.copies, s.sources + ' labels, ' + s.copies + ' copies');
		ok('pipe labels, node labels and Text objects are all on the map', s.kinds.link > 0 && s.kinds.node > 0 && s.kinds.text > 0, JSON.stringify(s.kinds));
		ok('every copy says what its label says', s.sameText);
		ok('every copy is drawn where its label is', s.sameBox, 'worst ' + s.maxD.toFixed(3) + ' px');
		ok('every copy is shown or hidden with its label', s.sameVis);
		ok('the label paints its halo only', s.srcFillOpacity === '0' && /255, 255, 255/.test(s.srcStroke), s.srcFillOpacity + ' ' + s.srcStroke);
		ok('the copy paints ink only', s.cpStroke === 'none' && s.cpFillOpacity === '1', s.cpStroke + ' ' + s.cpFillOpacity + ' ' + s.cpFill);
		ok('no copy carries lpn-lbl, lpn-draglbl, an id or a data-* attribute', s.leaky === 0, s.leaky);
		ok('a lookup by label class or label attribute never finds a copy', s.queryHits);

		// In step: move one label, select one, remove one.
		const step = await a.page.evaluate(() => new Promise((res) => {
			const L = document.querySelector('text.lpn-lbl[data-linklbl]').parentNode, ink = L.nextElementSibling;
			const src = Array.from(L.children).filter((e) => e.tagName === 'text' && e.classList.contains('lpn-lbl'));
			const t = src.find((e) => e.textContent.trim()), i = src.indexOf(t), c = ink.children[i];
			t.setAttribute('transform', 'translate(3 4)');
			t.classList.add('lpn-selected');
			const gone = src[src.length - 1], nBefore = ink.children.length;
			gone.remove();
			requestAnimationFrame(() => {
				const out = { tf: c.getAttribute('transform'), sel: c.classList.contains('lpn-selected'),
					fill: getComputedStyle(c).fill, same: ink.children[i] === c, removed: ink.children.length === nBefore - 1 };
				t.removeAttribute('transform'); t.classList.remove('lpn-selected'); L.appendChild(gone);
				requestAnimationFrame(() => { out.back = ink.children.length === nBefore && !c.hasAttribute('transform'); res(out); });
			});
		}));
		console.log('  ' + JSON.stringify(step));
		ok('a moved label moves its copy', step.tf === 'translate(3 4)');
		ok('a selected label colours its copy, and the copy is the same element', step.sel && /25, 118, 210/.test(step.fill) && step.same, step.fill);
		ok('a removed label takes its copy with it, and coming back brings it back', step.removed && step.back);

		const cr = await commaRect(a);
		ok('a pipe label with a separator between two values is on the map', !!cr, cr && (cr.n + ' separators, "' + cr.sep + '"'));
		const fixedComma = cr ? await lostInk(a, cr) : null;
		console.log('  comma probe (split):    ' + JSON.stringify(fixedComma));
		ok('around the separator, no ink is lost to a halo', fixedComma && fixedComma.ink > 20 && fixedComma.lost === 0, JSON.stringify(fixedComma));

		// Two labels made to overlap: the second pipe label laid half a line over the first.
		const overlap = () => a.page.evaluate(() => {
			const ls = Array.from(document.querySelectorAll('text.lpn-lbl[data-linklbl]')).filter((t) => t.textContent.trim() && getComputedStyle(t).visibility !== 'hidden');
			const A = ls[0], B = ls[1], ra = A.getBoundingClientRect(), rb = B.getBoundingClientRect();
			const ctm = A.getScreenCTM(), k = 1 / ctm.a;
			const dx = (ra.left + ra.width * 0.2 - rb.left) * k, dy = (ra.top + ra.height * 0.45 - rb.top) * k;
			B.setAttribute('transform', 'translate(' + dx + ' ' + dy + ')');
			const r2 = B.getBoundingClientRect();
			const x = Math.min(ra.left, r2.left) - 2, y = Math.min(ra.top, r2.top) - 2;
			return { x, y, w: Math.max(ra.right, r2.right) - x + 4, h: Math.max(ra.bottom, r2.bottom) - y + 4 };
		});
		const fixedOver = await lostInk(a, await overlap());
		console.log('  overlap probe (split):  ' + JSON.stringify(fixedOver));
		ok('where two labels overlap, neither halo covers the other label\'s ink', fixedOver.ink > 20 && fixedOver.lost === 0, JSON.stringify(fixedOver));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.join('\n').slice(0, 300));
		await a.close();

		console.log('=== the same probes on the page without the split (the defect Tom saw) ===');
		const b = await open(Session, browser, NET1, false);
		ok('the reference run really served the page without the split (both loads)', b.rewritten === 4, b.rewritten);
		const crb = await commaRect(b);
		const refComma = crb ? await lostInk(b, crb) : null;
		console.log('  comma probe (no split): ' + JSON.stringify(refComma));
		const bOver = await b.page.evaluate(() => true) && await lostInk(b, await b.page.evaluate(() => {
			const ls = Array.from(document.querySelectorAll('text.lpn-lbl[data-linklbl]')).filter((t) => t.textContent.trim() && getComputedStyle(t).visibility !== 'hidden');
			const A = ls[0], B = ls[1], ra = A.getBoundingClientRect(), rb = B.getBoundingClientRect(), k = 1 / A.getScreenCTM().a;
			B.setAttribute('transform', 'translate(' + ((ra.left + ra.width * 0.2 - rb.left) * k) + ' ' + ((ra.top + ra.height * 0.45 - rb.top) * k) + ')');
			const r2 = B.getBoundingClientRect(), x = Math.min(ra.left, r2.left) - 2, y = Math.min(ra.top, r2.top) - 2;
			return { x, y, w: Math.max(ra.right, r2.right) - x + 4, h: Math.max(ra.bottom, r2.bottom) - y + 4 };
		}));
		console.log('  overlap probe (no split): ' + JSON.stringify(bOver));
		ok('without the split the comma probe DOES find ink lost, so the probe can see the defect', refComma && refComma.lost > 0, JSON.stringify(refComma));
		ok('without the split the overlap probe DOES find ink lost', bOver && bOver.lost > 0, JSON.stringify(bOver));
		await b.close();

		if (TIMING) {
			for (const [title, BIG] of [['Net3 (Novato), 97 nodes, 119 pipes', path.join(REPO, 'dev', 'water-network-examples', 'Net3.lwn')],
				['600 junctions, 1000 pipes', path.join(REPO, 'dev', 'lpn-spike', 'fixtures', 'plain-downtown-n600-seed71.lwn')]]) {
				console.log('=== cost: ' + title + ', every field on (main-thread ms, printed only) ===');
				const rows = { split: [], none: [] };
				const KEYS = ['TaskDuration', 'ScriptDuration', 'LayoutDuration', 'RecalcStyleDuration'];
				const diff = (x, y) => { const o = {}; KEYS.forEach((k) => { o[k] = x[k] - y[k]; }); return o; };
				for (let round = 0; round < 3; round++) {
					for (const split of [true, false]) {
						const p = await open(Session, browser, BIG, split);
						const m0 = await metrics(p);
						const cen = await p.page.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
						await p.page.mouse.move(cen.x, cen.y);
						// In twice (each a new scale, so a full label pass), then back out (the bank's revisits).
						const zooms = [];
						for (const n of [-3, -3, 3, 3]) {
							const z0 = await metrics(p);
							for (let k = 0; k < 3; k++) { await p.page.mouse.wheel(0, n < 0 ? -100 : 100); await p.page.waitForTimeout(60); }
							await p.settle(2000);
							zooms.push(diff(await metrics(p), z0));
						}
						const st = await p.page.evaluate(() => (window.EngCalcs && EngCalcs.lpnLabelInkStats) ? EngCalcs.lpnLabelInkStats() : null);
						const labels = await p.page.evaluate(() => document.querySelectorAll('text.lpn-lbl').length);
						rows[split ? 'split' : 'none'].push({ open: m0, zooms, st, labels });
						await p.close();
					}
				}
				const med = (xs) => { const v = xs.slice().sort((x, y) => x - y); return v[Math.floor(v.length / 2)]; };
				const fmt = (R, pick) => KEYS.map((k) => k.replace('Duration', '') + ' ' + med(R.map((r) => pick(r)[k])).toFixed(0)).join(', ');
				for (const k of ['none', 'split']) {
					const R = rows[k];
					console.log('  ' + (k === 'split' ? 'WITH the split' : 'BEFORE (no split)') + ', ' + R[0].labels + ' labels, medians of 3 runs:');
					console.log('      open the project:        ' + fmt(R, (r) => r.open));
					console.log('      zoom in, new scale (x2): ' + fmt(R, (r) => { const o = {}; KEYS.forEach((q) => { o[q] = (r.zooms[0][q] + r.zooms[1][q]) / 2; }); return o; }));
					console.log('      zoom out, revisit (x2):  ' + fmt(R, (r) => { const o = {}; KEYS.forEach((q) => { o[q] = (r.zooms[2][q] + r.zooms[3][q]) / 2; }); return o; }));
					if (R[0].st) { console.log('      ink-copy upkeep, whole run: ' + R.map((r) => r.st.ms.toFixed(0) + ' ms/' + r.st.roots + ' labels/' + r.st.batches + ' batches').join('; ')); }
				}
			}
		}
	} finally { await browser.close(); env.stopServer(); }
	console.log('\n' + NAME + ': ' + (checks - fails) + '/' + checks + ' checks passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.log('  FAIL threw: ' + (e && e.stack || e)); process.exit(1); });
