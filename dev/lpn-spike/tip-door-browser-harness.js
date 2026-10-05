// ONE DOOR FOR AN EXPLANATION (ROADMAP Task 759, Tom's answer to Ida's interview, 2026-10-03:
// *"Click the ?, closed by a click elsewhere or Esc; one door on desktop and phone."*). Real
// headless Chromium, because every claim here is about what a pointer, a finger or a key DOES:
//
//   1. LOOPED NETWORK, desktop. In the Fire flow box (Q5: its rows now carry a `?`):
//      hovering a `?` opens nothing; a click opens it, wider than a name tip, left on screen while
//      the pointer rests on it; Esc closes it and leaves the box open; a click elsewhere closes it;
//      Enter on the focused `?` opens it and Tab away closes it; one explanation at a time.
//   2. LOOPED NETWORK, desktop. A NAME tip on an icon-only toolbar button still opens on hover.
//   3. LOOPED NETWORK, a phone in tall mode (390 x 844, touch). A tap on a `?` in Settings opens
//      it without raising the keyboard; a tap elsewhere closes it.
//   4. MANNING PIPE FLOW, desktop and phone: the same door on a calculator that is not lpn_, and
//      the label's WORDS still put the cursor in the field.
//   5. A TIP THAT GOES WITHOUT A CLICK (Perry's pre-review, 2026-10-05): its box rebuilt by a
//      keyboard change, or closed by its x from the keyboard. The next Esc must reach the page, not
//      be spent closing a tip that is no longer there.
//   6. A "?" INSIDE A LINK (Darcy-Weisbach's kinematic viscosity) and INSIDE A BUTTON (Looped
//      Network's "Something wrong here?"): the "?" opens on a click and neither follows the link nor
//      presses the button; hover opens nothing; the link's words still open the link.
//
//   node dev/lpn-spike/tip-door-browser-harness.js        (takes the browser lock itself)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_TIPDOOR_BROWSER_LOCKED';
const NAME = 'tip-door-browser-harness';

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

// What the reader sees of the tip hung on `host` (a CSS selector for its `.ec-help`).
function tipState(page, host) {
	return page.evaluate((sel) => {
		const h = document.querySelector(sel), id = h && h.getAttribute('aria-describedby');
		const t = id && document.getElementById(id);
		if (!t) { return { shown: false }; }
		const r = t.getBoundingClientRect(), inner = t.querySelector('.tooltip-inner');
		return {
			shown: t.classList.contains('show'), explain: t.classList.contains('ec-explain'),
			text: t.textContent, w: r.width, maxW: inner ? parseFloat(getComputedStyle(inner).maxWidth) : 0,
			pe: getComputedStyle(t).pointerEvents, cx: r.left + r.width / 2, cy: r.top + r.height / 2,
			rem: parseFloat(getComputedStyle(document.documentElement).fontSize)
		};
	}, host);
}
function anyExplanationShown(page) {
	return page.evaluate(() => document.querySelectorAll('.tooltip.ec-explain.show').length);
}
async function centre(page, sel) {
	const r = await page.evaluate((s) => { const b = document.querySelector(s).getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; }, sel);
	return r;
}
// Tag the nth visible `?` inside `scope` so later steps can address it and its `.ec-help`.
function tagGlyph(page, scope, n, tag) {
	return page.evaluate(([s, i, t]) => {
		const g = Array.from(document.querySelectorAll(s + ' .ec-explain-host .ec-tip, ' + s + ' .ec-tip.ec-explain-host'))
			.filter((e) => e.getClientRects().length && e.getBoundingClientRect().width > 0)[i];
		if (!g) { return false; }
		g.setAttribute('data-tipdoor', t);
		g.closest('.ec-help').setAttribute('data-tipdoor-host', t);
		return true;
	}, [scope, n, tag]);
}

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

// ---------------------------------------------------------------------------------------------
async function sectionLpnDesktop(Session, browser) {
	console.log('\n--- 1. Looped Network, desktop: the `?` in the Fire flow box ---');
	const a = await openLpn(Session, browser, DESKTOP, 'desktop');
	const page = a.page;
	try {
		await a.menuClickSub(await a.lang('lpn_analyze_menu'), await a.lang('lpn_ff_menu'), 'project');
		await a.settle(500);
		ok('the Fire flow box is open', await page.evaluate(() => getComputedStyle(document.getElementById('lpn_ff_box')).display !== 'none'));
		const rowGlyphs = await page.evaluate(() => document.querySelectorAll('#lpn_ff_controls .lpn-ff-row .ec-tip').length);
		const rowTips = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_ff_controls .lpn-ff-row [title], #lpn_ff_controls .lpn-ff-row [data-bs-original-title]'))
			.filter((e) => !e.querySelector('.ec-tip') && !e.matches('button, input, select')).length);
		ok('every Fire flow row that has a tip shows its `?` (Q5)', rowGlyphs >= 4 && rowTips === 0, 'glyphs=' + rowGlyphs + ' tips without one=' + rowTips);
		ok('...and the intro is no longer printed in the box: the corner `?` carries it',
			!(await page.evaluate(() => document.getElementById('lpn_ff_controls').textContent)).includes((await a.lang('lpn_ff_intro')).slice(0, 30)));
		ok('a `?` to test', await tagGlyph(page, '#lpn_ff_controls', 0, 'a'));
		await tagGlyph(page, '#lpn_ff_controls', 1, 'b');
		const G = '[data-tipdoor="a"]', H = '[data-tipdoor-host="a"]';

		// Hover opens nothing, however long the pointer stays.
		const g = await centre(page, G);
		await page.mouse.move(g.x, g.y);
		await page.waitForTimeout(1200);
		ok('hovering a `?` for 1.2 s opens no explanation', !(await tipState(page, H)).shown && (await anyExplanationShown(page)) === 0);
		const hl = await page.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.left + 3, y: r.top + r.height / 2 }; }, H);
		await page.mouse.move(hl.x, hl.y);
		await page.waitForTimeout(900);
		ok('...nor does hovering the label words', !(await tipState(page, H)).shown);

		// Click opens.
		await page.mouse.click(g.x, g.y);
		await a.settle(350);
		let s = await tipState(page, H);
		ok('a click on the `?` opens its explanation', s.shown && s.explain, JSON.stringify({ shown: s.shown, explain: s.explain }));
		ok('...wider than a name tip: its cap is 22rem, not 17rem', Math.abs(s.maxW - 22 * s.rem) < 1, s.maxW + ' px');
		ok('...and it takes the pointer, so it can be rested on', s.pe === 'auto', s.pe);
		await page.mouse.move(s.cx, s.cy);
		await page.waitForTimeout(800);
		const under = await page.evaluate(([x, y]) => { const e = document.elementFromPoint(x, y); return !!(e && e.closest('.tooltip.ec-explain')); }, [s.cx, s.cy]);
		ok('...the pointer resting on the tip is on the tip, and the tip stays', under && (await tipState(page, H)).shown);
		ok('...and the `?` says it is expanded', (await page.getAttribute(G, 'aria-expanded')) === 'true');

		// Esc closes it, and only it.
		await page.keyboard.press('Escape');
		await a.settle(350);
		ok('Esc closes the explanation', !(await tipState(page, H)).shown);
		ok('...and leaves the Fire flow box open', await page.evaluate(() => getComputedStyle(document.getElementById('lpn_ff_box')).display !== 'none'));

		// A click elsewhere closes it: the box's own title bar, then the map.
		await page.mouse.click(g.x, g.y);
		await a.settle(350);
		ok('a second click opens it again', (await tipState(page, H)).shown);
		const tb = await page.evaluate(() => { const r = document.querySelector('#lpn_ff_box .lpn-setbox-title').getBoundingClientRect(); return { x: r.left + 8, y: r.top + r.height / 2 }; });
		await page.mouse.click(tb.x, tb.y);
		await a.settle(350);
		ok('a click on the box title bar closes it', !(await tipState(page, H)).shown);
		await page.mouse.click(g.x, g.y);
		await a.settle(350);
		const map = await page.evaluate(() => { const r = document.getElementById('lpn_canvas').getBoundingClientRect(); return { x: r.left + 20, y: r.bottom - 20 }; });
		await page.mouse.click(map.x, map.y);
		await a.settle(350);
		ok('a click on the map closes it', !(await tipState(page, H)).shown && (await anyExplanationShown(page)) === 0);

		// A click on the same `?` closes it; another `?` replaces it.
		await page.mouse.click(g.x, g.y);
		await a.settle(350);
		await page.mouse.click(g.x, g.y);
		await a.settle(350);
		ok('a click on the open `?` closes it', !(await tipState(page, H)).shown);
		await page.mouse.click(g.x, g.y);
		await a.settle(350);
		const gb = await centre(page, '[data-tipdoor="b"]');
		await page.mouse.click(gb.x, gb.y);
		await a.settle(350);
		ok('opening another `?` closes the first: one explanation at a time',
			!(await tipState(page, H)).shown && (await tipState(page, '[data-tipdoor-host="b"]')).shown && (await anyExplanationShown(page)) === 1);
		await page.keyboard.press('Escape');
		await a.settle(300);

		// The keyboard's door.
		await page.focus(G);
		await a.settle(700);
		ok('focusing the `?` alone opens nothing', !(await tipState(page, H)).shown);
		await page.keyboard.press('Enter');
		await a.settle(350);
		ok('Enter on the focused `?` opens it', (await tipState(page, H)).shown);
		await page.keyboard.press('Tab');
		await a.settle(350);
		ok('Tab away closes it', !(await tipState(page, H)).shown);
		await page.focus(G);
		await page.keyboard.press(' ');
		await a.settle(350);
		ok('Space on the focused `?` opens it too', (await tipState(page, H)).shown);
		await page.keyboard.press('Escape');
		await a.settle(300);

		// The box's own `?` beside its x (Q5).
		const cg = await centre(page, '#lpn_ff_box .lpn-corner-help .ec-tip');
		await page.mouse.move(cg.x, cg.y);
		await page.waitForTimeout(1000);
		ok('hovering the box\'s corner `?` opens nothing', !(await tipState(page, '#lpn_ff_box .lpn-corner-help')).shown);
		await page.mouse.click(cg.x, cg.y);
		await a.settle(350);
		const cs = await tipState(page, '#lpn_ff_box .lpn-corner-help');
		ok('a click on it opens the box\'s whole explanation', cs.shown &&
			cs.text.indexOf(await a.lang('lpn_ff_intro')) === 0 && cs.text.indexOf(await a.lang('lpn_ff_scope_tip')) > 0, String(cs.text).slice(0, 50));
		await page.keyboard.press('Escape');
		await a.settle(300);

		console.log('\n--- 2. Looped Network, desktop: a name tip on a toolbar button keeps hover ---');
		const btn = await page.evaluate(() => {
			const b = Array.from(document.querySelectorAll('#lpn_toolbar button[data-bs-original-title]'))
				.filter((e) => e.getClientRects().length && !e.disabled && e.textContent.trim() === '')[0];
			if (!b) { return null; }
			b.setAttribute('data-tipdoor-btn', '1');
			const r = b.getBoundingClientRect();
			return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		});
		ok('an icon-only toolbar button with a tip', !!btn);
		if (btn) {
			await page.mouse.move(btn.x, btn.y);
			await page.waitForTimeout(1000);
			const bs = await tipState(page, '[data-tipdoor-btn]');
			ok('hovering it shows its name tip', bs.shown && !bs.explain, JSON.stringify({ shown: bs.shown, explain: bs.explain }));
			await page.mouse.move(map.x, map.y);
			await page.waitForTimeout(600);
			ok('...and leaving it takes the tip away', !(await tipState(page, '[data-tipdoor-btn]')).shown);
		}
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally {
		await a.close();
	}
}

// ---------------------------------------------------------------------------------------------
async function sectionLpnPhone(Session, browser) {
	console.log('\n--- 3. Looped Network, a phone in tall mode: tap a `?` in Settings ---');
	const a = await openLpn(Session, browser, PHONE, 'phone');
	const page = a.page;
	try {
		// The phone's toolbar folds Settings away; the box's own furniture record opens it on load.
		await page.evaluate(() => {
			localStorage.setItem('lpn_setbox', JSON.stringify({ left: 0, top: 60, w: 390, h: 700, ix: null, open: true }));
		});
		await a.reload();
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(1500);
		ok('a `?` in Settings to tap', await tagGlyph(page, '#lpn_settings_box', 0, 'p'));
		const G = '[data-tipdoor="p"]', H = '[data-tipdoor-host="p"]';
		await page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), G);
		await a.settle(200);
		await page.tap(G);
		await a.settle(400);
		const s = await tipState(page, H);
		ok('a tap on the `?` opens its explanation', s.shown && s.explain);
		ok('...no wider than the screen less a gutter', s.w <= 390 - 32 + 0.5, s.w + ' px');
		const typing = await page.evaluate(() => { const e = document.activeElement; return !!e && /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName); });
		ok('...and raises no keyboard: no field took focus', !typing);
		const tb = await page.evaluate(() => { const r = document.querySelector('#lpn_settings_box .lpn-setbox-title').getBoundingClientRect(); return { x: r.left + 8, y: r.top + r.height / 2 }; });
		await page.touchscreen.tap(tb.x, tb.y);
		await a.settle(400);
		ok('a tap elsewhere closes it', !(await tipState(page, H)).shown && (await anyExplanationShown(page)) === 0);
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally {
		await a.close();
	}
}

// ---------------------------------------------------------------------------------------------
async function sectionMpf(Session, browser) {
	for (const [vp, extra] of [['desktop', DESKTOP], ['phone', PHONE]]) {
		console.log('\n--- 4. Manning Pipe Flow, ' + vp + ': the same door ---');
		const a = await Session.open(browser, NAME + ':mpf-' + vp, extra);
		const page = a.page;
		try {
			await a.goto('Manning-Pipe-Flow.php?ec_nolog=1');
			await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			await a.settle(300);
			// The first `?` whose label names an input, so "the words reach the field" can be tried.
			const found = await page.evaluate(() => {
				const g = Array.from(document.querySelectorAll('label .ec-help.ec-explain-host > .ec-tip'))
					.filter((e) => e.getClientRects().length && e.getBoundingClientRect().width > 0 &&
						!!(e.closest('label').querySelector('input, select') ||
						(e.closest('label').htmlFor && document.getElementById(e.closest('label').htmlFor))))[0];
				if (!g) { return false; }
				g.setAttribute('data-tipdoor', 'm');
				g.closest('.ec-help').setAttribute('data-tipdoor-host', 'm');
				return true;
			});
			ok(vp + ': a labelled field with a `?`', found);
			if (!found) { continue; }
			const G = '[data-tipdoor="m"]', H = '[data-tipdoor-host="m"]';
			await page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center' }), G);
			await a.settle(200);
			const typing = () => page.evaluate(() => { const e = document.activeElement; return !!e && /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName); });
			if (vp === 'desktop') {
				const g = await centre(page, G);
				await page.mouse.move(g.x, g.y);
				await page.waitForTimeout(1200);
				ok('desktop: hovering the `?` opens nothing', !(await tipState(page, H)).shown);
				await page.mouse.click(g.x, g.y);
				await a.settle(350);
				ok('desktop: a click opens it', (await tipState(page, H)).shown);
				ok('desktop: ...without putting the cursor in the field', !(await typing()));
				await page.keyboard.press('Escape');
				await a.settle(350);
				ok('desktop: Esc closes it', !(await tipState(page, H)).shown);
				await page.mouse.click(g.x, g.y);
				await a.settle(350);
				await page.mouse.click(5, 5);
				await a.settle(350);
				ok('desktop: a click elsewhere closes it', !(await tipState(page, H)).shown);
				const w = await page.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.left + 3, y: r.top + r.height / 2 }; }, H);
				await page.mouse.click(w.x, w.y);
				await a.settle(350);
				ok('desktop: a click on the label WORDS opens no tip and reaches the field', !(await tipState(page, H)).shown && (await typing()));
			} else {
				await page.tap(G);
				await a.settle(400);
				ok('phone: a tap on the `?` opens it', (await tipState(page, H)).shown);
				ok('phone: ...and raises no keyboard', !(await typing()));
				await page.touchscreen.tap(195, 20);
				await a.settle(400);
				ok('phone: a tap elsewhere closes it', !(await tipState(page, H)).shown);
			}
			ok(vp + ': no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		} finally {
			await a.close();
		}
	}
}

// ---------------------------------------------------------------------------------------------
// Count the Escapes that reach the page's own (bubbling) listeners, i.e. that were NOT spent on a tip.
function armEscCounter(page) {
	return page.evaluate(() => {
		window.__tipdoorEsc = 0;
		if (!window.__tipdoorEscWired) {
			window.__tipdoorEscWired = true;
			document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { window.__tipdoorEsc++; } });
		}
	});
}
const escSeen = (page) => page.evaluate(() => window.__tipdoorEsc);
const boxOpen = (page, id) => page.evaluate((i) => getComputedStyle(document.getElementById(i)).display !== 'none', id);

async function sectionStale(Session, browser) {
	console.log('\n--- 5. Looped Network: a tip that goes without a click does not swallow the next Esc ---');
	const a = await openLpn(Session, browser, DESKTOP, 'stale');
	const page = a.page;
	try {
		await a.menuClickSub(await a.lang('lpn_analyze_menu'), await a.lang('lpn_ds_menu'), 'project');
		await a.settle(500);
		ok('the Demand scaling box is open', await boxOpen(page, 'lpn_ds_box'));
		await armEscCounter(page);
		ok('a `?` in a Demand scaling row', await tagGlyph(page, '#lpn_ds_controls', 0, 's'));
		await page.click('[data-tipdoor="s"]');
		await a.settle(350);
		ok('...it opens on a click', (await tipState(page, '[data-tipdoor-host="s"]')).shown);
		await page.keyboard.press('Escape');
		await a.settle(300);
		ok('control: Esc on a LIVE tip is spent on the tip and reaches nothing else', (await escSeen(page)) === 0);

		await page.click('[data-tipdoor="s"]');
		await a.settle(350);
		ok('opened again', (await anyExplanationShown(page)) === 1);
		// The scope selector changes while focus stays on the "?": the box rebuilds and the "?" is
		// replaced. (Moving focus to the selector first would close the tip honestly, by focus-out;
		// the case that went wrong is a disappearance nothing told the tip about.)
		const sel = await page.evaluate(() => {
			const s = document.querySelector('#lpn_ds_controls select');
			if (!s) { return false; }
			s.setAttribute('data-tipdoor-sel', '1');
			return true;
		});
		ok('the scope selector', sel);
		await page.evaluate(() => {
			const s = document.querySelector('[data-tipdoor-sel]');
			s.selectedIndex = (s.selectedIndex + 1) % s.options.length;
			s.dispatchEvent(new Event('change', { bubbles: true }));
		});
		await a.settle(500);
		ok('...the change rebuilt the box: the tagged `?` is gone', !(await page.$('[data-tipdoor="s"]')));
		await armEscCounter(page);
		await page.keyboard.press('Escape');
		await a.settle(300);
		ok('the FIRST Esc after that reaches the page, not a vanished tip', (await escSeen(page)) === 1, String(await escSeen(page)));

		// Closed by its x, without the focus leaving the "?" (a script's click, as a keyboard
		// shortcut or another command would close it).
		await tagGlyph(page, '#lpn_ds_controls', 0, 't');
		await page.click('[data-tipdoor="t"]');
		await a.settle(350);
		ok('a `?` open again', (await anyExplanationShown(page)) === 1);
		await page.evaluate(() => document.getElementById('lpn_ds_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await a.settle(400);
		ok('the x closes the box', !(await boxOpen(page, 'lpn_ds_box')));
		ok('...and takes its tip with it', (await anyExplanationShown(page)) === 0);
		await armEscCounter(page);
		await page.keyboard.press('Escape');
		await a.settle(300);
		ok('the FIRST Esc after that reaches the page', (await escSeen(page)) === 1, String(await escSeen(page)));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally {
		await a.close();
	}
}

async function sectionInControl(Session, browser) {
	console.log('\n--- 6a. Darcy-Weisbach: a `?` inside a link ---');
	let a = await Session.open(browser, NAME + ':dw', DESKTOP);
	let page = a.page;
	try {
		await a.goto('Darcy-Weisbach.php?ec_nolog=1');
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(300);
		const found = await page.evaluate(() => {
			const g = Array.from(document.querySelectorAll('a .ec-explain-host .ec-tip'))
				.filter((e) => e.getClientRects().length && e.getBoundingClientRect().width > 0)[0];
			if (!g) { return false; }
			g.setAttribute('data-tipdoor', 'l');
			g.closest('.ec-help').setAttribute('data-tipdoor-host', 'l');
			g.closest('a').setAttribute('data-tipdoor-link', 'l');
			return true;
		});
		ok('a `?` inside a link', found);
		if (found) {
			const G = '[data-tipdoor="l"]', H = '[data-tipdoor-host="l"]';
			const before = page.url();
			const g = await centre(page, G);
			await page.mouse.move(g.x, g.y);
			await page.waitForTimeout(1200);
			ok('hovering the `?` opens nothing', !(await tipState(page, H)).shown);
			const pages0 = a.context.pages().length;
			await page.mouse.click(g.x, g.y);
			await a.settle(600);
			ok('a click on the `?` opens the explanation', (await tipState(page, H)).shown);
			ok('...and does not follow the link', page.url() === before && a.context.pages().length === pages0,
				a.context.pages().length + ' pages');
			await page.keyboard.press('Escape');
			await a.settle(300);
			ok('Esc closes it', !(await tipState(page, H)).shown);
			await page.focus(G);
			await page.keyboard.press('Enter');
			await a.settle(350);
			ok('Enter on the focused `?` opens it, without following the link',
				(await tipState(page, H)).shown && a.context.pages().length === pages0);
			await page.keyboard.press('Escape');
			await a.settle(300);
			const w = await page.evaluate((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.left + 4, y: r.top + r.height / 2 }; }, '[data-tipdoor-link="l"]');
			const popup = a.context.waitForEvent('page', { timeout: 5000 }).catch(() => null);
			await page.mouse.click(w.x, w.y);
			const opened = await popup;
			ok('a click on the link\'s WORDS still opens the link', !!opened);
			if (opened) { await opened.close(); }
		}
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally {
		await a.close();
	}

	console.log('\n--- 6b. Looped Network: a `?` inside a button ---');
	a = await openLpn(Session, browser, DESKTOP, 'button');
	page = a.page;
	try {
		const B = await page.evaluate(() => {
			const b = ['lpn_wrong_btn', 'lpn_wrong_status_btn'].map((i) => document.getElementById(i))
				.filter((e) => e && e.getClientRects().length && e.querySelector('.ec-tip'))[0];
			if (!b) { return null; }
			b.querySelector('.ec-tip').setAttribute('data-tipdoor', 'w');
			return '#' + b.id;
		});
		ok('the "Something wrong here?" button, with its `?`', !!B);
		if (B) {
			const G = '[data-tipdoor="w"]', H = B + ' .ec-help';
			const label0 = await page.evaluate((s) => document.querySelector(s).textContent, B);
			const g = await centre(page, G);
			await page.mouse.move(g.x, g.y);
			await page.waitForTimeout(1200);
			ok('hovering its `?` opens nothing', !(await tipState(page, H)).shown);
			await page.mouse.click(g.x, g.y);
			await a.settle(400);
			ok('a click on its `?` opens the explanation', (await tipState(page, H)).shown);
			const after = await page.evaluate((s) => { const b = document.querySelector(s); return { t: b.textContent, d: b.disabled }; }, B);
			ok('...and does not press the button', after.t === label0 && !after.d, JSON.stringify(after).slice(0, 80));
			ok('...the `?` is not a tab stop inside the button: the button is', (await page.getAttribute(G, 'tabindex')) === null);
			await page.mouse.click(5, 450);
			await a.settle(350);
			ok('a click elsewhere closes it', !(await tipState(page, H)).shown);
		}
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
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
		await sectionLpnDesktop(Session, browser);
		await sectionLpnPhone(Session, browser);
		await sectionMpf(Session, browser);
		await sectionStale(Session, browser);
		await sectionInControl(Session, browser);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
