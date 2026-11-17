// **A PUMP'S OR VALVE'S SYMBOL OVERLAPS A JUNCTION WHERE THE INK TOUCHES** (Tom, 2026-11-16: "I specifically
// requested all symbol overlaps to be included, but not lines", and he wants to predict it by eye; Perry's
// review found a disc over the notch between a valve's two triangles with 20 px^2 of contact and no box,
// and 5 px^2 elsewhere with one). Real Chromium, a mouse. A junction is slid along and across a pump and
// a valve at four angles; for each position the drawn ink is SAMPLED every 0.5 px (the glyph's silhouette
// by isPointInFill, the junction's disc by fill and stroke) and the click must open a box exactly when
// the shared ink is at least FLOOR px^2: a box at FLOOR + 1 or more, none at FLOOR - 0.75 or less (the
// band between is printed, not asserted: it is a fraction of a pixel of antialiasing).
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

const FLOOR = 1;   // px^2, js/lpn-geom.js `contact`
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
	// The ink the junction's disc and the glyph's silhouette share, sampled every 0.5 px, in the page.
	const inkArea = (page, id) => page.evaluate((id) => {
		const node = document.querySelector('#lpn_canvas circle.lpn-node[data-node="' + id + 'j"]'), glyph = document.querySelector('#lpn_canvas path.lpn-link-symbol-hit[data-link="' + id + '"]');
		if (!node || !glyph) { return null; }
		const nb = node.getBoundingClientRect(), gb = glyph.getBoundingClientRect(), svg = document.getElementById('lpn_canvas').closest('svg') || node.ownerSVGElement;
		const nm = node.getScreenCTM().inverse(), gm = glyph.getScreenCTM().inverse(), P = svg.createSVGPoint();
		const toLocal = (m, x, y) => { P.x = x; P.y = y; return P.matrixTransform(m); };
		const l = Math.max(nb.left - 1, gb.left), r = Math.min(nb.right + 1, gb.right), t = Math.max(nb.top - 1, gb.top), b = Math.min(nb.bottom + 1, gb.bottom);
		let n = 0;
		for (let x = l + 0.25; x < r; x += 0.5) {
			for (let y = t + 0.25; y < b; y += 0.5) {
				const g = toLocal(gm, x, y), c = toLocal(nm, x, y);
				if (glyph.isPointInFill(g) && (node.isPointInFill(c) || node.isPointInStroke(c))) { n++; }
			}
		}
		return n * 0.25;
	}, id);
	let tot = { cases: 0, boxes: 0, mustBox: 0, mustNot: 0, band: 0, wrong: [] };
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
					const area = await inkArea(S1.page, id);
					const c = await S1.page.evaluate((id) => { const e = document.querySelector('#lpn_canvas circle.lpn-node[data-node="' + id + 'j"]'); if (!e) { return null; } const b = e.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }, id);
					if (area === null || !c || c.x < 0 || c.y < 0 || c.x > 1400 || c.y > 900) { continue; }
					await S1.page.mouse.move(c.x, c.y); await S1.page.mouse.click(c.x, c.y); await S1.settle(260);
					const rows = await S1.page.$$eval('.lpn-pick-chooser button', (bs) => bs.map((b) => b.textContent.trim()));
					await S1.page.keyboard.press('Escape'); await S1.settle(120);
					await S1.page.evaluate(() => { const x = document.getElementById('lpn_popup_close'); if (x) { x.click(); } });
					await S1.page.mouse.click(1380, 880); await S1.settle(120);
					const box = rows.length > 1 && rows.some((r) => new RegExp('^(Pump|Valve) ' + id + '$').test(r)) && rows.some((r) => r === 'Junction ' + id + 'j');
					tot.cases++; if (box) { boxes++; tot.boxes++; }
					if (area >= FLOOR + 1) { mustBox++; if (!box) { wrong++; tot.wrong.push([type, deg, cells[i], area, rows]); } }
					else if (area <= FLOOR - 0.75) { mustNot++; if (box) { wrong++; tot.wrong.push([type, deg, cells[i], area, rows]); } }
					else { band++; }
				}
				tot.mustBox += mustBox; tot.mustNot += mustNot; tot.band += band;
				ok(type + ' at ' + deg + ' degrees: a box exactly where the ink overlaps (' + mustBox + ' overlapping, ' + mustNot + ' clear, ' + band + ' within a pixel of the floor, ' + boxes + ' boxes)', wrong === 0 && mustBox > 5 && mustNot > 5, JSON.stringify(tot.wrong.slice(-4)));
				await S1.page.close();
			}
		}
		tot.wrong.forEach((w) => console.log('  (wrong) ' + JSON.stringify(w)));
		console.log('  NUMBERS ' + JSON.stringify({ cases: tot.cases, boxes: tot.boxes, mustBox: tot.mustBox, mustNot: tot.mustNot, band: tot.band }));
		ok('no page error', errors.length === 0, errors.join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(failures ? '\nFAILED: ' + failures + ' of ' + checks : '\nALL PASS (' + checks + ' checks)');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
