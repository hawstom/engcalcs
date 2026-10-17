// THE HOVER CARD: EVERY FIELD SETTINGS > LABELS OFFERS FOR THE ASSET, FORMATTED PER SETTINGS, AT ANY
// SCALE, FIT OR NOT, ONLY ON THE ELEMENT ITSELF, NEVER OFF-SCREEN (ROADMAP Task 773; Tom, 2026-10-16
// and 2026-10-17), in a real Chromium. Run with:
//   node dev/lpn-spike/hover-card-browser-harness.js
//
// WHAT IT PROVES.
//   1. Net1 (a valve, a custom property and a Description added; a non-default tick set; pressure at
//      3 decimals): the junction, pipe, valve, pump and customer cards each hold EXACTLY the Labels
//      list's fields for that asset, as "Name: value" with the label's formatting (Length 5280', not
//      5280.00; Pressure to 3 decimals), ticked or not; and none of the Properties box's extras
//      (position, custom property, Is active, From/To, pipe type). Status reads Open or Closed.
//   2. NO DESCRIPTION ROW: a node and a customer that have one show none (Tom, 2026-10-17); Tag stays.
//   3. REST ON A LABEL, NO CARD: the pointer resting on the asset's map label opens nothing; on the
//      symbol or line it does.
//   4. WHICH BOXES ARE TICKED MAKES NO DIFFERENCE: tick set, nothing ticked, everything ticked: equal.
//   5. THE LABELING THRESHOLD DOES NOT HIDE THE CARD.
//   6. NEVER OFF-SCREEN: inside the window at 1280x520 and at a 390x740 phone width.
//   7. RIGHT TO LEFT: on ?lang=ar direction rtl, alignment start, values in isolates.
//   8. DELETE AND DRAWING modes still show it and a press still acts.
//   9. HOVER COSTS NOTHING IN THE LABEL LAYER, the card takes no pointer events, a press selects
//      through it, sliding waits for rest, Esc / Ctrl+Z dismiss it.
//  10. THE SETTING: the real control; unticked, no card and lpn_hovercard=off is the only thing stored.
//  11. ?lang=es: the Spanish card differs from the English one. No page errors anywhere.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_HOVER_CARD_BROWSER_LOCKED';
const NAME = 'hover-card-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
}

let checks = 0, failures = 0;
const world = {};
let PC = {};   // the page's own strings, so no English wording is pinned here
function isSubsequence(sub, full) { let i = 0; (full || []).forEach((t) => { if (i < (sub || []).length && sub[i] === t) { i++; } }); return !!sub && i === sub.length; }
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

const NODE_FIELDS = ['id', 'desc', 'tag', 'demand', 'elev', 'initQuality', 'demandActual', 'level', 'head', 'pressure', 'quality'];
const CUST_FIELDS = ['id', 'demandActual', 'demand', 'desc', 'tag', 'count'];
const LINK_FIELDS = ['id', 'desc', 'tag', 'length', 'diameter', 'roughness', 'km', 'initStatus', 'bulkCoeff', 'wallCoeff',
	'flow', 'velocity', 'headloss', 'gradient', 'friction', 'rate', 'quality', 'status'];

// The project this harness loads states the id prefix (N, L); the page prints it on the map label and
// on the card, so the expected id is that prefix plus the bare id, read from the project, not typed.
const PFX = (function () {
	const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8'));
	const p = ((d.labelSettings || {}).prefix) || {};
	return { node: (p.node || {}).id || '', link: (p.link || {}).id || '' };
}());

function projectText(tick, maxW, longDesc) {
	const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8'));
	d.settings = Object.assign({}, d.settings, { labelMaxWidth: maxW === undefined ? null : maxW });
	d.labelSettings = d.labelSettings || {};
	d.labelSettings.node = {}; NODE_FIELDS.forEach((k) => { d.labelSettings.node[k] = tick.node.indexOf(k) >= 0; });
	d.labelSettings.link = {}; LINK_FIELDS.forEach((k) => { d.labelSettings.link[k] = tick.link.indexOf(k) >= 0; });
	d.labelSettings.customer = {}; CUST_FIELDS.forEach((k) => { d.labelSettings.customer[k] = (tick.customer || []).indexOf(k) >= 0; });
	d.labelSettings.decimals = d.labelSettings.decimals || {};
	d.labelSettings.decimals.node = Object.assign({}, d.labelSettings.decimals.node, { pressure: 3 });
	// One loose service with a stated description, tag and count, so the customer card has fields.
	d.customers = [{ id: 'M1', demand: 12.5, count: 3, link: null, x: 25, y: 60, desc: 'Main Street school', tag: 'inst' }];
	// A valve (pipe 122 made a PRV), a custom property on junction 11, pipe 111 and the pump, and a
	// Description on junction 11 (8 lines when asked).
	d.settings.customProps = [{ key: 'custom_rt', label: 'Route', applies: 'J L V P T R', validate: 'text' }];
	const lk = (id) => d.links.find((l) => l.id === id), nd = (id) => d.nodes.find((n) => n.id === id);
	Object.assign(lk('122'), { type: 'valve', valveType: 'PRV', _setting: 45, _status: 'open' });
	lk('111')._custom_rt = 'RT9'; lk('9')._custom_rt = 'RT3'; nd('11')._custom_rt = 'RT0';
	nd('11').tag = 'T1';
	nd('11').desc = longDesc ? Array.from({ length: 8 }, (_, i) => 'Line number ' + (i + 1) + ' of the description').join('\n') : 'Line one\nLine two';
	return JSON.stringify(d);
}

async function openNet1(Session, browser, tick, lang, maxW, view, longDesc) {
	const a = await Session.open(browser, NAME, Object.assign({ serviceWorkers: 'block' }, view ? { viewport: view } : {}));
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	// Counts every text measurement from before the page's first script runs.
	await a.context.addInitScript(() => {
		window.__bboxCalls = 0;
		const real = SVGGraphicsElement.prototype.getBBox;
		SVGGraphicsElement.prototype.getBBox = function () { window.__bboxCalls++; return real.apply(this, arguments); };
	});
	const q = 'Looped-Network.php?ec_nolog=1' + (lang ? '&lang=' + lang : '');
	await a.goto(q);
	await a.page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); }, projectText(tick, maxW, longDesc));
	await a.reload();
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.settle(2500);
	return a;
}

const TICK = { node: ['id', 'elev', 'demand'], link: ['id', 'length', 'diameter'], customer: ['id'] };
const ALL = { node: NODE_FIELDS, link: LINK_FIELDS, customer: CUST_FIELDS };
const NONE = { node: [], link: [], customer: [] };
const TICK_ES = { node: ['id'], link: ['id', 'status', 'length'], customer: ['id'] };

function centreOf(page, selector) {
	return page.evaluate((sel) => {
		const e = document.querySelector(sel);
		if (!e) { return null; }
		const b = e.getBoundingClientRect();
		return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
	}, selector);
}
function cardLines(page) {
	return page.evaluate(() => {
		const t = document.querySelector('.tooltip.lpn-hovercard .tooltip-inner');
		if (!t) { return null; }
		return Array.from(t.querySelectorAll('.lpn-hovercard-row')).map((r) => r.textContent);
	});
}
// A point ON the link's line (the middle of its bounding box can be off a slanted line).
function onLink(page, id, frac) {
	return page.evaluate(([i, f]) => {
		const e = document.querySelector('#lpn_canvas [data-link="' + i + '"]');
		if (!e || !e.getPointAtLength) { return null; }
		const m = e.getScreenCTM(), q = e.getPointAtLength(e.getTotalLength() * f);
		return { x: m.a * q.x + m.c * q.y + m.e, y: m.b * q.x + m.d * q.y + m.f };
	}, [id, frac || 0.5]);
}
// Rests on the link at several points along it until a card opens (a symbol may sit mid-line).
async function restOnLink(a, id) {
	for (const f of [0.5, 0.3, 0.7, 0.2, 0.8]) {
		await away(a);
		await rest(a, await onLink(a.page, id, f));
		const c = await cardLines(a.page);
		if (c) { return c; }
	}
	return null;
}
function cardBox(page) {
	return page.evaluate(() => {
		const t = document.querySelector('.tooltip.lpn-hovercard');
		if (!t) { return null; }
		const b = t.getBoundingClientRect();
		return { l: b.left, t: b.top, r: b.right, b: b.bottom, vw: window.innerWidth, vh: window.innerHeight };
	});
}
const names = (lines) => (lines || []).map((t) => t.split(': ')[0]);
const sameSet = (a, b) => JSON.stringify(a.slice().sort()) === JSON.stringify(b.slice().sort());
const has = (lines, re) => !!lines && lines.some((t) => re.test(t));
// The map label's rows: a tspan that carries an x starts a row, one without flows on from it.
function labelRows(page, nodeId) {
	return page.evaluate((id) => {
		const t = document.querySelector('text[data-nodelbl="' + id + '"]');
		if (!t) { return null; }
		const rows = [];
		Array.from(t.children).forEach((s) => {
			if (s.tagName !== 'tspan') { return; }
			if (s.hasAttribute('x') || !rows.length) { rows.push(''); }
			rows[rows.length - 1] += s.textContent;
		});
		return rows;
	}, nodeId);
}
async function rest(a, p) {
	await a.page.mouse.move(p.x - 40, p.y - 40);
	await a.page.mouse.move(p.x, p.y, { steps: 4 });
	await a.page.waitForTimeout(900);
}
async function away(a) {
	await a.page.mouse.move(40, 400);
	await a.page.waitForTimeout(300);
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		// ---- the subject: a non-default tick set ----
		console.log('=== subject: node ID, Elevation, Demand; pipe ID, Length, Diameter ===');
		const a = await openNet1(Session, browser, TICK);
		try {
			PC = await a.page.evaluate(() => EngCalcs.pageConfig);
			const mapRows = await labelRows(a.page, '11');
			ok('on the map, junction 11 shows exactly its three ticked rows', mapRows && mapRows.length === 3, JSON.stringify(mapRows));
			const p = await centreOf(a.page, '#lpn_canvas circle[data-node="11"]');
			ok('junction 11 is on screen', !!p);

			// 1 + 2: the card
			await a.page.evaluate(() => { window.__bboxCalls = 0; window.__mut = 0;
				window.__mo = new MutationObserver((rs) => { rs.forEach((r) => { if (r.type === 'childList' && (r.addedNodes.length || r.removedNodes.length)) { window.__mut++; } else if (r.type === 'characterData') { window.__mut++; } }); });
				window.__mo.observe(document.getElementById('lpn_canvas'), { childList: true, subtree: true, characterData: true });
			});
			await rest(a, p);
			const lines = await cardLines(a.page);
			ok('resting on junction 11 shows a card', !!lines, JSON.stringify(lines));
			ok('...led by the ID the map label shows', lines && lines[0] === 'ID: ' + PFX.node + '11', JSON.stringify(lines && lines[0]));
			ok('...a node WITH a Description shows no Description row (Tom: omit it), and still shows Tag', !has(lines, /^Description/) && has(lines, /^Tag: T1$/), JSON.stringify(lines));
			ok('...exactly the Labels list for a junction, ticked or not', sameSet(names(lines), ['ID', 'Tag', 'Base demand', 'Elevation', 'Initial quality', 'Demand', 'Head', 'Pressure', 'Chlorine concentration']), JSON.stringify(names(lines)));
			ok('...formatted as the label is: Elevation 710.00, Pressure to its three decimals', has(lines, /^Elevation: 710\.00$/) && has(lines, /^Pressure: \d+\.\d{3}$/), JSON.stringify(lines));
			ok('...and none of the Properties box\'s extras (position, custom property, Is active)', !has(lines, /^(X|Y|Route|Is active)/), JSON.stringify(lines));
			world.node = lines;
			const anchorTitle = await a.page.evaluate(() => { const e = document.querySelector('.lpn-hovercard-anchor'); return e ? (e.getAttribute('title') || '') + (e.getAttribute('data-bs-original-title') || '') : 'none'; });
			ok('the card is the styled tip on an untitled anchor, so no native tooltip can show', anchorTitle === '', JSON.stringify(anchorTitle));
			const cost = await a.page.evaluate(() => ({ bbox: window.__bboxCalls, mut: window.__mut }));
			ok('hovering ran no label pass: no text measured, nothing added to or removed from the drawing', cost.bbox === 0 && cost.mut === 0, JSON.stringify(cost));
			const pe = await a.page.evaluate(() => getComputedStyle(document.querySelector('.tooltip.lpn-hovercard')).pointerEvents);
			ok('the card takes no pointer events', pe === 'none', pe);

			// REST ON THE LABEL: no card. (The label's centre is a hit on the label, not the symbol.)
			await away(a);
			const lp0 = await centreOf(a.page, 'text[data-nodelbl="11"]');
			ok('junction 11\'s map label is on screen', !!lp0);
			if (lp0) {
				await rest(a, lp0);
				ok('resting on the map label opens no card', (await cardLines(a.page)) === null);
				await away(a);
				await rest(a, p);
				ok('...resting on the symbol does', (await cardLines(a.page)) !== null);
			}
			// the other asset types, before any press opens the bottom pane over them
			await away(a);
			const vl = await restOnLink(a, '122');
			ok('resting on valve 122 shows its Labels fields: Diameter, and Status Closed', has(vl, /^Diameter: 6"$/) && has(vl, /^Status: Closed$/) && !has(vl, /^(Valve type|Pressure setting)/), JSON.stringify(vl));
			await away(a);
			const ul = await restOnLink(a, '9');
			ok('resting on pump 9 shows its Labels fields: Initial status, Head loss (the pump head), Status', has(ul, /^Initial status: Open$/) && has(ul, /^Head loss: /) && has(ul, /^Status: Open$/) && !has(ul, /^(Pump head curve|Route)/), JSON.stringify(ul));
			await away(a);

			// 5: a click goes through, and the card goes
			await rest(a, p);
			await a.page.mouse.down(); await a.page.mouse.up();
			await a.page.waitForTimeout(250);
			const sel = await a.page.evaluate(() => document.querySelectorAll('#lpn_canvas .lpn-selected').length > 0);
			ok('a press on the junction selects it with the card up', sel);
			ok('...and the card is gone after the press', (await cardLines(a.page)) === null);
			await away(a);
			ok('leaving the junction leaves no card', (await cardLines(a.page)) === null);

			// the pipe
			const pp = await centreOf(a.page, '#lpn_canvas [data-link="111"]');
			if (pp) {
				await rest(a, pp);
				const pl = await cardLines(a.page);
				const lblText = await a.page.evaluate(() => { const t = document.querySelector('text[data-linklbl="111"]'); return t ? t.textContent.replace(/\s+/g, '') : null; });
				ok('resting on pipe 111 shows its card', !!pl && pl.length > 10, JSON.stringify(pl));
				ok('...led by the ID the map label shows', pl && pl[0] === 'ID: ' + PFX.link + '111', JSON.stringify(pl && pl[0]));
				ok('...Length and Diameter are told apart by name, formatted as the label is', has(pl, /^Length: 5280'$/) && has(pl, /^Diameter: 10"$/), JSON.stringify(pl));
				ok('...exactly the Labels list for a pipe', sameSet(names(pl), ['ID', 'Length', 'Diameter', 'Roughness, C', PC.lpn_field_km_short, 'Initial status', PC.lpn_reaction_bulk, PC.lpn_reaction_wall, 'Flow', 'Velocity', 'Head loss', PC.lpn_result_gradient, 'Friction factor', 'Reaction rate', 'Average Chlorine concentration', 'Status']), JSON.stringify(names(pl)));
				ok('...Status says Open', has(pl, /^Status: Open$/), JSON.stringify(pl));
				world.link = pl;
				await away(a);
			}

			// 8: sliding along a pipe, the card waits for the pointer to come to REST, then opens at the
			// resting point; a further move takes it down. (Perry's review.)
			const pts = await a.page.evaluate(() => {
				const e = document.querySelector('#lpn_canvas [data-link="111"]');
				if (!e || !e.getPointAtLength) { return null; }
				const L = e.getTotalLength(), m = e.getScreenCTM(), out = [];
				for (let k = 0; k <= 40; k++) {
					const q = e.getPointAtLength(L * (0.15 + 0.7 * k / 40));
					out.push({ x: m.a * q.x + m.c * q.y + m.e, y: m.b * q.x + m.d * q.y + m.f });
				}
				return out;
			});
			ok('pipe 111 can be walked along', !!pts && pts.length > 10);
			if (pts) {
				await a.page.mouse.move(pts[0].x, pts[0].y);
				let seen = false, last = pts[0];
				for (const q of pts) {
					await a.page.mouse.move(q.x, q.y);
					await a.page.waitForTimeout(40);
					if ((await cardLines(a.page)) !== null) { seen = true; }
					last = q;
				}
				ok('sliding along the pipe (about 1.6 s of steady motion) shows no card', !seen);
				await a.page.waitForTimeout(900);
				const rl = await cardLines(a.page);
				ok('...and once the pointer has rested, the card opens', !!rl);
				const at = await a.page.evaluate(() => { const e = document.querySelector('.lpn-hovercard-anchor'); const b = e.getBoundingClientRect(); return { x: b.left, y: b.top }; });
				ok('...at the resting point, not behind', Math.abs(at.x - last.x) <= 6 && Math.abs(at.y - last.y) <= 6, JSON.stringify({ at, last }));
				const far = pts[Math.max(0, pts.length - 12)];
				await a.page.mouse.move(far.x, far.y, { steps: 3 });
				await a.page.waitForTimeout(400);
				ok('moving again takes the card down', (await cardLines(a.page)) === null);
				await away(a);
			}

			// 9: Esc and Ctrl+Z dismiss a standing card
			for (const key of ['Escape', 'Control+z']) {
				await rest(a, p);
				ok('(' + key + ') a card is standing', (await cardLines(a.page)) !== null);
				await a.page.keyboard.press(key);
				await a.page.waitForTimeout(400);
				ok('(' + key + ') ...and the key takes it down', (await cardLines(a.page)) === null);
				await away(a);
			}

			// 6: the setting, through the real control
			await a.toolbarClick(await a.lang('lpn_tool_settings'));
			await a.settle(500);
			const rowText = await a.lang('lpn_settings_hover_card');
			const box = a.page.locator('label.lpn-set-row', { hasText: rowText }).first();
			ok('Settings has the row, named by its key', (await box.count()) === 1);
			await box.scrollIntoViewIfNeeded().catch(() => {});
			const before = await a.page.evaluate(() => localStorage.getItem('lpn_project_hover'));
			ok('on by default, and nothing stored for it', (await box.locator('input').isChecked()) && (await a.page.evaluate(() => localStorage.getItem('lpn_hovercard'))) === null);
			await box.locator('input').click();
			await a.settle(300);
			ok('unticked: the browser holds lpn_hovercard=off', (await a.page.evaluate(() => localStorage.getItem('lpn_hovercard'))) === 'off');
			ok('...and the stored project did not change', (await a.page.evaluate(() => localStorage.getItem('lpn_project_hover'))) === before);
			await rest(a, p);
			ok('with it off, resting on the junction shows no card', (await cardLines(a.page)) === null);
			await box.locator('input').click();
			await a.settle(300);
			ok('ticked again: the key is removed', (await a.page.evaluate(() => localStorage.getItem('lpn_hovercard'))) === null);
			await rest(a, p);
			ok('...and the card returns', (await cardLines(a.page)) !== null);
			ok('no page errors', !a.errors.length, (a.errors[0] || '').slice(0, 200));
		} finally { await a.close(); }

		// ---- the tick set makes no difference ----
		console.log('=== nothing ticked, and everything ticked ===');
		for (const [name, tk] of [['nothing ticked', NONE], ['everything ticked', ALL]]) {
			// Every label drawn would cover the neighbours (a label is a hit target), so the labeling
			// threshold hides them; the card does not depend on them.
			const n0 = await openNet1(Session, browser, tk, undefined, 1);
			try {
				const p0 = await centreOf(n0.page, '#lpn_canvas circle[data-node="11"]');
				// With every label drawn, a label of a neighbour can lie over the circle's centre; try
				// points across the circle until the card names junction 11.
				let jl = null;
				for (const [dx, dy] of [[0, 0], [4, 4], [-4, 4], [4, -4], [-4, -4], [0, 6], [6, 0], [0, -8], [-8, 0], [0, 10], [10, 0]]) {
					await away(n0);
					await rest(n0, { x: p0.x + dx, y: p0.y + dy });
					jl = await cardLines(n0.page);
					if (jl && jl[0] === world.node[0]) { break; }
				}
				ok(name + ': the junction card is line for line the same', JSON.stringify(jl) === JSON.stringify(world.node), JSON.stringify(jl));
				await away(n0);
				const p1 = await centreOf(n0.page, '#lpn_canvas [data-link="111"]');
				await rest(n0, p1);
				ok(name + ': ...and the pipe card', JSON.stringify(await cardLines(n0.page)) === JSON.stringify(world.link), JSON.stringify(await cardLines(n0.page)));
				await away(n0);
				const p2 = await centreOf(n0.page, '#lpn_canvas .lpn-meter[data-cust="M1"]');
				await rest(n0, p2);
				const cl = await cardLines(n0.page);
				if (name === 'nothing ticked') { world.cust = cl; }
				ok(name + ': ...and the customer card has every field', !!cl && sameSet(names(cl), ['ID', 'Tag', 'Base demand', PC.lpn_field_meter_count, 'Demand']) && !has(cl, /^Description/) && has(cl, /^Number of services: 3$/), JSON.stringify(cl));
				if (name !== 'nothing ticked') { ok('...the same as with nothing ticked', JSON.stringify(cl) === JSON.stringify(world.cust)); }
				ok('no page errors (' + name + ')', !n0.errors.length, (n0.errors[0] || '').slice(0, 200));
			} finally { await n0.close(); }
		}

		// ---- the labeling threshold hides the map's labels, not the card ----
		console.log('=== labels hidden by the labeling threshold ===');
		const hz = await openNet1(Session, browser, TICK, undefined, 1);
		try {
			const hidden = await hz.page.evaluate(() => document.getElementById('lpn_canvas').classList.contains('lpn-labels-hidden'));
			ok('at this view the map draws no labels (the threshold hides them)', hidden);
			const ph = await centreOf(hz.page, '#lpn_canvas circle[data-node="11"]');
			await rest(hz, ph);
			const lh = await cardLines(hz.page);
			ok('...yet resting on junction 11 shows every field', JSON.stringify(lh) === JSON.stringify(world.node), JSON.stringify(lh));
			await away(hz);
			const pph = await centreOf(hz.page, '#lpn_canvas [data-link="111"]');
			await rest(hz, pph);
			const lph = await cardLines(hz.page);
			ok('...and on pipe 111', JSON.stringify(lph) === JSON.stringify(world.link), JSON.stringify(lph));
			ok('no page errors (threshold)', !hz.errors.length, (hz.errors[0] || '').slice(0, 200));
		} finally { await hz.close(); }

		// ---- Delete mode and drawing ----
		console.log('=== Delete and Pipe modes ===');
		const dm = await openNet1(Session, browser, TICK);
		try {
			const linkCount = () => dm.page.evaluate(() => new Set(Array.from(document.querySelectorAll('#lpn_canvas [data-link]')).map((e) => e.dataset.link)).size);
			const links0 = await linkCount();
			await dm.toolbarClick(await dm.lang('lpn_tool_delete'));
			await dm.settle(300);
			const pd = await centreOf(dm.page, '#lpn_canvas [data-link="111"]');
			await rest(dm, pd);
			const ld = await cardLines(dm.page);
			ok('in Delete mode, resting on pipe 111 shows its card', JSON.stringify(ld) === JSON.stringify(world.link), JSON.stringify(ld));
			const pe = await dm.page.evaluate(() => { const t = document.querySelector('.tooltip.lpn-hovercard'); return t ? getComputedStyle(t).pointerEvents : null; });
			ok('...and it takes no pointer events', pe === 'none', pe);
			await dm.page.mouse.down(); await dm.page.mouse.up();
			await dm.page.waitForTimeout(400);
			ok('...the press still deletes the pipe', (await linkCount()) === links0 - 1, links0 + ' -> ' + (await linkCount()));
			ok('...and the card is gone', (await cardLines(dm.page)) === null);

			await dm.toolbarClick(await dm.lang('lpn_tool_add_pipe'));
			await dm.settle(300);
			const pa = await centreOf(dm.page, '#lpn_canvas circle[data-node="11"]');
			const pb = await centreOf(dm.page, '#lpn_canvas circle[data-node="13"]');
			await rest(dm, pa);
			const lp = await cardLines(dm.page);
			ok('in Pipe mode, resting on the node about to start a pipe shows its card', !!lp && JSON.stringify(lp.slice(0, 5)) === JSON.stringify(world.node.slice(0, 5)), JSON.stringify(lp));
			await dm.page.mouse.down(); await dm.page.mouse.up();
			await dm.page.waitForTimeout(300);
			ok('...the press starts the pipe (the from-node is marked) and the card is gone',
				(await dm.page.evaluate(() => !!document.querySelector('#lpn_canvas .lpn-node-pending'))) && (await cardLines(dm.page)) === null);
			await rest(dm, pb);
			const lq = await cardLines(dm.page);
			ok('...then resting on the node about to be joined shows ITS card', !!lq && lq[0] === 'ID: ' + PFX.node + '13', JSON.stringify(lq));
			const links1 = await linkCount();
			await dm.page.mouse.down(); await dm.page.mouse.up();
			await dm.page.waitForTimeout(400);
			ok('...and the press completes the pipe', (await linkCount()) === links1 + 1, links1 + ' -> ' + (await linkCount()));
			ok('...with the card gone', (await cardLines(dm.page)) === null);
			ok('no page errors (delete/pipe)', !dm.errors.length, (dm.errors[0] || '').slice(0, 200));
		} finally { await dm.close(); }

		// ---- never off-screen ----
		console.log('=== inside the window: 1280x520 and a 390x740 phone width, 8-line Description ===');
		for (const view of [{ width: 1280, height: 520 }, { width: 390, height: 740 }]) {
			const vv = await openNet1(Session, browser, TICK, undefined, undefined, view, true);
			try {
				for (const [what, sel] of [['junction 11', '#lpn_canvas circle[data-node="11"]'], ['pipe 111', '#lpn_canvas [data-link="111"]'], ['pump 9', '#lpn_canvas [data-link="9"]']]) {
					const pv = await centreOf(vv.page, sel);
					if (!pv) { ok(view.width + 'x' + view.height + ': ' + what + ' is on screen', false); continue; }
					await away(vv);
					await rest(vv, pv);
					const bx = await cardBox(vv.page), ln = await cardLines(vv.page);
					ok(view.width + 'x' + view.height + ': ' + what + ' card lies inside the window', !!bx && bx.l >= -0.5 && bx.t >= -0.5 && bx.r <= bx.vw + 0.5 && bx.b <= bx.vh + 0.5, JSON.stringify(bx));
					if (what === 'junction 11') {
						ok('...and carries no Description row, however long it is', !has(ln, /^Description/), JSON.stringify(ln && ln.slice(0, 5)));
					}
				}
				ok('no page errors (' + view.width + 'x' + view.height + ')', !vv.errors.length, (vv.errors[0] || '').slice(0, 200));
			} finally { await vv.close(); }
		}

		// ---- right to left ----
		console.log('=== ?lang=ar ===');
		const ar = await openNet1(Session, browser, TICK, 'ar');
		try {
			const pr = await centreOf(ar.page, '#lpn_canvas [data-link="111"]');
			await rest(ar, pr);
			const st = await ar.page.evaluate(() => {
				const b = document.querySelector('.lpn-hovercard-body'), ti = document.querySelector('.tooltip.lpn-hovercard .tooltip-inner');
				return b && ti ? { dir: getComputedStyle(b).direction, align: getComputedStyle(ti).textAlign, rows: b.querySelectorAll('.lpn-hovercard-row').length, bdi: b.querySelectorAll('bdi').length } : null;
			});
			ok('the Arabic card reads right to left, aligned to the start', !!st && st.dir === 'rtl' && st.align === 'start', JSON.stringify(st));
			ok('...every value and its unit sits in an isolate, so a unit never jumps', !!st && st.bdi === st.rows && st.rows > 10, JSON.stringify(st));
			ok('no page errors (ar)', !ar.errors.length, (ar.errors[0] || '').slice(0, 200));
		} finally { await ar.close(); }

		// ---- the other language ----
		console.log('=== ?lang=es ===');
		const en = await openNet1(Session, browser, TICK_ES);
		let enPipe;
		try {
			const pp = await centreOf(en.page, '#lpn_canvas [data-link="111"]');
			await rest(en, pp);
			enPipe = await cardLines(en.page);
		} finally { await en.close(); }
		const es = await openNet1(Session, browser, TICK_ES, 'es');
		try {
			const pp = await centreOf(es.page, '#lpn_canvas [data-link="111"]');
			await rest(es, pp);
			const esPipe = await cardLines(es.page);
			ok('the Spanish page shows a pipe card with every field', !!esPipe && esPipe.length >= 10, JSON.stringify(esPipe));
			ok('...whose words are Spanish where the English card has English ones', esPipe && enPipe && JSON.stringify(esPipe) !== JSON.stringify(enPipe),
				'en ' + JSON.stringify(enPipe) + ' es ' + JSON.stringify(esPipe));
			ok('no page errors (es)', !es.errors.length, (es.errors[0] || '').slice(0, 200));
		} finally { await es.close(); }
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
