// THE GUIDE'S HIERARCHY, ITS COLLAPSING HEADINGS, AND THE NOTES MOVED INTO IT (Tom, 2026-10-09).
//   node dev/lpn-spike/user-guide-hierarchy-harness.js
// (it takes the browser lock itself; never wrap it in that lock).
//
// Real Chromium, real clicks and keys:
//   1. A second level: each menu is a sub-heading of Menus, in the page and in the rail; Boxes are
//      grouped under the menu that opens them; no group nor menu is a stand-in for "everything".
//   2. A main heading collapses and expands by its chevron, by a single click, by Enter and Space
//      on the focused heading, and by a double-click; its cards are hidden while collapsed.
//   3. Search opens a collapsed section that holds a hit, and puts it back when the search is cleared;
//      a rail click into a collapsed section opens it. Nothing is written to storage.
//   4. About carries no notes; the Guide carries "How it is solved", "What it does not do" (without its
//      first sentence) and the page notes; the Help menu has no "Notes on this page" row.
//   5. The Spanish page builds the same Guide.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_USERGUIDEHIER_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '180', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.status === 75) { console.error('user-guide-hierarchy-harness: NOT RUN -- lock held.'); process.exit(1); }
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

async function boot(Session, browser, tag, url) {
	const a = await Session.open(browser, 'guide-' + tag);
	await a.goto(url);
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
	await a.settle(600);
	return a;
}
const openGuide = (page) => page.evaluate(() => {
	const x = document.getElementById('lpn_hotkeys_popup');
	if (x.style.display === 'flex') { return; }
	const b = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).filter(r => r.__lpnRow && r.__lpnRow.hotkey === '?')[0];
	b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
});
async function viaHelp(a) { await a.openMenu('help'); await openGuide(a.page); await a.settle(300); }

// Is the section's body drawn? A card inside it has a box only when it is.
const bodyShown = (page, sec) => page.evaluate((s) => {
	const el = document.querySelector('[data-guide-section="' + s + '"]');
	return Array.from(el.children).filter(c => c.tagName !== 'H2' && c.tagName !== 'TEMPLATE')
		.some(c => c.style.display !== 'none' && !c.hidden && c.getClientRects().length > 0);
}, sec);
const row = (k) => '#lpn_guide_nav .lpn-guide-nav-row[data-key="' + k + '"]';
const chev = (k) => row(k) + ' > .lpn-guide-nav-chev';
// Is a rail entry drawn?
const railShown = (page, k) => page.evaluate((sel) => { const r = document.querySelector(sel); return !!r && r.getClientRects().length > 0; }, row(k));

async function english(browser, Session) {
	const a = await boot(Session, browser, 'hier', 'Looped-Network.php');
	const page = a.page;
	const keysBefore = await page.evaluate(() => Object.keys(localStorage).sort());
	const valsBefore = await page.evaluate(() => JSON.stringify(localStorage));

	console.log('\n4. Help, About and the notes');
	const rows = await page.evaluate(() => { return null; });
	await a.openMenu('help');
	const helpRows = await page.$$eval('#lpn_menu_list button.lpn-menu-row', (els) => els.map(e => e.textContent.replace(/\s+/g, ' ').trim()));
	ok('the Help menu has no "Notes on this page" row', helpRows.every(t => t.indexOf(enString('lpn_help_notes')) < 0), JSON.stringify(helpRows));
	ok('...and no Notes box is in the page', await page.evaluate(() => !document.getElementById('lpn_notes_popup')));
	await page.keyboard.press('Escape');
	const about = await page.evaluate(() => document.getElementById('lpn_about_popup').textContent.replace(/\s+/g, ' '));
	ok('About holds no "How it is solved"', about.indexOf(enString('lpn_notes_1_term')) < 0);
	ok('...and no "What it does not do"', about.indexOf(enString('lpn_notes_2_term')) < 0);
	ok('...but still its licence and credits', about.indexOf(enString('lpn_about_license')) >= 0 && about.indexOf(enString('lpn_about_credits')) >= 0);
	const notes2 = enString('lpn_notes_2_def');
	ok('"What it does not do" no longer begins with the water quality sentence', !/^Water quality is modeled/.test(notes2) && /^Surge and water hammer/.test(notes2), notes2.slice(0, 50));

	await viaHelp(a);
	console.log('\n1. A second level');
	const secs = await page.evaluate(() => Array.from(document.querySelectorAll('.lpn-guide-section')).map(s => s.getAttribute('data-guide-section')));
	ok('the Guide has About this calculator and Notes on this page', secs.indexOf('about') >= 0 && secs.indexOf('notes') >= 0, secs.join());
	const aboutSec = await page.evaluate(() => document.querySelector('[data-guide-section="about"]').textContent);
	ok('...About this calculator carries both statements', aboutSec.indexOf(enString('lpn_notes_1_term')) >= 0 && aboutSec.indexOf(enString('lpn_notes_2_term')) >= 0);
	const noteSec = await page.evaluate(() => document.querySelector('[data-guide-section="notes"]').textContent);
	ok('...Notes carries the saving-projects and engine notes', noteSec.indexOf(enString('lpn_notes_3_term')) >= 0 && noteSec.indexOf(enString('lpn_notes_engine_term')) >= 0);
	const menus = await page.evaluate(() => Array.from(document.querySelectorAll('[data-guide-section="menus"] > .lpn-guide-list > .lpn-guide-menu')).map(m => ({
		key: m.getAttribute('data-guide-key'), h: m.querySelector(':scope > h3').textContent, rows: m.querySelectorAll('.lpn-guide-row').length })));
	ok('Menus has one sub-heading per menu, each with its cards', menus.length >= 4 && menus.every(m => /^menu-/.test(m.key) && m.h && m.rows > 0), JSON.stringify(menus));
	const nav = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_guide_nav a')).map(l => ({ k: l.getAttribute('data-guide-link'), sub: l.classList.contains('lpn-guide-nav-sub'), sub2: l.classList.contains('lpn-guide-nav-sub2') })));
	ok('the rail lists each menu as a second level', menus.every(m => nav.some(n => n.k === m.key && n.sub && !n.sub2)), JSON.stringify(nav.filter(n => /^menu-/.test(n.k))));
	const groups = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_guide_boxes > .lpn-guide-group')).map(g => ({
		key: g.getAttribute('data-guide-key'), h: g.querySelector(':scope > h3').textContent, n: g.querySelectorAll(':scope > .lpn-guide-boxentry').length })));
	ok('Boxes is grouped under the menus that open them', groups.length >= 2 && groups.every(g => g.h && g.n > 0), JSON.stringify(groups));
	ok('...and the rail shows a group, then its boxes one level deeper',
		groups.every(g => nav.some(n => n.k === g.key && n.sub)) && nav.filter(n => /^box-/.test(n.k) && n.sub2).length > 0);
	const orders = await page.evaluate(() => {
		const all = Array.from(document.querySelectorAll('#lpn_guide_nav a')).map(a => a.getAttribute('data-guide-link'));
		const dom = Array.from(document.querySelectorAll('[data-guide-section="boxes"] [data-guide-key]')).map(e => e.getAttribute('data-guide-key'));
		return { rail: all.filter(k => dom.indexOf(k) >= 0 && k !== 'boxes'), dom: dom };
	});
	ok('the rail runs in reading order', JSON.stringify(orders.rail) === JSON.stringify(orders.dom.filter(k => orders.rail.indexOf(k) >= 0)));

	console.log('\n2. The main content does not fold');
	ok('no section heading carries a chevron button or a fold class', await page.evaluate(() =>
		document.querySelectorAll('.lpn-guide-disc, .lpn-guide-disc-chev, .lpn-guide-collapsed').length === 0
		&& Array.from(document.querySelectorAll('.lpn-guide-section > h2')).every(h => !h.querySelector('button, svg'))));
	ok('the heading text is plain', (await page.textContent('[data-guide-section="menus"] > h2')).trim() === enString('lpn_hotkeys_menu_heading'));
	ok('Menus shows its cards', await bodyShown(page, 'menus'));
	await page.click('[data-guide-section="menus"] > h2');
	await page.dblclick('[data-guide-section="menus"] > h2');
	await a.settle(120);
	ok('a click and a double-click on a main heading fold nothing', await bodyShown(page, 'menus'));

	console.log('\n3. The contents rail folds');
	const parents = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_guide_nav .lpn-guide-nav-row')).map(r => ({
		k: r.getAttribute('data-key'), lvl: +r.getAttribute('data-level'), has: r.getAttribute('data-has') === '1', chev: !!r.querySelector('.lpn-guide-nav-chev') })));
	ok('Menus, Boxes and the box groups have a chevron; a leaf has none',
		['menus', 'boxes'].every(k => parents.some(p => p.k === k && p.has && p.chev)) && parents.filter(p => /^menu-/.test(p.k)).every(p => !p.has && !p.chev));
	ok('every entry starts unfolded, with its children shown', await page.evaluate(() => Array.from(document.querySelectorAll('.lpn-guide-nav-row')).every(r => r.getClientRects().length > 0 && !r.classList.contains('lpn-guide-nav-closed'))));
	const kid = await page.evaluate(() => document.querySelector('#lpn_guide_nav a[data-guide-link^="menu-"]').getAttribute('data-guide-link'));
	const grp = parents.filter(p => /^boxgroup-/.test(p.k) && p.has)[0];
	const grpKid = await page.evaluate((g) => { const r = document.querySelector('#lpn_guide_nav .lpn-guide-nav-row[data-key="' + g + '"]'); return r.nextElementSibling.getAttribute('data-key'); }, grp.k);
	ok('the chevron says it is expanded', (await page.getAttribute(chev('menus'), 'aria-expanded')) === 'true');
	await page.click(chev('menus'));
	await a.settle(120);
	ok('a click on the chevron folds Menus: its menus leave the rail', !(await railShown(page, kid)) && (await railShown(page, 'menus')) && (await page.getAttribute(chev('menus'), 'aria-expanded')) === 'false');
	ok('...the main content is untouched', await bodyShown(page, 'menus'));
	ok('...and the other entries are untouched', (await railShown(page, 'boxes')) && (await railShown(page, grpKid)));
	await page.click(chev('menus'));
	await a.settle(120);
	ok('a second click unfolds it', (await railShown(page, kid)) && (await page.getAttribute(chev('menus'), 'aria-expanded')) === 'true');
	await page.dblclick('#lpn_guide_nav a[data-guide-link="menus"]');
	await a.settle(200);
	ok('a double-click on the entry folds it', !(await railShown(page, kid)));
	await page.dblclick('#lpn_guide_nav a[data-guide-link="menus"]');
	await a.settle(200);
	ok('...and a second double-click unfolds it', await railShown(page, kid));
	await page.focus(chev('menus'));
	await page.keyboard.press('Enter');
	await a.settle(120);
	ok('Enter on the focused chevron folds', !(await railShown(page, kid)));
	await page.keyboard.press('Space');
	await a.settle(120);
	ok('Space unfolds', await railShown(page, kid));
	await page.keyboard.press('Space');
	await a.settle(120);
	ok('...and Space folds it again, keeping focus on the chevron', !(await railShown(page, kid)) && await page.evaluate((sel) => document.activeElement === document.querySelector(sel), chev('menus')));
	await page.click('#lpn_guide_nav a[data-guide-link="menus"]');
	await a.settle(300);
	ok('a single click on the entry text still jumps to its section, and does not unfold it',
		(await page.evaluate(() => document.getElementById('lpn_guide_nav').getAttribute('data-current'))) === 'menus' && !(await railShown(page, kid)));
	await page.click(chev('boxes'));
	await a.settle(120);
	ok('folding Boxes hides its groups and, deeper, its boxes',
		!(await railShown(page, grp.k)) && !(await railShown(page, grpKid)));
	await page.click(chev('boxes'));
	await a.settle(120);
	ok('unfolding Boxes shows them again', (await railShown(page, grp.k)) && (await railShown(page, grpKid)));
	await page.click(chev(grp.k));
	await a.settle(120);
	ok('a box group folds on its own, leaving its siblings', !(await railShown(page, grpKid)) && (await railShown(page, grp.k)) && (await railShown(page, 'boxes')));
	await page.click(chev(grp.k));
	await a.settle(120);

	console.log('\n4b. Search does not fold or unfold anything');
	const term = await page.evaluate(() => document.querySelector('[data-guide-section="menus"] .lpn-guide-menu .lpn-guide-name').textContent.trim());
	await page.fill('#lpn_guide_search', term);
	await a.settle(250);
	ok('while searching the main content is as it was, and the rail shows every match', (await bodyShown(page, 'menus')) && await page.evaluate(() =>
		document.querySelectorAll('#lpn_guide_nav .lpn-guide-nav-folded').length === 0));
	await page.fill('#lpn_guide_search', '');
	await a.settle(250);
	ok('...and after it the rail is back as it was (Menus still folded)', !(await railShown(page, kid)) && (await railShown(page, 'menus')));
	await page.click(chev('menus'));
	await a.settle(120);
	ok('a fresh page starts with Menus unfolded: unfold now', await railShown(page, kid));
	const keysAfter = await page.evaluate(() => Object.keys(localStorage).sort());
	ok('no localStorage key was added by any of it', JSON.stringify(keysAfter.filter(k => keysBefore.indexOf(k) < 0 && !/hotkeysbox|dock|layout/.test(k))) === '[]', JSON.stringify(keysAfter.filter(k => keysBefore.indexOf(k) < 0)));
	ok('...and none of the Guide\'s fold state is in storage', await page.evaluate(() => !/collaps|navfold|guide-?fold|nav-closed/i.test(JSON.stringify(localStorage) + JSON.stringify(sessionStorage))));
	await page.reload();
	await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.settle(500);
	await a.openExampleCard(await a.lang('lpn_ex_net3_title')).catch(() => {});
	await a.settle(500);
	if (!(await page.evaluate(() => document.getElementById('lpn_hotkeys_popup').style.display === 'flex'))) { await viaHelp(a); }
	await page.click(chev('menus'));
	await a.settle(100);
	await page.reload();
	await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.settle(500);
	await a.openExampleCard(await a.lang('lpn_ex_net3_title')).catch(() => {});
	await a.settle(500);
	if (!(await page.evaluate(() => document.getElementById('lpn_hotkeys_popup').style.display === 'flex'))) { await viaHelp(a); }
	ok('after a reload the rail is unfolded again', await railShown(page, kid));
	ok('no page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	await a.context.close().catch(() => {});
}

async function spanish(browser, Session) {
	console.log('\n5. The Spanish page');
	const a = await boot(Session, browser, 'hier-es', 'Looped-Network.php?lang=es');
	const page = a.page;
	await viaHelp(a);
	const st = await page.evaluate(() => ({
		secs: document.querySelectorAll('.lpn-guide-section').length,
		chevs: document.querySelectorAll('#lpn_guide_nav .lpn-guide-nav-chev').length,
		plain: document.querySelectorAll('.lpn-guide-disc').length,
		menus: document.querySelectorAll('[data-guide-section="menus"] .lpn-guide-menu').length,
		groups: document.querySelectorAll('#lpn_guide_boxes > .lpn-guide-group').length,
		nav: document.querySelectorAll('#lpn_guide_nav a').length,
		about: (document.querySelector('[data-guide-section="about"] > h2') || {}).textContent
	}));
	ok('the Guide builds in Spanish with all its sections', st.secs >= 9 && st.plain === 0 && st.chevs >= 2 && st.menus >= 4 && st.groups >= 2 && st.nav > st.secs, JSON.stringify(st));
	ok('...the new heading falls back to English until it is translated', /About this calculator/.test(st.about || ''), st.about);
	await page.click(chev('menus'));
	await a.settle(120);
	ok('...Menus is folded in the rail (its chevron says so)', (await page.getAttribute(chev('menus'), 'aria-expanded')) === 'false');
	ok('no page errors in Spanish', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
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
		await english(browser, Session);
		await spanish(browser, Session);
	} catch (e) {
		console.error(e && e.stack || e);
		fails++;
	} finally {
		await browser.close().catch(() => {});
		env.stopServer();
	}
	console.log(fails ? `\nuser-guide-hierarchy-harness: ${fails} FAILURE(S)` : '\nuser-guide-hierarchy-harness: ALL PASS');
	process.exit(fails ? 1 : 0);
}
main();
