// A TYPE-CHANGED ASSET'S OWN FIELDS WEAR THE OVERRIDE MARK, AND EACH SCENARIO SOLVES ITS TYPE.
// Run with:  node dev/lpn-spike/type-override-marks-browser-harness.js
//
// Tom, 2026-10-07: *"I changed a Junction to a Tank, and in the Tanks table, only the Water depth
// appears as an override. Shouldn't everything including the ID be an override?"* Clicked in a real
// Chromium on Net1:
//   1. In scenario B, junction 22 made a tank with Create overrides. In B's Tanks table every field a
//      tank has and a junction lacks is amber (depths, diameter, reaction, mixing); what Base still
//      supplies (ID, X, Y, Description, Tag, Active, Elevation) is not, and the real tank 2 has none.
//   2. In Base, 22 is a junction and no cell of the Junctions table is marked.
//   3. Solved in each scenario: in B the tank's head is its elevation plus its water depth; in Base
//      22 is a junction with a pressure.
//   4. Tank 2 made a reservoir in B only: solved, its head is the tank's water surface (970 ft),
//      not dropped. Base's tank 2 is untouched.
//   5. 22 made a junction again in B: the type override goes, its tank fields with it, and B's
//      junction 22 is Base's again.
//
// DO NOT PREFIX THIS WITH `flock`: it takes /tmp/engcalcs-browser.lock itself.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock', LOCK_ENV = 'EC_TOM_LOCKED';
if (process.env[LOCK_ENV] !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' }) });
		if (r.status === 75) { console.error('type-override-marks-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
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
		const a = await Session.open(browser, 'A');
		const page = a.page;
		page.on('pageerror', (e) => errors.push(String(e && e.message)));
		const L = (k) => a.lang(k);
		const settle = (ms) => a.settle(ms);
		await page.setViewportSize({ width: 1600, height: 1000 });
		await a.goto('Looped-Network.php');
		await a.openExampleCard(await L('lpn_ex_net1_title'));
		await settle(1500);
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		const scenarioMenu = async (label) => {
			await page.click('#lpn_scenario_btn');
			await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			for (const r of await page.$$('#lpn_menu_list button.lpn-menu-row')) {
				if ((await r.textContent()).trim().replace(/^✓\s*/, '').replace(/\s*\(\d+\)$/, '') === label.trim()) { await r.click(); break; }
			}
			await settle(1200);
		};
		const clickNode = async (id) => {
			await page.keyboard.press('Escape');
			const r = await page.evaluate((id) => {
				const c = document.querySelector('.lpn-node-hit[data-node="' + id + '"]');
				if (!c) { return null; }
				const b = c.getBoundingClientRect();
				return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
			}, id);
			if (!r) { return false; }
			await page.mouse.click(r.x, r.y);
			await settle(500);
			return true;
		};
		const press = async (label) => {
			const hit = await page.evaluate((t) => {
				const b = Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).find((x) => x.textContent.trim() === t);
				if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); }
				return !!b;
			}, label);
			await settle(900);
			return hit;
		};
		// Change type in a scenario: the menu, then Create overrides, then OK on any report box.
		const changeTypeHere = async (id, typeKey) => {
			await clickNode(id);
			await a.menuClickSub(await L('lpn_change_type_menu'), await L(typeKey), 'project');
			await settle(800);
			await press(await L('lpn_change_type_create_overrides'));
			if (await a.dialog()) { await press(await L('lpn_change_type_ok')); }
			await page.keyboard.press('Escape');
			await settle(400);
		};
		const run = async () => {
			await page.evaluate(() => { const b = document.querySelector('#lpn_toolbar_run button[data-icon="run"]'); if (b) { b.click(); } });
			await settle(2500);
		};
		// One row of a table: {heading: {v: value or text, m: marked}}, headings without soft hyphens.
		const row = async (tab, id) => {
			await page.click('#lpn_pane_tab_' + tab);
			await settle(600);
			return page.evaluate(([tab, id]) => {
				const t = document.querySelector('#lpn_pane_' + tab + ' table');
				if (!t) { return null; }
				const hs = Array.from(t.querySelectorAll('thead th')).map((h) => h.textContent.replace(/­/g, '').trim());
				const tr = Array.from(t.querySelectorAll('tbody tr')).find((r) => {
					const td = r.querySelector('td'); if (!td) { return false; }
					const i = td.querySelector('input');
					return (td._lpnPaneId !== undefined ? String(td._lpnPaneId) : (i ? i.value : td.textContent.trim())) === id;
				});
				if (!tr) { return null; }
				const out = {};
				Array.from(tr.querySelectorAll('td')).forEach((td, k) => {
					const c = td.querySelector('input,select');
					out[hs[k]] = { v: c ? (c.type === 'checkbox' ? String(c.checked) : c.value) : td.textContent.trim(), m: td.classList.contains('lpn-pane-ovcell') };
				});
				return out;
			}, [tab, id]);
		};
		const marked = (r) => Object.keys(r || {}).filter((h) => r[h].m);
		const head = (h) => h.replace(/\s*\(.*$/, '');
		const has = (r, words) => marked(r).map(head).sort().join('|');

		console.log('--- 1. junction 22 made a tank in scenario B ---');
		a.answerPromptWith('B');
		await scenarioMenu(await L('lpn_scenario_new'));
		await page.evaluate(() => { delete window.lpnDialogAnswerer; });
		await changeTypeHere('22', 'lpn_tool_add_tank');
		await a.toolbarClick(await L('lpn_pane_toggle'));
		await settle(600);
		const t22 = await row('tanks', '22');
		ok('1.0 B\'s Tanks table has a row for 22', !!t22);
		const want = ['lpn_field_tank_level', 'lpn_field_tank_minlevel', 'lpn_field_tank_maxlevel', 'lpn_field_tank_diameter', 'lpn_mixing_model', 'lpn_mixing_fraction'];
		const wantWords = [];
		for (const k of want) { wantWords.push(await L(k)); }
		const mk = marked(t22).map(head);
		wantWords.forEach((w) => ok('1.1 "' + w + '" is marked as B\'s override', mk.indexOf(w) >= 0, mk.join(' | ')));
		const react = Object.keys(t22 || {}).find((h) => /^Reac/.test(h));
		if (react) { ok('1.2 the tank\'s reaction coefficient is marked too', t22[react].m); }
		const shared = ['lpn_field_id', 'lpn_field_elev'];
		for (const k of shared) {
			const w = await L(k);
			ok('1.3 "' + w + '" comes from Base and is not marked', mk.indexOf(w) < 0, mk.join(' | '));
		}
		ok('1.4 no result column is marked', !Object.keys(t22 || {}).some((h) => /^Head/.test(h) && t22[h].m));
		const t2 = await row('tanks', '2');
		ok('1.5 Net1\'s own tank 2 wears no mark in B', marked(t2).length === 0, has(t2));
		const tip = await page.evaluate(() => { const td = document.querySelector('#lpn_pane_tanks td.lpn-pane-ovcell'); return td ? (td.getAttribute('data-bs-original-title') || td.getAttribute('title') || td._lpnScnTip || '') : ''; });
		ok('1.6 a marked cell\'s tip names the Physical alternative, B', /B/.test(tip), tip);

		console.log('\n--- 3a. solved in B ---');
		await run();
		const s22 = await row('tanks', '22');
		const elev = parseFloat(s22[Object.keys(s22).find((h) => head(h) === 'Elevation')].v);
		const lvl = parseFloat(s22[Object.keys(s22).find((h) => head(h) === wantWords[0])].v);
		const hd = parseFloat(s22[Object.keys(s22).find((h) => /^Head/.test(h))].v);
		ok('3.1 in B tank 22\'s head is its elevation plus its water depth', Math.abs(hd - (elev + lvl)) < 0.05, `${hd} = ${elev} + ${lvl}`);
		const statusB = await page.evaluate(() => { const e = document.getElementById('lpn_status'); return e && e.style.display !== 'none' ? e.textContent : ''; });
		ok('3.2 B solves without a diagnostic', !/cannot|could not|no answers/i.test(statusB), statusB);

		console.log('\n--- 2. Base ---');
		await scenarioMenu(await L('lpn_scenario_base'));
		await run();
		const j22 = await row('junctions', '22');
		ok('2.1 in Base 22 is a junction row', !!j22);
		const anyMark = await page.evaluate(() => document.querySelectorAll('#lpn_pane_junctions td.lpn-pane-ovcell').length);
		ok('2.2 no cell of Base\'s Junctions table is marked', anyMark === 0, String(anyMark));
		ok('2.3 Base\'s Tanks table has no row for 22', !(await row('tanks', '22')));
		const p22 = j22 && j22[Object.keys(j22).find((h) => /^Pressure/.test(h))];
		const h22 = j22 && j22[Object.keys(j22).find((h) => /^Head/.test(h))];
		ok('3.3 solved in Base, junction 22 has a pressure, and a head that is not B\'s tank surface', !!p22 && p22.v !== '' && h22 && Math.abs(parseFloat(h22.v) - hd) > 0.05,
			JSON.stringify({ p: p22 && p22.v, h: h22 && h22.v }));
		const base2 = await row('tanks', '2');
		const base2Head = parseFloat(base2[Object.keys(base2).find((h) => /^Head/.test(h))].v);

		console.log('\n--- 4. tank 2 made a reservoir in B only ---');
		await scenarioMenu('B');
		await changeTypeHere('2', 'lpn_tool_add_reservoir');
		await run();
		const r2 = await row('reservoirs', '2');
		ok('4.1 B\'s Reservoirs table has a row for 2', !!r2);
		const rHead = r2 && parseFloat(r2[Object.keys(r2).find((h) => head(h) === 'Head' && !r2[h].v.match(/^$/))].v);
		ok('4.2 its head is the tank\'s water surface, not dropped', Math.abs(rHead - base2Head) < 0.05, `${rHead} vs tank ${base2Head}`);
		await scenarioMenu(await L('lpn_scenario_base'));
		const back2 = await row('tanks', '2');
		ok('4.3 in Base, 2 is still a tank with the same head', !!back2 && Math.abs(parseFloat(back2[Object.keys(back2).find((h) => /^Head/.test(h))].v) - base2Head) < 0.05);

		console.log('\n--- 5. 22 back to a junction in B ---');
		await scenarioMenu('B');
		await changeTypeHere('22', 'lpn_tool_add_junction');
		const jb = await row('junctions', '22');
		ok('5.1 B\'s Junctions table has 22 again', !!jb);
		ok('5.2 ...with no cell of its row marked (the type override and its tank values are gone)', jb && marked(jb).length === 0, has(jb));
		ok('5.3 ...and B\'s Tanks table has no row for 22', !(await row('tanks', '22')));
		ok('no uncaught page errors', errors.length === 0, errors.join(' | '));
	} finally { await browser.close(); env.stopServer(); }
	console.log(fails ? `\n${fails} FAILED` : '\nall ok');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
