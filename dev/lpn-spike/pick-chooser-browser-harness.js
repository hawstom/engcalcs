// **THE PICK CHOOSER** (Tom, 2026-11-14: "a disambiguating chooser when there are
// multiple elements in one click such as when any assembly is exploded"). Real Chromium, real
// presses, on dev/lpn-spike/fixtures/pick-chooser.lwn: junction M lying on pipe P1; an exploded pump
// assembly (junctions J1, J2, J3 at one point, a zero-length pump PU9 and a zero-length pipe P2
// between them); two pipes Q1 and Q2 drawn over each other.
//   A. The ordinary click is untouched: a junction on a pipe selects the junction and opens its
//      Properties with no box; a pipe alone selects the pipe; bare map selects nothing.
//   B. A click on the exploded assembly opens a box listing each symbol as its type word and ID (and
//      its zero-length pipe, which is a point; never a pipe that is a visible line);
//      nothing is selected until a row is chosen; Escape and a press elsewhere on the map close it
//      with the selection as it was; choosing a row selects that element and opens its Properties;
//      the arrow keys and Enter choose; a Shift-held click adds the chosen element to the selection;
//      a drag from the assembly still moves what it grabbed (and selects it); hovering a row marks
//      that element on the map.
//   C. Two pipes drawn over each other open no box (a pipe is never a row); two coincident junctions
//      with a Text over them offer the Text as one more row.
//   D. A phone (390 x 844, touch): a tap on the assembly opens the box, its rows are finger-sized
//      (at least 44 px), a tap on a row chooses it; a tap on the junction on the pipe opens no box;
//      a tap between two dots inside the finger's disc opens the box of the two (round 7).
//   G. Tom's 2026-11-15 and 11-16 calls: the symbols are a node, a pump or valve glyph, a Text and a
//      Shape that is not a line, and the box opens where one the press lands on visibly overlaps
//      another under the pickbox; no pipe and no open Shape line is ever a row; a press elsewhere on
//      the map closes the box and goes through. A Shape point on a junction offers both.
//   I. Round 3: eight junctions at one point give six rows; two dots overlapping by 0.4 of a width or
//      more give a box, two that only touch give none; two separate dots and the short pipe between
//      them give none; an open Shape line crossing a pipe gives none; a junction on a closed Shape's
//      outline gives the junction and the Shape. A tap on a tank's ink beside a nearer junction centre
//      selects the tank.
//   K. Round 6: the box opens only when the pressed POINT is on the ink of two or more symbols. A press on
//      the overlap of a junction and a pump or valve opens a box of the two; a press on the free part of the
//      same glyph selects it with no box; a junction with no glyph ink under its centre opens none; the
//      pump's line away from its symbol opens none; a mouse. A finger is a disc (round 7): beside a glyph it
//      opens the box of the glyph and the junction its disc touches.
//   L. Round 6: a junction wholly under a tank is in the box from a press anywhere on the tank.
//   M. A 390 px phone, taps at x = 180 near the top, middle and bottom on the pile: the box has no row
//      under the press and lies wholly on screen.
//   E. Review fixes: a finger's tap near the right and bottom edges opens the box with no row under the
//      press and no row answering the lift's compatibility click; a pipe a finger taps within reach of
//      the pile is not a row (the pile's junctions are); a right-click or a long press that dismisses the box opens no
//      context menu; two stacked THICK pipes still open no box 4 px off their centreline; hovering a
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
	const open = async (S, text) => {
		S.page.on('pageerror', (e) => errors.push(String(e && e.message)));
		await S.page.addInitScript(() => { window.EC_DEFAULT_DOCKS = true; });
		await S.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
		await S.goto('Looped-Network.php?ec_nolog=1');
		await S.page.evaluate((t) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', t); localStorage.setItem('lpn_hovercard', 'off'); }, text || project);
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
		const want = ['Junction J3', 'Junction J1', 'Junction J2', 'Pump PU9', 'Pipe P2'];   // the one a plain click would hit (J3, drawn on top) first; the buried pipe, never the reason for a box, last
		ok('...listing the symbols there as their type word and ID, the plain-click element first, then by distance, with the zero-length pipe (a point, not a line) last but not the long pipes that end there', J(await rows()) === J(want), J(await rows()));
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
		ok('...and goes through: on bare map that is what a bare-map click always does, it clears the selection', (await selected()).length === 0, J(await selected()));
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
		ok('the first row has the keyboard focus', (await focused()) === 'Junction J3', await focused());
		await page.keyboard.press('ArrowDown'); await page.keyboard.press('ArrowDown');
		ok('ArrowDown moves down the rows', (await focused()) === 'Junction J2', await focused());
		await page.keyboard.press('ArrowUp');
		ok('ArrowUp moves back', (await focused()) === 'Junction J1', await focused());
		await page.keyboard.press('ArrowDown');
		await page.keyboard.press('Enter');
		await S.settle(500);
		ok('Enter chooses the focused row (Junction J2)', J(await selected()) === J(['node:J2']) && !(await chooserOpen()), J(await selected()));
		ok('...and opens its Properties', (await popupTitle()) === 'J2', String(await popupTitle()));
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
		ok('...and goes through: the junction\'s context menu opens', (await page.$$('.lpn-pane-ctxmenu')).length === 1);
		ok('...and leaves the selection alone, as a right-click always does', J(await selected()) === J(['node:M']), J(await selected()));
		await page.keyboard.press('Escape'); await S.settle(200);
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

		console.log('\nC. Two pipes drawn over each other: a pipe is never a row');
		await click({ x: 700, y: 820 });
		const dup = await page.evaluate(() => {
			const r = document.querySelector('#lpn_canvas .lpn-link-hit[data-link="Q1"]').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		});
		await click(dup);
		ok('a click where two pipes coincide opens no box', !(await chooserOpen()), J(await rows()));
		ok('...and is an ordinary click: one of the pipes is selected', (await selected()).length === 1 && (await selected())[0].indexOf('link:Q') === 0, J(await selected()));

		console.log('\nC2. A Text over coincident junctions is one more row');
		await click({ x: 700, y: 820 });
		const pile2 = await centre('#lpn_canvas [data-node="J4"]');
		await click(pile2);
		ok('a click on two coincident junctions with a Text over them opens the box', await chooserOpen(), J(await rows()));
		ok('...listing the two junctions and the Text by its words', J(await rows()) === J(['Text Booster', 'Junction J4', 'Junction J5']), J(await rows()));
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
		ok('a click on M while the box is open closes the box and goes through: M is selected', !(await chooserOpen()) && J(await selected()) === J(['node:M']), J(await selected()));
		await closeProps();
		await click(pile);
		await click(onPipe);
		ok('a click on a pipe while the box is open closes it and selects that pipe', !(await chooserOpen()) && J(await selected()) === J(['link:P1']), J(await selected()));
		await closeProps();

		console.log('\nG. A Shape snapped onto a junction (Tom, 2026-11-15: "you missed Shape")');
		await click({ x: 700, y: 820 });
		const w1 = await centre('#lpn_canvas [data-node="W1"]');
		await click(w1);
		ok('a click where a Shape point lies on a junction opens the box', await chooserOpen(), J(await rows()));
		ok('...listing the junction and the Shape, named as the Shape tool names it', J(await rows()) === J(['Junction W1', 'Shape S1']), J(await rows()));
		const shapeSel = () => page.evaluate(() => !!document.querySelector('#lpn_canvas .lpn-shape.lpn-selected'));
		await (await rowBtn('Shape S1')).click();
		await S.settle(450);
		ok('...choosing the Shape selects the Shape (what no click could reach before)', (await shapeSel()) && (await selected()).indexOf('node:W1') < 0, J(await selected()));
		await click({ x: 700, y: 820 });
		await click(w1);
		await (await rowBtn('Junction W1')).click();
		await S.settle(450);
		ok('...and choosing the junction selects the junction', J(await selected()) === J(['node:W1']) && !(await shapeSel()), J(await selected()));
		await closeProps();

		console.log('\nH. Review fixes: keys typed in the box, a network that changes under it');
		await click({ x: 700, y: 820 });
		await click(mid); await closeProps();
		await click(pile);
		ok('(the box is open over a selected junction M)', (await chooserOpen()) && J(await selected()) === J(['node:M']));
		await page.keyboard.press('Delete'); await S.settle(300);
		await page.keyboard.press('Backspace'); await S.settle(300);
		ok('Delete and Backspace typed in the box do not delete the selection it left alone', (await page.$$('#lpn_canvas [data-node="M"]')).length > 0 && (await chooserOpen()), J(await selected()));
		await page.keyboard.press('Escape'); await S.settle(200);
		// Undo while the box is open closes it.
		await click({ x: 700, y: 820 });
		await page.mouse.move(mid.x, mid.y); await page.mouse.down();
		for (let i = 1; i <= 6; i++) { await page.mouse.move(mid.x, mid.y + i * 8); await sleep(20); }
		await page.mouse.up(); await S.settle(400);
		const midMoved = await centre('#lpn_canvas [data-node="M"]');
		ok('(M was dragged 48 px down)', midMoved && Math.abs(midMoved.y - mid.y - 48) < 3, J([mid, midMoved]));
		await closeProps();
		await click(pile);
		ok('(the box is open over the changed map)', await chooserOpen());
		await page.keyboard.press('Control+z'); await S.settle(500);
		const midBack = await centre('#lpn_canvas [data-node="M"]');
		ok('Undo with the box open undoes the move', midBack && Math.abs(midBack.y - mid.y) < 3, J(midBack));
		ok('...and closes the box, whose rows belong to the drawing that was undone', !(await chooserOpen()));

		console.log('\nI. Round 3 (Tom, 2026-11-16): only symbols, only where they visibly overlap, at most six rows');
		await click({ x: 700, y: 820 });
		await closeProps();
		const zc = await centre('#lpn_canvas [data-node="Z1"]');
		await click(zc);
		ok('eight junctions at one point open a box of at most six rows', (await rows()).length === 6, J(await rows()));
		ok('...all of them from the pile, the one a plain click hits (Z8, drawn on top) first', (await rows()).every((r) => /^Junction Z[1-8]$/.test(r)) && (await rows())[0] === 'Junction Z8', J(await rows()));
		await page.keyboard.press('Escape'); await S.settle(200);
		await click({ x: 700, y: 820 });
		const o1 = await centre('#lpn_canvas [data-node="O1"]');
		await click(o1);
		ok('two junctions overlapping by half a width or more open a box', J((await rows()).slice().sort()) === J(['Junction O1', 'Junction O2']), J(await rows()));
		await page.keyboard.press('Escape'); await S.settle(200);
		await click({ x: 700, y: 820 });
		const g1 = await centre('#lpn_canvas [data-node="G1"]'), g2 = await centre('#lpn_canvas [data-node="G2"]');
		ok('(the dots G1 and G2 are drawn touching but not overlapping deeply: centres one dot width apart)', Math.abs(Math.hypot(g1.x - g2.x, g1.y - g2.y) - 12) < 2, J([g1, g2]));
		await click(g1);
		ok('a click on a dot that only touches its neighbour opens no box', !(await chooserOpen()) && J(await selected()) === J(['node:G1']), J([await rows(), await selected()]));
		await closeProps();
		await click({ x: 700, y: 820 });
		const n1 = await centre('#lpn_canvas [data-node="N1"]'), n2 = await centre('#lpn_canvas [data-node="N2"]');
		ok('(the separate dots N1 and N2 are drawn apart, clear of each other)', Math.hypot(n1.x - n2.x, n1.y - n2.y) > 12, J([n1, n2]));
		await click({ x: n1.x + 3, y: n1.y });
		ok('a click on a dot whose neighbour is a separate dot opens no box and selects the dot', !(await chooserOpen()) && J(await selected()) === J(['node:N1']), J([await rows(), await selected()]));
		await closeProps();
		await click({ x: 700, y: 820 });
		await click({ x: (n1.x + n2.x) / 2, y: n1.y });
		ok('a click on the short pipe between them opens no box (a pipe is never a row)', !(await chooserOpen()) && J(await selected()) === J(['link:NP']), J([await rows(), await selected()]));
		await closeProps();
		await click({ x: 700, y: 820 });
		const cross = await page.evaluate(() => { const r = document.querySelector('#lpn_canvas .lpn-shape[data-shape="S2"] .lpn-shape-line').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
		await click(cross);
		ok('a click where an open Shape line crosses a pipe opens no box', !(await chooserOpen()), J([cross, await rows(), await selected()]));
		await closeProps();
		await click({ x: 700, y: 820 });
		const k2 = await centre('#lpn_canvas [data-node="K2"]');
		await click(k2);
		ok('a click on a junction on the outline of a closed Shape opens the box: the junction and the Shape', J(await rows()) === J(['Junction K2', 'Shape S3']), J(await rows()));
		await page.keyboard.press('Escape'); await S.settle(200);
		await S.page.close();

		// =========================================================== thick pipes
		console.log('\nE1. Two stacked THICK pipes, pressed 4 px off their centreline: still no box');
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
		ok('a press 4 px off the centreline opens no box (a pipe is never a row)', !(await wt.chooserOpen()), J(await wt.rows()));
		ok('...and selects a pipe, as an ordinary click', (await wt.selected()).length === 1, J(await wt.selected()));
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
		const tn1 = await t.centre('#lpn_canvas [data-node="N1"]'), tn2 = await t.centre('#lpn_canvas [data-node="N2"]');
		await tap({ x: tn1.x + 4, y: tn1.y });
		ok('a tap between two separate dots, both inside the finger\'s disc, opens a box of the two, the nearer first, and selects nothing yet', J(await t.rows()) === J(['Junction N1', 'Junction N2']), J([tn1, tn2, await t.rows(), await t.selected()]));
		await T.page.keyboard.press('Escape'); await T.settle(200);
		await t.closeProps();
		// A tank's own ink beside a junction whose centre is nearer: the finger is on the tank.
		const tk = await T.page.evaluate(() => {
			const r = document.querySelector('#lpn_canvas path.lpn-node-hit[data-node="TK"]').getBoundingClientRect(), j = document.querySelector('#lpn_canvas circle.lpn-node[data-node="TJ"]').getBoundingClientRect();
			return { l: r.left, r: r.right, t: r.top, b: r.bottom, jx: j.left + j.width / 2, jy: j.top + j.height / 2 };
		});
		const tkEdge = { x: tk.r - 2, y: tk.t + 4 };
		await tap(tkEdge);
		ok('a tap on a tank\'s ink edge, with a junction centre nearer than the tank\'s: a box of the two, the tank first (the finger\'s disc touches both)', J(await t.rows()) === J(['Tank TK', 'Junction TJ']) && Math.hypot(tkEdge.x - tk.jx, tkEdge.y - tk.jy) < Math.hypot(tkEdge.x - (tk.l + tk.r) / 2, tkEdge.y - (tk.t + tk.b) / 2), J([tk, tkEdge, await t.rows(), await t.selected()]));
		await T.page.keyboard.press('Escape'); await T.settle(200);
		await t.closeProps();
		await tap(tpile);
		if (!(await t.chooserOpen())) { console.log('  (debug) top elements at the pile: ' + J(await T.page.evaluate((p) => document.elementsFromPoint(p.x, p.y).slice(0, 5).map((e) => e.tagName + '.' + String(e.className && e.className.baseVal !== undefined ? e.className.baseVal : e.className).slice(0, 40)), tpile))); }
		ok('a tap on the assembly opens the box (it stays open: the lift is not a press elsewhere)', await t.chooserOpen());
		ok('...with the same five rows', J(await t.rows()) === J(['Junction J1', 'Junction J2', 'Junction J3', 'Pump PU9', 'Pipe P2']), J(await t.rows()));
		const heights = await T.page.$$eval('.lpn-pick-chooser button', (bs) => bs.map((b) => Math.round(b.getBoundingClientRect().height)));
		ok('...each row finger-sized (at least 44 px tall)', heights.length === 5 && heights.every((h) => h >= 44), J(heights));
		const inView = await T.page.evaluate(() => { const b = document.querySelector('.lpn-pick-chooser').getBoundingClientRect(); return b.left >= 0 && b.top >= 0 && b.right <= innerWidth && b.bottom <= innerHeight; });
		ok('...and the box lies wholly on the screen', inView);
		if (SHOTS) { await T.page.screenshot({ path: path.join(SHOTS, 'pick-chooser-phone.png') }); }
		const prow = await t.rowBtn('Pump PU9');
		const rb = await prow.boundingBox();
		await tap({ x: rb.x + rb.width / 2, y: rb.y + rb.height / 2 });
		ok('a tap on a row chooses it and closes the box', J(await t.selected()) === J(['link:PU9']) && !(await t.chooserOpen()), J(await t.selected()));
		await t.closeProps();
		await tap(tpile);
		ok('(the box is open for the tap-elsewhere test)', await t.chooserOpen());
		// A bare point of the map that the box does not cover.
		const bareAway = await T.page.evaluate(() => {
			const b = document.querySelector('.lpn-pick-chooser').getBoundingClientRect();
			for (let y = 830; y > 200; y -= 20) { for (let x = 20; x < 380; x += 20) {
				if (x >= b.left - 10 && x <= b.right + 10 && y >= b.top - 10 && y <= b.bottom + 10) { continue; }
				const el = document.elementsFromPoint(x, y)[0]; if (el && el.tagName.toLowerCase() === 'svg') { return { x, y }; }
			} }
			return null;
		});
		await tap(bareAway || { x: 195, y: 790 });
		ok('a tap elsewhere on the map closes the box and goes through: bare map clears the selection', !(await t.chooserOpen()) && (await t.selected()).length === 0, J(await t.selected()));
		// E2. a finger near the J6/J7 pile on pipe P6: the pipe is never a row.
		const tp2 = await t.centre('#lpn_canvas [data-node="J6"]');
		const nearP6 = { x: tp2.x, y: tp2.y + 15 };
		await t.closeProps();
		await tap(nearP6);
		ok('a finger on pipe P6, 15 px from the pile (on no symbol), opens the box of the pile\'s junctions J6 and J7, and no pipe', J(await t.rows()) === J(['Junction J6', 'Junction J7']), J([await t.rows(), nearP6]));
		await T.page.keyboard.press('Escape'); await T.settle(200);
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
		ok('...and goes through: the junction\'s context menu opens', (await T.page.$$('.lpn-pane-ctxmenu')).length === 1);
		await T.page.keyboard.press('Escape');
		// E4. near the right and bottom edges (review item 1): pan the pile there with a finger.
		const pan = async (from, dx, dy) => {
			await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: from.x, y: from.y, id: 1 }] });
			for (let i = 1; i <= 8; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: from.x + dx * i / 8, y: from.y + dy * i / 8, id: 1 }] }); await sleep(25); }
			await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
			await T.settle(500);
		};
		const bare = await T.page.evaluate(() => { const isBare = (x, y) => { const el = document.elementsFromPoint(x, y)[0]; return !!el && el.tagName.toLowerCase() === 'svg'; }; const spots = []; for (let y = 250; y < 700; y += 10) { for (let x = 90; x < 330; x += 10) { spots.push({ x, y, d: Math.hypot(x - 195, y - 300) }); } } spots.sort((p, q) => p.d - q.d); for (const p of spots) { if (isBare(p.x, p.y) && isBare(p.x + 25, p.y) && isBare(p.x - 25, p.y) && isBare(p.x, p.y + 25) && isBare(p.x, p.y - 25)) { return { x: p.x, y: p.y }; } } return null; });
		const p0 = await t.centre('#lpn_canvas [data-node="J1"]');
		await pan(bare || { x: 195, y: 300 }, 355 - p0.x, 650 - p0.y);
		const edge = await t.centre('#lpn_canvas [data-node="J1"]');
		ok('the pile is now near the right and bottom edges', edge.x > 330 && edge.y > 620, J([edge, p0, bare]));
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


		// =========================================================== round 6: only the pressed point's ink counts
		console.log('\nK. Round 6 (Tom, 2026-11-16): the box opens only when the PRESSED POINT is on the ink of two or more symbols, a mouse and a finger');
		const proj4 = JSON.parse(project); proj4.view = { cx: 135, cy: -57, s: 3.5 };
		// Each glyph's junction sits over the glyph's ink at its middle or end; the box is for the press ON the overlap.
		const cases4 = [['PA', 'pump', 'Pump PA', 'Junction PAj', 'a junction at the middle of a pump'], ['PB', 'pump', 'Pump PB', 'Junction PBj', 'a junction over the tail end of a pump'],
			['VA', 'valve', 'Valve VA', 'Junction VAj', 'a junction at the middle of a valve']];
		// Ink in the page: the glyph's silhouette (isPointInFill) and the junction's disc with its stroke.
		const inkProbe = (page, lid) => page.evaluate((lid) => {
			const g = document.querySelector('#lpn_canvas path.lpn-link-symbol-hit[data-link="' + lid + '"]'), n = document.querySelector('#lpn_canvas circle.lpn-node[data-node="' + lid + 'j"]');
			const gb = g.getBoundingClientRect(), nb = n.getBoundingClientRect(), svg = n.ownerSVGElement, P = svg.createSVGPoint(), gm = g.getScreenCTM().inverse(), nm = n.getScreenCTM().inverse();
			const L = (m, x, y) => { P.x = x; P.y = y; return P.matrixTransform(m); };
			const cx = nb.left + nb.width / 2, cy = nb.top + nb.height / 2, r = nb.width / 2;
			let best = null, over = null;
			for (let x = gb.left; x <= gb.right; x += 0.5) {
				for (let y = gb.top; y <= gb.bottom; y += 0.5) {
					if (!g.isPointInFill(L(gm, x, y))) { continue; }
					const d = Math.hypot(x - cx, y - cy);
					if (d > r + 4 && (!best || d > best.d)) { best = { x, y, d }; }   // glyph ink, well clear of the disc
					if (d < r - 1 && (!over || d < over.d)) { over = { x, y, d }; }   // glyph ink inside the disc
				}
			}
			return { free: best, over: over, centre: { x: cx, y: cy }, centreOnGlyph: g.isPointInFill(L(gm, cx, cy)) };
		}, lid);
		for (const touch of [false, true]) {
			const K = await Session.open(browser, NAME + '-k' + (touch ? 'p' : 'd'), touch ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } : { viewport: { width: 1400, height: 900 } });
			await open(K, JSON.stringify(proj4));
			const kt = tools(K), kcdp = touch ? await K.page.context().newCDPSession(K.page) : null;
			const press = async (p) => {
				if (touch) {
					await kcdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: p.x, y: p.y, id: 1 }] });
					await sleep(60);
					await kcdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
					await K.settle(600);
				} else { await kt.click(p); }
			};
			const away = async () => { await press({ x: touch ? 195 : 700, y: touch ? 800 : 880 }); };
			const who = touch ? 'a tap' : 'a click';
			for (const [lid, typ, linkRow, nodeRow, what] of cases4) {
				const ink = await inkProbe(K.page, lid);
				// On the overlap: a point on the glyph's ink inside the junction's disc.
				ok('(' + what + ': the glyph has ink under the disc)', !!ink.over, J(ink));
				await press(ink.over || ink.centre);
				ok(who + ' on the overlap of ' + what + ' opens a box of the junction and the ' + typ, J((await kt.rows()).slice().sort()) === J([linkRow, nodeRow].sort()), J(await kt.rows()));
				ok('...nothing is selected yet', (await kt.selected()).length === 0, J(await kt.selected()));
				const lr = await kt.rowBtn(linkRow), lb = await lr.boundingBox();
				await press({ x: lb.x + lb.width / 2, y: lb.y + lb.height / 2 });
				ok('...and choosing the ' + typ + ' selects it', J(await kt.selected()) === J(['link:' + lid]), J(await kt.selected()));
				await kt.closeProps();
				await away();
				// Away from the junction: the free part of the same symbol is just the symbol.
				ok('(' + what + ': the glyph has ink clear of the disc)', !!ink.free, J(ink));
				await press(ink.free || ink.centre);
				// A finger is a disc of its reach (Tom, 2026-11-18): the disc round the free part of a glyph reaches the junction
				// too, so on a phone this is a box of the two, selecting nothing yet; a mouse selects the glyph.
				const sel = await kt.selected(), krows = (await kt.rows()).slice().sort();
				if (touch) {
					ok(who + ' on the free part of ' + what + ' opens the box of the ' + typ + ' and the junction its disc also touches, selecting nothing yet', J(krows) === J([linkRow, nodeRow].sort()) && sel.length === 0, J([krows, sel, ink.free]));
					await K.page.keyboard.press('Escape'); await K.settle(200);
				} else {
					ok(who + ' on the free part of ' + what + ' selects exactly one thing, the ' + typ + ' with no box', !(await kt.chooserOpen()) && sel.length === 1 && sel[0] === 'link:' + lid, J([await kt.rows(), sel, ink.free]));
				}
				await kt.closeProps();
				await away();
			}
			// A junction the glyph's ink does not reach under: the press on the junction is the junction alone.
			for (const [lid, typ] of [['VB', 'valve'], ['PN', 'pump'], ['VN', 'valve']]) {
				const jn = await kt.centre('#lpn_canvas [data-node="' + lid + 'j"]');
				await press(jn);
				if (touch) {
					const jr = (await kt.rows()).slice().sort();
					ok(who + ' on a junction beside a ' + typ + ' symbol, the symbol inside the finger\'s disc, opens the box of the two', jr.length === 2 && jr.some((x) => x === 'Junction ' + lid + 'j') && jr.some((x) => new RegExp('^(Pump|Valve) ' + lid + '$').test(x)), J([jr, await kt.selected()]));
					await K.page.keyboard.press('Escape'); await K.settle(200);
				} else {
					ok(who + ' on a junction beside a ' + typ + ' symbol (no ink under the point) opens no box and selects the junction', !(await kt.chooserOpen()) && J(await kt.selected()) === J(['node:' + lid + 'j']), J([await kt.rows(), await kt.selected()]));
				}
				await kt.closeProps();
				await away();
			}
			// The link's LINE is not a symbol: the line well clear of the symbol selects the pump, no box.
			const ga = await K.page.evaluate(() => { const r = document.querySelector('#lpn_canvas path.lpn-link-symbol-hit[data-link="PA"]').getBoundingClientRect(), n = document.querySelector('#lpn_canvas circle.lpn-node[data-node="PAa"]').getBoundingClientRect(); return { x: (r.left + n.right) / 2 - 6, y: r.top + r.height / 2 }; });
			await press({ x: ga.x - (touch ? 0 : 0), y: ga.y });
			ok(who + ' on the pump\'s line, away from its symbol, opens no box', !(await kt.chooserOpen()), J([ga, await kt.rows(), await kt.selected()]));
			await K.page.close();
		}

		// =========================================================== round 6: a symbol hidden entirely under another
		console.log('\nL. Round 6: a junction wholly under a tank is in the box from a press anywhere on the tank');
		for (const touch of [false, true]) {
			const projH = JSON.parse(project); projH.view = { cx: 175, cy: 20, s: 0.8 };   // zoomed out: a tank keeps its size on the screen, a junction shrinks
			const H = await Session.open(browser, NAME + '-h' + (touch ? 'p' : 'd'), touch ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } : { viewport: { width: 1400, height: 900 } });
			await open(H, JSON.stringify(projH));
			const ht = tools(H), hc = touch ? await H.page.context().newCDPSession(H.page) : null;
			const press = async (p) => {
				if (touch) {
					await hc.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: p.x, y: p.y, id: 1 }] });
					await sleep(60);
					await hc.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
					await H.settle(600);
				} else { await ht.click(p); }
			};
			const who = touch ? 'a tap' : 'a click';
			// The tank's drawn ink, and the junction's disc: is the disc wholly inside the ink?
			const geo = await H.page.evaluate(() => {
				const g = document.querySelector('#lpn_canvas path.lpn-node-hit[data-node="HT"]'), n = document.querySelector('#lpn_canvas circle.lpn-node[data-node="HJ"]');
				const gb = g.getBoundingClientRect(), nb = n.getBoundingClientRect();
				return { l: gb.left, r: gb.right, t: gb.top, b: gb.bottom, nl: nb.left, nr: nb.right, nt: nb.top, nb: nb.bottom };
			});
			// The tank's hit path is its drawn silhouette (SYMBOL_INK): the box of its ink.
			const ink = { l: geo.l, r: geo.r, t: geo.t, b: geo.b };
			ok('(the junction\'s disc lies wholly inside the tank\'s ink: nothing of it shows)', geo.nl >= ink.l && geo.nr <= ink.r && geo.nt >= ink.t && geo.nb <= ink.b, J([geo, ink]));
			// The far corner of the tank's ink from the disc, 1 px inside.
			const corner = { x: ink.r - 1, y: ink.t + 1 };
			await press(corner);
			ok(who + ' on the tank far from the junction hidden under it lists both, the tank first', J(await ht.rows()) === J(['Tank HT', 'Junction HJ']), J([geo, corner, await ht.rows(), await ht.selected()]));
			await H.page.keyboard.press('Escape'); await H.settle(200);
			await press({ x: touch ? 195 : 700, y: touch ? 800 : 880 });
			await press({ x: geo.nl + (geo.nr - geo.nl) / 2, y: geo.nt + (geo.nb - geo.nt) / 2 });
			ok(who + ' on the disc itself lists both', (await ht.rows()).length === 2, J(await ht.rows()));
			await H.page.keyboard.press('Escape'); await H.settle(200);
			await press({ x: touch ? 195 : 700, y: touch ? 800 : 880 });
			await press({ x: geo.l - 40, y: geo.t - 40 });
			ok(who + ' on bare map beside the tank opens no box', !(await ht.chooserOpen()), J(await ht.rows()));
			await H.page.close();
		}


		// =========================================================== a narrow phone: the box never sits under the press
		console.log('\nM. A 390 px phone, a tap at x = 180 near the top, the middle and the bottom: no row under the finger, the box on screen');
		for (const [name, Y] of [['near the top', 72], ['in the middle', 420], ['near the bottom', 742]]) {
			const pj = JSON.parse(project); pj.view = { cx: 60 - (180 - 195) / 3.5, cy: -40 + (Y - 422) / 3.5, s: 3.5 };
			const M = await Session.open(browser, NAME + '-m', { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
			await open(M, JSON.stringify(pj));
			const mt = tools(M);
			const pile4 = await mt.centre('#lpn_canvas [data-node="J1"]');
			await M.page.touchscreen.tap(pile4.x, pile4.y);
			await M.settle(700);
			const geo4 = await M.page.evaluate((p) => {
				const b = document.querySelector('.lpn-pick-chooser'); if (!b) { return null; }
				const r = b.getBoundingClientRect();
				return { n: b.querySelectorAll('button').length, under: p.x >= r.left && p.x <= r.right && p.y >= r.top && p.y <= r.bottom, inView: r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight };
			}, pile4);
			ok('a tap at x = ' + Math.round(pile4.x) + ', y = ' + Math.round(pile4.y) + ' (' + name + ') opens the box of five rows', !!geo4 && geo4.n === 5, J([geo4, pile4]));
			ok('...with no row under the press point and the whole box on screen', !!geo4 && geo4.under === false && geo4.inView, J(geo4));
			await M.page.close();
		}

		ok('no page error', errors.length === 0, errors.join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(failures ? '\nFAILED: ' + failures + ' of ' + checks : '\nALL PASS (' + checks + ' checks)');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
