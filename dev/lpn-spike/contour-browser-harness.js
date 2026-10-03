// THE CONTOUR PLOT IN A REAL BROWSER (ROADMAP Task 600). The Node half is contour-harness.js; this
// is what a stub cannot show: the raster on screen, the menu row, the box on a desk and on a phone,
// and labels that keep their size through a zoom.
//
//   1. Water > Graphs > Contour on Net3 opens the box and draws a fill image (a PNG data URL), lines
//      and labels, under the pipes.
//   2. (e) The box: interval 10 redraws the lines at multiples of 10; opacity 30 sets the image to
//      0.3; the label count follows Labels.
//   3. A zoom re-places the labels at the same size on screen.
//   3c. The box's size fits its contents (no scrolling, within 600 x 600, on screen) in en, de, ru,
//      fr at 1400 x 900, with no saved state AND with a stale small saved size that lacks
//      `userSized`; with `userSized: true` the saved size wins; a drag of the corner sets the flag.
//   4. (f) At 390 x 844 the box fits the screen, with nothing wider than it.
//
//   flock /tmp/engcalcs-browser.lock node dev/lpn-spike/contour-browser-harness.js
// CONTOUR_SHOT=<dir> also writes a screenshot of each view there, for a person to look at.
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_CONTOUR_BROWSER_LOCKED';
const NAME = 'contour-browser-harness';

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

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
async function shot(page, name) {
	if (!process.env.CONTOUR_SHOT) { return; }
	await page.screenshot({ path: path.join(process.env.CONTOUR_SHOT, name + '.png') });
}

async function openNet3(Session, browser, viewport) {
	const a = await Session.open(browser, NAME, viewport ? { viewport } : undefined);
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	// The consent banner covers the bottom of a phone screen, cards included.
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
	await a.settle(1500);
	return a;
}
// Water > Graphs > Contour, by the rows' own words.
async function contourFromMenu(a) {
	const names = await a.page.evaluate(() => ({ g: EngCalcs.pageConfig.lpn_graphs_menu, c: EngCalcs.pageConfig.lpn_contour_menu }));
	await a.page.click('#lpn_menu_project');
	await a.page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
	const clickRow = (sel, label) => a.page.evaluate(([s, l]) => {
		const r = Array.from(document.querySelectorAll(s + ' button.lpn-menu-row')).find((b) => {
			const t = Array.from(b.childNodes).filter((n) => !(n.classList && (n.classList.contains('lpn-menu-arrow') || n.classList.contains('lpn-kbdbadge') || n.classList.contains('lpn-menu-key'))))
				.map((n) => n.textContent).join('').trim();
			return t === l || t.indexOf(l) === 0;
		});
		if (r) { r.click(); }
		return !!r;
	}, [sel, label]);
	ok('Water has a Graphs row', await clickRow('#lpn_menu_list', names.g));
	await a.page.waitForSelector('#lpn_menu_popup2', { state: 'visible' });
	ok('Graphs has a Contour row', await clickRow('#lpn_menu_list2', names.c));
	await a.settle(600);
}
function layerFacts(page) {
	return page.evaluate(() => {
		const g = document.querySelector('#lpn_canvas g.lpn-contour');
		if (!g) { return null; }
		const img = g.querySelector('image.lpn-contour-fill'), r = img ? img.getBoundingClientRect() : null;
		const labels = Array.from(g.querySelectorAll('text.lpn-contour-label'));
		const lb = labels.map((t) => t.getBoundingClientRect());
		return {
			first: g.parentNode.firstChild === g,
			href: img ? (img.getAttribute('href') || '').slice(0, 22) : '',
			opacity: img ? img.getAttribute('opacity') : null,
			imgW: r ? r.width : 0, imgH: r ? r.height : 0,
			lines: Array.from(g.querySelectorAll('path.lpn-contour-line')).map((p) => +p.getAttribute('data-level')),
			breaks: g.querySelectorAll('path.lpn-contour-break').length,
			labels: labels.map((t) => +t.getAttribute('data-level')),
			fontSize: labels.length ? +labels[0].getAttribute('font-size') : 0,
			labelH: lb.length ? lb.reduce((s, b) => s + Math.min(b.width, b.height), 0) / lb.length : 0
		};
	});
}
async function setBox(a, id, value) {
	await a.page.evaluate(([i, v]) => {
		const e = document.getElementById(i);
		if (e.type === 'checkbox') { e.checked = !!v; } else { e.value = String(v); }
		e.dispatchEvent(new Event('change', { bubbles: true }));
	}, [id, value]);
	await a.settle(300);
}

async function sectionDesk(Session, browser) {
	console.log('\n--- 1. Net3 on a desk ---');
	const a = await openNet3(Session, browser, { width: 1440, height: 900 });
	try {
		// Colour the nodes by pressure needs a solve; the example solves on open.
		await contourFromMenu(a);
		const open = await a.page.evaluate(() => { const b = document.getElementById('lpn_contour_box'); return !!b && getComputedStyle(b).display !== 'none'; });
		ok('the Contour row opens the contour box', open);
		let f = await layerFacts(a.page);
		ok('the layer is the first thing in the drawing group, under the pipes', f && f.first);
		ok('the fill is a PNG raster on screen', f && f.href.indexOf('data:image/png') === 0 && f.imgW > 200 && f.imgH > 100, f && (f.href + ' ' + f.imgW + 'x' + f.imgH));
		ok('at 60% opacity', f && f.opacity === '0.6', f && f.opacity);
		ok('contour lines every 5 psi', f && f.lines.length >= 8 && f.lines.every((v) => v % 5 === 0), f && f.lines.join(','));
		ok('labels on them', f && f.labels.length >= 3, f && f.labels.length);
		ok('a break line at the pump', f && f.breaks >= 1);
		await shot(a.page, 'contour-desk');

		console.log('\n--- 2. the box redraws the layer (e) ---');
		await setBox(a, 'lpn_contour_interval', 10);
		f = await layerFacts(a.page);
		ok('interval 10: the lines redraw at multiples of 10', f.lines.length >= 4 && f.lines.every((v) => v % 10 === 0), f.lines.join(','));
		ok('...and the labels follow', f.labels.length > 0 && f.labels.every((v) => v % 10 === 0), f.labels.join(','));
		await setBox(a, 'lpn_contour_opacity', 30);
		f = await layerFacts(a.page);
		ok('opacity 30: the image is drawn at 0.3', f.opacity === '0.3', f.opacity);
		await setBox(a, 'lpn_contour_labels', false);
		f = await layerFacts(a.page);
		ok('Labels off: no labels, lines kept', f.labels.length === 0 && f.lines.length > 0);
		await setBox(a, 'lpn_contour_labels', true);
		// TIMING, the whole change as the page does it (Settings and legend included): a new reach
		// recomputes the field, the raster and its PNG; an opacity change reuses all three.
		const timeChange = (id, v) => a.page.evaluate(([i, val]) => {
			const e = document.getElementById(i), t0 = performance.now();
			e.value = String(val); e.dispatchEvent(new Event('change', { bubbles: true }));
			return performance.now() - t0;
		}, [id, v]);
		const cold = Math.min(await timeChange('lpn_contour_buffer', 2.6), await timeChange('lpn_contour_buffer', 2.5));
		const warm = Math.min(await timeChange('lpn_contour_opacity', 50), await timeChange('lpn_contour_opacity', 40));
		console.log('         Net3 in Chromium: a new reach ' + cold.toFixed(0) + ' ms, an opacity change ' + warm.toFixed(0) + ' ms');
		ok('Net3 stays interactive: a full rebuild in under half a second', cold < 500, cold.toFixed(0) + ' ms');
		await setBox(a, 'lpn_contour_opacity', 60);
		await setBox(a, 'lpn_contour_interval', 5);

		console.log('\n--- 3. a zoom keeps the labels\' size ---');
		const before = await layerFacts(a.page);
		// Over the map, clear of the box (which opens in the middle).
		const c = await a.page.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.x + r.width * 0.25, y: r.y + r.height * 0.75 }; });
		await a.page.mouse.move(c.x, c.y);
		for (let i = 0; i < 4; i++) { await a.page.mouse.wheel(0, -240); await a.page.waitForTimeout(60); }
		await a.settle(700);
		const after = await layerFacts(a.page);
		ok('zoomed in, labels are re-placed', after.labels.length > 0 && after.fontSize < before.fontSize * 0.7, before.labels.length + ' -> ' + after.labels.length + ', font-size ' + before.fontSize + ' -> ' + after.fontSize + ' drawing units');
		ok('...at the same size on screen', before.labelH > 0 && Math.abs(after.labelH - before.labelH) / before.labelH < 0.25,
			before.labelH.toFixed(1) + ' px -> ' + after.labelH.toFixed(1) + ' px');
		await shot(a.page, 'contour-desk-zoomed');
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally {
		await a.close();
	}
}

async function sectionDocked(Session, browser) {
	console.log('\n--- 3b. first open docks at the map top-right, 1400 x 900 ---');
	const a = await openNet3(Session, browser, { width: 1400, height: 900 });
	try {
		await contourFromMenu(a);
		const g = await a.page.evaluate(() => {
			const R = (e) => { if (!e) { return null; } const r = e.getBoundingClientRect(); return (r.width > 0 && r.height > 0) ? { l: r.left, t: r.top, r: r.right, b: r.bottom } : null; };
			const map = document.getElementById('lpn_canvas'), wrap = map.closest('svg') ? map.closest('svg').parentNode : map.parentNode;
			return { box: R(document.getElementById('lpn_contour_box')), map: R(wrap), zoom: R(document.getElementById('lpn_zoom_control')),
				legend: R(document.getElementById('lpn_color_legend')) };
		});
		const hit = (x, y) => x && y && x.l < y.r && x.r > y.l && x.t < y.b && x.b > y.t;
		ok('the box lies in the right third of the map', g.box && g.map && g.box.l >= g.map.l + (g.map.r - g.map.l) * 2 / 3 - 1 && g.box.r <= g.map.r + 0.5, JSON.stringify(g));
		ok('it does not cover the zoom buttons', g.zoom && !hit(g.box, g.zoom), JSON.stringify(g));
		ok('it does not cover the colour legend', g.legend && !hit(g.box, g.legend), JSON.stringify(g));
	} finally {
		await a.close();
	}
}

// ---- 3c. the box fits its contents -------------------------------------------------------------
async function openNet3Saved(Session, browser, locale, saved) {
	const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 }, locale });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	if (saved) { await a.page.addInitScript((v) => { try { if (!localStorage.getItem('lpn_contourbox')) { localStorage.setItem('lpn_contourbox', v); } } catch (e) { /* none */ } }, JSON.stringify(saved)); }
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
	await a.settle(1500);
	return a;
}
function boxFacts(page, withDem) {
	return page.evaluate((dem) => {
		const b = document.getElementById('lpn_contour_box'), body = document.getElementById('lpn_contour_body');
		if (dem) {
			// The DEM row is offered only with a located project and a token; stand one in, labelled as the page words it.
			const rows = body.querySelectorAll('.lpn-set-row'), c = rows[rows.length - 1].cloneNode(true);
			c.firstChild.textContent = EngCalcs.pageConfig.lpn_contour_dem;
			body.appendChild(c);
		}
		const r = b.getBoundingClientRect();
		return { w: Math.round(r.width), h: Math.round(r.height), l: r.left, t: r.top, rt: r.right, bt: r.bottom, vw: window.innerWidth, vh: window.innerHeight,
			rows: body.querySelectorAll('.lpn-set-row').length, vScroll: body.scrollHeight - body.clientHeight, hScroll: body.scrollWidth - body.clientWidth,
			saved: localStorage.getItem('lpn_contourbox') };
	}, !!withDem);
}
async function sectionFit(Session, browser) {
	console.log('\n--- 3c. the box fits its contents, 1400 x 900 ---');
	const cases = [['en-US', null], ['de-DE', null], ['ru-RU', null], ['fr-FR', null],
		['de-DE', { left: null, top: null, w: 300, h: 250, open: true }]];
	for (const [loc, saved] of cases) {
		const a = await openNet3Saved(Session, browser, loc, saved);
		try {
			await contourFromMenu(a);
			const f = await boxFacts(a.page, true);
			await a.settle(300);
			const g = await boxFacts(a.page, false);
			const tag = loc + (saved ? ' (stale saved 300x250, no flag)' : ' (no saved state)');
			console.log('         ' + tag + ': box ' + f.w + ' x ' + g.h + ' px with the DEM row');
			ok(tag + ': all rows shown', f.rows >= 8, f.rows);
			ok(tag + ': no vertical or horizontal scroll', g.vScroll <= 0 && g.hScroll <= 0, g.vScroll + ' / ' + g.hScroll);
			ok(tag + ': within 600 x 600 and on screen', g.w <= 600 && g.h <= 600 && g.l >= 0 && g.t >= 0 && g.rt <= g.vw + 0.5 && g.bt <= g.vh + 0.5, JSON.stringify(g));
			ok(tag + ': wider than the old 23 rem box (368 px)', g.w > 400, g.w);
		} finally { await a.close(); }
	}
	// A size the user dragged wins.
	const a = await openNet3Saved(Session, browser, 'en-US', { left: 200, top: 200, w: 520, h: 330, open: true, userSized: true });
	try {
		await contourFromMenu(a);
		const g = await boxFacts(a.page, false);
		ok('userSized:true: the saved size wins', Math.abs(g.w - 520) <= 2 && Math.abs(g.h - 330) <= 2, g.w + ' x ' + g.h);
	} finally { await a.close(); }
	// ... and a drag of the corner is what sets the flag.
	const d = await openNet3Saved(Session, browser, 'en-US', null);
	try {
		await contourFromMenu(d);
		const before = await boxFacts(d.page, false);
		ok('a fresh open stores no size flag', !before.saved || JSON.parse(before.saved).userSized !== true, before.saved);
		// A mouse machine's resizer is the browser's own corner (the 28 px grip is for a finger).
		const grip = await d.page.evaluate(() => { const r = document.getElementById('lpn_contour_box').getBoundingClientRect(); return { x: r.right - 5, y: r.bottom - 5 }; });
		await d.page.mouse.move(grip.x, grip.y);
		await d.page.mouse.down();
		await d.page.mouse.move(grip.x - 60, grip.y + 40, { steps: 5 });
		await d.page.mouse.up();
		await d.settle(300);
		const after = await boxFacts(d.page, false), rec = JSON.parse(after.saved || '{}');
		ok('a drag of the corner resizes the box and sets userSized', rec.userSized === true && Math.abs(after.w - (before.w - 60)) <= 3 && Math.abs(rec.w - after.w) <= 1, after.saved);
	} finally { await d.close(); }
}

async function sectionPhone(Session, browser) {
	console.log('\n--- 4. on a phone, 390 x 844 (f) ---');
	const a = await openNet3(Session, browser, { width: 390, height: 844 });
	try {
		await contourFromMenu(a);
		const fit = await a.page.evaluate(() => {
			const b = document.getElementById('lpn_contour_box'), r = b.getBoundingClientRect(), body = document.getElementById('lpn_contour_body');
			const wide = Array.from(b.querySelectorAll('input, select, button, .lpn-set-row')).filter((e) => {
				const q = e.getBoundingClientRect();
				return q.width > 0 && (q.right > r.right + 0.5 || q.left < r.left - 0.5);
			}).map((e) => e.id || e.className);
			return { l: r.left, t: r.top, r: r.right, b: r.bottom, vw: window.innerWidth, vh: window.innerHeight,
				over: body.scrollWidth - body.clientWidth, wide, shown: getComputedStyle(b).display !== 'none' };
		});
		ok('the box is open', fit.shown);
		ok('it lies inside the screen', fit.l >= 0 && fit.t >= 0 && fit.r <= fit.vw + 0.5 && fit.b <= fit.vh + 0.5, JSON.stringify(fit));
		ok('nothing in it is wider than it, and it does not scroll sideways', fit.over <= 1 && fit.wide.length === 0, fit.over + ' ' + fit.wide.join(','));
		await shot(a.page, 'contour-phone');
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally {
		await a.close();
	}
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING rather than failing the build on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		await sectionDesk(Session, browser);
		await sectionDocked(Session, browser);
		await sectionFit(Session, browser);
		await sectionPhone(Session, browser);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
