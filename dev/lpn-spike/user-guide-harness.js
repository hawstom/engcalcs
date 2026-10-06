// THE USER GUIDE (Tom, 2026-10-06; Ida's design, dev/agents/interface-designer/journal.md).
//   node dev/lpn-spike/user-guide-harness.js
// (it takes the browser lock itself; never wrap it in that lock).
//
// Real Chromium, because the guide is derived at runtime from the strip and the menus, and because
// "a row SHOWS and never runs" and "a phone sees the folded rows" are claims about a live page:
//   1. Help has ONE "User guide" row (with "?" in its key slot) where "Tables and Hotkeys" and the
//      "Toolbar" fly-out stood, and it opens the box.
//   2. The Toolbar rows equal toolbarIconIndex in count and order; every #lpn_toolbar button is in
//      that index; the tip is written out with its key in a <kbd>, never "Shortcut: N" again; a
//      button with a menu twin names it.
//   3. Search filters rows and hides a section with nothing left; nonsense shows "Nothing matched."
//   4. A row click pulses the real button, or opens the menu (and fly-out) at the row -- and runs
//      nothing: no document change, no undo entry, no tool change. Delete network is the row used.
//   5. "?" opens the guide at the focused control, at the hovered one, at a hovered menu row, and
//      types a plain "?" in a field.
//   6. At 390 px the box fills the width, rows fold (tip under name), nothing scrolls sideways, and
//      a toolbar row opens the menu twin above the box.
//   7. Looped-Network.php#guide opens it.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_USERGUIDE_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '180', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.status === 75) { console.error('user-guide-harness: NOT RUN -- lock held.'); process.exit(1); }
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

async function desktop(browser, Session) {
	const a = await boot(Session, browser, 'desk');
	const page = a.page;
	const L = {
		// The two retired rows' words, read from the language file: the page no longer sends them.
		manual: await a.lang('lpn_help_manual'), hotkeys: enString('lpn_help_hotkeys'), icons: enString('lpn_help_icons'),
		edit: await a.lang('lpn_menu_edit'), del: await a.lang('lpn_tool_delete'),
		delnet: await a.lang('lpn_edit_delete_network'), none: await a.lang('lpn_find_none'),
		junction: await a.lang('lpn_tool_add_junction'), insert: await a.lang('lpn_menu_insert'),
		undo: await a.lang('lpn_tool_undo'), pipe: await a.lang('lpn_tool_add_pipe'), find: await a.lang('lpn_find_menu')
	};

	console.log('\n1. Help has one User guide row, and it opens the box');
	await a.openMenu('help');
	const help = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row'))
		.map(b => ({ t: b.childNodes[1] ? b.childNodes[1].textContent : '', hk: b.getAttribute('data-hotkey'), sub: b.getAttribute('aria-haspopup') })));
	const texts = help.map(r => r.t);
	ok('no "Tables and Hotkeys" row', texts.indexOf(L.hotkeys) < 0, JSON.stringify(texts));
	ok('no "Toolbar" fly-out row', texts.indexOf(L.icons) < 0);
	const g = help.filter(r => r.t === L.manual);
	ok('exactly one "User guide" row', g.length === 1);
	ok('...and "?" sits in its hotkey slot', g.length === 1 && g[0].hk === '?', g[0] && g[0].hk);
	ok('...and it is a command, not a fly-out', g.length === 1 && !g[0].sub);
	await page.evaluate((t) => {
		const b = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).filter(x => x.childNodes[1] && x.childNodes[1].textContent === t)[0];
		b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
	}, L.manual);
	await a.settle(300);
	ok('the row opens the User guide box', await boxOpen(page));
	ok('...titled "User guide"', (await page.textContent('#lpn_hotkeys_title')).trim() === L.manual);

	console.log('\n2. The Toolbar section is the strip, in order, with tips written out');
	const p0 = await probe(page);
	const rows = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_guide_toolbar > .lpn-guide-row')).map(r => ({
		name: r.querySelector('.lpn-guide-name').textContent,
		tip: (r.querySelector('.lpn-guide-tip') || { textContent: '' }).textContent,
		keys: Array.from(r.querySelectorAll('kbd')).map(k => k.textContent),
		twin: (r.querySelector('.lpn-guide-twin') || { textContent: '' }).textContent,
		off: r.classList.contains('lpn-guide-off')
	})));
	ok('as many guide rows as toolbarIconIndex records', rows.length === p0.names.length && rows.length > 15, rows.length + ' vs ' + p0.names.length);
	ok('...in the same order', JSON.stringify(rows.map(r => r.name)) === JSON.stringify(p0.names));
	const unindexed = await page.evaluate(() => {
		const els = EngCalcs.lpnGuideProbe().toolbar.map(b => b.el);
		return Array.from(document.querySelectorAll('#lpn_toolbar button')).filter(b => els.indexOf(b) < 0)
			.map(b => b.getAttribute('aria-label') || b.textContent || b.className);
	});
	ok('every #lpn_toolbar button is in the index', unindexed.length === 0, JSON.stringify(unindexed));
	const jr = rows.filter(r => r.name === L.junction)[0];
	ok('the Junction row shows its key in a <kbd>', !!jr && jr.keys.indexOf('2') >= 0, jr && JSON.stringify(jr.keys));
	ok('...and its tip does not repeat "Shortcut: 2"', !!jr && !/Shortcut/.test(jr.tip) && rows.every(r => !/Shortcut: /.test(r.tip)));
	ok('...and it names its menu twin, Water > Insert > Junction', !!jr && jr.twin === (await a.lang('lpn_guide_also')).replace('{menu}', (await a.lang('lpn_menu_project')) + L.insert + L.junction), jr && jr.twin);
	const dr = rows.filter(r => r.name === L.del)[0];
	ok('the Delete row says "Also in Edit > Delete", the menu named by its button\'s words alone', !!dr && dr.twin === (await a.lang('lpn_guide_also')).replace('{menu}', L.edit + L.del), dr && dr.twin);
	const tipped = rows.filter(r => r.tip.length > 20).length;
	ok('tips are written out on the rows, not hidden behind hover', tipped >= 8, String(tipped));
	const chev = await page.evaluate(() => document.querySelectorAll('#lpn_guide_toolbar .lpn-guide-chev').length);
	ok('the path is drawn with chevrons', chev > 5, String(chev));
	const rules = await page.evaluate(() => document.querySelectorAll('#lpn_guide_toolbar > .lpn-guide-rule').length);
	ok('the strip\'s groups are ruled off', rules >= 4, String(rules));
	const menus = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_guide_menus .lpn-guide-menu')).map(m => m.getAttribute('data-guide-menu')));
	ok('the Menus section lists File, Edit, Map, Water and Help', JSON.stringify(menus) === JSON.stringify(['lpn_menu_file', 'lpn_menu_edit', 'lpn_menu_map', 'lpn_menu_project', 'lpn_menu_help']), JSON.stringify(menus));
	const subs = await page.evaluate(() => document.querySelectorAll('#lpn_guide_menus .lpn-guide-sub').length);
	ok('...fly-out rows included, indented', subs > 10, String(subs));

	console.log('\n3. Search filters, and hides a section with nothing left');
	const vis = () => page.evaluate(() => {
		const out = {};
		document.querySelectorAll('#lpn_hotkeys_popup .lpn-guide-section').forEach(s => { out[s.getAttribute('data-guide-section')] = s.style.display !== 'none'; });
		out.toolbarRows = Array.from(document.querySelectorAll('#lpn_guide_toolbar > .lpn-guide-row')).filter(r => r.style.display !== 'none').length;
		out.none = !document.getElementById('lpn_guide_none').hidden;
		return out;
	});
	await page.fill('#lpn_guide_search', L.junction.toLowerCase());
	let v = await vis();
	ok('a tool name leaves the Toolbar section with fewer rows', v.toolbar && v.toolbarRows >= 1 && v.toolbarRows < rows.length, JSON.stringify(v));
	await page.fill('#lpn_guide_search', 'Ctrl+Shift+PageDown');
	v = await vis();
	ok('a key only the Tables section has hides Toolbar, Menus and Map', v.tables && !v.toolbar && !v.menus && !v.map, JSON.stringify(v));
	await page.fill('#lpn_guide_search', 'zqxjkvw');
	v = await vis();
	ok('nonsense hides every section and says "Nothing matched."', !v.toolbar && !v.menus && !v.map && !v.tables && v.none, JSON.stringify(v));
	await page.fill('#lpn_guide_search', '');
	v = await vis();
	ok('clearing it brings everything back', v.toolbar && v.menus && v.map && v.tables && !v.none && v.toolbarRows === rows.length);

	console.log('\n4. A row SHOWS and never runs');
	const before = await probe(page);
	await page.evaluate((t) => {
		const r = Array.from(document.querySelectorAll('#lpn_guide_toolbar > .lpn-guide-row')).filter(x => x.querySelector('.lpn-guide-name').textContent === t)[0];
		r.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
	}, L.junction);
	await a.settle(150);
	const pulsed = await page.evaluate(() => {
		const b = document.querySelector('#lpn_toolbar button[data-tool="add-junction"]');
		return !!b && b.classList.contains('lpn-guide-pulse');
	});
	ok('a toolbar row pulses the real button', pulsed);
	let after = await probe(page);
	ok('...and the tool is not switched on', after.mode === before.mode, before.mode + ' -> ' + after.mode);
	await page.waitForTimeout(1700);
	ok('...and the pulse ends after about 1.5 s', !(await page.evaluate(() => document.querySelector('#lpn_toolbar button[data-tool="add-junction"]').classList.contains('lpn-guide-pulse'))));
	// Delete network: the row whose running would be loudest.
	await page.evaluate((t) => {
		const r = Array.from(document.querySelectorAll('#lpn_guide_menus [data-guide-menu="lpn_menu_edit"] .lpn-guide-row')).filter(x => x.querySelector('.lpn-guide-name').textContent === t)[0];
		r.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
	}, L.delnet);
	await a.settle(200);
	const shown = await page.evaluate(() => {
		const pop = document.getElementById('lpn_menu_popup'), ae = document.activeElement;
		return { open: pop.style.display === 'block', anchor: document.getElementById('lpn_menu_edit').getAttribute('aria-expanded'),
			focus: ae && ae.__lpnRow ? ae.__lpnRow.label : null, pulse: !!(ae && ae.classList.contains('lpn-guide-pulse')) };
	});
	ok('a menu row opens its menu', shown.open && shown.anchor === 'true', JSON.stringify(shown));
	ok('...with that row focused and pulsing', shown.focus === L.delnet && shown.pulse, JSON.stringify(shown));
	after = await probe(page);
	ok('...and the network is NOT deleted: the document is unchanged', after.sig === before.sig);
	ok('...and no undo entry was made', after.undo === before.undo, before.undo + ' -> ' + after.undo);
	ok('...and no dialog asked anything', a.dialogs.length === 0 && !(await page.evaluate(() => { const d = document.getElementById('lpn_dialog'); return !!d && d.style.display !== 'none' && d.getClientRects().length > 0; })));
	await page.keyboard.press('Escape');
	await a.settle(100);
	// A fly-out row: Water > Insert > Junction.
	await page.evaluate((t) => {
		const r = Array.from(document.querySelectorAll('#lpn_guide_menus [data-guide-menu="lpn_menu_project"] .lpn-guide-sub')).filter(x => x.querySelector('.lpn-guide-name').textContent === t)[0];
		r.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
	}, L.junction);
	await a.settle(200);
	const fly = await page.evaluate(() => {
		const sub = document.getElementById('lpn_menu_popup2'), ae = document.activeElement;
		return { open: !!sub && sub.style.display === 'block', inSub: !!(ae && sub.contains(ae)), focus: ae && ae.__lpnRow ? ae.__lpnRow.label : null };
	});
	ok('a fly-out row opens the menu AND its fly-out, at the row', fly.open && fly.inSub && fly.focus === L.junction, JSON.stringify(fly));
	after = await probe(page);
	ok('...and runs nothing', after.mode === before.mode && after.sig === before.sig && after.undo === before.undo);
	await page.keyboard.press('Escape');
	await page.keyboard.press('Escape');
	await a.settle(100);

	console.log('\n5. "?" opens the guide at the control in question');
	await closeBox(page);
	await a.settle(100);
	ok('(the box is closed)', !(await boxOpen(page)));
	const guideFocus = () => page.evaluate(() => {
		const ae = document.activeElement, box = document.getElementById('lpn_hotkeys_popup');
		const row = ae && ae.closest && ae.closest('.lpn-guide-row');
		return { open: box.style.display === 'flex', inBox: !!(row && box.contains(row)),
			name: row ? row.querySelector('.lpn-guide-name').textContent : null,
			menu: row && row.closest('[data-guide-menu]') ? row.closest('[data-guide-menu]').getAttribute('data-guide-menu') : null,
			pulse: !!(row && row.classList.contains('lpn-guide-pulse')) };
	});
	await page.evaluate(() => {
		const b = Array.from(document.querySelectorAll('#lpn_toolbar button')).filter(x => x.getAttribute('data-icon') === 'undo' || (x.querySelector('svg') && /undo/i.test(x.getAttribute('aria-label') || '')))[0]
			|| EngCalcs.lpnGuideProbe().toolbar.filter(t => t.icon === 'undo')[0].el;
		b.focus();
	});
	await page.keyboard.type('?');
	await a.settle(200);
	let gf = await guideFocus();
	ok('"?" on the focused Undo button opens the guide at the Undo row', gf.open && gf.inBox && gf.name === L.undo && gf.pulse, JSON.stringify(gf));
	await closeBox(page);
	await page.evaluate(() => { if (document.activeElement) { document.activeElement.blur(); } });
	await page.hover('#lpn_toolbar button[data-tool="add-pipe"]');
	await page.keyboard.type('?');
	await a.settle(200);
	gf = await guideFocus();
	ok('"?" with the pointer over Pipe opens it at the Pipe row', gf.open && gf.name === L.pipe, JSON.stringify(gf));
	await closeBox(page);
	await page.evaluate(() => { if (document.activeElement) { document.activeElement.blur(); } });
	await a.openMenu('edit');
	const findRow = await page.evaluateHandle((t) => Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).filter(x => x.__lpnRow && x.__lpnRow.label === t)[0], L.find);
	await findRow.hover();
	await page.keyboard.type('?');
	await a.settle(200);
	gf = await guideFocus();
	ok('"?" over a menu row opens it at that row, under that menu', gf.open && gf.name === L.find && gf.menu === 'lpn_menu_edit', JSON.stringify(gf));
	ok('...and the menu closed behind it', await page.evaluate(() => document.getElementById('lpn_menu_popup').style.display !== 'block'));
	await page.focus('#lpn_guide_search');
	await page.keyboard.type('?');
	ok('"?" typed in a field is just a character', (await page.inputValue('#lpn_guide_search')) === '?'
		&& await page.evaluate(() => document.activeElement && document.activeElement.id === 'lpn_guide_search'));
	await page.fill('#lpn_guide_search', '');
	await page.evaluate(() => document.getElementById('lpn_guide_search').dispatchEvent(new Event('input')));

	console.log('\n7. Looped-Network.php#guide opens it');
	await closeBox(page);
	await a.goto('Looped-Network.php#guide');
	await a.settle(800);
	ok('#guide opens the box on arrival', await boxOpen(page));
	ok('...with toolbar rows in it', (await page.evaluate(() => document.querySelectorAll('#lpn_guide_toolbar > .lpn-guide-row').length)) > 15);
	await closeBox(page);
	ok('no page errors on the desktop pass', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	await a.context.close().catch(() => {});
}

async function phone(browser, Session) {
	const a = await boot(Session, browser, 'phone', { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
	const page = a.page;
	const junction = await a.lang('lpn_tool_add_junction');
	console.log('\n6. At 390 px: the box fills the width and the rows fold');
	await page.tap('#lpn_menu_help');
	await a.settle(200);
	const manual = await a.lang('lpn_help_manual');
	await page.evaluate((t) => {
		const b = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).filter(x => x.__lpnRow && x.__lpnRow.label === t)[0];
		b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
	}, manual);
	await a.settle(400);
	ok('the Help row opens the guide on a phone', await boxOpen(page));
	const geo = await page.evaluate(() => {
		const box = document.getElementById('lpn_hotkeys_popup'), r = box.getBoundingClientRect();
		const body = box.querySelector('.lpn-guide-body');
		const row = document.querySelector('#lpn_guide_toolbar > .lpn-guide-row');
		const nm = row.querySelector('.lpn-guide-name').getBoundingClientRect(), ds = row.querySelector('.lpn-guide-desc').getBoundingClientRect();
		const p = EngCalcs.lpnGuideProbe();
		return { w: r.width, left: r.left, vw: window.innerWidth, sw: body.scrollWidth, cw: body.clientWidth,
			nameBottom: nm.bottom, descTop: ds.top, descLeft: ds.left, nameLeft: nm.left,
			rows: document.querySelectorAll('#lpn_guide_toolbar > .lpn-guide-row').length, index: p.toolbar.length,
			off: document.querySelectorAll('#lpn_guide_toolbar > .lpn-guide-row.lpn-guide-off').length,
			hidden: p.toolbar.filter(b => !b.el.getClientRects().length).length };
	});
	ok('the box fills the width', geo.w >= geo.vw - 20 && geo.left <= 10, JSON.stringify({ w: geo.w, vw: geo.vw, left: geo.left }));
	ok('...and nothing in it scrolls sideways', geo.sw <= geo.cw + 1, geo.sw + ' > ' + geo.cw);
	ok('every toolbar record has its row on a phone too', geo.rows === geo.index && geo.rows > 15, geo.rows + '/' + geo.index);
	ok('rows fold: the tip sits under the name', geo.descTop >= geo.nameBottom - 1 && Math.abs(geo.descLeft - geo.nameLeft) < 2, JSON.stringify(geo));
	ok('buttons the phone has folded away are dimmed, one for one', geo.off === geo.hidden && geo.hidden > 0, geo.off + ' dimmed, ' + geo.hidden + ' hidden');
	const before = await probe(page);
	await page.evaluate((t) => {
		const r = Array.from(document.querySelectorAll('#lpn_guide_toolbar > .lpn-guide-row')).filter(x => x.querySelector('.lpn-guide-name').textContent === t)[0];
		r.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
	}, junction);
	await a.settle(300);
	const fly = await page.evaluate(() => {
		const sub = document.getElementById('lpn_menu_popup2'), ae = document.activeElement;
		const target = ae && sub.contains(ae) ? ae : null, r = target ? target.getBoundingClientRect() : null;
		const top = r ? document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) : null;
		return { open: sub.style.display === 'block', focus: target && target.__lpnRow ? target.__lpnRow.label : null,
			onTop: !!(top && target && (top === target || target.contains(top))) };
	});
	ok('a toolbar row on a phone opens its menu twin, Water > Insert, at the row', fly.open && fly.focus === junction, JSON.stringify(fly));
	ok('...drawn above the guide, where a finger can reach it', fly.onTop);
	const after = await probe(page);
	ok('...and runs nothing', after.mode === before.mode && after.sig === before.sig && after.undo === before.undo);
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
	console.log(fails ? `\nuser-guide-harness: ${fails} FAILURE(S)` : '\nuser-guide-harness: ALL PASS');
	process.exit(fails ? 1 : 0);
}
main();
