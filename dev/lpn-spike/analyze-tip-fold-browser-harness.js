// THE FIRE FLOW AND DEMAND SCALING BOXES SHOW CONTROLS AND RESULTS; THEIR EXPLANATION IS BEHIND
// THE `?` BY THE x (Tom, 2026-10-05: "a lot of head room is spent in Fire flow analysis on
// paragraph text, both above and below/after Run (ISO note). Both of these can be folded into the
// box ? glyph tip ... Do the same treatment for Demand Scaling."). Real headless Chromium on Net3,
// which has a run schedule, so the time-step paragraphs would have been drawn:
//
//   1. Fire flow, desktop: no paragraph above Run; the rows, headings and buttons are the ones the
//      box had; the corner `?` opens one tip holding the intro, the hydrant accounting, the ISO
//      credit limit in this project's flow unit, and the engine; after a run the report keeps its
//      results and carries no ISO paragraph.
//   2. Demand scaling, desktop: the same, with Find's range and step in the tip.
//   3. A phone in tall mode (390 x 844, and a short one at 375 x 667): the long tip fits on the
//      screen, scrolling inside itself if it must, and stays inside the viewport's width.
//
//   node dev/lpn-spike/analyze-tip-fold-browser-harness.js     (takes the browser lock itself)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_TIPFOLD_BROWSER_LOCKED';
const NAME = 'analyze-tip-fold-browser-harness';

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
const DESKTOP = { viewport: { width: 1400, height: 900 } };
const PHONE = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true };
// The short phone: 667 px is less than the Fire flow tip's own height below its glyph.
const SHORT_PHONE = { viewport: { width: 375, height: 667 }, hasTouch: true, isMobile: true };

async function openLpn(Session, browser, extra, name) {
	const a = await Session.open(browser, NAME + ':' + name, extra);
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
	await a.settle(1200);
	return a;
}
// What the box shows: its paragraphs, row labels, headings and buttons, in order.
function boxShape(page, controls) {
	return page.evaluate((sel) => {
		const host = document.querySelector(sel), clean = (e) => e.textContent.replace(/\?\s*$/, '').trim();
		return {
			paras: Array.from(host.querySelectorAll(':scope > p')).map((p) => p.textContent),
			rows: Array.from(host.querySelectorAll('.lpn-ff-row')).map((r) => clean(r.firstElementChild)),
			heads: Array.from(host.querySelectorAll('.lpn-ff-head')).map((h) => h.textContent.trim()),
			buttons: Array.from(host.querySelectorAll('.lpn-ff-buttons button')).map((b) => b.textContent.trim()),
			text: host.textContent
		};
	}, controls);
}
// Open the box's corner `?` by a click and read the tip the reader gets.
async function openCornerTip(a, boxId) {
	const sel = '#' + boxId + ' .lpn-corner-help .ec-tip';
	const g = await a.page.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel);
	await a.page.mouse.click(g.x, g.y);
	await a.settle(400);
	return a.page.evaluate((s) => {
		const h = document.querySelector(s).closest('.ec-help'), id = h.getAttribute('aria-describedby');
		const t = id && document.getElementById(id);
		if (!t) { return { shown: false }; }
		const r = t.getBoundingClientRect(), inner = t.querySelector('.tooltip-inner');
		return { shown: t.classList.contains('show'), text: Array.from(t.querySelectorAll('p')).map((p) => p.textContent).join(' ') || t.textContent, left: r.left, right: r.right, top: r.top, bottom: r.bottom,
			vw: window.innerWidth, vh: window.innerHeight,
			scrolls: inner.scrollHeight > inner.clientHeight + 1, overflowY: getComputedStyle(inner).overflowY };
	}, sel);
}
function sentences(text) { return text.split(/(?<=[.;:])\s+/).map((x) => x.trim()).filter((x) => x.length > 8); }
async function closeTip(a) { await a.page.keyboard.press('Escape'); await a.settle(300); }

async function sectionFireFlow(a, lang) {
	console.log('\n--- 1. Fire flow, desktop ---');
	const page = a.page;
	await a.menuClickSub(lang.analyze, lang.ffMenu, 'project');
	await page.waitForSelector('#lpn_ff_box', { state: 'visible' });
	await a.settle(400);
	const s = await boxShape(page, '#lpn_ff_controls');
	ok('no paragraph above Run: the box shows controls only', s.paras.length === 0, JSON.stringify(s.paras).slice(0, 160));
	ok('...the six criteria rows are still there, in order', JSON.stringify(s.rows) === JSON.stringify(lang.ffRows), JSON.stringify(s.rows));
	ok('...and Run, Stop and Clear rings', JSON.stringify(s.buttons) === JSON.stringify(lang.ffButtons), JSON.stringify(s.buttons));
	const t = await openCornerTip(a, 'lpn_ff_box');
	ok('the corner `?` opens one tip', t.shown);
	// Every sentence the tip holds (the engine cost, maximum day, the hydrant accounting, the ISO
	// limit, the engine) is one the box no longer prints.
	const printed = sentences(t.text).filter((x) => s.text.indexOf(x) >= 0);
	ok('...and not one of its sentences is also printed in the box', sentences(t.text).length >= 8 && printed.length === 0, JSON.stringify(printed).slice(0, 120));
	ok('...that opens with the intro (who is tested, on a copy, maximum day, the search cost)', t.text.indexOf(lang.ffIntro) === 0, t.text.slice(0, 80));
	ok('...says where the fire flow is drawn, in full', t.text.indexOf(lang.ffAccounting) > 0);
	ok('...carries the ISO credit limit with a number in this project\'s flow unit', /credits a single hydrant with at most [\d.,]+ \S+\./.test(t.text) && t.text.indexOf('{flow}') < 0,
		(t.text.match(/at most [^.]*\./) || [''])[0]);
	ok('...and ends with the engine that will run', t.text.endsWith(lang.engineNative) || t.text.endsWith(lang.engineEpanet), t.text.slice(-40));
	ok('...and fits the window', t.left >= 0 && t.right <= t.vw && t.top >= 0 && t.bottom <= t.vh, JSON.stringify({ top: t.top, bottom: t.bottom, vh: t.vh }));
	await closeTip(a);

	const before = await page.evaluate(() => document.getElementById('lpn_ff_controls').innerHTML.length);
	await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#lpn_ff_controls button.lpn-ff-run'))[0]; b.click(); });
	await a.waitFor(() => page.evaluate(() => {
		const r = document.getElementById('lpn_ff_report'), box = document.getElementById('lpn_ff_run_box');
		return !!r && r.textContent.length > 20 && (!box || box.style.display === 'none');
	}), 'the Fire flow answer', 240000);
	const rep = await page.evaluate(() => document.getElementById('lpn_ff_report').textContent);
	ok('after a run, the report has its results', rep.indexOf(lang.ffTableHead) >= 0 && rep.length > 200, rep.slice(0, 80));
	ok('...and no ISO paragraph after Run', rep.indexOf('(ISO)') < 0);
	const s2 = await boxShape(page, '#lpn_ff_controls');
	ok('...and still no paragraph above Run', s2.paras.length === 0 && before > 0, JSON.stringify(s2.paras).slice(0, 120));
	const t2 = await openCornerTip(a, 'lpn_ff_box');
	ok('...the corner `?` still opens the same tip after the run', t2.shown && t2.text === t.text);
	await closeTip(a);
	await page.click('#lpn_ff_close');
	await a.settle(300);
}

async function sectionDemandScale(a, lang) {
	console.log('\n--- 2. Demand scaling, desktop ---');
	const page = a.page;
	await a.menuClickSub(lang.analyze, lang.dsMenu, 'project');
	await page.waitForSelector('#lpn_ds_box', { state: 'visible' });
	await a.settle(400);
	const s = await boxShape(page, '#lpn_ds_controls');
	ok('no paragraph in the box: controls only', s.paras.length === 0, JSON.stringify(s.paras).slice(0, 160));
	ok('...the rows are still there, in order', JSON.stringify(s.rows) === JSON.stringify(lang.dsRows), JSON.stringify(s.rows));
	ok('...the two headings are still there', JSON.stringify(s.heads) === JSON.stringify(lang.dsHeads), JSON.stringify(s.heads));
	ok('...and Run, Find and Stop', JSON.stringify(s.buttons) === JSON.stringify(lang.dsButtons), JSON.stringify(s.buttons));
	const t = await openCornerTip(a, 'lpn_ds_box');
	ok('the corner `?` opens one tip', t.shown);
	ok('...that explains Run and Find, with the search\'s range and step filled in', t.text.indexOf(lang.dsIntro) === 0 && t.text.indexOf('{') < 0, t.text.slice(0, 80));
	ok('...and ends with the engine that will run', t.text.endsWith(lang.engineNative) || t.text.endsWith(lang.engineEpanet), t.text.slice(-40));
	ok('...and fits the window', t.left >= 0 && t.right <= t.vw && t.top >= 0 && t.bottom <= t.vh);
	await closeTip(a);
	await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#lpn_ds_controls button.lpn-ff-run'))[0]; b.click(); });
	await a.waitFor(() => page.evaluate(() => {
		const r = document.querySelector('#lpn_ds_controls [data-ds="scale"]');
		return !!r && r.textContent.length > 20;
	}), 'the Demand scaling Run answer', 240000);
	ok('a Run still reports its result under Run', (await page.evaluate(() => document.querySelector('#lpn_ds_controls [data-ds="scale"]').textContent)).length > 20);
	await page.click('#lpn_ds_close');
	await a.settle(300);
}

async function sectionPhone(Session, browser, lang, vp, name) {
	console.log('\n--- 3. A phone in tall mode (' + vp.viewport.width + ' x ' + vp.viewport.height + '): the long tip fits ---');
	const a = await openLpn(Session, browser, vp, name);
	try {
		for (const [menu, box] of [[lang.ffMenu, 'lpn_ff_box'], [lang.dsMenu, 'lpn_ds_box']]) {
			await a.menuClickSub(lang.analyze, menu, 'project');
			await a.page.waitForSelector('#' + box, { state: 'visible' });
			await a.settle(500);
			const t = await openCornerTip(a, box);
			ok(box + ': a tap on the corner `?` opens the tip', t.shown);
			ok('...inside the screen\'s width', t.left >= 0 && t.right <= t.vw, JSON.stringify({ left: t.left, right: t.right, vw: t.vw }));
			ok('...and its height: whatever does not fit scrolls inside the tip', t.top >= 0 && t.bottom <= t.vh && (t.overflowY === 'auto' || !t.scrolls),
				JSON.stringify({ top: Math.round(t.top), bottom: Math.round(t.bottom), vh: t.vh, scrolls: t.scrolls }));
			await a.page.mouse.click(5, vp.viewport.height - 14);
			await a.settle(300);
			await a.page.evaluate((id) => { const x = document.querySelector('#' + id + ' .lpn-popover-x'); if (x) { x.click(); } }, box);
			await a.settle(300);
		}
		ok('no uncaught page errors (' + name + ')', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
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
		const a = await openLpn(Session, browser, DESKTOP, 'desktop');
		const L = (k) => a.lang(k);
		const lang = {
			analyze: await L('lpn_analyze_menu'), ffMenu: await L('lpn_ff_menu'), dsMenu: await L('lpn_ds_menu'),
			ffIntro: (await L('lpn_ff_intro')).split('\\n\\n').join(' '), ffAccounting: await L('lpn_ff_accounting'),
			dsIntro: (await L('lpn_ds_intro')).split('{')[0].split('\\n\\n').join(' '),
			engineNative: await L('lpn_ff_engine_native'), engineEpanet: await L('lpn_ff_engine_epanet'),
			ffTableHead: await L('lpn_ff_report_all'),
			ffRows: [await L('lpn_ff_scope'), await L('lpn_ff_required'), await L('lpn_ff_residual'), await L('lpn_ff_design'),
				await L('lpn_ff_minpressure'), await L('lpn_ff_maxvelocity')],
			ffButtons: [await L('lpn_ff_calculate'), await L('lpn_ff_stop'), await L('lpn_ff_clear')],
			dsRows: [await L('lpn_ds_scope'), await L('lpn_ds_minpressure'), await L('lpn_ds_multiplier')],
			dsHeads: [await L('lpn_ds_head_scale'), await L('lpn_ds_head_search')],
			dsButtons: [await L('lpn_ds_run'), await L('lpn_find_btn'), await L('lpn_ff_stop')]
		};
		try {
			await sectionFireFlow(a, lang);
			await sectionDemandScale(a, lang);
			ok('no uncaught page errors (desktop)', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		} finally {
			await a.close();
		}
		await sectionPhone(Session, browser, lang, PHONE, 'phone');
		await sectionPhone(Session, browser, lang, SHORT_PHONE, 'short-phone');
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
