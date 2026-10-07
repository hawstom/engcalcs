// THE GUIDE'S CONTENTS RAIL, SEARCH AND "?" (Tom, 2026-10-07; Ida's spec).
//   node dev/lpn-spike/user-guide-rail-harness.js
// (it takes the browser lock itself; never wrap it in that lock).
//
// Real Chromium, clicking the real controls:
//   1. The rail collapses by its chevron and the choice persists across a reload (inside the
//      lpn_hotkeysbox record: no new storage key).
//   2. Scrolling the content moves the highlighted section in the rail (IntersectionObserver),
//      and a rail click scrolls to its section and writes #guide/<section> in the URL.
//   3. Search filters the rail and the sections, shows a snippet, "/" focuses it, Ctrl+K opens
//      the guide with it focused.
//   4. The "?" in the title bar of two different boxes opens the Guide at each box's own entry;
//      F1 inside a box does the same; #guide/<key> deep-links.
//   5. At 390 px the rail is a "Contents" disclosure, closed by default, and opens on a tap.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_USERGUIDERAIL_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '180', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.status === 75) { console.error('user-guide-rail-harness: NOT RUN -- lock held.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

const EN = require('fs').readFileSync(path.join(REPO, 'lib', 'lang.ec.en.php'), 'utf8');
function enString(key) {
	const m = EN.match(new RegExp("\\$ec_lang\\['" + key + "'\\]='((?:[^'\\\\]|\\\\.)*)';"));
	if (!m) { throw new Error('no English for ' + key); }
	return m[1].replace(/\\'/g, "'");
}
// A real press: Playwright's click is a trusted mouse click with detail 1.
async function press(page, sel) { await page.click(sel); }

async function boot(Session, browser, tag, extra) {
	const a = await Session.open(browser, 'guide-' + tag, extra);
	await a.goto('Looped-Network.php');
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
	await a.settle(600);
	return a;
}

const boxOpen = (page) => page.evaluate(() => {
	const b = document.getElementById('lpn_hotkeys_popup');
	return !!b && b.style.display === 'flex' && b.getClientRects().length > 0;
});
const closeBox = (page) => page.evaluate(() => {
	const x = document.getElementById('lpn_hotkeys_close');
	if (x && x.getClientRects().length) { x.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); }
});
const probe = (page) => page.evaluate(() => {
	const p = EngCalcs.lpnGuideProbe();
	return { undo: p.undo, sig: p.sig, mode: p.mode, names: p.toolbar.map(b => b.name), icons: p.toolbar.map(b => b.icon) };
});


const openGuide = (page) => page.evaluate(() => {
	const x = document.getElementById('lpn_hotkeys_popup');
	if (x.style.display === 'flex') { return; }
	const b = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).filter(r => r.__lpnRow && r.__lpnRow.hotkey === '?')[0];
	b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
});
async function viaHelp(a) {
	await a.openMenu('help');
	await openGuide(a.page);
	await a.settle(300);
}
const cur = (page) => page.evaluate(() => {
	const c = document.querySelector('#lpn_guide_nav a[aria-current="true"]');
	return c ? c.getAttribute('data-guide-link') : null;
});
const railState = (page) => page.evaluate(() => {
	const box = document.getElementById('lpn_hotkeys_popup'), rail = document.getElementById('lpn_guide_rail'), r = rail.getBoundingClientRect();
	return { collapsed: box.classList.contains('lpn-guide-rail-collapsed'), w: Math.round(r.width), h: Math.round(r.height),
		expanded: document.getElementById('lpn_guide_railtoggle').getAttribute('aria-expanded'),
		bodyShown: document.getElementById('lpn_guide_railbody').getClientRects().length > 0 };
});
const click = (page, sel) => page.evaluate((s) => { document.querySelector(s).dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); }, sel);

async function desktop(browser, Session) {
	const a = await boot(Session, browser, 'rail');
	const page = a.page;
	const keysBefore = await page.evaluate(() => Object.keys(localStorage).sort());
	await viaHelp(a);
	ok('the guide opens', await boxOpen(page));
	ok('...titled "Guide"', (await page.textContent('#lpn_hotkeys_title')).trim() === 'Guide');

	console.log('\n1. The rail collapses, and stays collapsed');
	let st = await railState(page);
	ok('the rail opens at about 240 px with its body shown', !st.collapsed && st.w >= 225 && st.w <= 250 && st.bodyShown, JSON.stringify(st));
	await click(page, '#lpn_guide_railtoggle');
	await a.settle(150);
	st = await railState(page);
	ok('the chevron collapses it to a strip', st.collapsed && st.w < 60 && !st.bodyShown && st.expanded === 'false', JSON.stringify(st));
	await closeBox(page);
	await page.reload();
	await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.settle(600);
	await a.openExampleCard(await a.lang('lpn_ex_net3_title')).catch(() => {});
	await a.settle(500);
	if (!(await boxOpen(page))) { await viaHelp(a); }
	st = await railState(page);
	ok('after a reload it is still collapsed', st.collapsed && !st.bodyShown, JSON.stringify(st));
	await click(page, '#lpn_guide_railtoggle');
	await a.settle(150);
	st = await railState(page);
	ok('and the chevron brings it back', !st.collapsed && st.bodyShown && st.expanded === 'true', JSON.stringify(st));
	const keysAfter = await page.evaluate(() => Object.keys(localStorage).sort());
	ok('no new localStorage key was written', JSON.stringify(keysAfter.filter(k => keysBefore.indexOf(k) < 0 && !/hotkeysbox|recent|dock|layout/.test(k))) === '[]',
		JSON.stringify(keysAfter.filter(k => keysBefore.indexOf(k) < 0)));

	console.log('\n2. Scroll moves the highlight; the rail scrolls to a section');
	const links = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_guide_nav a')).map(a => a.getAttribute('data-guide-link')));
	ok('the rail lists the five sections and a row per box', ['toolbar', 'menus', 'map', 'tables', 'boxes'].every(k => links.indexOf(k) >= 0) && links.filter(k => /^box-/.test(k)).length >= 10, JSON.stringify(links));
	await page.evaluate(() => { document.getElementById('lpn_guide_content').scrollTop = 0; });
	await a.settle(250);
	ok('at the top the first section is current', (await cur(page)) === 'toolbar', await cur(page));
	await page.evaluate(() => {
		const c = document.getElementById('lpn_guide_content'), t = document.querySelector('[data-guide-key="tables"]');
		c.scrollTop = t.getBoundingClientRect().top - c.getBoundingClientRect().top + c.scrollTop + 2;
	});
	await a.settle(300);
	ok('scrolled to Tables, Tables is current', (await cur(page)) === 'tables', await cur(page));
	await page.evaluate(() => { document.getElementById('lpn_guide_content').scrollTop = 0; });
	await a.settle(250);
	await click(page, '#lpn_guide_nav a[data-guide-link="map"]');
	await a.settle(300);
	const pos = await page.evaluate(() => {
		const c = document.getElementById('lpn_guide_content'), t = document.querySelector('[data-guide-key="map"]');
		return { top: Math.round(t.getBoundingClientRect().top - c.getBoundingClientRect().top), hash: location.hash };
	});
	ok('a rail click scrolls that section to the top of the pane', Math.abs(pos.top) < 12, JSON.stringify(pos));
	ok('...and writes #guide/map in the address', pos.hash === '#guide/map', pos.hash);
	ok('...and highlights it', (await cur(page)) === 'map', await cur(page));

	console.log('\n3. Search');
	await page.fill('#lpn_guide_search', 'Zoom out');
	await a.settle(200);
	const sr = await page.evaluate(() => ({
		links: Array.from(document.querySelectorAll('#lpn_guide_nav a')).map(a => a.getAttribute('data-guide-link')),
		snip: Array.from(document.querySelectorAll('.lpn-guide-nav-snip')).map(s => s.textContent),
		shown: Array.from(document.querySelectorAll('.lpn-guide-section')).filter(s => s.style.display !== 'none').map(s => s.getAttribute('data-guide-section'))
	}));
	ok('the rail narrows to the sections that match', sr.links.length >= 1 && sr.links.length < 5 && sr.links.indexOf('boxes') < 0, JSON.stringify(sr.links));
	ok('...with a snippet of the matching text', sr.snip.length >= 1 && /zoom out/i.test(sr.snip.join(' ')), JSON.stringify(sr.snip));
	ok('...and the content shows the same sections', JSON.stringify(sr.links.filter(k => !/^box-/.test(k)).sort()) === JSON.stringify(sr.shown.sort()), JSON.stringify(sr.shown));
	await page.fill('#lpn_guide_search', 'qqzzxx');
	await a.settle(150);
	ok('nonsense lists nothing and says "Nothing matched."', (await page.evaluate(() => document.querySelectorAll('#lpn_guide_nav a').length)) === 0
		&& !(await page.evaluate(() => document.getElementById('lpn_guide_none').hidden)));
	await page.fill('#lpn_guide_search', '');
	await a.settle(150);
	// "/" from inside the box focuses the search.
	await page.focus('#lpn_guide_nav a');
	await page.keyboard.press('/');
	ok('"/" in the guide focuses the search', (await page.evaluate(() => document.activeElement && document.activeElement.id)) === 'lpn_guide_search');
	await page.keyboard.type('x');
	ok('...and the slash itself is not typed', (await page.inputValue('#lpn_guide_search')) === 'x');
	await page.fill('#lpn_guide_search', '');
	await closeBox(page);
	await a.settle(200);
	ok('the guide is closed again', !(await boxOpen(page)));
	await page.evaluate(() => { if (document.activeElement) { document.activeElement.blur(); } });
	await page.keyboard.press('Control+k');
	await a.settle(300);
	ok('Ctrl+K opens the guide', await boxOpen(page));
	ok('...with the search focused', (await page.evaluate(() => document.activeElement && document.activeElement.id)) === 'lpn_guide_search');

	console.log('\n4. The "?" in a title bar, and F1');
	await closeBox(page);
	const settingsTitle = await a.lang('lpn_tool_settings');
	await a.openBox ? 0 : 0;
	await page.evaluate(() => { const b = document.getElementById('lpn_toolbar_settings') || document.querySelector('#lpn_toolbar [data-tool="settings"]'); if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); } });
	await a.settle(300);
	const boxes = await page.evaluate(() => Array.from(document.querySelectorAll('[data-guide-for]')).map(b => b.getAttribute('data-guide-for')));
	ok('every standing box carries one guide "?"', boxes.length >= 15 && new Set(boxes).size === boxes.length, boxes.length + ' ' + JSON.stringify(boxes));
	const tip = await page.evaluate(() => document.querySelector('[data-guide-for]').title);
	ok('...tip "Help for this box"', tip === 'Help for this box', tip);
	async function opens(boxId, why) {
		await page.evaluate((id) => {
			const box = document.getElementById(id);
			if (box.style.display === 'none' || !box.style.display) { box.style.display = 'flex'; }
		}, boxId);
		await page.evaluate(() => { const g = document.getElementById('lpn_hotkeys_popup'); if (g.style.display === 'flex') { document.getElementById('lpn_hotkeys_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); } });
		await a.settle(150);
		await click(page, '[data-guide-for="' + boxId + '"]');
		await a.settle(400);
		const r = await page.evaluate((id) => {
			const c = document.getElementById('lpn_guide_content'), e = document.querySelector('[data-guide-key="box-' + id + '"]');
			const box = document.getElementById('lpn_hotkeys_popup');
			return { open: box.style.display === 'flex', top: e ? Math.round(e.getBoundingClientRect().top - c.getBoundingClientRect().top) : null,
				title: e ? e.querySelector('h3').textContent : null,
				boxTitle: document.querySelector('#' + id + ' .lpn-setbox-title').textContent.trim(),
				current: (document.querySelector('#lpn_guide_nav a[aria-current="true"]') || { getAttribute: () => null }).getAttribute('data-guide-link'),
				hash: location.hash };
		}, boxId);
		ok(why + ': the "?" opens the guide', r.open, JSON.stringify(r));
		ok('...at that box\'s own entry, named as its title bar is', r.title === r.boxTitle && r.top !== null && Math.abs(r.top) < 40, JSON.stringify(r));
		ok('...highlighted in the rail and written to the address', r.current === 'box-' + boxId && r.hash === '#guide/box-' + boxId, JSON.stringify(r));
		return r;
	}
	const r1 = await opens('lpn_settings_box', 'Settings');
	const r2 = await opens('lpn_library_box', 'Library');
	ok('two different boxes reach two different entries', r1.title !== r2.title);
	// F1 with focus inside a box.
	await page.evaluate(() => { document.getElementById('lpn_hotkeys_close').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); });
	await a.settle(150);
	await page.evaluate(() => { const b = document.getElementById('lpn_settings_box'); b.style.display = 'flex'; const f = b.querySelector('input, button, select'); if (f) { f.focus(); } });
	await page.keyboard.press('F1');
	await a.settle(400);
	ok('F1 inside Settings opens the Settings entry', (await page.evaluate(() => document.getElementById('lpn_hotkeys_popup').style.display === 'flex' && location.hash)) === '#guide/box-lpn_settings_box');
	await closeBox(page);
	await a.settle(150);
	ok('closing the guide clears #guide from the address', await page.evaluate(() => !/guide/.test(location.hash)));
	await page.evaluate(() => { location.hash = '#guide/menus'; });
	await a.settle(400);
	ok('#guide/menus deep-links to Menus', await boxOpen(page) && (await cur(page)) === 'menus', await cur(page));

	ok('no page errors on the desktop pass', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	await a.context.close().catch(() => {});
}

async function phone(browser, Session) {
	const a = await boot(Session, browser, 'rail-phone', { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
	const page = a.page;
	console.log('\n5. At 390 px the rail is a Contents disclosure, closed by default');
	await page.tap('#lpn_menu_help');
	await a.settle(200);
	await openGuide(page);
	await a.settle(400);
	ok('the guide opens', await boxOpen(page));
	let st = await railState(page);
	ok('the rail is closed, stacked above the text', st.collapsed && !st.bodyShown && st.expanded === 'false', JSON.stringify(st));
	const lay = await page.evaluate(() => {
		const r = document.getElementById('lpn_guide_rail').getBoundingClientRect(), c = document.getElementById('lpn_guide_content').getBoundingClientRect();
		return { railW: Math.round(r.width), contentTop: Math.round(c.top), railBottom: Math.round(r.bottom), title: document.querySelector('.lpn-guide-railtitle').getClientRects().length > 0,
			label: document.querySelector('.lpn-guide-railtitle').textContent.trim() };
	});
	ok('...full width, content below it, labelled "Contents"', lay.railW > 300 && lay.contentTop >= lay.railBottom - 1 && lay.title && lay.label === 'Contents', JSON.stringify(lay));
	await page.tap('#lpn_guide_railtoggle');
	await a.settle(200);
	st = await railState(page);
	ok('a tap opens the disclosure', !st.collapsed && st.bodyShown && st.expanded === 'true', JSON.stringify(st));
	await page.tap('#lpn_guide_nav a[data-guide-link="tables"]');
	await a.settle(300);
	ok('a tap on an entry scrolls to it', (await cur(page)) === 'tables', await cur(page));
	const sw = await page.evaluate(() => { const b = document.querySelector('.lpn-guide-body'); return { sw: b.scrollWidth, cw: b.clientWidth }; });
	ok('nothing scrolls sideways', sw.sw <= sw.cw + 1, JSON.stringify(sw));
	ok('no page errors on the phone pass', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	await a.context.close().catch(() => {});
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		await desktop(browser, Session);
		await phone(browser, Session);
	} catch (e) {
		console.error(e && e.stack || e);
		fails++;
	} finally {
		await browser.close().catch(() => {});
		env.stopServer();
	}
	console.log(fails ? `\nuser-guide-rail-harness: ${fails} FAILURE(S)` : '\nuser-guide-rail-harness: ALL PASS');
	process.exit(fails ? 1 : 0);
}
main();
