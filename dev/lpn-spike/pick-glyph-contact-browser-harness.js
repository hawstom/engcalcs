// **A PRESS OPENS THE BOX ONLY WHERE ITS POINT IS ON THE INK OF TWO OR MORE SYMBOLS** (Tom, 2026-11-16, round 6:
// "only clicking on overlaps would trigger the box"). Real Chromium, a mouse. A junction is slid along and
// across a pump and a valve at four angles. For each position the junction's CENTRE is pressed: the glyph's
// silhouette is asked by isPointInFill whether the centre is on its ink, and the click must open a box exactly
// then (a centre within 1.5 px of the silhouette's edge is printed, not asserted: the page's drawn path and the pick model differ by about a pixel there). The same glyph is also
// pressed on a point of its own ink well clear of the junction: that is never a box.
//
//   node dev/lpn-spike/pick-glyph-contact-browser-harness.js   (takes the browser lock itself)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const NAME = 'pick-glyph-contact-browser-harness';
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PICKGLYPH_LOCKED';
if (process.env[LOCK_ENV] !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' }) });
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
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const S = 3.5;   // px per map unit in the project's view

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const base = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'lpn-spike', 'fixtures', 'pick-chooser.lwn'), 'utf8'));
	const errors = [];
	// One project per glyph type and angle: 3 rows of 8 cells, each a link 16 units long through the cell's
	// centre with one junction placed along/across it by (along, across) px from the link's middle.
	const ALONG = [-26, -20, -14, -8, -4, 0, 4, 8, 14, 20, 26], ACROSS = [0, 6, 9, 12, 15, -9];
	const cellsFor = () => { const c = []; ACROSS.forEach((a) => ALONG.forEach((l) => c.push([l, a]))); return c; };
	const project = (type, deg) => {
		const d = JSON.parse(JSON.stringify(base)); d.nodes = []; d.links = []; d.labels = []; d.shapes = []; d.curves = d.curves || [];
		const cells = cellsFor(), th = deg * Math.PI / 180, ux = Math.cos(th), uy = Math.sin(th), cols = 11;
		cells.forEach((cl, i) => {
			const cx = (i % cols) * 24, cy = Math.floor(i / cols) * 24, id = type[0] + i, half = 8;
			const nd = (n, x, y) => d.nodes.push({ id: n, type: 'junction', x: x, y: y, elev: 700, _demand: 0, tok: { x: x.toFixed(2), y: y.toFixed(2) }, _initQuality: 0 });
			nd(id + 'a', cx - ux * half, cy - uy * half); nd(id + 'b', cx + ux * half, cy + uy * half);
			nd(id + 'j', cx + (ux * cl[0] - uy * cl[1]) / S, cy + (uy * cl[0] + ux * cl[1]) / S);
			const L = { id: id, type: type, from: id + 'a', to: id + 'b', verts: [], _diameter: 18, lenAuto: false, _k: 0 };
			if (type === 'pump') { Object.assign(L, { curvePoints: [[1500, 250]], curveRef: null, h0: 101.6, a: 2836.19, b: 2, curveId: '1' }); }
			else { Object.assign(L, { _setting: 0, _status: 'open', _valveType: 'PRV' }); }
			d.links.push(L);
		});
		d.view = { cx: cols * 12 - 12, cy: 60, s: S };   // the 6 rows centred, clear of the bars at the top
		return JSON.stringify(d);
	};
	// Is the junction's centre on the glyph's silhouette (and is that settled to 1.5 px), and a point of the
	// glyph's ink well clear of the disc, in the page.
	const probe = (page, id) => page.evaluate((id) => {
		const node = document.querySelector('#lpn_canvas circle.lpn-node[data-node="' + id + 'j"]'), glyph = document.querySelector('#lpn_canvas path.lpn-link-symbol-hit[data-link="' + id + '"]');
		if (!node || !glyph) { return null; }
		const nb = node.getBoundingClientRect(), gb = glyph.getBoundingClientRect(), svg = node.ownerSVGElement, gm = glyph.getScreenCTM().inverse(), P = svg.createSVGPoint();
		const inGlyph = (x, y) => { P.x = x; P.y = y; return glyph.isPointInFill(P.matrixTransform(gm)); };
		const cx = nb.left + nb.width / 2, cy = nb.top + nb.height / 2, r = nb.width / 2;
		const here = inGlyph(cx, cy), settled = [[1.5, 0], [-1.5, 0], [0, 1.5], [0, -1.5], [1.1, 1.1], [-1.1, 1.1], [1.1, -1.1], [-1.1, -1.1]].every((d) => inGlyph(cx + d[0], cy + d[1]) === here);
		let free = null;
		for (let x = gb.left; x <= gb.right; x += 0.5) {
			for (let y = gb.top; y <= gb.bottom; y += 0.5) {
				const d = Math.hypot(x - cx, y - cy);
				if (d > r + 4 && inGlyph(x, y) && (!free || d > free.d)) { free = { x, y, d }; }
			}
		}
		return { x: cx, y: cy, here, settled, free };
	}, id);
	let tot = { cases: 0, boxes: 0, mustBox: 0, mustNot: 0, band: 0, free: 0, freeBoxes: 0, wrong: [] };
	try {
		for (const type of (process.env.GC_TYPES || 'pump,valve').split(',')) {
			for (const deg of (process.env.GC_DEGS || '0,40,90,200').split(',').map(Number)) {
				const text = project(type, deg);
				const S1 = await Session.open(browser, NAME + '-' + type + deg, { viewport: { width: 1400, height: 900 } });
				S1.page.on('pageerror', (e) => errors.push(String(e && e.message)));
				await S1.page.addInitScript(() => { window.EC_DEFAULT_DOCKS = true; });
				await S1.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
				await S1.goto('Looped-Network.php?ec_nolog=1');
				await S1.page.evaluate((t) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', t); localStorage.setItem('lpn_hovercard', 'off'); }, text);
				await S1.reload();
				await S1.answerTrainingPanel().catch(() => {});
				await S1.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
				await S1.settle(2500);
				const cells = cellsFor();
				let wrong = 0, mustBox = 0, mustNot = 0, band = 0, boxes = 0;
				for (let i = 0; i < cells.length; i++) {
					const id = type[0] + i;
					const pr = await probe(S1.page, id);
					if (!pr || pr.x < 0 || pr.y < 0 || pr.x > 1400 || pr.y > 900) { continue; }
					const press = async (pt) => {
						await S1.page.mouse.move(pt.x, pt.y); await S1.page.mouse.click(pt.x, pt.y); await S1.settle(260);
						const rows = await S1.page.$$eval('.lpn-pick-chooser button', (bs) => bs.map((b) => b.textContent.trim()));
						await S1.page.keyboard.press('Escape'); await S1.settle(120);
						await S1.page.evaluate(() => { const x = document.getElementById('lpn_popup_close'); if (x) { x.click(); } });
						await S1.page.mouse.click(1380, 880); await S1.settle(120);
						return rows;
					};
					const rows = await press(pr);
					const box = rows.length > 1 && rows.some((r) => new RegExp('^(Pump|Valve) ' + id + '$').test(r)) && rows.some((r) => r === 'Junction ' + id + 'j');
					tot.cases++; if (box) { boxes++; tot.boxes++; }
					if (!pr.settled) { band++; }
					else if (pr.here) { mustBox++; if (!box) { wrong++; tot.wrong.push([type, deg, cells[i], 'centre on ink', rows]); } }
					else { mustNot++; if (box) { wrong++; tot.wrong.push([type, deg, cells[i], 'centre off ink', rows]); } }
					if (pr.free) {
						const fr = await press(pr.free);
						tot.free++;
						if (fr.length > 1) { tot.freeBoxes++; wrong++; tot.wrong.push([type, deg, cells[i], 'free ink', fr]); }
					}
				}
				tot.mustBox += mustBox; tot.mustNot += mustNot; tot.band += band;
				ok(type + ' at ' + deg + ' degrees: a box exactly where the press is on both inks, none on free ink (' + mustBox + ' centres on the glyph, ' + mustNot + ' off it, ' + band + ' within 1.5 px of its edge, ' + boxes + ' boxes, free ink pressed ' + tot.free + ' times)', wrong === 0 && mustBox >= (type === 'pump' ? 5 : 1) && mustNot > 5, JSON.stringify(tot.wrong.slice(-4)));
				await S1.page.close();
			}
		}
		tot.wrong.forEach((w) => console.log('  (wrong) ' + JSON.stringify(w)));
		console.log('  NUMBERS ' + JSON.stringify({ cases: tot.cases, boxes: tot.boxes, mustBox: tot.mustBox, mustNot: tot.mustNot, band: tot.band, free: tot.free, freeBoxes: tot.freeBoxes }));
		ok('no page error', errors.length === 0, errors.join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(failures ? '\nFAILED: ' + failures + ' of ' + checks : '\nALL PASS (' + checks + ' checks)');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
