// THE SCENARIO MANAGER AS A MODERN TREE (Tom, 2026-10-11: *"Buttons are okay, and the same options
// probably belong in a right-click menu in a modern tree paradigm"*, and of the Guide rail:
// *"chevron is a good tree paradigm"*; Ida's advice is the spec). Real Chromium, the real page, Net1:
//   1. Base -> Peak -> Night built with the real buttons; a chevron at every parent and a spacer at
//      the leaf, at least 24 px square; one icon per kind of item; no footer under the tree, its
//      text now paragraphs of the title's "?" (Tom, 2026-10-11);
//   2. a real mouse click on a chevron collapses and expands; a selection folded away moves to the
//      folding item; nothing is written to the device and the project is unchanged;
//   3. keyboard: Up, Down, Home, End, Right (expand, then first child), Left (collapse, then parent);
//   4. the right-click menu's rows are the buttons' commands in the stated order (Make current, Add
//      child, Add base, Rename, Copy, separator, Delete); on Base, Rename and Delete stay, greyed, and
//      do nothing; Make current from the menu switches the scenario and the solve follows;
//   5. ?lang=ar: the chevron sits at the right of the name and a closed one points left; Left expands;
//   6. a phone, 390 px wide in tall mode: the box fits, a tap on a chevron folds the tree, no
//      horizontal page scroll.
//
// DO NOT PREFIX THIS WITH `flock`: it takes /tmp/engcalcs-browser.lock itself.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
if (process.env.EC_SMTREE_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { EC_SMTREE_LOCKED: '1' }) });
		if (r.status === 75) { console.error('scenario-tree-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0;
// The angle, in whole degrees, of a computed `matrix(a, b, c, d, e, f)` rotation.
function rot(t) {
	const m = /^matrix\(([^)]*)\)/.exec(String(t || ''));
	if (!m) { return null; }
	const v = m[1].split(',').map(Number);
	return Math.round(Math.atan2(v[1], v[0]) * 180 / Math.PI);
}
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}

async function setup(a, page, netKey) {
	await a.goto(a.__url);
	await a.openExampleCard(await a.lang(netKey));
	await a.settle(1500);
	await page.evaluate(() => {
		let e = document.querySelector('.ec-consent-actions');
		while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
		if (e) { e.style.display = 'none'; }
	});
}
function helpers(a, page) {
	const settle = (ms) => a.settle(ms);
	const h = {};
	h.scenarioMenu = async (label) => {
		await require('./manager-door.js').ensure(page, label);
		await page.click('#lpn_scenario_btn');
		await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		for (const r of await page.$$('#lpn_menu_list button.lpn-menu-row')) {
			if ((await r.textContent()).trim().replace(/^✓\s*/, '').replace(/\s*\(\d+\)$/, '') === label.trim()) { await r.click(); break; }
		}
		await settle(900);
	};
	h.rows = () => page.evaluate(() => Array.from(document.querySelectorAll('#lpn_sm_tree .lpn-sm-row')).map((r) => {
		const ch = r.querySelector('.lpn-tree-chev'), b = ch ? ch.getBoundingClientRect() : null, ic = r.querySelector('.lpn-sm-icon');
		return { key: r.getAttribute('data-key'), level: +r.getAttribute('aria-level'), sel: r.classList.contains('lpn-sm-sel'),
			name: r.querySelector('.lpn-sm-name').textContent, exp: r.getAttribute('aria-expanded'),
			chev: ch ? { exp: ch.getAttribute('aria-expanded'), w: b.width, h: b.height } : null,
			spacer: !!r.querySelector('.lpn-tree-spacer'), icon: ic ? ic.className.replace('lpn-sm-icon ', '') : null };
	}));
	h.names = async () => (await h.rows()).map((r) => '-'.repeat(r.level - 1) + r.name);
	h.sel = async () => ((await h.rows()).filter((r) => r.sel)[0] || {}).name || null;
	h.rowOf = (name) => page.locator('#lpn_sm_tree .lpn-sm-row', { has: page.locator('.lpn-sm-name', { hasText: new RegExp('^' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$') }) }).first();
	h.click = async (sel) => { await page.evaluate((s) => document.querySelector(s).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })), sel); await settle(500); };
	h.clickRow = async (name) => { await h.rowOf(name).locator('.lpn-sm-name').click(); await settle(300); };
	h.chevClick = async (name) => { await h.rowOf(name).locator('.lpn-tree-chev').click(); await settle(400); };
	h.key = async (k) => { await page.keyboard.press(k); await settle(250); };
	h.addChild = async (under, name) => {
		await h.clickRow(under);
		await h.click('#lpn_sm_add');
		await page.keyboard.type(name);
		await page.keyboard.press('Enter');
		await settle(600);
	};
	h.menu = () => page.evaluate(() => Array.from(document.querySelectorAll('.lpn-sm-menu > *')).map((e) => e.getAttribute('role') === 'separator' ? '|' :
		{ cmd: e.getAttribute('data-sm-cmd'), text: e.textContent.trim(), off: e.getAttribute('aria-disabled') === 'true', title: e.title || '' }));
	h.buttons = () => page.evaluate(() => Array.from(document.querySelectorAll('#lpn_sm_body .lpn-sm-tools button[data-sm-cmd]')).map((b) =>
		({ cmd: b.getAttribute('data-sm-cmd'), off: b.getAttribute('aria-disabled') === 'true', color: getComputedStyle(b).color })));
	h.store = () => page.evaluate(() => { const o = {}; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k !== 'lpn_smbox') { o[k] = localStorage.getItem(k); } } } catch (e) { /* none */ } return o; });
	return h;
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
		// ---- desktop, English ----
		const a = await Session.open(browser, 'T');
		const page = a.page;
		page.on('pageerror', (e) => errors.push(String(e && e.message)));
		const L = (k) => a.lang(k);
		const h = helpers(a, page);
		a.__url = 'Looped-Network.php';
		await page.setViewportSize({ width: 1400, height: 900 });
		await setup(a, page, 'lpn_ex_net1_title');
		await h.scenarioMenu(await L('lpn_sm_menu'));
		const BASE = await L('lpn_scenario_base');

		console.log('--- 1. build Base > Peak > Night ---');
		await h.addChild(BASE, 'Peak');
		await h.addChild('Peak', 'Night');
		ok('1.1 the tree is Base, Peak under it, Night under Peak', JSON.stringify(await h.names()) === JSON.stringify([BASE, '-Peak', '--Night']), JSON.stringify(await h.names()));
		let rows = await h.rows();
		ok('1.2 Base and Peak have an expanded chevron, Night a spacer', rows[0].chev && rows[0].chev.exp === 'true' && rows[1].chev && rows[1].chev.exp === 'true' && !rows[2].chev && rows[2].spacer, JSON.stringify(rows.map((r) => [r.name, r.chev, r.spacer])));
		ok('1.3 the treeitem says so too (aria-expanded on Base and Peak, none on Night)', rows[0].exp === 'true' && rows[1].exp === 'true' && rows[2].exp === null);
		ok('1.4 every chevron is at least 24 px square', rows.filter((r) => r.chev).every((r) => r.chev.w >= 24 && r.chev.h >= 24), JSON.stringify(rows.map((r) => r.chev)));
		// Tom, 2026-10-14: the child icon only on an entry that has descendants; a leaf keeps its width.
		ok('1.5 Base the base icon, Peak (a parent) the child icon, Night (a leaf) none', rows[0].icon === 'lpn-sm-icon-scnbase' && rows[1].icon === 'lpn-sm-icon-scn' && rows[2].icon === 'lpn-sm-icon-none', JSON.stringify(rows.map((r) => r.icon)));
		const leafGap = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_sm_tree .lpn-sm-row')).map((r) => {
			const ic = r.querySelector('.lpn-sm-icon'), nm = r.querySelector('.lpn-sm-name');
			return [ic.getBoundingClientRect().width, !!ic.querySelector('svg'), nm.getBoundingClientRect().left - r.getBoundingClientRect().left];
		}));
		ok('1.5b ...the leaf\'s empty icon is as wide as a drawn one, so its name starts one indent further than its parent\'s',
			leafGap[2][0] === leafGap[1][0] && !leafGap[2][1] && Math.abs((leafGap[2][2] - leafGap[1][2]) - (leafGap[1][2] - leafGap[0][2])) < 0.5, JSON.stringify(leafGap));
		const iconColours = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_sm_tree .lpn-sm-icon')).map((i) => getComputedStyle(i).color));
		ok('1.6 the Base icon is drawn in a different token colour from a child\'s', iconColours[0] !== iconColours[1], JSON.stringify(iconColours));
		// **THE FOOTER MOVED INTO THE "?"** (Tom, 2026-10-11: "Move the footer text to the tip.").
		ok('1.7 nothing sits under the tree any more (no footer hint)', !(await page.$('#lpn_sm_body .lpn-sm-hint')) && (await page.evaluate(() => { const t = document.getElementById('lpn_sm_tree'); return !t.nextElementSibling; })));
		const tipParas = (await L('lpn_sm_help')).split('\\n\\n');
		// Tom's draft of 2026-10-11, finished: his two headings, his model, his example named after its scenario.
		ok('1.8 the tip is in two parts, each under a heading line of its own', tipParas.filter((t) => /:$/.test(t)).length === 2 && /:$/.test(tipParas[0]), JSON.stringify(tipParas));
		// The example is the paragraph that begins "Example:" (Tom's text of 2026-10-12 put paragraphs before it).
		const exPara = tipParas.filter((t) => /create a "[^"]+" scenario/.test(t))[0] || '';
		const exScn = (exPara.match(/create a "([^"]+)" scenario/) || [])[1], exAlt = (exPara.match(/alternative called "([^"]+)"/) || [])[1];
		ok('1.9 his example names the alternative after the scenario, and the typo is gone', !!exScn && exScn === exAlt && !/alernative/.test(tipParas.join(' ')), exScn + ' / ' + exAlt);
		await page.mouse.click(...(await page.evaluate(() => { const g = document.querySelector('#lpn_smbox_title .ec-tip').getBoundingClientRect(); return [g.left + g.width / 2, g.top + g.height / 2]; })));
		await a.settle(500);
		const shown = await page.evaluate(() => Array.from(document.querySelectorAll('.tooltip.ec-explain.show p')).map((p) => p.textContent));
		ok('1.10 clicking the ? shows those paragraphs as paragraphs', JSON.stringify(shown) === JSON.stringify(tipParas.map((t) => t.trim())), JSON.stringify(shown));
		await page.keyboard.press('Escape');
		await a.settle(300);

		console.log('\n--- 2. the chevron, clicked ---');
		const storeBefore = await h.store();
		await h.clickRow('Peak');
		await page.focus('#lpn_sm_tree');
		await h.key('ArrowDown');
		await h.chevClick(BASE);
		ok('2.1 a click on Base\'s chevron folds Peak and Night away', JSON.stringify(await h.names()) === JSON.stringify([BASE]), JSON.stringify(await h.names()));
		rows = await h.rows();
		ok('2.2 ...the chevron says collapsed, and the selection moved to Base', rows[0].chev.exp === 'false' && rows[0].exp === 'false' && (await h.sel()) === BASE, JSON.stringify(rows[0]) + ' sel ' + await h.sel());
		const closedT = await page.evaluate(() => getComputedStyle(document.querySelector('#lpn_sm_tree .lpn-tree-chev-svg')).transform);
		ok('2.3 a closed chevron is turned a quarter toward the end of the line (rotate -90)', rot(closedT) === -90, closedT);
		await h.chevClick(BASE);
		ok('2.4 a second click opens it again, Peak still open inside', JSON.stringify(await h.names()) === JSON.stringify([BASE, '-Peak', '--Night']), JSON.stringify(await h.names()));
		await h.chevClick('Peak');
		ok('2.5 Peak folds on its own', JSON.stringify(await h.names()) === JSON.stringify([BASE, '-Peak']), JSON.stringify(await h.names()));
		ok('2.6 a chevron click never renames or makes current', !(await page.$('#lpn_sm_editor')) && (await page.evaluate(() => document.getElementById('lpn_scenario_btn').textContent)).indexOf('Peak') < 0);
		ok('2.7 folding wrote nothing on the device (lpn_smbox aside, which is the box\'s place)', JSON.stringify(await h.store()) === JSON.stringify(storeBefore));
		await h.chevClick('Peak');

		console.log('\n--- 3. the keyboard ---');
		await h.clickRow(BASE);
		await page.focus('#lpn_sm_tree');
		await h.key('ArrowDown');
		ok('3.1 Down: Peak', (await h.sel()) === 'Peak');
		await h.key('ArrowDown');
		ok('3.2 Down: Night', (await h.sel()) === 'Night');
		await h.key('Home');
		ok('3.3 Home: Base', (await h.sel()) === BASE);
		await h.key('End');
		ok('3.4 End: Night', (await h.sel()) === 'Night');
		await h.key('ArrowLeft');
		ok('3.5 Left on a leaf: its parent, Peak', (await h.sel()) === 'Peak');
		await h.key('ArrowLeft');
		ok('3.6 Left on open Peak: collapses it, Peak still selected', JSON.stringify(await h.names()) === JSON.stringify([BASE, '-Peak']) && (await h.sel()) === 'Peak', JSON.stringify(await h.names()));
		await h.key('End');
		ok('3.7 End with Peak folded is Peak (Night is not on screen)', (await h.sel()) === 'Peak');
		await h.key('ArrowLeft');
		ok('3.8 Left on folded Peak: its parent, Base', (await h.sel()) === BASE);
		await h.key('ArrowUp');
		ok('3.9 Up at the top stays on Base', (await h.sel()) === BASE);
		await h.key('ArrowLeft');
		ok('3.10 Left on open Base collapses it', JSON.stringify(await h.names()) === JSON.stringify([BASE]));
		await h.key('ArrowRight');
		ok('3.11 Right on folded Base expands it, Base still selected', JSON.stringify(await h.names()) === JSON.stringify([BASE, '-Peak']) && (await h.sel()) === BASE, JSON.stringify(await h.names()));
		await h.key('ArrowRight');
		ok('3.12 Right on open Base moves to its first child, Peak', (await h.sel()) === 'Peak');
		await h.key('ArrowRight');
		ok('3.13 Right on folded Peak expands it', JSON.stringify(await h.names()) === JSON.stringify([BASE, '-Peak', '--Night']));
		await h.key('ArrowRight');
		ok('3.14 Right on open Peak moves to Night', (await h.sel()) === 'Night');
		await h.key('ArrowRight');
		ok('3.15 Right on a leaf does nothing', (await h.sel()) === 'Night' && (await h.names()).length === 3);
		await h.key('F2');
		ok('3.16 F2 still renames', !!(await page.$('#lpn_sm_editor')));
		await h.key('Escape');

		console.log('\n--- 4. one command list: the buttons and the right-click menu ---');
		const want = ['current', 'overrides', 'add', 'addbase', 'rename', 'copy', '|', 'del'];
		const wantText = [await L('lpn_sm_make_current'), await L('lpn_sm_list_overrides'), await L('lpn_sm_add_child'), await L('lpn_sm_add_base'), await L('lpn_sm_rename'), await L('lpn_sm_copy'), '|', await L('lpn_tool_delete')];
		await h.rowOf('Night').locator('.lpn-sm-name').click({ button: 'right' });
		await a.settle(300);
		let m = await h.menu();
		ok('4.1 the menu on Night: Make current, Manage overrides (Task 800), Add child, Add base, Rename, Copy scenario, separator, Delete', JSON.stringify(m.map((x) => x === '|' ? '|' : x.text)) === JSON.stringify(wantText), JSON.stringify(m.map((x) => x === '|' ? '|' : x.text)));
		let btns = await h.buttons();
		ok('4.2 ...the same commands as the buttons, in the same order', JSON.stringify(btns.map((b) => b.cmd)) === JSON.stringify(want.filter((x) => x !== '|')) && JSON.stringify(m.filter((x) => x !== '|').map((x) => x.cmd)) === JSON.stringify(btns.map((b) => b.cmd)), JSON.stringify(btns.map((b) => b.cmd)));
		const offOf = (list) => list.filter((x) => x !== '|').filter((x) => x.off).map((x) => x.cmd).join();
		// Copy is always greyed on the Scenarios tree: Copy scenario is Basic mode's (Tom, 2026-10-12).
		ok('4.3 ...and the same ones on and off (on Night, which holds no overrides of its own, Manage overrides and Copy are off)', JSON.stringify(m.filter((x) => x !== '|').map((x) => x.off)) === JSON.stringify(btns.map((b) => b.off)) && offOf(btns) === 'overrides,copy', offOf(btns));
		await page.keyboard.press('Escape');
		await page.mouse.click(5, 5);
		await a.settle(300);
		await h.rowOf(BASE).locator('.lpn-sm-name').click({ button: 'right' });
		await a.settle(300);
		m = await h.menu();
		btns = await h.buttons();
		ok('4.4 on Base (the open scenario) the menu still lists all eight rows, Make current, Manage overrides, Rename, Copy and Delete greyed', m.length === 8 && offOf(m) === 'current,overrides,rename,copy,del', JSON.stringify(m));
		ok('4.5 the buttons grey the same five', offOf(btns) === 'current,overrides,rename,copy,del', JSON.stringify(btns));
		const cols = await page.evaluate(() => { const r = Array.from(document.querySelectorAll('.lpn-sm-menu button')); return [getComputedStyle(r.find((b) => b.getAttribute('data-sm-cmd') === 'del')).color, getComputedStyle(r.find((b) => b.getAttribute('data-sm-cmd') === 'add')).color]; });
		ok('4.6 a greyed row is drawn greyed (its colour differs from a live row\'s)', cols[0] !== cols[1], JSON.stringify(cols));
		ok('4.7 the greyed Delete says why in its tip', m.find((x) => x.cmd === 'del').title === await L('lpn_sm_base_kept'));
		await page.evaluate(() => document.querySelector('.lpn-sm-menu button[data-sm-cmd="del"]').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })));
		await a.settle(400);
		ok('4.8 clicking the greyed Delete does nothing (the tree is whole, the menu still open)', (await h.names()).length === 3 && !!(await page.$('.lpn-sm-menu')));
		await page.mouse.click(5, 5);
		await a.settle(300);
		// Make current from the menu (a switch of scenario, not a model edit).
		await h.rowOf('Peak').locator('.lpn-sm-name').click({ button: 'right' });
		await a.settle(300);
		await page.evaluate(() => document.querySelector('.lpn-sm-menu button[data-sm-cmd="current"]').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })));
		await a.settle(1500);
		ok('4.9 Make current from the menu opens Peak', (await page.evaluate(() => document.getElementById('lpn_scenario_btn').textContent)).indexOf('Peak') >= 0, await page.evaluate(() => document.getElementById('lpn_scenario_btn').textContent));
		await h.rowOf('Peak').locator('.lpn-sm-name').click({ button: 'right' });
		await a.settle(300);
		m = await h.menu();
		ok('4.10 on the current scenario, Make current is greyed in the menu and the button (and Manage overrides, Night holding none)', offOf(m) === 'current,overrides,copy' && offOf(await h.buttons()) === 'current,overrides,copy', offOf(m));
		await page.mouse.click(5, 5);
		await a.settle(300);
		ok('4.11 no page errors so far', errors.length === 0, errors.join(' | '));

		// ---- right-to-left ----
		console.log('\n--- 5. ?lang=ar ---');
		const b = await Session.open(browser, 'T-ar');
		const hb = helpers(b, b.page);
		b.__url = 'Looped-Network.php?lang=ar';
		await b.page.setViewportSize({ width: 1400, height: 900 });
		await setup(b, b.page, 'lpn_ex_net1_title');
		await hb.scenarioMenu(await b.lang('lpn_sm_menu'));
		const BASEar = await b.lang('lpn_scenario_base');
		await hb.addChild(BASEar, 'P');
		const geo = await b.page.evaluate(() => { const r = document.querySelector('#lpn_sm_tree .lpn-sm-row'); const c = r.querySelector('.lpn-tree-chev').getBoundingClientRect(), n = r.querySelector('.lpn-sm-name').getBoundingClientRect(); return { dir: document.documentElement.getAttribute('dir'), c: c.left, n: n.left }; });
		ok('5.1 ar: the page is right-to-left and the chevron sits at the right of the name', geo.dir === 'rtl' && geo.c > geo.n, JSON.stringify(geo));
		await hb.chevClick(BASEar);
		const tAr = await b.page.evaluate(() => getComputedStyle(document.querySelector('#lpn_sm_tree .lpn-tree-chev-svg')).transform);
		ok('5.2 ar: a closed chevron is turned the other way (rotate +90: it points left)', rot(tAr) === 90, tAr);
		ok('5.3 ar: folded', (await hb.names()).length === 1);
		await hb.clickRow(BASEar);
		await b.page.focus('#lpn_sm_tree');
		await hb.key('ArrowLeft');
		ok('5.4 ar: Left (toward the end of the line) expands', (await hb.names()).length === 2, JSON.stringify(await hb.names()));
		await hb.key('ArrowRight');
		ok('5.5 ar: Right collapses', (await hb.names()).length === 1);
		const iconT = await b.page.evaluate(() => getComputedStyle(document.querySelector('#lpn_sm_tree .lpn-sm-icon svg')).transform);
		ok('5.6 ar: the icons are mirrored', /^matrix\(-1, 0, 0, 1,/.test(iconT), iconT);

		// ---- a phone ----
		console.log('\n--- 6. a phone, 390 px ---');
		const c = await Session.open(browser, 'T-phone', { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
		const hc = helpers(c, c.page);
		c.__url = 'Looped-Network.php';
		await setup(c, c.page, 'lpn_ex_net1_title');
		await hc.scenarioMenu(await c.lang('lpn_sm_menu'));
		const BASEp = await c.lang('lpn_scenario_base');
		await hc.addChild(BASEp, 'Peak');
		const fit = await c.page.evaluate(() => {
			const box = document.getElementById('lpn_sm_box').getBoundingClientRect();
			const btn = Array.from(document.querySelectorAll('#lpn_sm_body .lpn-sm-tools button')).map((x) => x.getBoundingClientRect());
			const ch = document.querySelector('#lpn_sm_tree .lpn-tree-chev').getBoundingClientRect();
			return { boxL: box.left, boxR: box.right, btnR: Math.max.apply(null, btn.map((r) => r.right)), btnL: Math.min.apply(null, btn.map((r) => r.left)), ch: [ch.width, ch.height],
				scroll: document.documentElement.scrollWidth, vw: window.innerWidth };
		});
		ok('6.1 phone: the box and every button lie inside the 390 px screen', fit.boxL >= 0 && fit.boxR <= 390.5 && fit.btnL >= 0 && fit.btnR <= 390.5, JSON.stringify(fit));
		ok('6.2 phone: the chevron is at least 24 px square', fit.ch[0] >= 24 && fit.ch[1] >= 24, JSON.stringify(fit.ch));
		ok('6.3 phone: no horizontal page scroll', fit.scroll <= fit.vw, fit.scroll + ' > ' + fit.vw);
		await hc.rowOf(BASEp).locator('.lpn-tree-chev').tap();
		await c.settle(400);
		ok('6.4 phone: a tap on the chevron folds the tree', (await hc.names()).length === 1, JSON.stringify(await hc.names()));
		await hc.rowOf(BASEp).locator('.lpn-tree-chev').tap();
		await c.settle(400);
		ok('6.5 phone: and a second tap opens it', (await hc.names()).length === 2);
		ok('6.6 no page errors anywhere', errors.length === 0 && b.errors.length === 0 && c.errors.length === 0, errors.concat(b.errors, c.errors).join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall ok');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
