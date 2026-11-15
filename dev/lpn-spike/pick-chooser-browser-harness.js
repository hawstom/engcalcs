// **THE PICK CHOOSER** (Tom, 2026-11-14: "a disambiguating chooser when there are
// multiple elements in one click such as when any assembly is exploded"). Real Chromium, real
// presses, on dev/lpn-spike/fixtures/pick-chooser.lwn: junction M lying on pipe P1; an exploded pump
// assembly (junctions J1, J2, J3 at one point, a zero-length pump PU9 and a zero-length pipe P2
// between them); two pipes Q1 and Q2 drawn over each other.
//   A. The ordinary click is untouched: a junction on a pipe selects the junction and opens its
//      Properties with no box; a pipe alone selects the pipe; bare map selects nothing.
//   B. A click on the exploded assembly opens a box listing each element as its type word and ID;
//      nothing is selected until a row is chosen; Escape and a press elsewhere on the map close it
//      with the selection as it was; choosing a row selects that element and opens its Properties;
//      the arrow keys and Enter choose; a Shift-held click adds the chosen element to the selection;
//      a drag from the assembly still moves what it grabbed (and selects it); hovering a row marks
//      that element on the map.
//   C. Two pipes drawn over each other offer both; two coincident junctions with a Text over them offer
//      the Text as one more row.
//   D. A phone (390 x 844, touch): a tap on the assembly opens the box, its rows are finger-sized
//      (at least 44 px), a tap on a row chooses it; a tap on the junction on the pipe opens no box.
//   E. Review fixes: a finger's tap near the right and bottom edges opens the box with no row under the
//      press and no row answering the lift's compatibility click; a pipe a finger taps within reach of
//      the pile is one more row; a right-click or a long press that dismisses the box opens no
//      context menu; two stacked THICK pipes are both offered 4 px off their centreline; hovering a
//      row marks exactly that element and closing clears it; a pan from bare map still clears the selection.
// EC_SHOTS=<dir> saves pick-chooser-desktop.png and pick-chooser-phone.png there.
//
//   node dev/lpn-spike/pick-chooser-browser-harness.js   (takes the browser lock itself)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const NAME = 'pick-chooser-browser-harness';
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PICKCHOOSER_LOCKED';
const SHOTS = process.env.EC_SHOTS || '';
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

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const project = fs.readFileSync(path.join(REPO, 'dev', 'lpn-spike', 'fixtures', 'pick-chooser.lwn'), 'utf8');
	const errors = [];
	const open = async (S) => {
		S.page.on('pageerror', (e) => errors.push(String(e && e.message)));
		await S.page.addInitScript(() => { window.EC_DEFAULT_DOCKS = true; });
		await S.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
		await S.goto('Looped-Network.php?ec_nolog=1');
		await S.page.evaluate((t) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', t); localStorage.setItem('lpn_hovercard', 'off'); }, project);
		await S.reload();
		await S.answerTrainingPanel().catch(() => {});
		await S.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await S.settle(2500);
	};
	const tools = (S) => {
		const page = S.page;
		const centre = (sel) => page.evaluate((s) => {
			for (const el of document.querySelectorAll(s)) {
				const r = el.getBoundingClientRect();
				if (r.width > 0) { return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
			}
			return null;
		}, sel);
		// A link wears its mark on its halo, which sits just before its grab band (the one with data-link).
		const marked = (cls) => page.evaluate((c) => Array.from(document.querySelectorAll('#lpn_canvas .' + c)).map((e) => {
			if (e.dataset.node) { return 'node:' + e.dataset.node; }
			const hit = e.dataset.link !== undefined ? e : e.nextElementSibling;
			return hit && hit.dataset.link !== undefined ? 'link:' + hit.dataset.link : 'other';
		}).sort(), cls);
		const selected = () => marked('lpn-selected');
		const rows = () => page.$$eval('.lpn-pick-chooser button', (bs) => bs.map((b) => b.textContent.trim()));
		const chooserOpen = () => page.evaluate(() => !!document.querySelector('.lpn-pick-chooser'));
		// What the Properties box is open on: the value in its ID field (null when it is not shown).
		const popupTitle = () => page.evaluate(() => { const p = document.getElementById('lpn_popup'); const i = p && getComputedStyle(p).display !== 'none' && p.querySelector('#lpn_popup_title input'); return i ? i.value : null; });
		const closeProps = () => page.evaluate(() => { const x = document.getElementById('lpn_popup_close'); if (x) { x.click(); } });
		const hovered = () => marked('lpn-hover');
		const click = async (p, opts) => { await page.mouse.move(p.x, p.y); await page.mouse.click(p.x, p.y, opts); await S.settle(450); };
		const rowBtn = async (label) => { for (const b of await page.$$('.lpn-pick-chooser button')) { if ((await b.textContent()).trim() === label) { return b; } } return null; };
		return { page, centre, selected, rows, chooserOpen, popupTitle, closeProps, hovered, click, rowBtn };
	};
	const J = (s) => JSON.stringify(s);
	try {
		// =========================================================== desktop, a mouse
		const S = await Session.open(browser, NAME + '-d', { viewport: { width: 1400, height: 900 } });
		await open(S);
		const { page, centre, selected, rows, chooserOpen, popupTitle, closeProps, hovered, click, rowBtn } = tools(S);
		const pile = await centre('#lpn_canvas [data-node="J1"]');
		const mid = await centre('#lpn_canvas [data-node="M"]');
		ok('the map is drawn: the assembly and the junction on the pipe are on screen', !!pile && !!mid, J([pile, mid]));
		const pileSame = await page.evaluate(() => ['J1', 'J2', 'J3'].map((id) => { const r = document.querySelector('#lpn_canvas circle.lpn-node[data-node="' + id + '"]').getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top)]; }));
		ok('J1, J2 and J3 are drawn at one point', J(pileSame[0]) === J(pileSame[1]) && J(pileSame[1]) === J(pileSame[2]), J(pileSame));

		console.log('\nA. The ordinary click is untouched');
		await click(mid);
		ok('a click on the junction that sits on a pipe selects the junction', J(await selected()) === J(['node:M']), J(await selected()));
		ok('...opens no box', !(await chooserOpen()));
		ok('...and opens its Properties', (await popupTitle()) === 'M', String(await popupTitle()));
		await closeProps();
		const onPipe = await page.evaluate(() => {
			const l = document.querySelector('#lpn_canvas .lpn-link-hit[data-link="P1"]') || document.querySelector('#lpn_canvas [data-link="P1"]');
			const r = l.getBoundingClientRect(); return { x: r.left + r.width * 0.2, y: r.top + r.height / 2 };
		});
		await click(onPipe);
		ok('a click on a pipe alone selects the pipe, with no box', J(await selected()) === J(['link:P1']) && !(await chooserOpen()), J(await selected()));
		await click({ x: 700, y: 820 });
		ok('a click on bare map selects nothing, with no box', (await selected()).length === 0 && !(await chooserOpen()));

		console.log('\nB. The exploded assembly');
		await click(mid);
		await closeProps();
		await click(pile);
		ok('a click on the assembly opens the box', await chooserOpen());
		const want = ['Junction J1', 'Junction J2', 'Junction J3', 'Pipe P2', 'Pump PU9'];
		ok('...listing every element as its type word and ID, nodes then links', J(await rows()) === J(want), J(await rows()));
		ok('...selecting nothing yet: the selection is as it was (the junction M)', J(await selected()) === J(['node:M']), J(await selected()));
		const box = await page.evaluate(() => { const b = document.querySelector('.lpn-pick-chooser').getBoundingClientRect(); return { l: b.left, t: b.top, w: b.width, h: b.height }; });
		ok('...at the pointer, wholly on screen', Math.abs(box.l - pile.x) < 40 && Math.abs(box.t - pile.y) < 40 && box.l + box.w <= 1400 && box.t + box.h <= 900, J(box));
		const pr = await rowBtn('Pump PU9');
		await pr.hover(); await S.settle(200);
		ok('hovering a row marks exactly that element on the map (no stale mark beside it)', J(await hovered()) === J(['link:PU9']), J(await hovered()));
		if (SHOTS) { await page.screenshot({ path: path.join(SHOTS, 'pick-chooser-desktop.png') }); }
		await page.keyboard.press('Escape');
		await S.settle(200);
		ok('Escape closes it', !(await chooserOpen()));
		ok('...with the selection as it was and the hover mark gone', J(await selected()) === J(['node:M']) && (await hovered()).length === 0, J([await selected(), await hovered()]));
		await click(pile);
		await click({ x: 700, y: 820 });
		ok('a press elsewhere on the map closes it', !(await chooserOpen()));
		ok('...and changes nothing: the junction M is still the selection', J(await selected()) === J(['node:M']), J(await selected()));
		await click(pile);
		await (await rowBtn('Pump PU9')).click();
		await S.settle(500);
		ok('choosing Pump PU9 selects it', J(await selected()) === J(['link:PU9']), J(await selected()));
		ok('...and opens its Properties, as a direct click would', (await popupTitle()) === 'PU9', String(await popupTitle()));
		ok('...and the box has closed', !(await chooserOpen()));
		await click(pile);
		await (await rowBtn('Pipe P2')).click();
		await S.settle(500);
		ok('the zero-length pipe, which nothing else can reach, is chosen the same way', J(await selected()) === J(['link:P2']) && (await popupTitle()) === 'P2', J(await selected()));
		await click(pile);
		const focused = () => page.evaluate(() => (document.activeElement && document.activeElement.textContent || '').trim());
		ok('the first row has the keyboard focus', (await focused()) === 'Junction J1', await focused());
		await page.keyboard.press('ArrowDown'); await page.keyboard.press('ArrowDown');
		ok('ArrowDown moves down the rows', (await focused()) === 'Junction J3', await focused());
		await page.keyboard.press('ArrowUp');
		ok('ArrowUp moves back', (await focused()) === 'Junction J2', await focused());
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('Enter');
		await S.settle(500);
		ok('Enter chooses the focused row (Junction J3)', J(await selected()) === J(['node:J3']) && !(await chooserOpen()), J(await selected()));
		ok('...and opens its Properties', (await popupTitle()) === 'J3', String(await popupTitle()));
		// Shift adds.
		await click(mid);
		await closeProps();
		await page.keyboard.down('Shift');
		await page.mouse.move(pile.x, pile.y); await page.mouse.click(pile.x, pile.y);
		await page.keyboard.up('Shift');
		await S.settle(450);
		ok('a Shift-held click on the assembly opens the box and leaves the selection alone', (await chooserOpen()) && J(await selected()) === J(['node:M']), J(await selected()));
		await page.keyboard.down('Shift');
		await (await rowBtn('Junction J2')).click();
		await page.keyboard.up('Shift');
		await S.settle(450);
		ok('...and choosing a row adds it to the selection, as a Shift-click on it would', J(await selected()) === J(['node:J2', 'node:M']), J(await selected()));
		// A right-click that dismisses the box opens no context menu (review item 3).
		await click(mid); await closeProps();
		await click(pile);
		ok('(the box is open for the right-click test)', await chooserOpen());
		await page.mouse.move(mid.x, mid.y); await page.mouse.click(mid.x, mid.y, { button: 'right' }); await S.settle(500);
		ok('a right-click on a junction while the box is open closes the box', !(await chooserOpen()));
		ok('...and opens no context menu', (await page.$$('.lpn-pane-ctxmenu')).length === 0);
		ok('...and leaves the selection alone', J(await selected()) === J(['node:M']), J(await selected()));
		// A pan from bare map still clears the selection (Task 415), and a drag leaves no box behind.
		await page.mouse.move(700, 820); await page.mouse.down();
		for (let i = 1; i <= 6; i++) { await page.mouse.move(700 + i * 10, 820 - i * 4); await sleep(20); }
		await page.mouse.up(); await S.settle(400);
		ok('a pan from bare map clears the selection, as it always did', (await selected()).length === 0 && !(await chooserOpen()), J(await selected()));
		await page.mouse.move(760, 796); await page.mouse.down();
		for (let i = 1; i <= 6; i++) { await page.mouse.move(760 - i * 10, 796 + i * 4); await sleep(20); }
		await page.mouse.up(); await S.settle(400);
		const pileNow = await centre('#lpn_canvas [data-node="J1"]');
		ok('(the map is back where it was)', Math.abs(pileNow.x - pile.x) < 1.5 && Math.abs(pileNow.y - pile.y) < 1.5, J([pile, pileNow]));
		// A drag from the assembly.
		await click({ x: 700, y: 820 });
		const before = await page.evaluate(() => ['J1', 'J2', 'J3'].map((id) => { const r = document.querySelector('#lpn_canvas circle.lpn-node[data-node="' + id + '"]').getBoundingClientRect(); return Math.round(r.left); }));
		await page.mouse.move(pile.x, pile.y); await page.mouse.down();
		for (let i = 1; i <= 8; i++) { await page.mouse.move(pile.x + i * 12, pile.y + i * 3); await sleep(20); }
		await page.mouse.up(); await S.settle(500);
		const after = await page.evaluate(() => ['J1', 'J2', 'J3'].map((id) => { const r = document.querySelector('#lpn_canvas circle.lpn-node[data-node="' + id + '"]').getBoundingClientRect(); return Math.round(r.left); }));
		const moved = after.filter((v, i) => Math.abs(v - before[i]) > 50).length;
		ok('a drag from the assembly moves the one element it grabbed, as it always did', moved === 1 && !(await chooserOpen()), J([before, after]));
		ok('...and selects it, at the first frame of the drag', (await selected()).length === 1 && (await selected())[0].indexOf('node:J') === 0, J(await selected()));
		await page.keyboard.press('Control+z'); await S.settle(500);

		console.log('\nC. Two pipes drawn over each other');
		await click({ x: 700, y: 820 });
		const dup = await page.evaluate(() => {
			const r = document.querySelector('#lpn_canvas .lpn-link-hit[data-link="Q1"]').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		});
		await click(dup);
		ok('a click where two pipes coincide opens the box', await chooserOpen(), J(await rows()));
		ok('...listing both', J(await rows()) === J(['Pipe Q1', 'Pipe Q2']), J(await rows()));
		await (await rowBtn('Pipe Q2')).click();
		await S.settle(500);
		ok('...and choosing Pipe Q2 selects Q2 and opens it', J(await selected()) === J(['link:Q2']) && (await popupTitle()) === 'Q2', J(await selected()));

		console.log('\nC2. A Text over coincident junctions is one more row');
		await click({ x: 700, y: 820 });
		const pile2 = await centre('#lpn_canvas [data-node="J4"]');
		await click(pile2);
		ok('a click on two coincident junctions with a Text over them opens the box', await chooserOpen(), J(await rows()));
		ok('...listing the two junctions and the Text by its words', J(await rows()) === J(['Junction J4', 'Junction J5', 'Text Booster']), J(await rows()));
		await (await rowBtn('Text Booster')).click();
		await S.settle(500);
		ok('...choosing the Text selects it and opens its Properties', (await page.evaluate(() => !!document.querySelector('#lpn_canvas text.lpn-lbl.lpn-selected'))) && J(await selected()) === J(['other']), J(await selected()));
		await closeProps();
		await click({ x: 700, y: 820 });
		const tx = await page.evaluate(() => { const r = document.querySelector('#lpn_canvas text.lpn-lbl[data-lbl="X1"]').getBoundingClientRect(); return { x: r.right - 6, y: r.top + r.height / 2 }; });
		await click(tx);
		ok('a click on the Text away from the junctions selects the Text with no box', !(await chooserOpen()) && J(await selected()) === J(['other']), J([tx, pile2, await rows(), await selected()]));

		console.log('\nF. A click right after a dismissed box (Perry saw one select differently once; tried to reproduce)');
		const quick = async (p) => { await page.mouse.move(p.x, p.y); await page.mouse.click(p.x, p.y); };
		await click({ x: 700, y: 820 });
		await click(onPipe);
		await closeProps();
		ok('(P1 is selected to start)', J(await selected()) === J(['link:P1']), J(await selected()));
		await click(pile);
		await page.keyboard.press('Escape');
		await quick(mid); await S.settle(450);
		ok('Escape, then at once a click on junction M: M is selected', J(await selected()) === J(['node:M']), J(await selected()));
		await closeProps();
		await click(onPipe); await closeProps();
		await click(pile);
		await click({ x: 700, y: 820 });
		await quick(mid); await S.settle(450);
		ok('a press on bare map to dismiss, then at once a click on M: M is selected', J(await selected()) === J(['node:M']), J(await selected()));
		await closeProps();
		await click(onPipe); await closeProps();
		await click(pile);
		await click(mid);
		ok('a press on M itself while the box is open only closes the box: the selection is unchanged', !(await chooserOpen()) && J(await selected()) === J(['link:P1']), J(await selected()));
		await quick(mid); await S.settle(450);
		ok('...and the next click on M selects it', J(await selected()) === J(['node:M']), J(await selected()));
		await S.page.close();

		// =========================================================== thick pipes
		console.log('\nE1. Two stacked THICK pipes, pressed 4 px off their centreline');
		const thick = JSON.parse(project); thick.settings.linkWidth = 10;
		const W = await Session.open(browser, NAME + '-w', { viewport: { width: 1400, height: 900 } });
		const projectKeep = project;
		await (async () => {
			W.page.on('pageerror', (e) => errors.push(String(e && e.message)));
			await W.page.addInitScript(() => { window.EC_DEFAULT_DOCKS = true; });
			await W.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
			await W.goto('Looped-Network.php?ec_nolog=1');
			await W.page.evaluate((t) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', t); localStorage.setItem('lpn_hovercard', 'off'); }, JSON.stringify(thick));
			await W.reload();
			await W.answerTrainingPanel().catch(() => {});
			await W.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			await W.settle(2500);
		})();
		const wt = tools(W);
		const q = await W.page.evaluate(() => { const r = document.querySelector('#lpn_canvas .lpn-link-hit[data-link="Q1"]').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, h: r.height }; });
		// The stroke width is in map units: scale it by the on-screen size of one map unit.
		const sw = await W.page.evaluate(() => { const el = document.querySelector('#lpn_canvas .lpn-link-hit[data-link="Q1"]'); const m = el.getScreenCTM(); return parseFloat(getComputedStyle(el).strokeWidth) * Math.hypot(m.a, m.b); });
		ok('the pipes are drawn thick (the grab stroke is 10 px across)', sw >= 9.5 && sw <= 10.5, String(sw));
		await wt.click({ x: q.x, y: q.y + 3 });   // the stroke's centre is 1 px above the box's top edge: 4 px off
		ok('a press 4 px off the centreline opens the box listing both pipes', J(await wt.rows()) === J(['Pipe Q1', 'Pipe Q2']), J(await wt.rows()));
		await W.page.keyboard.press('Escape');
		await wt.click({ x: q.x, y: q.y + 8 });
		ok('...and 8 px off, outside the stroke, opens no box', !(await wt.chooserOpen()));
		await W.page.close();

		// =========================================================== a phone, a finger
		console.log('\nD. A phone, 390 x 844, a finger');
		const T = await Session.open(browser, NAME + '-p', { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
		await open(T);
		const t = tools(T);
		const cdp = await T.page.context().newCDPSession(T.page);
		const tap = async (p) => {
			await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: p.x, y: p.y, id: 1 }] });
			await sleep(60);
			await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
			await T.settle(600);
		};
		const tpile = await t.centre('#lpn_canvas [data-node="J1"]'), tmid = await t.centre('#lpn_canvas [data-node="M"]');
		ok('the phone shows the assembly and the junction on the pipe', !!tpile && !!tmid && tpile.x > 0 && tpile.x < 390 && tmid.x > 0 && tmid.x < 390, J([tpile, tmid]));
		await tap(tmid);
		ok('a tap on the junction on the pipe selects it with no box', J(await t.selected()) === J(['node:M']) && !(await t.chooserOpen()), J(await t.selected()));
		await t.closeProps();
		await tap(tpile);
		if (!(await t.chooserOpen())) { console.log('  (debug) top elements at the pile: ' + J(await T.page.evaluate((p) => document.elementsFromPoint(p.x, p.y).slice(0, 5).map((e) => e.tagName + '.' + String(e.className && e.className.baseVal !== undefined ? e.className.baseVal : e.className).slice(0, 40)), tpile))); }
		ok('a tap on the assembly opens the box (it stays open: the lift is not a press elsewhere)', await t.chooserOpen());
		ok('...with the same five rows', J(await t.rows()) === J(['Junction J1', 'Junction J2', 'Junction J3', 'Pipe P2', 'Pump PU9']), J(await t.rows()));
		const heights = await T.page.$$eval('.lpn-pick-chooser button', (bs) => bs.map((b) => Math.round(b.getBoundingClientRect().height)));
		ok('...each row finger-sized (at least 44 px tall)', heights.length === 5 && heights.every((h) => h >= 44), J(heights));
		const inView = await T.page.evaluate(() => { const b = document.querySelector('.lpn-pick-chooser').getBoundingClientRect(); return b.left >= 0 && b.top >= 0 && b.right <= innerWidth && b.bottom <= innerHeight; });
		ok('...and the box lies wholly on the screen', inView);
		if (SHOTS) { await T.page.screenshot({ path: path.join(SHOTS, 'pick-chooser-phone.png') }); }
		const prow = await t.rowBtn('Pump PU9');
		const rb = await prow.boundingBox();
		await tap({ x: rb.x + rb.width / 2, y: rb.y + rb.height / 2 });
		ok('a tap on a row chooses it and closes the box', J(await t.selected()) === J(['link:PU9']) && !(await t.chooserOpen()), J(await t.selected()));
		await tap(tpile);
		await tap({ x: 195, y: 790 });
		ok('a tap elsewhere on the map closes the box and changes nothing', !(await t.chooserOpen()) && J(await t.selected()) === J(['link:PU9']), J(await t.selected()));
		// E2. a pipe within a finger's reach of a pile is one more row (review item 2). The pipe P6 leaves the
		// J6/J7 pile (no pump symbol and no Text over it, as the assembly and the J4/J5 pile have).
		const tp2 = await t.centre('#lpn_canvas [data-node="J6"]');
		const nearP6 = { x: tp2.x, y: tp2.y + 15 };
		await t.closeProps();
		await tap(nearP6);
		ok('a finger on pipe P6, 15 px from the pile, gets the pile and the pipe', J(await t.rows()) === J(['Junction J6', 'Junction J7', 'Pipe P6']), J([await t.rows(), nearP6, await T.page.evaluate((p) => document.elementsFromPoint(p.x, p.y).slice(0, 6).map((e) => e.tagName + '.' + String(e.getAttribute('class')) + '#' + (e.dataset.link || e.dataset.node || e.dataset.nodelbl || e.dataset.linklbl || e.dataset.lbl || '')), nearP6)]));
		await (async () => { const b = await t.rowBtn('Pipe P6'); const bb = await b.boundingBox(); await tap({ x: bb.x + bb.width / 2, y: bb.y + bb.height / 2 }); })();
		ok('...and choosing Pipe P6 selects it, which nothing could do there before', J(await t.selected()) === J(['link:P6']) && !(await t.chooserOpen()), J(await t.selected()));
		await t.closeProps();
		// E3. a long press that dismisses the box opens no context menu (review item 3).
		await tap(tpile);
		ok('(the box is open for the long-press test)', await t.chooserOpen());
		const tmidNow = await t.centre('#lpn_canvas [data-node="M"]');
		await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: tmidNow.x, y: tmidNow.y, id: 1 }] });
		await sleep(900);
		await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
		await T.settle(500);
		ok('a long press on a junction while the box is open closes the box', !(await t.chooserOpen()));
		ok('...and opens no context menu', (await T.page.$$('.lpn-pane-ctxmenu')).length === 0);
		await T.page.keyboard.press('Escape');
		// E4. near the right and bottom edges (review item 1): pan the pile there with a finger.
		const pan = async (from, dx, dy) => {
			await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: from.x, y: from.y, id: 1 }] });
			for (let i = 1; i <= 8; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: from.x + dx * i / 8, y: from.y + dy * i / 8, id: 1 }] }); await sleep(25); }
			await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
			await T.settle(500);
		};
		const bare = await T.page.evaluate(() => { for (let y = 250; y < 330; y += 10) { for (let x = 150; x < 215; x += 10) { const el = document.elementsFromPoint(x, y)[0]; if (el && el.tagName.toLowerCase() === 'svg') { return { x, y }; } } } return null; });
		const p0 = await t.centre('#lpn_canvas [data-node="J1"]');
		await pan(bare || { x: 195, y: 300 }, 355 - p0.x, 650 - p0.y);
		const edge = await t.centre('#lpn_canvas [data-node="J1"]');
		ok('the pile is now near the right and bottom edges', edge.x > 330 && edge.y > 620, J(edge));
		await t.closeProps();
		const tapFast = async (p) => {
			await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: p.x, y: p.y, id: 1 }] });
			await sleep(60);
			await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
		};
		const selBefore = await t.selected();
		await tapFast(edge);
		await sleep(40);
		const shield = await T.page.evaluate((p) => {
			const b = document.querySelector('.lpn-pick-chooser button'); if (!b) { return null; }
			const r = b.getBoundingClientRect(), top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
			return { rowIsHit: top === b, n: document.querySelectorAll('.lpn-pick-chooser button').length };
		}, edge);
		ok('a tap near the edges opens the box', !!shield && shield.n === 5, J(shield));
		ok('...and in the first instants no row answers a touch (the lift\'s compatibility click lands on nothing)', shield && shield.rowIsHit === false, J(shield));
		await T.settle(600);
		const geo = await T.page.evaluate((p) => {
			const b = document.querySelector('.lpn-pick-chooser'); if (!b) { return null; }
			const r = b.getBoundingClientRect(), first = b.querySelector('button').getBoundingClientRect();
			return { contains: p.x >= r.left - 1 && p.x <= r.right + 1 && p.y >= r.top - 1 && p.y <= r.bottom + 1, inView: r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight, firstHit: document.elementFromPoint(first.left + first.width / 2, first.top + first.height / 2) === b.querySelector('button') };
		}, edge);
		ok('...with no row under the press point and the whole box on screen', !!geo && geo.contains === false && geo.inView, J(geo));
		ok('...after the lift the rows answer touches again', !!geo && geo.firstHit);
		ok('...and the tap chose nothing', (await t.chooserOpen()) && J(await t.selected()) === J(selBefore), J(await t.selected()));
		await T.page.close();

		ok('no page error', errors.length === 0, errors.join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(failures ? '\nFAILED: ' + failures + ' of ' + checks : '\nALL PASS (' + checks + ' checks)');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
