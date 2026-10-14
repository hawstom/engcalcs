// **THE RIGHT-CLICK MENU ON A TEXT AND ON A DRAGGED LABEL, AND A TEXT EDITED IN PLACE INSIDE A
// SCENARIO** (Tom, 2026-10-14, when a double-click on a Text became editing it: the old "send it
// home" moves to the menu as Reset position). Real Chromium, real presses; long presses are real
// touches through the DevTools protocol.
//   A. Net1: a right-click on a node's label offers the asset rows plus Reset position, greyed until
//      the label is dragged; Reset sends it home as one Undo step; a long press offers the same.
//   B. A Text: right-click offers Edit text and Reset position and nothing else; Reset is greyed on
//      a free Text and on an attached Text at its own spot, enabled once it is dragged, one Undo
//      step; Edit text opens the in-place editor; a long press offers the same rows.
//   C. Tom's Fotobi project: inside the No wells scenario, a double-click edit of Text X42 lands in
//      that scenario's Text alternative, exactly as the Properties box does, and Base, the EPS
//      alternative and the drawing keep their own words; Edit text from the menu opens on the
//      scenario's words.
//
//   node dev/lpn-spike/text-ctxmenu-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const NAME = 'text-ctxmenu-browser-harness';
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_TEXTCTX_BROWSER_LOCKED';
if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
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
const FOTOBI = path.join(REPO, 'dev', 'lpn-spike', 'fixtures', 'Fotobi_US_WGS84.epp');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function tools(a) {
	const page = a.page;
	const menu = () => page.$$eval('.lpn-pane-ctxmenu button', (bs) => bs.map((b) => ({ t: b.textContent.trim(), off: b.getAttribute('aria-disabled') === 'true' })));
	const closeMenu = async () => { await page.keyboard.press('Escape'); await page.evaluate(() => document.querySelectorAll('.lpn-pane-ctxmenu').forEach((m) => m.remove())); await a.settle(200); };
	const clickRow = async (label) => {
		const bs = await page.$$('.lpn-pane-ctxmenu button');
		for (const b of bs) { if ((await b.textContent()).trim() === label) { await b.click(); return true; } }
		return false;
	};
	const centreOf = (sel) => page.evaluate((s) => {
		for (const el of document.querySelectorAll(s)) {
			const r = el.getBoundingClientRect();
			if (r.width > 0) { return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
		}
		return null;
	}, sel);
	const rightClick = async (p) => { await page.mouse.move(p.x, p.y); await page.mouse.click(p.x, p.y, { button: 'right' }); await a.settle(400); };
	const editor = () => page.evaluate(() => { const t = document.querySelector('textarea.lpn-text-inplace'); return t ? { value: t.value, focused: t === document.activeElement } : null; });
	return { page, menu, closeMenu, clickRow, centreOf, rightClick, editor };
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const errors = [];
	try {
		// ---------------------------------------------------------------- A. a node's label, Net1
		console.log('\nA. A node label: Reset position on the right-click and long press menu');
		const a = await Session.open(browser, 'A', { hasTouch: true, viewport: { width: 1400, height: 900 } });
		const { page, menu, closeMenu, clickRow, centreOf, rightClick, editor } = tools(a);
		page.on('pageerror', (e) => errors.push(String(e && e.message)));
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (route) => route.abort());
		await a.goto('Looped-Network.php');
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1500);
		await page.evaluate(() => {
			delete window.lpnDialogAnswerer;
			const c = document.getElementById('ec-consent'); if (c) { c.remove(); }
			let e = document.querySelector('.ec-consent-actions');
			while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
			if (e) { e.style.display = 'none'; }
		});
		const L = (k) => a.lang(k);
		const COPY = await L('lpn_copy_props_menu'), PASTE = await L('lpn_paste_props_menu'), GRAPH = await L('lpn_tsb_menu');
		const EDIT = await L('lpn_ctx_edit_text'), RESET = await L('lpn_ctx_reset_position');
		const stored = async () => { await a.settle(1500); return page.evaluate(() => {
			const idx = JSON.parse(localStorage.getItem('lpn_index') || '{}');
			return JSON.parse(localStorage.getItem('lpn_project_' + idx.openId) || 'null');
		}); };
		const nodeLx = async (id) => { const d = await stored(); const n = d.nodes.filter((x) => x.id === id)[0]; return n ? n.lx : 'missing'; };
		const cdp = await page.context().newCDPSession(page);
		const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map((p, i) => ({ x: p.x, y: p.y, id: i + 1 })) });
		const longPress = async (p) => { await touch('touchStart', [p]); await sleep(900); await touch('touchEnd', []); await a.settle(600); };
		const LBL = '#lpn_canvas text[data-nodelbl="22"]';
		let lp = await centreOf(LBL);
		ok('junction 22 has a label on screen', !!lp, JSON.stringify(lp));
		await rightClick(lp);
		let m = await menu();
		ok('right-click on the label: Copy, Paste, Time series graph, then Reset position',
			JSON.stringify(m.map((r) => r.t)) === JSON.stringify([COPY, PASTE, GRAPH, RESET]), JSON.stringify(m));
		ok('...Reset position greyed while the label is where the page put it', m.length === 4 && m[3].off, JSON.stringify(m));
		await closeMenu();
		const nodeP = await centreOf('#lpn_canvas [data-node="22"]');
		await rightClick(nodeP);
		m = await menu();
		ok('right-click on the junction itself: the asset rows only', JSON.stringify(m.map((r) => r.t)) === JSON.stringify([COPY, PASTE, GRAPH]), JSON.stringify(m));
		await closeMenu();
		// Drag the label 60 px.
		lp = await centreOf(LBL);
		await page.mouse.move(lp.x, lp.y); await page.mouse.down();
		for (let i = 1; i <= 6; i++) { await page.mouse.move(lp.x + i * 10, lp.y + i * 6); await sleep(20); }
		await page.mouse.up(); await a.settle(500);
		ok('the label is dragged (it now holds an offset)', typeof (await nodeLx('22')) === 'number');
		lp = await centreOf(LBL);
		await rightClick(lp);
		m = await menu();
		ok('right-click on the dragged label: Reset position enabled', m.length === 4 && m[3].t === RESET && !m[3].off, JSON.stringify(m));
		await clickRow(RESET);
		await a.settle(500);
		ok('Reset position sends it home', (await nodeLx('22')) === undefined);
		await page.keyboard.press('Control+z');
		ok('...and one Undo puts it back where it was dragged', typeof (await nodeLx('22')) === 'number');
		lp = await centreOf(LBL);
		await longPress(lp);
		m = await menu();
		ok('a long press on the dragged label opens the same menu, Reset enabled', m.length === 4 && m[3].t === RESET && !m[3].off, JSON.stringify(m));
		await clickRow(RESET);
		await a.settle(500);
		ok('...and its Reset position sends it home', (await nodeLx('22')) === undefined);
		await closeMenu();

		// ---------------------------------------------------------------- B. a Text
		console.log('\nB. A Text: Edit text and Reset position');
		await a.toolbarClick(await L('lpn_tool_add_text'));
		await a.settle(200);
		const np = await centreOf('#lpn_canvas [data-node="10"]');
		await page.mouse.click(np.x + 4, np.y + 4);
		await a.settle(400);
		await page.keyboard.type('Attached');
		await page.keyboard.press('Control+Enter');
		await a.settle(200);
		await page.keyboard.press('Escape');
		await a.settle(300);
		let d = await stored();
		const tx = d.labels.filter((l) => l._text === 'Attached')[0];
		ok('a Text is placed attached to junction 10', !!tx && tx.anchorNode === '10', JSON.stringify(d.labels));
		const TSEL = '#lpn_canvas text.lpn-lbl[data-lbl="' + (tx && tx.id) + '"]';
		let tp = await centreOf(TSEL);
		await rightClick(tp);
		m = await menu();
		ok('right-click on the Text: Edit text and Reset position, nothing else',
			JSON.stringify(m.map((r) => r.t)) === JSON.stringify([EDIT, RESET]), JSON.stringify(m));
		ok('...Reset enabled: it was placed off its own spot', m.length === 2 && !m[1].off, JSON.stringify(m));
		await clickRow(RESET);
		await a.settle(400);
		d = await stored();
		const home = d.labels.filter((l) => l.id === tx.id)[0];
		ok('Reset position moves it', home.x !== tx.x || home.y !== tx.y, JSON.stringify([tx, home]));
		tp = await centreOf(TSEL);
		await rightClick(tp);
		m = await menu();
		ok('...to its own spot: Reset is now greyed', m.length === 2 && m[1].off, JSON.stringify(m));
		await closeMenu();
		await page.keyboard.press('Control+z');
		d = await stored();
		const back = d.labels.filter((l) => l.id === tx.id)[0];
		ok('one Undo puts it back where it was', back.x === tx.x && back.y === tx.y, JSON.stringify([tx, back]));
		tp = await centreOf(TSEL);
		await rightClick(tp);
		await clickRow(EDIT);
		await a.settle(400);
		let ed = await editor();
		ok('Edit text opens the in-place editor on its words', !!ed && ed.value === 'Attached' && ed.focused, JSON.stringify(ed));
		await page.keyboard.type('Edited from the menu');
		await page.keyboard.press('Control+Enter');
		await a.settle(300);
		d = await stored();
		ok('...and its commit writes them', d.labels.filter((l) => l.id === tx.id)[0]._text === 'Edited from the menu');
		// A free Text.
		await a.toolbarClick(await L('lpn_tool_add_text'));
		await a.settle(200);
		const free = await page.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.x + 60, y: r.y + r.height - 80 }; });
		await page.mouse.click(free.x, free.y);
		await a.settle(400);
		await page.keyboard.type('Free');
		await page.keyboard.press('Control+Enter');
		await page.keyboard.press('Escape');
		await a.settle(300);
		d = await stored();
		const fx = d.labels.filter((l) => l._text === 'Free')[0];
		ok('a free Text is placed', !!fx && !fx.anchorNode && !fx.anchorLink, JSON.stringify(fx));
		await rightClick(await centreOf('#lpn_canvas text.lpn-lbl[data-lbl="' + (fx && fx.id) + '"]'));
		m = await menu();
		ok('...its Reset position is greyed, with the tip saying why', m.length === 2 && m[1].off &&
			(await page.$eval('.lpn-pane-ctxmenu button:nth-child(2)', (b) => b.title)) === await L('lpn_ctx_reset_position_off_tip'), JSON.stringify(m));
		await closeMenu();
		// A finger's long press. Away from any junction: within a finger's reach of one, the
		// junction outranks a label or a Text for every touch (touchNodeOver()), this menu included.
		const fpt = await centreOf('#lpn_canvas text.lpn-lbl[data-lbl="' + fx.id + '"]');
		await longPress(fpt);
		m = await menu();
		ok('a long press on the Text opens the same two rows', JSON.stringify(m.map((r) => r.t)) === JSON.stringify([EDIT, RESET]), JSON.stringify(m));
		await clickRow(EDIT);
		await a.settle(400);
		ed = await editor();
		ok('...and Edit text opens the editor there too', !!ed && ed.value === 'Free', JSON.stringify(ed));
		await page.keyboard.type('Free, long pressed');
		await page.keyboard.press('Control+Enter');
		await a.settle(300);
		d = await stored();
		ok('...and the edit is written', d.labels.filter((l) => l.id === fx.id)[0]._text === 'Free, long pressed');
		await a.close();

		// ---------------------------------------------------------------- C. Fotobi, a scenario
		console.log('\nC. Fotobi: an in-place edit inside a scenario lands in its Text alternative');
		const b = await Session.open(browser, 'B', { serviceWorkers: 'block', viewport: { width: 1600, height: 1000 } });
		const T = tools(b), P = T.page;
		P.on('pageerror', (e) => errors.push(String(e && e.message)));
		await P.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (route) => route.abort());
		await b.goto('Looped-Network.php?ec_nolog=1');
		await P.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); localStorage.setItem('lpn_scnbasic', 'off'); }, fs.readFileSync(FOTOBI, 'utf8'));
		await b.reload();
		await b.answerTrainingPanel().catch(() => {});
		await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await b.settle(2500);
		const saved = async () => { await b.settle(2600); return P.evaluate(() => JSON.parse(localStorage.getItem('lpn_project_hover'))); };
		const scenarioMenu = async (label) => {
			await P.click('#lpn_scenario_btn');
			await P.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			let hit = false;
			for (const r of await P.$$('#lpn_menu_list button.lpn-menu-row')) {
				const t = (await r.textContent()).trim().replace(/^✓\s*/, '').replace(/\s*\(\d+\)$/, '');
				if (t === label.trim()) { await r.click(); hit = true; break; }
			}
			if (!hit) { await P.keyboard.press('Escape'); }
			await b.settle(1500);
			return hit;
		};
		const x42Rows = () => P.evaluate(() => {
			const t = document.querySelector('#lpn_canvas text.lpn-lbl[data-lbl="X42"]');
			return t ? Array.from(t.querySelectorAll('tspan')).map((s) => s.textContent) : null;
		});
		const before = JSON.parse(fs.readFileSync(FOTOBI, 'utf8'));
		const altText = (d2, id) => ((d2.alternatives.filter((x) => x.id === id)[0] || {}).values || {})['t:X42'];
		ok('No wells is chosen', await scenarioMenu('No wells'));
		ok('X42 shows the No wells words', ((await x42Rows()) || [])[0] === 'Scenario: No wells', JSON.stringify(await x42Rows()));
		const xp = await T.centreOf('#lpn_canvas text.lpn-lbl[data-lbl="X42"]');
		await P.mouse.dblclick(xp.x, xp.y);
		await b.settle(500);
		ed = await T.editor();
		ok('a double-click opens the editor on the scenario\'s words', !!ed && ed.value === altText(before, 'a6').text, JSON.stringify(ed && ed.value.slice(0, 40)));
		await P.keyboard.press('Control+a');
		await P.keyboard.type('Scenario: No wells');
		await P.keyboard.press('Enter');
		await P.keyboard.type('Edited in place');
		await P.keyboard.press('Control+Enter');
		await b.settle(400);
		let sv = await saved();
		const x42 = (d2) => d2.labels.filter((l) => l.id === 'X42')[0];
		ok('the words land in the No wells Text alternative', (altText(sv, 'a6') || {}).text === 'Scenario: No wells\nEdited in place', JSON.stringify(altText(sv, 'a6')));
		ok('...Base\'s own words are untouched', x42(sv)._text === x42(before)._text);
		ok('...and so is the EPS alternative', JSON.stringify(altText(sv, 'a10')) === JSON.stringify(altText(before, 'a10')));
		await T.rightClick(await T.centreOf('#lpn_canvas text.lpn-lbl[data-lbl="X42"]'));
		await T.clickRow(EDIT);
		await b.settle(400);
		ed = await T.editor();
		ok('Edit text from the menu opens on the scenario\'s new words', !!ed && ed.value === 'Scenario: No wells\nEdited in place', JSON.stringify(ed));
		await P.keyboard.press('Escape');
		await b.settle(200);
		// The Properties box, the reference this must match.
		const xq = await T.centreOf('#lpn_canvas text.lpn-lbl[data-lbl="X42"]');
		await P.mouse.click(xq.x, xq.y);
		await b.settle(800);
		const pv = await P.evaluate(() => { const t = document.querySelector('#lpn_popup_fields textarea'); return t ? t.value : null; });
		ok('Properties shows the same words', pv === 'Scenario: No wells\nEdited in place', JSON.stringify(pv));
		await P.keyboard.press('Escape');
		ok('back to Base', await scenarioMenu(await b.lang('lpn_scenario_base')));
		ok('Base draws its own words', ((await x42Rows()) || [])[0] === 'Scenario: Base', JSON.stringify(((await x42Rows()) || []).slice(0, 2)));
		await b.close();
		ok('no page error', errors.length === 0, JSON.stringify(errors).slice(0, 300));
	} catch (e) {
		ok('harness ran to the end', false, e && e.stack);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main();
