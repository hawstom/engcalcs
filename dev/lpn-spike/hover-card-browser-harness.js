// THE HOVER CARD: ALL OF AN ASSET'S PROPERTIES, FORMATTED AS SETTINGS SPECIFIES, AT ANY SCALE, FIT OR
// NOT (ROADMAP Task 773; Tom, 2026-10-16), in a real Chromium. Run with:
//   node dev/lpn-spike/hover-card-browser-harness.js
//
// WHAT IT PROVES.
//   1. Net1 with a NON-DEFAULT tick set (node: ID, Elevation, Demand; pipe: ID, Length, Diameter) and
//      a pressure of 3 decimals: resting the pointer on junction 11, pipe 111 and a customer shows a
//      card with fields that are NOT ticked (Head, Pressure; Roughness, Flow; the customer's
//      Description), the pressure printed with the label settings' three decimals, and the map
//      label's own ticked rows still a subset of it, in order. The card is the suite's one styled tip.
//   2. WHICH BOXES ARE TICKED MAKES NO DIFFERENCE: the same cards with the TICK set, with nothing
//      ticked, and with everything ticked are line for line equal.
//   3. THE LABELING THRESHOLD DOES NOT HIDE THE CARD: with the threshold so low that the map draws
//      no labels at the fitted view, the card still shows every field.
//   4. DELETE AND DRAWING: in Delete mode the card shows on a pipe, and a press still deletes it
//      and takes the card down; in Pipe mode it shows on the node about to be joined, and the
//      press still starts / completes the pipe.
//   5. HOVER COSTS NOTHING IN THE LABEL LAYER (no getBBox, no node added or removed), the card
//      takes no pointer events, a press selects through it, and sliding waits for rest.
//   6. THE SETTING: Settings > Map and page > Page > "Show the full label on hover" is the real
//      control; unticked, no card and lpn_hovercard=off is the only thing stored.
//   7. ?lang=es: the Spanish card differs from the English one and carries every field.
//   8. No page errors.
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

function projectText(tick, maxW) {
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
	return JSON.stringify(d);
}

async function openNet1(Session, browser, tick, lang, maxW) {
	const a = await Session.open(browser, NAME, { serviceWorkers: 'block' });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	// Counts every text measurement from before the page's first script runs.
	await a.context.addInitScript(() => {
		window.__bboxCalls = 0;
		const real = SVGGraphicsElement.prototype.getBBox;
		SVGGraphicsElement.prototype.getBBox = function () { window.__bboxCalls++; return real.apply(this, arguments); };
	});
	const q = 'Looped-Network.php?ec_nolog=1' + (lang ? '&lang=' + lang : '');
	await a.goto(q);
	await a.page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); }, projectText(tick, maxW));
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
		const out = [''];
		t.childNodes.forEach((n) => { if (n.nodeName === 'BR') { out.push(''); } else { out[out.length - 1] += n.textContent; } });
		return out;
	});
}
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
			ok('...whose lines hold every map label row, in the label\'s order', lines && isSubsequence(mapRows, lines),
				'card ' + JSON.stringify(lines) + ' label ' + JSON.stringify(mapRows));
			ok('...and also the unticked fields: Head and Pressure', lines && lines.length > 5 && lines.some((t) => /^H=/.test(t)) && lines.some((t) => /^P=/.test(t)), JSON.stringify(lines));
			ok('...Pressure printed with the label settings\' three decimals', lines && lines.some((t) => /^P=\d+\.\d{3}\b/.test(t)), JSON.stringify(lines));
			world.node = lines;
			const anchorTitle = await a.page.evaluate(() => { const e = document.querySelector('.lpn-hovercard-anchor'); return e ? (e.getAttribute('title') || '') + (e.getAttribute('data-bs-original-title') || '') : 'none'; });
			ok('the card is the styled tip on an untitled anchor, so no native tooltip can show', anchorTitle === '', JSON.stringify(anchorTitle));
			const cost = await a.page.evaluate(() => ({ bbox: window.__bboxCalls, mut: window.__mut }));
			ok('hovering ran no label pass: no text measured, nothing added to or removed from the drawing', cost.bbox === 0 && cost.mut === 0, JSON.stringify(cost));
			const pe = await a.page.evaluate(() => getComputedStyle(document.querySelector('.tooltip.lpn-hovercard')).pointerEvents);
			ok('the card takes no pointer events', pe === 'none', pe);

			// 5: a click goes through, and the card goes
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
				ok('resting on pipe 111 shows its card with more than the three ticked rows', !!pl && pl.length > 5, JSON.stringify(pl));
				ok('...led by the ID the map label shows', pl && pl[0] === PFX.link + '111', JSON.stringify(pl && pl[0]));
				ok('...with the unticked Roughness and Flow among them', pl && pl.some((t) => /^C=/.test(t)) && pl.some((t) => /^Q=/.test(t)), JSON.stringify(pl));
				ok('...and the ticked rows the map label prints, in its order', pl && lblText === pl.filter((t) => lblText.indexOf(t.replace(/\s+/g, '')) >= 0).join('').replace(/\s+/g, ''),
					'card ' + JSON.stringify(pl) + ' label ' + JSON.stringify(lblText));
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
				ok(name + ': ...and the customer card has every field', !!cl && cl.length >= 5 && cl.some((t) => /Main Street school/.test(t)) && cl.some((t) => /inst/.test(t)), JSON.stringify(cl));
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
			ok('in Pipe mode, resting on the node about to start a pipe shows its card', !!lp && JSON.stringify(lp.slice(0, 5)) === JSON.stringify(world.node.slice(0, 5)) && lp.length === world.node.length, JSON.stringify(lp));
			await dm.page.mouse.down(); await dm.page.mouse.up();
			await dm.page.waitForTimeout(300);
			ok('...the press starts the pipe (the from-node is marked) and the card is gone',
				(await dm.page.evaluate(() => !!document.querySelector('#lpn_canvas .lpn-node-pending'))) && (await cardLines(dm.page)) === null);
			await rest(dm, pb);
			const lq = await cardLines(dm.page);
			ok('...then resting on the node about to be joined shows ITS card', !!lq && lq[0] === PFX.node + '13', JSON.stringify(lq));
			const links1 = await linkCount();
			await dm.page.mouse.down(); await dm.page.mouse.up();
			await dm.page.waitForTimeout(400);
			ok('...and the press completes the pipe', (await linkCount()) === links1 + 1, links1 + ' -> ' + (await linkCount()));
			ok('...with the card gone', (await cardLines(dm.page)) === null);
			ok('no page errors (delete/pipe)', !dm.errors.length, (dm.errors[0] || '').slice(0, 200));
		} finally { await dm.close(); }

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
			ok('the Spanish page shows a pipe card with every field', !!esPipe && esPipe.length >= 8, JSON.stringify(esPipe));
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
