// THE THEME GALLERY: POINT TO TRY, CLICK TO KEEP, LEAVE TO PUT IT BACK (Task 811; dev/themes-plan.md), in a
// real Chromium, by real events only: Playwright's mouse (a real click carries detail 1) and keyboard, never
// el.click() or a hand-made event. Run with:
//   node dev/lpn-spike/theme-gallery-browser-harness.js
//   EC_THEME_SHOTS=/some/dir node dev/lpn-spike/theme-gallery-browser-harness.js    also saves screenshots
//
// WHAT IT PROVES:
//   1. Settings > Page > Theme is a button that shows the kept theme's picture and name; a click opens the
//      gallery: seven cards, System, Light, Dark, High contrast, Amber, Green, Platinum, named from the
//      language file, the kept one pressed.
//   2. Each card is painted in its OWN theme while the page stays in the kept one (an Amber card on a light
//      page has Amber's paper), and System's card shows what System resolves to on this device.
//   3. POINTING previews: the pointer on a card repaints the page in that theme and stores nothing; the
//      pointer leaving the gallery puts the kept theme back.
//   4. THE ARROW KEYS preview too, walking the grid (right, down a row, Home, End); Escape puts the kept
//      theme back, closes the gallery and returns focus to the button; nothing was stored.
//   5. Enter keeps the focused card; a click keeps the card clicked. Either closes the gallery, stores the
//      choice in `lpn_theme` (and nothing else), and repaints the button.
//   6. A press outside the gallery while previewing puts the kept theme back; so does a second click on
//      the Theme button, which closes the gallery rather than opening it again.
//   7. The kept theme survives a reload. `?theme=system` is the rescue: it clears the choice. A value the
//      page does not know is read as System.
//   8. On a Spanish page the gallery works the same and its names are the page's own strings; on a right-to-
//      left page the left arrow moves forward.
//   9. Under a dark device, System's card is Dark and High contrast's card is the white-on-black palette.
//  10. No page errors.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_THEME_GALLERY_LOCKED';
const NAME = 'theme-gallery-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename].concat(process.argv.slice(2)), {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.status === 75) { console.error(NAME + ': NOT RUN, browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}

let checks = 0, fails = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
const SHOTS = process.env.EC_THEME_SHOTS || '';
if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); }

const ORDER = ['system', 'light', 'dark', 'hc', 'rounded', 'platinum', 'desktop', 'newspaper', 'amber', 'green', 'arcade', 'space', 'prairie'];
const KEYS = { system: 'lpn_theme_system', light: 'lpn_theme_light', dark: 'lpn_theme_dark', hc: 'lpn_theme_hc',
	amber: 'lpn_theme_amber', green: 'lpn_theme_green', platinum: 'lpn_theme_platinum', rounded: 'lpn_theme_rounded', desktop: 'lpn_theme_desktop',
	newspaper: 'lpn_theme_newspaper', arcade: 'lpn_theme_arcade', space: 'lpn_theme_space', prairie: 'lpn_theme_prairie' };

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });

	const state = (s) => s.page.evaluate(() => ({
		theme: document.documentElement.getAttribute('data-theme'),
		bs: document.documentElement.getAttribute('data-bs-theme'),
		stored: (function () { try { return localStorage.getItem('lpn_theme'); } catch (e) { return 'ERR'; } })(),
		open: !!document.getElementById('lpn_theme_gallery'),
		focus: document.activeElement ? (document.activeElement.getAttribute('data-theme-name') || document.activeElement.id || document.activeElement.tagName) : null,
		btn: (function () { const b = document.getElementById('lpn_set_theme'); return b ? { choice: b.getAttribute('data-theme-choice'), name: (b.querySelector('.lpn-theme-btn-name') || {}).textContent, expanded: b.getAttribute('aria-expanded') } : null; })()
	}));
	const themeKeys = (s) => s.page.evaluate(() => { const k = []; for (let i = 0; i < localStorage.length; i++) { if (/theme/i.test(localStorage.key(i))) { k.push(localStorage.key(i)); } } return k; });
	const shot = async (s, name) => { if (SHOTS) { await s.page.screenshot({ path: path.join(SHOTS, name) }); } };
	const card = (t) => '#lpn_theme_gallery .lpn-theme-choice[data-theme-name="' + t + '"]';

	async function openSettingsRow(s) {
		if (!(await s.page.isVisible('#lpn_settings_box'))) { await s.toolbarClick(await s.lang('lpn_tool_settings')); }
		await s.settle(400);
		const row = s.page.locator('label.lpn-set-row', { hasText: await s.lang('lpn_settings_theme') }).first();
		await row.scrollIntoViewIfNeeded();
		return row;
	}
	async function openGallery(s) {
		await s.page.click('#lpn_set_theme');
		await s.page.waitForSelector('#lpn_theme_gallery', { state: 'visible' });
		await s.settle(400);
	}
	// Somewhere on the page that is neither the gallery nor its button: the Settings box's title.
	async function pointerAway(s) {
		const r = await s.page.evaluate(() => { const t = document.querySelector('#lpn_settings_box .lpn-popover-title, #lpn_settings_box h2, #lpn_settings_box'); const b = t.getBoundingClientRect(); return { x: b.left + 20, y: b.top + 12 }; });
		await s.page.mouse.move(r.x, r.y, { steps: 4 });
		await s.settle(250);
		return r;
	}

	try {
		const a = await Session.open(browser, 'light-os', { colorScheme: 'light' });
		try {
			await a.goto('Looped-Network.php');
			await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
			await a.settle(500);
			const row = await openSettingsRow(a);
			ok('1. the Theme row holds a button, not a drop-down', (await row.locator('button#lpn_set_theme').count()) === 1 && (await row.locator('select').count()) === 0);
			let st = await state(a);
			ok('1. the button shows the kept theme, System, by name', st.btn && st.btn.choice === 'system' && st.btn.name === await a.lang('lpn_theme_system'), JSON.stringify(st.btn));
			ok('1. nothing stored at first; System resolves to light here', st.stored === null && st.theme === 'light' && st.bs === 'light', JSON.stringify(st));
			await shot(a, 'gallery-0-row.png');

			await openGallery(a);
			st = await state(a);
			ok('1. a real click opens the gallery and marks the button expanded', st.open && st.btn.expanded === 'true', JSON.stringify(st));
			const cards = await a.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_theme_gallery .lpn-theme-choice')).map((b) => ({
				t: b.getAttribute('data-theme-name'), name: b.querySelector('.lpn-theme-choice-name').textContent, pressed: b.getAttribute('aria-pressed'),
				mini: b.querySelector('.ec-theme-card').getAttribute('data-theme'), paper: getComputedStyle(b.querySelector('.ec-theme-card')).backgroundColor
			})));
			ok('1. ' + ORDER.length + ' cards in order: ' + ORDER.join(', '), JSON.stringify(cards.map((c) => c.t)) === JSON.stringify(ORDER), JSON.stringify(cards.map((c) => c.t)));
			const names = []; for (const t of ORDER) { names.push(await a.lang(KEYS[t])); }
			ok('1. each card is named from the language file', JSON.stringify(cards.map((c) => c.name)) === JSON.stringify(names), JSON.stringify(cards.map((c) => c.name)));
			ok('1. System is the pressed card', cards.filter((c) => c.pressed === 'true').map((c) => c.t).join() === 'system');
			ok('1. focus starts on the kept card', st.focus === 'system', String(st.focus));
			const paper = Object.fromEntries(cards.map((c) => [c.t, c.paper]));
			ok('2. each card is painted in its own theme: Amber, Green, Dark and High contrast keep their own paper on a light page',
				paper.amber === 'rgb(20, 12, 0)' && paper.green === 'rgb(3, 16, 3)' && paper.dark === 'rgb(30, 31, 34)' && paper.hc === 'rgb(255, 255, 255)' && paper.light === 'rgb(255, 255, 255)', JSON.stringify(paper));
			ok('2. System\'s card shows what System is here (light), High contrast its light palette',
				cards[0].mini === 'light' && cards[ORDER.indexOf('hc')].mini === 'hc', JSON.stringify(cards.map((c) => c.mini)));
			await shot(a, 'gallery-1-open.png');

			// 3. pointing previews
			await a.page.hover(card('amber'));
			await a.settle(250);
			st = await state(a);
			ok('3. pointing at Amber paints the page Amber (and Bootstrap dark)', st.theme === 'amber' && st.bs === 'dark', JSON.stringify(st));
			ok('3. ...and stores nothing', st.stored === null && (await themeKeys(a)).length === 0, JSON.stringify(await themeKeys(a)));
			const pageInk = await a.page.evaluate(() => getComputedStyle(document.getElementById('lpn_menu_help')).color);
			ok('3. ...the real chrome follows (a menu item is Amber\'s accent)', pageInk === 'rgb(255, 211, 122)', pageInk);
			await shot(a, 'gallery-2-hover-amber.png');
			await a.page.hover(card('green'));
			await a.settle(200);
			ok('3. pointing at Green paints the page Green', (await state(a)).theme === 'green');
			await a.page.hover(card('platinum'));
			await a.settle(200);
			ok('3. pointing at Platinum paints the page Platinum', (await state(a)).theme === 'platinum');
			await pointerAway(a);
			st = await state(a);
			ok('3. the pointer leaving the gallery puts the kept theme back, and the gallery stays open', st.theme === 'light' && st.open && st.stored === null, JSON.stringify(st));

			// 4. the arrow keys
			await a.page.focus(card('system'));
			await a.settle(150);
			await a.page.keyboard.press('ArrowRight'); await a.settle(150);
			st = await state(a);
			ok('4. ArrowRight moves to Light and previews it', st.focus === 'light' && st.theme === 'light', JSON.stringify(st));
			await a.page.keyboard.press('ArrowRight'); await a.settle(150);
			st = await state(a);
			ok('4. ArrowRight again: Dark, previewed', st.focus === 'dark' && st.theme === 'dark' && st.bs === 'dark', JSON.stringify(st));
			const cols = await a.page.evaluate(() => { const c = Array.from(document.querySelectorAll('#lpn_theme_gallery .lpn-theme-choice')); let n = 1; while (n < c.length && c[n].offsetTop === c[0].offsetTop) { n++; } return n; });
			await a.page.keyboard.press('ArrowDown'); await a.settle(150);
			st = await state(a);
			const below = ORDER[Math.min(ORDER.length - 1, 2 + cols)];
			ok('4. ArrowDown moves one row down (' + cols + ' to a row): ' + below, st.focus === below && st.theme === (below === 'hc' ? 'hc' : below), JSON.stringify(st));
			await a.page.keyboard.press('End'); await a.settle(150);
			ok('4. End: Prairie', (await state(a)).focus === 'prairie');
			await a.page.keyboard.press('Home'); await a.settle(150);
			ok('4. Home: System', (await state(a)).focus === 'system');
			await a.page.keyboard.press('ArrowRight'); await a.page.keyboard.press('ArrowRight'); await a.page.keyboard.press('ArrowRight'); await a.settle(150);
			st = await state(a);
			ok('4. three to the right: High contrast, previewed', st.focus === 'hc' && st.theme === 'hc', JSON.stringify(st));
			await a.page.keyboard.press('Escape'); await a.settle(250);
			st = await state(a);
			ok('4. Escape puts the kept theme back and closes the gallery', st.theme === 'light' && !st.open && st.btn.expanded === 'false', JSON.stringify(st));
			ok('4. ...focus is back on the Theme button', st.focus === 'lpn_set_theme', String(st.focus));
			ok('4. ...and nothing was stored', st.stored === null);
			ok('4. ...the Settings box is still open (Escape went to the gallery alone)', await a.page.isVisible('#lpn_settings_box'));

			// 5. Enter keeps
			await a.page.keyboard.press('Enter'); await a.settle(400);
			st = await state(a);
			ok('5. Enter on the button opens the gallery again, focus on the kept card', st.open && st.focus === 'system', JSON.stringify(st));
			for (let i = 0; i < ORDER.indexOf('amber'); i++) { await a.page.keyboard.press('ArrowRight'); }
			await a.settle(150);
			ok('5. ' + ORDER.indexOf('amber') + ' to the right: Amber, previewed', (await state(a)).theme === 'amber');
			await a.page.keyboard.press('Enter'); await a.settle(300);
			st = await state(a);
			ok('5. Enter keeps Amber: stored, painted, gallery closed', st.stored === 'amber' && st.theme === 'amber' && !st.open, JSON.stringify(st));
			ok('5. ...the button now shows Amber, by name and picture', st.btn.choice === 'amber' && st.btn.name === await a.lang('lpn_theme_amber') &&
				(await a.page.evaluate(() => document.querySelector('#lpn_set_theme .ec-theme-card').getAttribute('data-theme'))) === 'amber', JSON.stringify(st.btn));
			ok('5. ...focus is back on the button', st.focus === 'lpn_set_theme', String(st.focus));
			ok('5. lpn_theme is the only theme key in storage', JSON.stringify(await themeKeys(a)) === '["lpn_theme"]', JSON.stringify(await themeKeys(a)));

			// 5. a click keeps
			await openGallery(a);
			ok('5. reopened: Amber is the pressed card', (await a.page.getAttribute(card('amber'), 'aria-pressed')) === 'true');
			await a.page.click(card('platinum'));
			await a.settle(300);
			st = await state(a);
			ok('5. a real click on Platinum keeps it and closes the gallery', st.stored === 'platinum' && st.theme === 'platinum' && st.bs === 'light' && !st.open, JSON.stringify(st));
			await shot(a, 'gallery-3-platinum.png');

			// 6. a press outside reverts
			await openGallery(a);
			await a.page.hover(card('green'));
			await a.settle(200);
			ok('6. previewing Green', (await state(a)).theme === 'green');
			const away = await pointerAway(a);
			await a.page.hover(card('green'));
			await a.settle(150);
			await a.page.mouse.click(away.x, away.y);
			await a.settle(300);
			st = await state(a);
			ok('6. a press outside the gallery puts the kept Platinum back and closes it', st.theme === 'platinum' && st.stored === 'platinum' && !st.open, JSON.stringify(st));
			await openGallery(a);
			await a.page.hover(card('amber'));
			await a.settle(150);
			await a.page.click('#lpn_set_theme');
			await a.settle(300);
			st = await state(a);
			ok('6. a second click on the Theme button closes the gallery and puts the kept Platinum back', st.theme === 'platinum' && !st.open && st.btn.expanded === 'false', JSON.stringify(st));

			// 7. a reload keeps it; the rescue clears it; an unknown value is System
			await a.reload();
			st = await state(a);
			ok('7. after a reload Platinum stands, on <html> before the page is used', st.theme === 'platinum' && st.stored === 'platinum', JSON.stringify(st));
			await a.goto('Looped-Network.php?theme=system');
			st = await state(a);
			ok('7. ?theme=system clears the choice: nothing stored, System (light here)', st.stored === null && st.theme === 'light', JSON.stringify(st));
			await a.page.evaluate(() => localStorage.setItem('lpn_theme', 'sepia-retired'));
			await a.reload();
			st = await state(a);
			ok('7. a stored value the page does not know is read as System', st.theme === 'light' && (await a.page.evaluate(() => window.ecTheme.get())) === 'system', JSON.stringify(st));
			await a.page.evaluate(() => localStorage.removeItem('lpn_theme'));
			ok('10. no page errors (English, light device)', !a.errors.length, (a.errors[0] || '').slice(0, 200));
		} finally { await a.close(); }

		// 8. Spanish, and right to left
		const es = await Session.open(browser, 'es', { colorScheme: 'light' });
		try {
			await es.goto('Looped-Network.php?lang=es');
			await es.settle(600);
			ok('8. the Spanish page is Spanish', (await es.page.evaluate(() => document.documentElement.lang)) === 'es');
			await openSettingsRow(es);
			await openGallery(es);
			const esNames = await es.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_theme_gallery .lpn-theme-choice-name')).map((n) => n.textContent));
			const want = []; for (const t of ORDER) { want.push(await es.lang(KEYS[t])); }
			ok('8. the Spanish gallery is named from the Spanish page\'s strings', JSON.stringify(esNames) === JSON.stringify(want), JSON.stringify(esNames));
			await es.page.hover(card('green'));
			await es.settle(200);
			ok('8. pointing previews on the Spanish page', (await state(es)).theme === 'green');
			await es.page.click(card('dark'));
			await es.settle(300);
			let st = await state(es);
			ok('8. a click keeps Dark on the Spanish page', st.stored === 'dark' && st.theme === 'dark' && !st.open, JSON.stringify(st));
			ok('8. ...and the button reads the Spanish name', st.btn.name === await es.lang('lpn_theme_dark'), JSON.stringify(st.btn));
			await shot(es, 'gallery-4-es-dark.png');
			await es.goto('Looped-Network.php?lang=ar&theme=system');
			await es.settle(600);
			ok('8. the Arabic page is right to left', (await es.page.evaluate(() => document.documentElement.getAttribute('dir'))) === 'rtl');
			await openSettingsRow(es);
			await openGallery(es);
			await es.page.keyboard.press('ArrowLeft'); await es.settle(150);
			st = await state(es);
			ok('8. right to left: ArrowLeft moves forward, System to Light', st.focus === 'light', JSON.stringify(st));
			await es.page.keyboard.press('Escape'); await es.settle(200);
			ok('10. no page errors (Spanish, Arabic)', !es.errors.length, (es.errors[0] || '').slice(0, 200));
		} finally { await es.close(); }

		// 9. a dark device
		const d = await Session.open(browser, 'dark-os', { colorScheme: 'dark' });
		try {
			await d.goto('Looped-Network.php');
			await d.settle(600);
			let st = await state(d);
			ok('9. System under a dark device is Dark', st.theme === 'dark' && st.bs === 'dark' && st.stored === null, JSON.stringify(st));
			await openSettingsRow(d);
			await openGallery(d);
			const minis = await d.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_theme_gallery .ec-theme-card')).map((c) => c.getAttribute('data-theme')));
			ok('9. System\'s card is Dark and High contrast\'s card is its dark palette', minis[0] === 'dark' && minis[ORDER.indexOf('hc')] === 'hc-dark', JSON.stringify(minis));
			await d.page.click(card('hc'));
			await d.settle(300);
			st = await state(d);
			ok('9. High contrast kept under a dark device: white on black, stored as hc', st.theme === 'hc-dark' && st.stored === 'hc' && st.bs === 'dark', JSON.stringify(st));
			await d.page.emulateMedia({ colorScheme: 'light' });
			await d.settle(300);
			ok('9. ...and it follows the device to its light palette while the page is open', (await state(d)).theme === 'hc');
			await shot(d, 'gallery-5-hc.png');
			ok('10. no page errors (dark device)', !d.errors.length, (d.errors[0] || '').slice(0, 200));
		} finally { await d.close(); }
	} finally { await browser.close(); env.stopServer(); }
	console.log(fails ? `\n${fails} FAILED of ${checks}` : `\nall ${checks} ok`);
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
