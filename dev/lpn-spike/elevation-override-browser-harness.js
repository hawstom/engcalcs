// **ELEVATION IS A PHYSICAL OVERRIDE BY EVERY DOOR** (Tom, 2026-10-16: *"I like graying it out,
// though I am inclined to ask why it can't be a Physical override."*). Real Chromium, on a crafted
// Net2 (Branford, projected with a street map, so the Mapbox DEM doors exist), in three set-ups: a
// scenario made from the menu with Basic mode on, the same with Basic mode off, and a scenario that
// names its own Physical alternative. In each, one junction's elevation is changed by each door:
//   D1 the Properties Elevation field          D2 a Tables pane cell
//   D3 Find and replace, a typed value         D4 a paste into the Tables pane
//   D5 Find and replace, From Mapbox DEM       D6 Properties, Use DEM
//   D7 a NEW junction drawn while Settings > New assets > Elevation source is Mapbox DEM
//   D8 a tank's Base elevation in Properties   D9 a node dragged while the source is Mapbox DEM
// and for each: Base's stored node is unchanged, the scenario holds the value (as an override, or in
// its Physical alternative), the Properties Elevation row carries the override dot, the Tables cell
// shows it, the solve stands on it (pressure = head - elevation), and the .inp export writes it.
// Then the slope length (Task 643): a pipe with an Automatic length whose end elevation the scenario
// overrides is measured with the scenario's elevation in Tables, in the solve (its head loss) and in
// the export, while Base keeps its own stored length and shows it.
// The Mapbox DEM is stubbed in the page (EngCalcs.lpnTerrainFetchPixels returns encoded pixels, and
// consent reads as given); nothing reaches api.mapbox.com.
//
//   node dev/lpn-spike/elevation-override-browser-harness.js   (takes the browser lock itself)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const zlib = require('zlib');
const U = require('./scenario-ui-helper.js');
const NAME = 'elevation-override-browser-harness';
U.takeBrowserLock(NAME, 'EC_ELEV_OVERRIDE_BROWSER_LOCKED');
const REPO = U.REPO;

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
const byId = (arr, id) => (arr || []).filter((x) => x.id === id)[0];
const near = (x, y, tol) => typeof x === 'number' && typeof y === 'number' && Math.abs(x - y) <= tol;

// The .inp download (a zip when the project carries more than the .inp), as scenario-pass-1012 reads it.
function unzip(buf) {
	const out = {};
	let e = buf.length - 22;
	while (e >= 0 && buf.readUInt32LE(e) !== 0x06054b50) { e--; }
	if (e < 0) { return null; }
	const n = buf.readUInt16LE(e + 10);
	let p = buf.readUInt32LE(e + 16);
	for (let i = 0; i < n; i++) {
		const method = buf.readUInt16LE(p + 10), csize = buf.readUInt32LE(p + 20), nlen = buf.readUInt16LE(p + 28),
			xlen = buf.readUInt16LE(p + 30), clen = buf.readUInt16LE(p + 32), loc = buf.readUInt32LE(p + 42),
			name = buf.toString('utf8', p + 46, p + 46 + nlen);
		const start = loc + 30 + buf.readUInt16LE(loc + 26) + buf.readUInt16LE(loc + 28), body = buf.subarray(start, start + csize);
		out[name] = method === 8 ? zlib.inflateRawSync(body) : Buffer.from(body);
		p += 46 + nlen + xlen + clen;
	}
	return out;
}
function inpText(buf) {
	if (buf.length > 4 && buf.toString('latin1', 0, 2) === 'PK') {
		const z = unzip(buf), n = z && Object.keys(z).find((k) => /\.inp$/i.test(k));
		return n ? z[n].toString('utf8') : null;
	}
	return buf.toString('utf8');
}
// One section's data rows, split on whitespace, keyed by their first field.
function inpRows(text, section) {
	const out = {};
	let on = false;
	for (const line of String(text || '').split(/\r?\n/)) {
		const m = /^\s*\[(\w+)\]/.exec(line);
		if (m) { on = m[1].toUpperCase() === section; continue; }
		const t = line.replace(/;.*$/, '').trim();
		if (on && t) { const f = t.split(/\s+/); out[f[0]] = f; }
	}
	return out;
}

// The DEM the stub serves: one height everywhere, encoded as Mapbox Terrain-RGB encodes it.
const DEM_M = 123.4;
const DEM_FT = +(DEM_M / 0.3048).toFixed(2);

// Net2 (US units: ft of elevation and ft of length), with Automatic lengths on the pipes that meet
// the junctions this harness raises, and Settings > New assets > Elevation source on Mapbox DEM.
function craft(mode) {
	const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net2-Branford-CT.lwn'), 'utf8'));
	['3', '4', '29'].forEach((id) => { byId(d.links, id).lenAuto = true; });
	d.settings.defaults = Object.assign({}, d.settings.defaults, { nodeElevSource: 'dem' });
	d.settings.nodeElevSource = 'dem';
	d.project = Object.assign({}, d.project, { activeScenario: 'base' });
	// No saved view, so the drawing opens fitted to the window and every node can be clicked.
	delete d.view;
	// Nor any Text: Net2's "Tank" note sits on tank 26 and would take the click meant for the tank.
	d.labels = [];
	if (mode === 'alt') {
		d.alternatives = [{ id: 'pz', category: 'physical', name: 'Raised', parent: null }];
		d.scenarios.push({ id: 'sz', name: 'Raised', overrides: {}, alternatives: { physical: 'pz' } });
		d.project.activeScenario = 'sz';
	}
	return d;
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		for (const mode of ['basic', 'nobasic', 'alt']) {
			await runMode(browser, Session, mode);
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

async function runMode(browser, Session, mode) {
	const title = { basic: 'Basic mode on, scenario made from the menu', nobasic: 'Basic mode off, scenario made from the menu',
		alt: 'a scenario naming its own Physical alternative' }[mode];
	console.log('\n--- ' + title + ' ---');
	const d0 = craft(mode);
	const a = await Session.open(browser, NAME + '-' + mode, { serviceWorkers: 'block', viewport: { width: 1600, height: 1000 } });
	const P = a.page;
	const errors = [];
	P.on('pageerror', (e) => errors.push(String(e && e.message)));
	await P.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php?ec_nolog=1');
	await P.evaluate(([txt, off]) => {
		localStorage.clear();
		localStorage.setItem('lpn_project_hover', txt);
		localStorage.setItem('lpn_scnbasic', off ? 'off' : 'on');
	}, [JSON.stringify(d0), mode !== 'basic']);
	await a.reload();
	await a.answerTrainingPanel().catch(() => {});
	const clearSeams = () => P.evaluate(() => {
		const c = document.getElementById('ec-consent'); if (c) { c.remove(); }
		delete window.lpnDialogAnswerer;
	});
	await clearSeams();
	await a.settle(2500);
	// THE DEM STUB: consent given, and every requested pixel answers DEM_M.
	await P.evaluate((m) => {
		const v = Math.round((m + 10000) / 0.1), r = Math.floor(v / 65536), g = Math.floor((v % 65536) / 256), b = v % 256;
		window.__demCalls = 0;
		EngCalcs.lpnTerrainConsented = () => true;
		EngCalcs.lpnTerrainFetchPixels = (tile) => { window.__demCalls++; return Promise.resolve(tile.points.map((p) => ({ id: p.id, r, g, b }))); };
	}, DEM_M);
	const ctx = { a, P, strings: {} };
	const L = (k) => U.lang(ctx, k);
	const saved = () => P.evaluate(() => {
		const i = (JSON.parse(localStorage.getItem('lpn_index') || '{}').openId) || 'hover';
		return JSON.parse(localStorage.getItem('lpn_project_' + i) || localStorage.getItem('lpn_project_hover') || 'null');
	});
	const flush = () => a.settle(2600);
	const press = (label) => P.evaluate((t) => {
		const b = Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).find((x) => x.textContent.trim() === t);
		if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); }
		return !!b;
	}, label);
	const dialogShown = () => P.evaluate(() => { const bd = document.getElementById('lpn_dialog_backdrop'); return !!bd && getComputedStyle(bd).display !== 'none'; });
	const closeDialogs = async () => {
		for (let k = 0; k < 4 && await dialogShown(); k++) {
			await P.evaluate(() => { const b = document.querySelector('#lpn_dialog_buttons button'); if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); } });
			await a.settle(400);
		}
	};

	// ---- the scenario ----
	let scnId = 'sz';
	if (mode !== 'alt') {
		const made = await U.createScenarioViaMenu(ctx);
		ok(mode + ': a child scenario was made from the menu and is current', !!made.scenario && made.doc.project.activeScenario === made.scenario.id,
			JSON.stringify(made.scenario && made.scenario.id));
		scnId = made.scenario && made.scenario.id;
	}
	await flush();
	const base0 = await saved();
	const baseNode = (doc, id) => JSON.stringify(byId(doc.nodes, id));
	// Where this scenario keeps a node value: its own overrides, or its Physical alternative.
	const held = (doc, id, prop) => {
		const s = byId(doc.scenarios, scnId) || {};
		const ov = (s.overrides || {})['n:' + id];
		if (ov && Object.prototype.hasOwnProperty.call(ov, prop)) { return ov[prop]; }
		const altId = (s.alternatives || {}).physical, alt = byId(doc.alternatives, altId);
		const av = alt && alt.values && alt.values['n:' + id];
		return av && Object.prototype.hasOwnProperty.call(av, prop) ? av[prop] : undefined;
	};

	// Zoom to fit, so a node under the bottom pane or past the window's edge can be clicked.
	const zoomFit = async () => {
		const t = await L('lpn_tool_zoom_extent');
		await P.evaluate((x) => { const b = Array.from(document.querySelectorAll('button')).find((e) => (e.getAttribute('aria-label') || e.textContent || '').trim() === x); if (b) { b.click(); } }, t);
		await a.settle(600);
	};
	// ---- Properties helpers ----
	const closeProps = async () => {
		await P.evaluate(() => { const b = document.getElementById('lpn_popup_close'); if (b && b.offsetParent) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); } });
		await a.settle(300);
	};
	// The Properties row whose label starts with `text`: its input's value, and whether its gutter
	// carries the override dot.
	const propRow = (text) => P.evaluate((t) => {
		const ls = Array.from(document.querySelectorAll('#lpn_popup_fields label'))
			.filter((x) => x.textContent.replace(/­/g, '').replace(/^\s+/, '').indexOf(t) === 0);
		const l = ls[0];
		if (!l) { return null; }
		const i = l.querySelector('input');
		let dot = !!l.querySelector('.lpn-ovm-dot');
		if (!dot) {
			for (let s = l.previousSibling; s && s.nodeName !== 'BR'; s = s.previousSibling) {
				if (s.nodeType === 1 && (s.matches('.lpn-ovm') || s.querySelector && s.querySelector('.lpn-ovm-dot'))) { dot = !!(s.matches('.lpn-ovm-dot') || s.querySelector('.lpn-ovm-dot')); break; }
			}
		}
		return { value: i ? i.value : null, dot: dot };
	}, text);

	// ---- Tables helpers ----
	const ensurePane = async () => {
		const shown = await P.evaluate(() => { const p = document.getElementById('lpn_pane'); return !!p && getComputedStyle(p).display !== 'none' && !p.classList.contains('lpn-pane-shut') && p.getBoundingClientRect().height > 40; });
		if (!shown) { await a.toolbarClick(await L('lpn_pane_toggle')); await a.settle(700); }
	};
	const tab = async (id) => { await ensurePane(); await P.evaluate((i) => { const t = document.getElementById('lpn_pane_tab_' + i); if (t) { t.click(); } }, id); await a.settle(700); };
	const cellTd = (kind, id, key) => P.evaluateHandle(([k, i, c]) => Array.from(document.querySelectorAll('#lpn_pane_' + k + ' td'))
		.filter((t) => t._lpnPaneId === i && t._lpnPaneKey === c)[0] || null, [kind, id, key]);
	const cell = (kind, id, key) => P.evaluate(([k, i, c]) => {
		const td = Array.from(document.querySelectorAll('#lpn_pane_' + k + ' td')).filter((t) => t._lpnPaneId === i && t._lpnPaneKey === c)[0];
		if (!td) { return null; }
		const inp = td.querySelector('input,select');
		return inp ? inp.value : td.textContent.trim();
	}, [kind, id, key]);
	const num = (s) => (s === null || s === undefined || s === '') ? null : +String(s).replace(/[^0-9eE.+-]/g, '');
	const typeCell = async (kind, id, key, text) => {
		const h = await cellTd(kind, id, key);
		const el = h.asElement();
		if (!el) { return false; }
		await el.scrollIntoViewIfNeeded();
		const inp = await el.$('input');
		if (!inp) { return false; }
		await inp.click();
		await P.keyboard.press('Control+A');
		await P.keyboard.type(text, { delay: 5 });
		await P.keyboard.press('Tab');
		await a.settle(900);
		return true;
	};
	const pasteCell = (kind, id, key, text) => P.evaluate(([k, i, c, tx]) => {
		const td = Array.from(document.querySelectorAll('#lpn_pane_' + k + ' td')).filter((t) => t._lpnPaneId === i && t._lpnPaneKey === c)[0];
		if (!td) { return false; }
		td.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, detail: 1 }));
		td.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, detail: 1 }));
		const dt = new DataTransfer(); dt.setData('text/plain', tx);
		td.closest('table').dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
		return true;
	}, [kind, id, key, text]);

	// ---- Find and replace ----
	const findBox = async (query, prop, value, source) => {
		const open = await P.evaluate(() => { const b = document.getElementById('lpn_find_popup'); return !!b && getComputedStyle(b).display !== 'none'; });
		if (!open) {
			const lbl = await L('lpn_find_menu');
			await P.evaluate((t) => {
				const b = Array.from(document.querySelectorAll('#lpn_toolbar button')).find((x) => (x.getAttribute('aria-label') || x.textContent || '').trim() === t);
				if (b) { b.click(); }
			}, lbl);
			await a.settle(600);
		}
		const q = await P.$('#lpn_find_popup .lpn-find-query');
		await q.click({ clickCount: 3 });
		await P.keyboard.press('Control+A');
		await P.keyboard.type(query, { delay: 2 });
		await P.keyboard.press('Enter');
		await a.settle(700);
		// "Property to change", then (for Elevation on a locatable project) "New value source".
		const pick = (labelText, val) => P.evaluate(([t, v]) => {
			const l = Array.from(document.querySelectorAll('#lpn_find_popup label')).find((x) => x.textContent.trim().indexOf(t) === 0 && x.querySelector('select'));
			const s = l && l.querySelector('select');
			if (!s || !Array.from(s.options).some((o) => o.value === v)) { return false; }
			s.value = v; s.dispatchEvent(new Event('change', { bubbles: true }));
			return true;
		}, [labelText, val]);
		const okProp = await pick(await L('lpn_replace_prop'), prop);
		await a.settle(300);
		let okSrc = true;
		if (source) { okSrc = await pick(await L('lpn_replace_source'), source); await a.settle(300); }
		if (value !== undefined) {
			const vl = await L('lpn_replace_value');
			await P.evaluate(([t, v]) => {
				const l = Array.from(document.querySelectorAll('#lpn_find_popup label')).find((x) => x.textContent.trim().indexOf(t) === 0 && x.querySelector('input'));
				const i = l.querySelector('input'); i.value = v; i.dispatchEvent(new Event('input', { bubbles: true }));
			}, [vl, String(value)]);
		}
		const rep = await L('lpn_replace_btn'), apply = await L('lpn_replace_apply');
		await P.evaluate((t) => { const b = Array.from(document.querySelectorAll('#lpn_find_popup button')).find((x) => x.textContent.trim() === t); if (b) { b.click(); } }, rep);
		await a.settle(500);
		const applied = await P.evaluate((t) => { const b = Array.from(document.querySelectorAll('#lpn_find_popup button')).find((x) => x.textContent.trim() === t); if (b) { b.click(); return true; } return false; }, apply);
		await a.settle(900);
		// A DEM replace asks to send first, unless consent is already given (the stub gives it).
		if (await dialogShown()) { await press(await L('lpn_dialog_ok')); await a.settle(900); }
		return { okProp, okSrc, applied };
	};

	// ================= THE DOORS =================
	const EXPECT = {};   // node id -> the elevation this scenario should now hold
	const doorBase = {}; // door -> was Base unchanged
	const checkDoor = async (door, id, prop, want, before) => {
		await flush();
		const now = await saved();
		const baseSame = baseNode(now, id) === baseNode(before, id);
		ok(mode + ' ' + door + ': Base\'s ' + prop + ' of node ' + id + ' is unchanged', baseSame,
			'base now ' + JSON.stringify((byId(now.nodes, id) || {})[prop]) + ', was ' + JSON.stringify((byId(before.nodes, id) || {})[prop]));
		const h = held(now, id, prop);
		ok(mode + ' ' + door + ': the scenario holds ' + prop + ' = ' + want, near(+h, want, 0.011), JSON.stringify(h));
		doorBase[door] = baseSame;
		return now;
	};

	// D1 Properties Elevation field, junction 3.
	let before = await saved();
	await U.openProperties(ctx, 'node', '3');
	await U.typeProperty(ctx, await L('lpn_field_elev'), '1060');
	let row = await propRow(await L('lpn_field_elev'));
	ok(mode + ' D1: Properties shows 1060 with the override dot', !!row && num(row.value) === 1060 && row.dot, JSON.stringify(row));
	await closeProps();
	await checkDoor('D1 Properties', '3', 'elev', 1060, before); EXPECT['3'] = 1060;

	// D2 a Tables cell, junction 4.
	before = await saved();
	await tab('junctions');
	const typed = await typeCell('junctions', '4', 'elev', '260');
	ok(mode + ' D2: the Junctions table has an Elevation cell for 4', typed);
	await checkDoor('D2 Tables cell', '4', 'elev', 260, before); EXPECT['4'] = 260;

	// D3 Find and replace, typed value, junction 5.
	before = await saved();
	let fr = await findBox("Junction.ID equal to '5'", 'elev', '562');
	ok(mode + ' D3: Find and replace offered Elevation and applied', fr.okProp && fr.applied, JSON.stringify(fr));
	await checkDoor('D3 Find and replace', '5', 'elev', 562, before); EXPECT['5'] = 562;

	// D4 a paste into the Tables pane, junction 6.
	before = await saved();
	await tab('junctions');
	ok(mode + ' D4: the paste reached the Elevation cell of 6', await pasteCell('junctions', '6', 'elev', '563'));
	await a.settle(900);
	await checkDoor('D4 Tables paste', '6', 'elev', 563, before); EXPECT['6'] = 563;

	// D5 Find and replace From Mapbox DEM, junction 7.
	before = await saved();
	fr = await findBox("Junction.ID equal to '7'", 'elev', undefined, 'dem');
	ok(mode + ' D5: Find and replace offered Mapbox DEM as the source and applied', fr.okProp && fr.okSrc && fr.applied, JSON.stringify(fr));
	await a.settle(1200);
	await checkDoor('D5 Find and replace DEM', '7', 'elev', DEM_FT, before); EXPECT['7'] = DEM_FT;
	await P.evaluate(() => { const b = document.getElementById('lpn_find_popup'); if (b) { b.style.display = 'none'; } });

	// D6 Properties Use DEM, junction 8.
	before = await saved();
	await U.openProperties(ctx, 'node', '8');
	const use = await L('lpn_elev_dem_use');
	const pressed = await P.evaluate((t) => { const b = Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-elev-dem button')).find((x) => x.textContent.trim() === t); if (b) { b.click(); return true; } return false; }, use);
	await a.settle(1200);
	if (await dialogShown()) { await press(await L('lpn_dialog_ok')); await a.settle(1200); }
	ok(mode + ' D6: Properties has a Use DEM button', pressed);
	row = await propRow(await L('lpn_field_elev'));
	ok(mode + ' D6: Properties shows the DEM elevation with the override dot', !!row && near(num(row.value), DEM_FT, 0.011) && row.dot, JSON.stringify(row));
	await closeProps();
	await checkDoor('D6 Use DEM', '8', 'elev', DEM_FT, before); EXPECT['8'] = DEM_FT;

	// D8 a tank's Base elevation, tank 26.
	before = await saved();
	await closeProps(); await zoomFit();
	await U.openProperties(ctx, 'node', '26');
	await U.typeProperty(ctx, await L('lpn_field_tank_base_elev'), '330');
	row = await propRow(await L('lpn_field_tank_base_elev'));
	ok(mode + ' D8: Properties shows Base elevation 330 with the override dot', !!row && num(row.value) === 330 && row.dot, JSON.stringify(row));
	await closeProps();
	await checkDoor('D8 tank base', '26', 'bottomElev', 330, before);

	// D9 drag junction 9 with the DEM as the elevation source.
	before = await saved();
	await zoomFit();
	const at = await P.evaluate(() => {
		const e = Array.from(document.querySelectorAll('#lpn_canvas [data-node="9"]')).filter((x) => x.getBoundingClientRect().width > 0)[0];
		const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
	});
	await P.mouse.move(at.x, at.y); await P.mouse.down();
	for (let k = 1; k <= 8; k++) { await P.mouse.move(at.x + 5 * k, at.y + 3 * k); await P.waitForTimeout(30); }
	await P.mouse.up();
	await a.settle(1500);
	await flush();
	let now = await saved();
	const b9 = byId(before.nodes, '9'), n9 = byId(now.nodes, '9');
	ok(mode + ' D9: Base\'s junction 9 is unchanged by the drag (elevation and position)', JSON.stringify(n9) === JSON.stringify(b9),
		JSON.stringify({ was: [b9.x, b9.y, b9.elev], now: [n9.x, n9.y, n9.elev] }));
	ok(mode + ' D9: the drag was recorded in the scenario', held(now, '9', 'x') !== undefined || held(now, '9', 'y') !== undefined);
	doorBase['D9 drag, DEM'] = JSON.stringify(n9) === JSON.stringify(b9);

	// D7 a new junction drawn in the scenario, elevation source Mapbox DEM.
	before = await saved();
	const ids0 = before.nodes.map((n) => n.id);
	await zoomFit();
	await a.makeEdit();
	await a.settle(1500);
	await flush();
	now = await saved();
	const born = now.nodes.filter((n) => ids0.indexOf(n.id) < 0)[0];
	ok(mode + ' D7: a junction was drawn', !!born, born && born.id);
	if (born) {
		ok(mode + ' D7: the DEM was asked for the new junction', (await P.evaluate(() => window.__demCalls)) > 0);
		ok(mode + ' D7: Base holds no elevation for a junction drawn in the scenario', born.elev === undefined, JSON.stringify(born.elev));
		ok(mode + ' D7: the scenario holds the DEM elevation for it', near(+held(now, born.id, 'elev'), DEM_FT, 0.011), JSON.stringify(held(now, born.id, 'elev')));
		doorBase['D7 new node, DEM'] = born.elev === undefined;
	}

	// ================= SHOWN, SOLVED, EXPORTED =================
	await closeDialogs();
	await P.evaluate(() => { const b = document.getElementById('lpn_find_popup'); if (b) { b.style.display = 'none'; } });
	await tab('junctions');
	await a.settle(1500);
	for (const id of Object.keys(EXPECT)) {
		const e = num(await cell('junctions', id, 'elev')), hd = num(await cell('junctions', id, 'head')), pr = num(await cell('junctions', id, 'pressure'));
		ok(mode + ': Tables shows junction ' + id + '\'s scenario elevation ' + EXPECT[id], near(e, EXPECT[id], 0.011), String(e));
		ok(mode + ': ...and the solve stands on it (pressure = head - elevation)', hd !== null && pr !== null && near(pr, (hd - EXPECT[id]) * 0.433515, 0.2),
			JSON.stringify({ head: hd, pressure: pr, want: hd === null ? null : +((hd - EXPECT[id]) * 0.433515).toFixed(2) }));
	}

	// The slope length (Task 643). Pipe 3 runs 2 -> 3 and pipe 4 runs 3 -> 4; pipe 29 runs 25 -> 26.
	const lenWant = (doc, lid, za, zb) => {
		const l = byId(doc.links, lid), n1 = byId(doc.nodes, l.from), n2 = byId(doc.nodes, l.to);
		const zb0 = (n) => (n.type === 'tank' && typeof n.bottomElev === 'number') ? n.bottomElev : n.elev;
		const h2 = l._length * l._length - Math.pow(zb0(n2) - zb0(n1), 2);
		return Math.sqrt(h2 + Math.pow(zb - za, 2));
	};
	await tab('pipes');
	await a.settle(800);
	const docNow = await saved();
	const pipesBase = { '3': byId(base0.links, '3')._length, '4': byId(base0.links, '4')._length, '29': byId(base0.links, '29')._length };
	const lenScn = { '3': lenWant(docNow, '3', 100, 1060), '4': lenWant(docNow, '4', 1060, 260), '29': lenWant(docNow, '29', 230, 330) };
	for (const lid of ['3', '4', '29']) {
		ok(mode + ': Base\'s stored length of pipe ' + lid + ' is unchanged', byId(docNow.links, lid)._length === pipesBase[lid],
			byId(docNow.links, lid)._length + ' vs ' + pipesBase[lid]);
		const shown = num(await cell('pipes', lid, 'length'));
		ok(mode + ': Tables shows pipe ' + lid + '\'s slope length from the scenario\'s elevations (' + lenScn[lid].toFixed(1) + ')',
			near(shown, lenScn[lid], 0.6), String(shown));
	}
	// Properties says the same.
	await zoomFit();
	await U.openProperties(ctx, 'link', '3');
	row = await propRow(await L('lpn_field_length'));
	ok(mode + ': Properties shows pipe 3\'s scenario slope length', !!row && near(num(row.value), lenScn['3'], 0.6), JSON.stringify(row));
	await closeProps();
	await tab('pipes');
	// The solve: pipe 3's head loss and flow, read back through EPANET's Hazen-Williams formula
	// (US: h = 4.727 C^-1.852 d^-4.871 L q^1.852, q in ft3/s and d in ft), give the length it was
	// solved with. Base's and the scenario's differ by a quarter, far beyond two printed decimals.
	{
		const hl = num(await cell('pipes', '3', 'headloss')), q = Math.abs(num(await cell('pipes', '3', 'flow')));
		const used = (hl && q) ? Math.abs(hl) / (4.727 * Math.pow(100, -1.852) * Math.pow(8 / 12, -4.871) * Math.pow(q / 448.831, 1.852)) : null;
		ok(mode + ': the solve measured pipe 3 at the scenario\'s slope length (from its head loss and flow)', used !== null && Math.abs(used - lenScn['3']) / lenScn['3'] < 0.03,
			JSON.stringify({ headloss: hl, flow: q, impliedLength: used && +used.toFixed(1), want: +lenScn['3'].toFixed(1), base: pipesBase['3'] }));
	}
	// The .inp export from the scenario.
	const got = [];
	const onDl = (dl) => got.push(dl);
	P.on('download', onDl);
	await closeDialogs();
	await a.menuClickSub(await L('lpn_file_export_menu'), await L('lpn_file_export_item_inp'), 'file');
	for (let i = 0; i < 60 && got.length < 1; i++) { await P.waitForTimeout(100); }
	await P.waitForTimeout(600);
	P.off('download', onDl);
	const inp = got.length ? inpText(fs.readFileSync(await got[0].path())) : null;
	ok(mode + ': an .inp was exported from the scenario', !!inp);
	if (inp) {
		const J = inpRows(inp, 'JUNCTIONS'), T = inpRows(inp, 'TANKS'), PI = inpRows(inp, 'PIPES');
		for (const id of Object.keys(EXPECT)) {
			ok(mode + ': the export writes junction ' + id + '\'s scenario elevation', J[id] && near(+J[id][1], EXPECT[id], 0.011), JSON.stringify(J[id]));
		}
		ok(mode + ': the export writes tank 26\'s scenario base elevation', T['26'] && near(+T['26'][1], 330, 0.011), JSON.stringify(T['26']));
		for (const lid of ['3', '4', '29']) {
			ok(mode + ': the export writes pipe ' + lid + '\'s scenario slope length', PI[lid] && near(+PI[lid][3], lenScn[lid], 0.6), JSON.stringify(PI[lid]) + ' want ' + lenScn[lid].toFixed(2));
		}
	}
	await closeDialogs();
	// ---- and Base keeps its own: switched to from the Scenarios button, as a person does ----
	const baseName = byId(docNow.scenarios, 'base').name;
	await P.click('#lpn_scenario_btn');
	await P.waitForSelector('#lpn_menu_popup', { state: 'visible' });
	const switched = await P.evaluate((nm) => {
		const r = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row'))
			.find((x) => x.textContent.trim().replace(/^✓\s*/, '').replace(/\s*\(\d+\)$/, '') === nm);
		if (r) { r.click(); }
		return !!r;
	}, baseName);
	if (!switched) { await P.keyboard.press('Escape'); }
	await a.settle(1500);
	await flush();
	ok(mode + ': switched to Base from the Scenarios button', switched && (await saved()).project.activeScenario === 'base');
	await tab('junctions');
	for (const id of Object.keys(EXPECT)) {
		const e = num(await cell('junctions', id, 'elev')), hd = num(await cell('junctions', id, 'head')), pr = num(await cell('junctions', id, 'pressure'));
		const want = byId(base0.nodes, id).elev;
		ok(mode + ': in Base, junction ' + id + ' shows and solves on Base\'s elevation ' + want, near(e, want, 0.011) && near(pr, (hd - want) * 0.433515, 0.2),
			JSON.stringify({ elev: e, head: hd, pressure: pr }));
	}
	await tab('pipes');
	for (const lid of ['3', '4', '29']) {
		const shown = num(await cell('pipes', lid, 'length'));
		ok(mode + ': in Base, pipe ' + lid + ' shows Base\'s own length ' + pipesBase[lid].toFixed(2), near(shown, pipesBase[lid], 0.011), String(shown));
	}
	ok(mode + ': no uncaught page errors', errors.length === 0, errors.slice(0, 3).join(' | '));
	console.log('  doors that left Base alone: ' + JSON.stringify(doorBase));
	await a.close();
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
