// THE HOVER CARD: AN ASSET'S FULL LABEL, AS IF EVERY FIELD WERE TICKED (ROADMAP Task 773), in a
// real Chromium. Run with:
//   node dev/lpn-spike/hover-card-browser-harness.js
//
// WHAT IT PROVES.
//   1. Net1 with ONLY the ID ticked on every node and link: resting the pointer on a junction shows
//      a card with every field the label can print (not just the ID), and the card is the suite's
//      one styled tip (a .tooltip), not the browser's native one (the anchor carries no title).
//   2. THE CARD IS THE MAP LABEL'S OWN TEXT. The same junction in a second page with every field
//      ticked draws a map label; the card's lines must equal that label's rows. Two formatters
//      would drift; this is what catches it.
//   3. A pipe gets a card too, and it comes out in the page's language (?lang=es): the status line
//      is localized, so the Spanish card differs from the English one.
//   4. HOVER COSTS NOTHING IN THE LABEL LAYER: no getBBox() call and no child added to or removed
//      from the drawing between the pointer arriving and the card standing (the label pass writes
//      glyphs and measures them; the highlight is a class toggle and neither).
//   5. THE CARD NEVER BLOCKS A CLICK: it is pointer-events:none, a press on the junction selects
//      it, and the card is gone once the press has landed.
//   6. THE SETTING: Settings > Map and page > Page > "Show the full label on hover" is the real
//      control. Unticked, no card appears and the browser holds lpn_hovercard=off (the only thing
//      stored); ticked again, the key is removed and the card returns. The Settings row is
//      browser-scoped: the project record is unchanged by the switch.
//   7. No page errors.
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
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

const NODE_FIELDS = ['id', 'desc', 'tag', 'demand', 'elev', 'initQuality', 'demandActual', 'level', 'head', 'pressure', 'quality'];
const LINK_FIELDS = ['id', 'desc', 'tag', 'length', 'diameter', 'roughness', 'km', 'initStatus', 'bulkCoeff', 'wallCoeff',
	'flow', 'velocity', 'headloss', 'gradient', 'friction', 'rate', 'quality', 'status'];

function projectText(allOn) {
	const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8'));
	d.settings = Object.assign({}, d.settings, { labelMaxWidth: null });
	d.labelSettings = d.labelSettings || {};
	d.labelSettings.node = {}; NODE_FIELDS.forEach((k) => { d.labelSettings.node[k] = allOn || k === 'id'; });
	d.labelSettings.link = {}; LINK_FIELDS.forEach((k) => { d.labelSettings.link[k] = allOn || k === 'id'; });
	return JSON.stringify(d);
}

async function openNet1(Session, browser, allOn, lang) {
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
	await a.page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); }, projectText(allOn));
	await a.reload();
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.settle(2500);
	return a;
}

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
		// ---- the reference: every field ticked, and the label the map draws for junction 11 ----
		console.log('=== reference: every field ticked ===');
		const ref = await openNet1(Session, browser, true);
		let refRows;
		try {
			refRows = await labelRows(ref.page, '11');
			ok('the reference map label for junction 11 has several rows', refRows && refRows.length >= 4, JSON.stringify(refRows));
			ok('(reference) no page errors', !ref.errors.length, (ref.errors[0] || '').slice(0, 200));
		} finally { await ref.close(); }

		// ---- the subject: ID only on the map ----
		console.log('=== subject: only the ID ticked ===');
		const a = await openNet1(Session, browser, false);
		try {
			const mapRows = await labelRows(a.page, '11');
			ok('on the map, junction 11 shows its ID alone', mapRows && mapRows.length === 1, JSON.stringify(mapRows));
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
			ok('...with more than the ID: every field the label can print', lines && lines.length >= 4, JSON.stringify(lines));
			ok('...whose lines equal the all-ticked map label, row for row', lines && JSON.stringify(lines) === JSON.stringify(refRows),
				'card ' + JSON.stringify(lines) + ' label ' + JSON.stringify(refRows));
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
				ok('resting on pipe 111 shows its card', !!pl && pl.length >= 3, JSON.stringify(pl));
				ok('...led by the ID the map label shows', pl && pl[0] === '111', JSON.stringify(pl && pl[0]));
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

		// ---- the other language ----
		console.log('=== ?lang=es ===');
		const en = await openNet1(Session, browser, false);
		let enPipe;
		try {
			const pp = await centreOf(en.page, '#lpn_canvas [data-link="111"]');
			await rest(en, pp);
			enPipe = await cardLines(en.page);
		} finally { await en.close(); }
		const es = await openNet1(Session, browser, false, 'es');
		try {
			const pp = await centreOf(es.page, '#lpn_canvas [data-link="111"]');
			await rest(es, pp);
			const esPipe = await cardLines(es.page);
			ok('the Spanish page shows a pipe card', !!esPipe && esPipe.length >= 3, JSON.stringify(esPipe));
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
