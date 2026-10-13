// **TOM'S BROWSER PASS OF 2026-10-13 ON SCENARIOS**, in a real Chromium on Net1, through the same
// menus, table cells and Scenario manager keys his clicks reach:
//   D1  Delete scenario says how many overrides go with it, singular and plural, with Basic mode on
//       (his "I don't see this message"); with Basic mode off they stay, in the alternative that
//       holds them, and the question says that instead;
//   D2  deleting an alternative that holds overrides asks first, saying how many go with it; an
//       empty one goes at once, as before;
//   U1  an alternative no scenario names does not stop a project showing in Basic mode, whatever its
//       parent (Tom, 2026-10-13: "No.");
//   K1  ticking Basic mode on for a project it cannot show is refused in the dialog;
//   M5  Task 790: the dot (an override here), the hollow dot (inherited) and the down triangle
//       (child scenarios override it) in Properties and the Settings box; no marker is a tab stop;
//       the triangle asks "Clear child overrides ({n} total)?" and clears them.
// Wording is read from the page's own language strings, never written here.
//
//   node dev/lpn-spike/scenario-pass-1013-browser-harness.js   (takes the browser lock itself)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SCNPASS1013_LOCKED';
const NAME = 'scenario-pass-1013-browser-harness';
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
const byId = (arr, id) => (arr || []).filter((x) => x.id === id)[0];
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const errors = [];
	let a = null, page = null;
	try {
		// A crafted Net1: Base > Fig 4 > Fig 5, Fig 5 current. `basicOff` writes the browser preference.
		const openProject = async (edit, basicOff) => {
			const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8'));
			d.scenarios.push({ id: 'f4', name: 'Fig 4', overrides: {} }, { id: 'f5', name: 'Fig 5', parent: 'f4', overrides: {} });
			d.project = Object.assign({}, d.project, { activeScenario: 'f5' });
			if (edit) { edit(d); }
			if (a) { await a.context.close(); }
			a = await Session.open(browser, 'A', { serviceWorkers: 'block' });
			page = a.page;
			page.on('pageerror', (e) => errors.push(String(e && e.message)));
			await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
			await a.goto('Looped-Network.php?ec_nolog=1');
			await page.evaluate(([txt, off]) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); if (off) { localStorage.setItem('lpn_scnbasic', 'off'); } }, [JSON.stringify(d), !!basicOff]);
			await a.reload();
			await a.answerTrainingPanel().catch(() => {});
			await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			await page.setViewportSize({ width: 1600, height: 1000 });
			await a.settle(2500);
			return d;
		};
		const L = (k) => a.lang(k);
		const flat = (d) => { delete byId(d.scenarios, 'f5').parent; };
		const saved = () => page.evaluate(() => JSON.parse(localStorage.getItem('lpn_project_hover')));
		const flush = async () => { await a.settle(2600); };
		const scenarioMenu = async (label) => {
			await page.click('#lpn_scenario_btn');
			await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			let hit = false;
			for (const r of await page.$$('#lpn_menu_list button.lpn-menu-row')) {
				const t = (await r.textContent()).trim().replace(/^✓\s*/, '').replace(/\s*\(\d+\)$/, '');
				if (t === label.trim()) { await r.click(); hit = true; break; }
			}
			if (!hit) { await page.keyboard.press('Escape'); }
			await a.settle(1200);
			return hit;
		};
		const tab = async (id) => { await page.click('#lpn_pane_tab_' + id); await a.settle(700); };
		const cell = (kind, id, key) => page.evaluate(([k, i, c]) => {
			const td = Array.from(document.querySelectorAll('#lpn_pane_' + k + ' td.lpn-pane-col-' + c)).filter((t) => t._lpnPaneId === i)[0];
			if (!td) { return null; }
			const inp = td.querySelector('input,select');
			return inp ? (inp.type === 'checkbox' ? (inp.checked ? '1' : '0') : inp.value) : td.textContent.trim();
		}, [kind, id, key]);
		const typeInto = async (kind, id, key, text) => {
			const h = await page.evaluateHandle(([s, i]) => Array.from(document.querySelectorAll(s)).filter((t) => t._lpnPaneId === i)[0],
				['#lpn_pane_' + kind + ' td.lpn-pane-col-' + key, id]);
			const inp = await h.asElement().$('input');
			await inp.click();
			await page.keyboard.press('Control+A');
			await page.keyboard.type(text, { delay: 10 });
			await page.keyboard.press('Tab');
			await a.settle(900);
		};
		const pointOf = (group, id) => page.evaluate(([g, i]) => {
			const el = Array.from(document.querySelectorAll('#lpn_canvas [data-' + g + '="' + i + '"]')).filter((e) => e.getBoundingClientRect().width > 0)[0];
			if (!el) { return null; }
			const r = el.getBoundingClientRect();
			return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		}, [group, id]);
		const textPoint = () => page.evaluate(() => {
			const t = document.querySelector('#lpn_canvas text[data-lbl="X2"]');
			return t ? { x: +t.getAttribute('x'), y: +t.getAttribute('y'), fs: parseFloat(t.style.fontSize) } : null;
		});
		const rightClickRow = async (label) => {
			const p = await pointOf(label[0], label[1]);
			await page.mouse.move(p.x, p.y);
			await page.mouse.click(p.x, p.y, { button: 'right' });
			await a.settle(400);
			const hit = await page.$$eval('.lpn-pane-ctxmenu button', (bs, l) => {
				const b = bs.filter((x) => x.textContent.trim() === l)[0];
				if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); }
				return !!b;
			}, label[2]);
			await a.settle(1000);
			return hit;
		};
		const clickNode = async (id, shift) => {
			const p = await pointOf('node', id);
			if (shift) { await page.keyboard.down('Shift'); }
			await page.mouse.click(p.x, p.y);
			if (shift) { await page.keyboard.up('Shift'); }
			await a.settle(700);
		};

		const askOf = () => (a.dialogs.filter((x) => x.type === 'confirm')[0] || {}).message || '';
		const plain = (d) => { d.scenarios = d.scenarios.filter((s) => s.id !== 'f4' && s.id !== 'f5'); d.project.activeScenario = d.scenarios[0].id; };
		const pane = async () => {
			if (!(await page.evaluate(() => { const p = document.getElementById('lpn_pane_tab_junctions'); return !!p && !!p.offsetParent; }))) {
				await a.toolbarClick(await L('lpn_pane_toggle'));
				await a.settle(500);
			}
		};
		const smRow = async (name) => {
			await page.locator('#lpn_sm_tree .lpn-sm-row', { has: page.locator('.lpn-sm-name', { hasText: new RegExp('^' + name + '$') }) }).first().locator('.lpn-sm-name').click();
			await a.settle(300);
		};

		// ---- D1 ----
		console.log('--- D1. Delete scenario: how many overrides go with it ---');
		for (const n of [1, 2]) {
			await openProject(plain);
			ok('D1 Net1 with one scenario opens in Basic mode', await page.evaluate(() => getComputedStyle(document.getElementById('lpn_pane_tab_scenarios')).display === 'none'));
			a.answerPromptWith('Fig X');
			await scenarioMenu(await L('lpn_scenario_new'));
			await flush();
			await pane();
			await tab('junctions');
			await typeInto('junctions', '10', 'elev', '777');
			if (n === 2) { await typeInto('junctions', '11', 'elev', '778'); }
			await flush();
			a.dialogs.length = 0;
			a.answerConfirmsWith(true);
			await scenarioMenu(await L('lpn_scenario_delete'));
			await flush();
			const want = n === 1 ? await L('lpn_scenario_delete_goes_one') : (await L('lpn_scenario_delete_goes')).replace('{n}', '2');
			ok('D1 Basic on, ' + n + ' override(s) made in the table: the question says "' + want + '"', askOf().indexOf(want) >= 0 &&
				askOf().indexOf((await L('lpn_scenario_delete_ask')).replace('{name}', 'Fig X')) === 0, askOf());
			const sv = await saved();
			ok('D1 ...and the scenario goes with its alternative', !sv.scenarios.some((s) => s.name === 'Fig X') && !(sv.alternatives || []).length, JSON.stringify(sv.alternatives));
		}
		await openProject(plain, true);
		a.answerPromptWith('Fig X');
		await scenarioMenu(await L('lpn_scenario_new'));
		await flush();
		await pane();
		await tab('junctions');
		await typeInto('junctions', '10', 'elev', '777');
		await flush();
		a.dialogs.length = 0;
		await scenarioMenu(await L('lpn_scenario_delete'));
		await flush();
		ok('D1 Basic off: the override stays, in the alternative the question names as staying',
			askOf().indexOf((await L('lpn_scenario_delete_stays')).replace('{list}', 'Fig X')) >= 0 && askOf().indexOf((await L('lpn_scenario_delete_goes_one'))) < 0, askOf());
		let sv = await saved();
		ok('D1 ...and it does stay', ((byId(sv.alternatives, 'a1') || {}).values || {})['n:10'] !== undefined, JSON.stringify(sv.alternatives));

		// ---- D2 ----
		console.log('\n--- D2. Delete an alternative holding overrides ---');
		await scenarioMenu(await L('lpn_sm_menu'));
		await page.selectOption('#lpn_sm_tree_select', 'physical');
		await a.settle(500);
		await smRow('Fig X');
		a.dialogs.length = 0;
		a.answerConfirmsWith(false);
		await page.keyboard.press('Delete');
		await flush();
		ok('D2 the alternative asks first, saying its one override goes with it',
			askOf() === (await L('lpn_sm_delete_alt_ask')).replace('{name}', 'Fig X') + ' ' + (await L('lpn_scenario_delete_goes_one')), askOf());
		sv = await saved();
		ok('D2 ...No keeps it', !!byId(sv.alternatives, 'a1'));
		await openProject((d) => {
			plain(d);
			d.alternatives = [{ id: 'a1', category: 'physical', name: 'Two', parent: null, values: { 'n:10': { elev: 701, diameter: 9 }, 'n:11': { elev: 702 } } },
				{ id: 'a2', category: 'physical', name: 'Empty', parent: null }];
		}, true);
		await scenarioMenu(await L('lpn_sm_menu'));
		await page.selectOption('#lpn_sm_tree_select', 'physical');
		await a.settle(500);
		await smRow('Two');
		a.dialogs.length = 0;
		a.answerConfirmsWith(true);
		await page.keyboard.press('Delete');
		await flush();
		ok('D2 three overrides: "' + (await L('lpn_scenario_delete_goes')).replace('{n}', '3') + '"',
			askOf() === (await L('lpn_sm_delete_alt_ask')).replace('{name}', 'Two') + ' ' + (await L('lpn_scenario_delete_goes')).replace('{n}', '3'), askOf());
		sv = await saved();
		ok('D2 ...Yes deletes it', !byId(sv.alternatives, 'a1'), JSON.stringify(sv.alternatives));
		await smRow('Empty');
		a.dialogs.length = 0;
		await page.keyboard.press('Delete');
		await flush();
		sv = await saved();
		ok('D2 an empty alternative goes at once, unasked', !a.dialogs.length && !byId(sv.alternatives || [], 'a2'), JSON.stringify(a.dialogs));

		// ---- U1 and K1 ----
		console.log('\n--- U1, K1. what Basic mode can show ---');
		await openProject((d) => {
			plain(d);
			d.alternatives = [{ id: 'a1', category: 'physical', name: 'Old', parent: null, values: { 'n:10': { elev: 701 } } },
				{ id: 'a2', category: 'physical', name: 'Old child', parent: 'a1', values: { 'n:10': { elev: 702 } } }];
			d.calcSets = [{ id: 'c1', name: 'Calc', parent: null }, { id: 'c2', name: 'Calc child', parent: 'c1' }];
		});
		ok('U1 alternatives no scenario names, one the child of another, leave Basic mode on (Tom, 2026-10-13: "No.")',
			await page.evaluate(() => getComputedStyle(document.getElementById('lpn_pane_tab_scenarios')).display === 'none') &&
			(await page.evaluate(() => localStorage.getItem('lpn_scnbasic'))) === null);
		await openProject((d) => {
			plain(d);
			d.alternatives = [{ id: 'a1', category: 'physical', name: 'Old', parent: null },
				{ id: 'a2', category: 'physical', name: 'Used child', parent: 'a1', values: { 'n:10': { elev: 702 } } }];
			d.scenarios.push({ id: 'f6', name: 'Fig 6', overrides: {}, alternatives: { physical: 'a2' } });
		});
		ok('U1 ...but one a scenario names that has a parent still turns it off', await page.evaluate(() => getComputedStyle(document.getElementById('lpn_pane_tab_scenarios')).display !== 'none'));
		a.dialogs.length = 0;
		await scenarioMenu(await L('lpn_scenario_basic'));
		const MISFIT = await L('lpn_scenario_basic_misfit');
		ok('K1 ticking Basic mode on is refused in the dialog, in Tom\'s words',
			a.dialogs.some((x) => x.type === 'alert' && x.message === MISFIT) && await page.evaluate(() => getComputedStyle(document.getElementById('lpn_pane_tab_scenarios')).display !== 'none'), JSON.stringify(a.dialogs));
		await page.keyboard.press('Escape');

		// ---- M5 ----
		console.log('\n--- M5. Task 790: the dot and the down triangle ---');
		// Base > Fig 4 > Fig 5. Fig 4 and Fig 5 each hold junction 10's elevation in their own
		// Physical alternative; Fig 5 also holds a Settings value of its own.
		const tree = (d) => {
			d.alternatives = [{ id: 'a4', category: 'physical', name: 'Fig 4', parent: null, values: { 'n:10': { elev: 705 } } },
				{ id: 'a5', category: 'physical', name: 'Fig 5', parent: 'a4', values: { 'n:10': { elev: 701 } } }];
			byId(d.scenarios, 'f4').alternatives = { physical: 'a4' };
			byId(d.scenarios, 'f5').alternatives = { physical: 'a5' };
			byId(d.scenarios, 'f5').settings = { labelSettings: { link: { id: false } } };
		};
		const popMarks = () => page.evaluate(() => {
			const q = (c) => Array.from(document.querySelectorAll('#lpn_popup_fields .' + c));
			return { dot: q('lpn-ovm-dot').length, hollow: q('lpn-ovm-hollow').length, tri: q('lpn-ovm-tri').length,
				triTip: (q('lpn-ovm-tri')[0] || {}).title || (q('lpn-ovm-tri')[0] || { getAttribute: () => '' }).getAttribute('aria-label'),
				focusable: q('lpn-ovm-cell').filter((c) => c.tabIndex >= 0).length,
				stops: Array.from(document.querySelectorAll('#lpn_popup_fields input, #lpn_popup_fields select, #lpn_popup_fields button, #lpn_popup_fields textarea, #lpn_popup_fields [tabindex]'))
					.filter((e) => e.tabIndex >= 0 && !e.disabled && e.offsetParent).length };
		});
		const openPop = async (id) => {
			await page.evaluate(() => { const p = document.getElementById('lpn_popup_close'); if (p && p.offsetParent) { p.click(); } });
			await a.settle(300);
			await clickNode(id);
			await a.settle(500);
		};
		await openProject((d) => { tree(d); d.project.activeScenario = 'f4'; }, true);
		await openPop('10');
		let m = await popMarks();
		const TRI1 = (await L('lpn_ovm_child_tip')).replace('{n}', '1');
		ok('M5 in Fig 4, junction 10\'s elevation wears the dot (its override) and the triangle (Fig 5 overrides it)', m.dot === 1 && m.tri === 1, JSON.stringify(m));
		ok('M5 ...every other overridable row the hollow dot', m.hollow > 3, JSON.stringify(m));
		ok('M5 the triangle\'s tip counts the child overrides', m.triTip === TRI1, m.triTip);
		ok('M5 no marker is a tab stop', m.focusable === 0, JSON.stringify(m));
		a.dialogs.length = 0;
		a.answerConfirmsWith(false);
		await page.click('#lpn_popup_fields .lpn-ovm-tri');
		await flush();
		ok('M5 the triangle asks "' + (await L('lpn_ovm_child_ask')).replace('{n}', '1') + '"', askOf() === (await L('lpn_ovm_child_ask')).replace('{n}', '1'), askOf());
		sv = await saved();
		ok('M5 ...No clears nothing', ((byId(sv.alternatives, 'a5').values || {})['n:10'] || {}).elev === 701);
		a.dialogs.length = 0;
		a.answerConfirmsWith(true);
		await page.click('#lpn_popup_fields .lpn-ovm-tri');
		await flush();
		sv = await saved();
		ok('M5 ...Yes clears Fig 5\'s override, so Fig 5 follows Fig 4 again', !((byId(sv.alternatives, 'a5').values || {})['n:10'] || {}).elev &&
			((byId(sv.alternatives, 'a4').values || {})['n:10'] || {}).elev === 705, JSON.stringify(sv.alternatives));
		m = await popMarks();
		ok('M5 ...and the triangle is gone', m.tri === 0 && m.dot === 1, JSON.stringify(m));
		await page.click('#lpn_popup_fields .lpn-ovm-dot');
		await flush();
		sv = await saved();
		m = await popMarks();
		ok('M5 clicking the dot clears Fig 4\'s own override', !((byId(sv.alternatives, 'a4').values || {})['n:10'] || {}).elev && m.dot === 0, JSON.stringify(sv.alternatives));
		const hollowBefore = m.hollow;
		await page.click('#lpn_popup_fields .lpn-ovm-hollow >> nth=0');
		await flush();
		m = await popMarks();
		ok('M5 clicking a hollow dot makes that value an override, holding what it showed', m.dot === 1 && m.hollow === hollowBefore - 1, JSON.stringify(m));
		await scenarioMenu(await L('lpn_scenario_base'));
		await openPop('10');
		m = await popMarks();
		ok('M5 Base has no dot, and its marks are no tab stop either', m.dot === 0 && m.hollow === 0 && m.focusable === 0, JSON.stringify(m));
		await openProject((d) => { tree(d); d.project.activeScenario = 'base'; }, true);
		await openPop('10');
		m = await popMarks();
		ok('M5 in Base the triangle counts every scenario\'s override of it (2 total)', m.tri === 1 && m.triTip === (await L('lpn_ovm_child_tip')).replace('{n}', '2'), JSON.stringify(m));
		a.dialogs.length = 0;
		await page.click('#lpn_popup_fields .lpn-ovm-tri');
		await flush();
		sv = await saved();
		ok('M5 ...and asks "(2 total)", then clears both', askOf() === (await L('lpn_ovm_child_ask')).replace('{n}', '2') &&
			!((byId(sv.alternatives, 'a4') || {}).values || {})['n:10'] && !((byId(sv.alternatives, 'a5') || {}).values || {})['n:10'], askOf() + ' ' + JSON.stringify(sv.alternatives));

		// The Settings box.
		await openProject((d) => { tree(d); d.project.activeScenario = 'f4'; }, true);
		await page.evaluate(() => { const p = document.getElementById('lpn_popup_close'); if (p && p.offsetParent) { p.click(); } });
		await a.toolbarClick(await L('lpn_tool_settings'));
		await page.waitForSelector('#lpn_settings_box', { state: 'visible' });
		await a.settle(800);
		const setMarks = () => page.evaluate(() => {
			const q = (c) => Array.from(document.querySelectorAll('#lpn_settings_box .' + c));
			return { dot: q('lpn-ovm-dot').length, tri: q('lpn-ovm-tri').length, hollow: q('lpn-ovm-hollow').length,
				focusable: q('lpn-ovm-cell').filter((c) => c.tabIndex >= 0).length };
		});
		m = await setMarks();
		ok('M5 Settings in Fig 4: a triangle on the row Fig 5 overrides, no dot, no hollow dot', m.tri === 1 && m.dot === 0 && m.hollow === 0 && m.focusable === 0, JSON.stringify(m));
		a.dialogs.length = 0;
		await page.click('#lpn_settings_box .lpn-ovm-tri');
		await flush();
		sv = await saved();
		ok('M5 ...which asks "(1 total)" and clears Fig 5\'s setting', askOf() === (await L('lpn_ovm_child_ask')).replace('{n}', '1') &&
			!byId(sv.scenarios, 'f5').settings, askOf() + ' ' + JSON.stringify(byId(sv.scenarios, 'f5')));
		await openProject((d) => { tree(d); d.project.activeScenario = 'f5'; }, true);
		await page.evaluate(() => { const p = document.getElementById('lpn_popup_close'); if (p && p.offsetParent) { p.click(); } });
		await a.toolbarClick(await L('lpn_tool_settings'));
		await page.waitForSelector('#lpn_settings_box', { state: 'visible' });
		await a.settle(800);
		m = await setMarks();
		ok('M5 Settings in Fig 5: the held row wears the dot', m.dot >= 1 && m.tri === 0, JSON.stringify(m));
		await page.click('#lpn_settings_box .lpn-ovm-dot >> nth=0');
		await flush();
		sv = await saved();
		ok('M5 ...and clicking it clears the override, as Clear override does', !byId(sv.scenarios, 'f5').settings, JSON.stringify(byId(sv.scenarios, 'f5')));

		ok('no page error', errors.length === 0, JSON.stringify(errors).slice(0, 400));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
