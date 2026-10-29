// AN AUTOMATIC PIPE LENGTH IS THE SLOPE DISTANCE (Task 643; Tom, 2026-10-14: "Let's go ahead and
// use slope distance for our calculations in case it's significant which occasionally will be
// true."). Run with:
//   node dev/lpn-spike/slope-length-browser-harness.js
// (it takes /tmp/engcalcs-browser.lock itself; never wrap it in that lock).
//
// Real Chromium, real controls:
//   1. A US project: two junctions 300 ft apart at elevations 0 and 40 give 302.65 ft; a pipe with
//      two bends gives sqrt(Lh^2 + dz^2) over its whole polyline; a reservoir that states no
//      elevation is measured level; a tank end stands at its BASE elevation; a typed length is the
//      user's number and stays exactly as typed.
//   2. The Properties box: the Length field carries the tip, and typing an end elevation there
//      moves every Auto length at that node -- and the head loss follows the new length.
//   3. The Tables pane: typing an elevation in the Junctions table does the same.
//   4. Undo puts the length back with the elevation.
//   5. An imported .inp's lengths are the file's numbers: Auto is off and they do not move.
//   6. A lat/lon project on a Spanish page: the horizontal part is the geodesic one.
//   7. The shipped Basic examples (older files): brought to slope distance once on open, and how
//      far each Auto length moves (reported).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SLOPELEN_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error('slope-length-browser-harness: flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error('slope-length-browser-harness: NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error('slope-length-browser-harness: no `flock` binary found -- running WITHOUT the browser lock.');
}

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
const near = (a, b, tol) => Math.abs(a - b) <= tol;
const slope = (h, dz) => Math.sqrt(h * h + dz * dz);

// Vincenty's inverse on WGS 84 (Survey Review 23(176), 1975), metres -- independent of the page.
function vincenty(lon1, lat1, lon2, lat2) {
	const RAD = Math.PI / 180, a = 6378137, f = 1 / 298.257223563, b = a * (1 - f);
	const L = (lon2 - lon1) * RAD, U1 = Math.atan((1 - f) * Math.tan(lat1 * RAD)), U2 = Math.atan((1 - f) * Math.tan(lat2 * RAD));
	const sU1 = Math.sin(U1), cU1 = Math.cos(U1), sU2 = Math.sin(U2), cU2 = Math.cos(U2);
	let lam = L, lamP, sS, cS, sig, sA, c2A, c2Sm, C, it = 0;
	do {
		const sl = Math.sin(lam), cl = Math.cos(lam);
		sS = Math.sqrt((cU2 * sl) ** 2 + (cU1 * sU2 - sU1 * cU2 * cl) ** 2);
		if (sS === 0) { return 0; }
		cS = sU1 * sU2 + cU1 * cU2 * cl;
		sig = Math.atan2(sS, cS);
		sA = cU1 * cU2 * sl / sS;
		c2A = 1 - sA * sA;
		c2Sm = c2A ? cS - 2 * sU1 * sU2 / c2A : 0;
		C = f / 16 * c2A * (4 + f * (4 - 3 * c2A));
		lamP = lam;
		lam = L + (1 - C) * f * sA * (sig + C * sS * (c2Sm + C * cS * (-1 + 2 * c2Sm * c2Sm)));
	} while (Math.abs(lam - lamP) > 1e-12 && ++it < 200);
	const u2 = c2A * (a * a - b * b) / (b * b);
	const A = 1 + u2 / 16384 * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)));
	const B = u2 / 1024 * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));
	const dS = B * sS * (c2Sm + B / 4 * (cS * (-1 + 2 * c2Sm * c2Sm) - B / 6 * c2Sm * (-3 + 4 * sS * sS) * (-3 + 4 * c2Sm * c2Sm)));
	return b * A * (sig - dS);
}

const US_UNITS = { lpn_u_length: 'ft', lpn_u_elevhead: 'fth2o', lpn_u_pressure: 'psi', lpn_u_diameter: 'in',
	lpn_u_flow: 'gpm', lpn_u_velocity: 'ftps', lpn_u_gradient: 'gradePercent' };
const pipe = (id, from, to, verts, extra) => Object.assign({ id, type: 'pipe', from, to, verts: verts || [], _diameter: 6,
	_roughness: 130, _length: 0, lenAuto: true, _status: 'open', _k: 0 }, extra || {});

// R1 (head 200 ft, NO elevation) -- P4 -- J1 (0 ft) -- P1 -- J2 (40 ft) -- P2 (two bends) -- J3 (10 ft)
// J2 -- P5 -- T1 (ground 0, base 50); J3 -- P3 (typed 1000 ft) -- J1.
function usProject() {
	return {
		// A v12 file, as the page before Task 643 saved it: every Auto length horizontal.
		format: 'hawsedc-lpn', v: 12,
		project: { name: 'Slope length', activeScenario: 'base' },
		scenarios: [{ id: 'base', name: 'Base', isBase: true, overrides: {} }],
		nodes: [
			{ id: 'R1', type: 'reservoir', x: 0, y: 300, _head: 200 },
			{ id: 'J1', type: 'junction', x: 0, y: 0, elev: 0, _demand: 50 },
			{ id: 'J2', type: 'junction', x: 300, y: 0, elev: 40, _demand: 50 },
			{ id: 'J3', type: 'junction', x: 900, y: -400, elev: 10, _demand: 100 },
			{ id: 'T1', type: 'tank', x: 300, y: 300, elev: 0, bottomElev: 50, _level: 100, minLevel: 0, maxLevel: 150, tankDiameter: 40 }
		],
		links: [
			pipe('P4', 'R1', 'J1', [], { _length: 300 }),
			pipe('P1', 'J1', 'J2', [], { _length: 300 }),
			pipe('P2', 'J2', 'J3', [{ x: 300, y: -400 }, { x: 600, y: -400 }], { _length: 1000 }),
			pipe('P5', 'J2', 'T1', [], { _length: 300 }),
			pipe('P3', 'J3', 'J1', [], { lenAuto: false, _length: 1000 })
		],
		labels: [], nextId: {}, units: US_UNITS
	};
}
// Horizontal lengths by hand: P2 is 400 + 300 + 300 = 1000 ft along its polyline.

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	let chromium;
	try { chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium; }
	catch (err) { console.error('playwright-core is not installed (cd dev/browser-pass && npm install).'); process.exit(1); }
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error('slope-length-browser-harness: no Chromium found (set CHROME_PATH). SKIPPING.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'slopelen', { viewport: { width: 1500, height: 950 } });
		const page = a.page;
		const errors = [];
		page.on('pageerror', (e) => errors.push(String(e && e.message || e)));
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (route) => route.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.dismissGallery();
		const S = (k) => a.lang(k);

		const index = () => page.evaluate(() => JSON.parse(localStorage.getItem('lpn_index') || '{}'));
		const stored = async () => {
			const id = (await index()).openId;
			return page.evaluate((i) => JSON.parse(localStorage.getItem('lpn_project_' + i) || 'null'), id);
		};
		const lengths = async () => {
			const s = await stored(), out = {};
			(s ? s.links : []).forEach((l) => { out[l.id] = { len: l._length, auto: l.lenAuto }; });
			return out;
		};
		const probe = () => page.evaluate(() => {
			const r = EngCalcs.lpnSolveProbe();
			return r ? { hl: r.headlosses, q: r.flows } : null;
		});
		const openFile = async (name, obj) => {
			await a.writeFile(name, JSON.stringify(obj, null, '\t'));
			await a.queuePick(name);
			await a.menuClick(await S('lpn_file_open'));
			await a.settle(300);
			await a.answerTrainingPanel();
			await a.settle(1800);
		};
		const clickEl = async (sel) => {
			const at = await page.evaluate((s) => {
				const e = Array.from(document.querySelectorAll(s)).filter((x) => x.getBoundingClientRect().width > 0)[0];
				if (!e) { return null; }
				const r = e.getBoundingClientRect();
				return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
			}, sel);
			if (at) { await page.mouse.click(at.x, at.y); await a.settle(900); }
			return !!at;
		};
		const closePopup = async () => {
			await page.evaluate(() => { const b = document.getElementById('lpn_popup_close'); if (b && b.offsetParent) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); } });
			await a.settle(300);
		};
		const popupField = (label) => page.evaluate((t) => {
			const l = Array.from(document.querySelectorAll('#lpn_popup_fields label'))
				.filter((x) => x.textContent.replace(/­/g, '').trim().indexOf(t) === 0)[0];
			if (!l) { return null; }
			const i = l.querySelector('input'), h = l.querySelector('.ec-help');
			return { value: i ? i.value : null, tip: h ? (h.title || h.getAttribute('data-bs-original-title') || '') : null };
		}, label);
		const typePopup = (label, v) => page.evaluate(([t, val]) => {
			const l = Array.from(document.querySelectorAll('#lpn_popup_fields label'))
				.filter((x) => x.textContent.replace(/­/g, '').trim().indexOf(t) === 0)[0];
			const i = l.querySelector('input');
			i.focus(); i.value = val;
			i.dispatchEvent(new Event('input', { bubbles: true }));
			i.dispatchEvent(new Event('change', { bubbles: true }));
			i.blur();
		}, [label, String(v)]);

		// ---- 1 ------------------------------------------------------------------------------------
		console.log('1. A US PROJECT SAVED BEFORE THIS TASK OPENS WITH SLOPE LENGTHS');
		await openFile('slope.lwn', usProject());
		let L = await lengths();
		ok('two junctions 300 ft apart at 0 and 40 ft: 302.65 ft', L.P1 && L.P1.len.toFixed(2) === '302.65', L.P1 && L.P1.len);
		ok('a pipe with two bends, 1000 ft along the drawing and 30 ft of fall: ' + slope(1000, 30).toFixed(2),
			L.P2 && near(L.P2.len, slope(1000, 30), 1e-6), L.P2 && L.P2.len);
		ok('a reservoir with no stated elevation: the pipe is measured level, 300 ft', L.P4 && near(L.P4.len, 300, 1e-9), L.P4 && L.P4.len);
		ok('a tank end stands at its base (50 ft), not its ground (0): ' + slope(300, 10).toFixed(2),
			L.P5 && near(L.P5.len, slope(300, 10), 1e-6), L.P5 && L.P5.len);
		ok('the typed 1000 ft is untouched and still typed', L.P3 && L.P3.len === 1000 && L.P3.auto === false, JSON.stringify(L.P3));

		// ---- 2 ------------------------------------------------------------------------------------
		console.log('\n2. THE PROPERTIES BOX');
		const lenLabel = await S('lpn_field_length'), lenTip = await S('lpn_field_length_slope_tip'), elevLabel = await S('lpn_field_elev');
		ok('pipe P1 opens in Properties', await clickEl('#lpn_canvas [data-link="P1"]'));
		let lf = await popupField(lenLabel);
		ok('its Length field shows 302.65', lf && lf.value === '302.65', JSON.stringify(lf));
		ok('...and carries the slope tip', lf && lf.tip === lenTip, lf && lf.tip);
		await a.settle(600);
		const before = await probe();
		ok('the network solved', before && before.hl && typeof before.hl.P1 === 'number', JSON.stringify(before && before.hl));
		await closePopup();
		ok('junction J2 opens in Properties', await clickEl('#lpn_canvas [data-node="J2"]'));
		await typePopup(elevLabel, 100);
		await a.settle(1500);
		L = await lengths();
		ok('J2 at 100 ft: P1 is ' + slope(300, 100).toFixed(2), near(L.P1.len, slope(300, 100), 1e-6), L.P1.len);
		ok('...P2 is ' + slope(1000, 90).toFixed(2), near(L.P2.len, slope(1000, 90), 1e-6), L.P2.len);
		ok('...P5 (to the tank base) is ' + slope(300, 50).toFixed(2), near(L.P5.len, slope(300, 50), 1e-6), L.P5.len);
		ok('...P4, not at J2, is still 300', near(L.P4.len, 300, 1e-9), L.P4.len);
		ok('...and the typed P3 is still 1000', L.P3.len === 1000, L.P3.len);
		const after = await probe();
		// Hazen-Williams: h = r L Q^1.852, so at one pipe h2/h1 = (L2/L1) (Q2/Q1)^1.852.
		const hwRatio = (id, L1, L2) => (L2 / L1) * Math.pow(Math.abs(after.q[id] / before.q[id]), 1.852);
		['P1', 'P2', 'P5'].forEach((id) => {
			const want = hwRatio(id, id === 'P1' ? slope(300, 40) : id === 'P2' ? slope(1000, 30) : slope(300, 10), L[id].len);
			const got = after.hl[id] / before.hl[id];
			ok('the solve used the new ' + id + ' length: head loss ratio ' + got.toFixed(5) + ' vs ' + want.toFixed(5),
				after && near(got, want, 2e-3 * want));
		});
		await closePopup();
		ok('P1 reopens in Properties showing ' + slope(300, 100).toFixed(2), await clickEl('#lpn_canvas [data-link="P1"]') &&
			(await popupField(lenLabel)).value === slope(300, 100).toFixed(2), (await popupField(lenLabel) || {}).value);
		await closePopup();

		// ---- 3 ------------------------------------------------------------------------------------
		console.log('\n3. THE TABLES PANE');
		await a.toolbarClick(await S('lpn_pane_toggle'));
		await a.settle(500);
		const tabId = await page.evaluate(() => {
			const t = Array.from(document.querySelectorAll('[id^="lpn_pane_tab_"]')).map((e) => e.id);
			return t.filter((i) => /junction/i.test(i))[0] || t.join(',');
		});
		await page.click('#' + tabId);
		await a.settle(800);
		const kind = tabId.replace('lpn_pane_tab_', '');
		const cellAt = await page.evaluate(([k]) => {
			const td = Array.from(document.querySelectorAll('#lpn_pane_' + k + ' td.lpn-pane-col-elev')).filter((t) => t._lpnPaneId === 'J1')[0];
			if (!td) { return null; }
			td.scrollIntoView({ block: 'center' });
			const r = td.getBoundingClientRect();
			return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		}, [kind]);
		ok('the Junctions table has an Elevation cell for J1', !!cellAt);
		if (cellAt) {
			await page.mouse.click(cellAt.x, cellAt.y);
			await a.settle(150);
			await page.keyboard.type('20');
			await page.keyboard.press('Enter');
			await a.settle(1500);
		}
		L = await lengths();
		const s1 = await stored();
		ok('J1 took 20 ft from the table', s1 && s1.nodes.filter((n) => n.id === 'J1')[0].elev === 20);
		ok('P1 (J1 20 ft, J2 100 ft) is ' + slope(300, 80).toFixed(2), near(L.P1.len, slope(300, 80), 1e-6), L.P1.len);
		ok('P4 (a reservoir with no elevation) stays 300', near(L.P4.len, 300, 1e-9), L.P4.len);
		ok('the typed P3, which ends at J1, stays 1000', L.P3.len === 1000, L.P3.len);
		const pipesTab = await page.evaluate(() => Array.from(document.querySelectorAll('[id^="lpn_pane_tab_"]')).map((e) => e.id).filter((i) => /pipe/i.test(i))[0]);
		await page.click('#' + pipesTab);
		await a.settle(600);
		const paneLen = await page.evaluate(([k]) => {
			const td = Array.from(document.querySelectorAll('#lpn_pane_' + k + ' td.lpn-pane-col-length')).filter((t) => t._lpnPaneId === 'P1')[0];
			if (!td) { return null; }
			const i = td.querySelector('input');
			return i ? i.value : td.textContent;
		}, [pipesTab.replace('lpn_pane_tab_', '')]);
		ok('the Pipes table shows P1 at ' + slope(300, 80).toFixed(2), paneLen !== null && near(parseFloat(paneLen), slope(300, 80), 0.006), paneLen);

		// ---- 4 ------------------------------------------------------------------------------------
		console.log('\n4. UNDO');
		await a.toolbarClick(await S('lpn_tool_undo'));
		await a.settle(1500);
		L = await lengths();
		ok('Undo puts J1 back at 0 and P1 back at ' + slope(300, 100).toFixed(2), near(L.P1.len, slope(300, 100), 1e-6), L.P1.len);
		await a.toolbarClick(await S('lpn_pane_toggle'));
		await a.settle(300);

		// ---- 5 ------------------------------------------------------------------------------------
		console.log('\n5. AN IMPORTED .inp KEEPS ITS LENGTHS');
		const inp = ['[TITLE]', 'slope', '', '[JUNCTIONS]', 'A 0 10', 'B 40 10', '', '[RESERVOIRS]', 'R 200', '',
			'[PIPES]', 'P A B 500 6 130 0 Open', 'Q R A 300 6 130 0 Open', '', '[COORDINATES]', 'A 0 0', 'B 300 0', 'R 0 300', '',
			'[OPTIONS]', 'Units GPM', 'Headloss H-W', '', '[END]', ''].join('\n');
		const [chooser] = await Promise.all([page.waitForEvent('filechooser'), a.menuClickSub(await S('lpn_file_import_menu'), await S('lpn_file_import_inp'))]);
		await chooser.setFiles({ name: 'slope.inp', mimeType: 'text/plain', buffer: Buffer.from(inp, 'utf8') });
		await a.settle(600);
		// The project has assets, so the file is asked where it goes (Task 814): a new project.
		await page.click('#lpn_dialog_buttons button');
		await a.settle(1500);
		await page.keyboard.press('Escape');
		await a.settle(600);
		L = await lengths();
		ok('the file\'s 500 ft between junctions 40 ft apart in elevation stays 500, Auto off', L.P && L.P.len === 500 && L.P.auto === false, JSON.stringify(L.P));
		ok('...and its 300 ft stays 300', L.Q && L.Q.len === 300 && L.Q.auto === false, JSON.stringify(L.Q));

		// ---- 6 ------------------------------------------------------------------------------------
		console.log('\n6. A LAT/LON PROJECT, ON A SPANISH PAGE');
		await a.goto('Looped-Network.php?lang=es&ec_nolog=1');
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.dismissGallery();
		const esLen = await S('lpn_field_length');
		ok('the page really is Spanish (Length is not the English word)', esLen && esLen !== 'Length', esLen);
		const g = { lon: -112.0, lat: 33.5 }, g2 = { lon: -112.0, lat: 33.501 }, g3 = { lon: -111.999, lat: 33.501 };
		const h1 = vincenty(g.lon, g.lat, g2.lon, g2.lat), h2 = vincenty(g3.lon, g3.lat, g2.lon, g2.lat);
		await openFile('slope-geo.lwn', {
			format: 'hawsedc-lpn', v: 13,
			project: { name: 'Slope geo', activeScenario: 'base', coords: 'geo', basemap: 'osm' },
			scenarios: [{ id: 'base', name: 'Base', isBase: true, overrides: {} }],
			nodes: [
				{ id: 'G1', type: 'junction', x: g.lon, y: g.lat, elev: 0, _demand: 1 },
				{ id: 'G2', type: 'junction', x: g2.lon, y: g2.lat, elev: 40, _demand: 1 },
				{ id: 'G3', type: 'reservoir', x: g3.lon, y: g3.lat, elev: 60, _head: 120 }
			],
			// A current (v13) file whose Auto lengths are stale on purpose: ticking Auto again in
			// Properties is what makes the page measure them itself, geodesically.
			links: [pipe('GP1', 'G1', 'G2', [], { _diameter: 150, _roughness: 130, _length: 1 }),
				pipe('GP2', 'G3', 'G2', [], { _diameter: 150, _roughness: 130, _length: 1 })],
			labels: [], nextId: {},
			units: { lpn_u_length: 'm', lpn_u_diameter: 'mm', lpn_u_elevhead: 'mh2o', lpn_u_pressure: 'kpa',
				lpn_u_flow: 'lps', lpn_u_velocity: 'mps', lpn_u_gradient: 'gradePercent' }
		});
		const retick = async (id) => {
			ok(id + ' opens in Properties', await clickEl('#lpn_canvas [data-link="' + id + '"]'));
			await page.evaluate((t) => {
				const l = Array.from(document.querySelectorAll('#lpn_popup_fields label'))
					.filter((x) => x.textContent.replace(/\u00ad/g, '').trim().indexOf(t) === 0)[0];
				let n = l.nextElementSibling;
				while (n && !(n.querySelector && n.querySelector('input[type="checkbox"]'))) { n = n.nextElementSibling; }
				const box = n.querySelector('input[type="checkbox"]');
				box.checked = false; box.dispatchEvent(new Event('change', { bubbles: true }));
				box.checked = true; box.dispatchEvent(new Event('change', { bubbles: true }));
			}, esLen);
			await a.settle(900);
		};
		await retick('GP1');
		await closePopup();
		await retick('GP2');
		await closePopup();
		L = await lengths();
		ok('GP1: ' + h1.toFixed(3) + ' m on the ground, 40 m of rise: ' + slope(h1, 40).toFixed(3) + ' m',
			L.GP1 && near(L.GP1.len, slope(h1, 40), 0.01), L.GP1 && L.GP1.len);
		ok('GP2 from a reservoir that states an elevation (60 m): ' + slope(h2, 20).toFixed(3) + ' m',
			L.GP2 && near(L.GP2.len, slope(h2, 20), 0.01), L.GP2 && L.GP2.len);
		await clickEl('#lpn_canvas [data-link="GP1"]');
		lf = await popupField(esLen);
		ok('its Length field shows ' + slope(h1, 40).toFixed(2) + ' and carries a tip that is text, never "undefined"',
			lf && near(parseFloat(lf.value), slope(h1, 40), 0.006) && lf.tip && lf.tip.indexOf('undefined') < 0, JSON.stringify(lf));
		await closePopup();

		// ---- 7 ------------------------------------------------------------------------------------
		console.log('\n7. THE SHIPPED NET1 EXAMPLES (reported, not asserted)');
		const fs = require('fs');
		for (const [file, key] of [['Net1-Scenarios.lwn', 'lpn_ex_net1_title'], ['Net1-Scenarios-SI.lwn', 'lpn_ex_net1_si_title']]) {
			const was = JSON.parse(fs.readFileSync(path.join(REPO, 'examples', file), 'utf8'));
			const b = await Session.open(browser, 'slopelen-ex', { viewport: { width: 1500, height: 950 } });
			await b.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (route) => route.abort());
			await b.goto('Looped-Network.php?lang=en&ec_nolog=1');
			await b.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			await b.openExampleCard(await b.lang(key));
			await b.settle(1200);
			const bIndex = await b.page.evaluate(() => JSON.parse(localStorage.getItem('lpn_index') || '{}'));
			const bDoc = await b.page.evaluate((i) => JSON.parse(localStorage.getItem('lpn_project_' + i) || 'null'), bIndex.openId);
			const now = {};
			bDoc.links.forEach((l) => { now[l.id] = { len: l._length }; });
			let worst = { id: '', pct: 0 };
			was.links.filter((l) => l.lenAuto && l.type === 'pipe').forEach((l) => {
				const pct = (now[l.id].len - l._length) / l._length * 100;
				console.log('       ' + file + ' ' + l.id + ': ' + l._length.toFixed(2) + ' -> ' + now[l.id].len.toFixed(2) + '  (' + pct.toFixed(3) + '%)');
				if (Math.abs(pct) > Math.abs(worst.pct)) { worst = { id: l.id, pct }; }
			});
			console.log('       largest: ' + worst.id + ' ' + worst.pct.toFixed(2) + '%');
			ok(file + ' opens with every pipe at its stored length (no auto length is re-derived)', worst.pct === 0 || Math.abs(worst.pct) < 1e-9, worst.pct.toFixed(4) + '%');
			ok('...and stamped as the current version', bDoc.v >= 13, String(bDoc.v));
			ok(file + ' opens with no unsaved-work mark', !(await b.currentTabDirty()));
			await b.close();
		}
		ok('no page error', errors.length === 0, errors.slice(0, 2).join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall slope length browser checks passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });

