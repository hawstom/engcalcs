// **TOM'S BROWSER PASS OF 2026-10-12 ON SCENARIOS, AND SUE'S REVIEW OF THE SAME DAY**, in a real
// Chromium on crafted Net1 projects (Base > Fig 4 > Fig 5):
//   B1  the Settings box's override note names the scenario holding the override (Fig 5), not Base;
//   B2  a Text dragged in Fig 5 moves in Fig 5 only: Base and Fig 4 keep it where it was, and the
//       position lands in Fig 5's own Text alternative; its size is overridable the same way;
//   B3  a right-click menu action in an auto-hidden Scenario manager leaves the box out;
//   B4  the manager's button is "Copy" on every tree, greyed on the Scenarios tree;
//   q01 a project Basic mode cannot show turns it off (and ticking it on is refused); Copy scenario,
//       Basic mode only, copies the scenario's overrides with their alternatives, named like the copy;
//   q02 renaming a scenario renames its equally named alternatives (Basic on) or asks (Basic off);
//   q07 Add base makes a copy of Base that a later Base edit does not reach;
//   B5/F1 Delete scenario asks one question naming what goes and what stays: Basic mode on deletes
//       its unshared alternatives, off keeps them (and the manager's Delete asks too);
//   M1  in a scenario, Copy properties copies overrides only ("No overrides to copy." when none);
//       a paste in another scenario writes there (Base unchanged) and names the alternative it made;
//   M2  in Basic mode a new scenario is a child of Base, even made while Fig 5 is current;
//   F7  the menu's New and Rename refuse a name already used;
//   F8  "Shared with" names a scenario that names the alternative, not a child that inherits it.
//   Q2  the line beside an override says what Clear override restores, named by where it comes from
//       (the parent scenario, or Base);
//   Q3  an .inp export from Fig 5 writes Fig 5's Text position, as it writes its node values.
// Wording is read from the page's own language strings, never written here.
//
//   node dev/lpn-spike/scenario-pass-1012-browser-harness.js   (takes the browser lock itself)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SCNPASS1012_LOCKED';
const NAME = 'scenario-pass-1012-browser-harness';
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
// The .inp download, as label-export-stable-browser-harness.js reads it.
function unzip(buf) {
	const out = {};
	let e = buf.length - 22;
	while (e >= 0 && buf.readUInt32LE(e) !== 0x06054b50) { e--; }
	if (e < 0) { return null; }
	const n = buf.readUInt16LE(e + 10);
	let p = buf.readUInt32LE(e + 16);
	for (let i = 0; i < n; i++) {
		if (buf.readUInt32LE(p) !== 0x02014b50) { return null; }
		const method = buf.readUInt16LE(p + 10), crc = buf.readUInt32LE(p + 16), csize = buf.readUInt32LE(p + 20),
			usize = buf.readUInt32LE(p + 24), nlen = buf.readUInt16LE(p + 28), xlen = buf.readUInt16LE(p + 30),
			clen = buf.readUInt16LE(p + 32), loc = buf.readUInt32LE(p + 42), name = buf.toString('utf8', p + 46, p + 46 + nlen);
		if (buf.readUInt32LE(loc) !== 0x04034b50) { return null; }
		const start = loc + 30 + buf.readUInt16LE(loc + 26) + buf.readUInt16LE(loc + 28), body = buf.subarray(start, start + csize);
		const data = method === 8 ? zlib.inflateRawSync(body) : method === 0 ? Buffer.from(body) : null;
		if (!data || data.length !== usize || zlib.crc32(data) !== crc) { return null; }
		out[name] = data;
		p += 46 + nlen + xlen + clen;
	}
	return out;
}
function inpText(buf) {
	if (buf.length > 4 && buf.toString('latin1', 0, 2) === 'PK') {
		const z = unzip(buf), n = z && Object.keys(z).find((k) => /\.inp$/i.test(k));
		return n ? z[n].toString('utf8') : null;
	}
	return buf.toString('utf8');
}
async function closeDialog(a) {
	for (let k = 0; k < 6; k++) {
		const shown = await a.page.evaluate(() => {
			const bd = document.getElementById('lpn_dialog_backdrop');
			return !!bd && getComputedStyle(bd).display !== 'none';
		});
		if (!shown) { return; }
		await a.page.click('#lpn_dialog_buttons button:visible');
		await a.settle(400);
	}
}
async function exportInp(a) {
	const got = [];
	const onDl = (d) => got.push(d);
	a.page.on('download', onDl);
	await closeDialog(a);
	await a.menuClickSub(await a.lang('lpn_file_export_menu'), await a.lang('lpn_file_export_item_inp'), 'file');
	for (let i = 0; i < 60 && got.length < 1; i++) { await a.page.waitForTimeout(100); }
	await a.page.waitForTimeout(800);
	// A file that leaves scenarios behind is answered with a dialog (Task 814); dismiss it.
	if (await a.page.evaluate(() => { const d = document.getElementById('lpn_dialog'); return !!d && d.style.display !== 'none'; })) { await a.page.keyboard.press('Escape'); await a.page.waitForTimeout(300); }
	a.page.off('download', onDl);
	if (!got.length) { return null; }
	return inpText(fs.readFileSync(await got[0].path()));
}
function labelRows(text) {
	const out = [];
	let on = false;
	for (const line of String(text).split(/\r?\n/)) {
		const m = /^\s*\[(\w+)\]/.exec(line);
		if (m) { on = m[1].toUpperCase() === 'LABELS'; continue; }
		if (on && line.trim() && line.trim()[0] !== ';') { out.push(line); }
	}
	return out;
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
			await require('./manager-door.js').ensure(page, label);
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

		// ---- B1 ----
		console.log('--- B1. the Settings box note names the scenario holding the override ---');
		await openProject((d) => { byId(d.scenarios, 'f5').settings = { labelSettings: { link: { id: false } } }; });
		await a.toolbarClick(await L('lpn_tool_settings'));
		await page.waitForSelector('#lpn_settings_box', { state: 'visible' });
		await a.settle(800);
		const L_clear = await L('lpn_ovm_dot_clear');
		const dots = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_settings_box .lpn-ovm-dot')).map((n) => n.getAttribute('aria-label')));
		const wantIn = (await L('lpn_settings_held_in')).replace('{scenario}', 'Fig 5');
		ok('B1 a held row is marked with a dot in Fig 5', dots.length >= 1, JSON.stringify(dots));
		ok('B1 every dot names Fig 5, the scenario holding the override, and says Click to clear it', dots.length > 0 && dots.every((n) => n === wantIn + ' ' + (L_clear)), JSON.stringify(dots));
		ok('B1 no yellow override note is drawn under any row (Tom, 2026-10-13: the markers replace it)', (await page.evaluate(() => document.querySelectorAll('#lpn_settings_box .lpn-set-heldnote, #lpn_settings_box .lpn-set-heldclear').length)) === 0);

		// ---- B2 ----
		console.log('\n--- B2. a Text moved in Fig 5 moves in Fig 5 only ---');
		const d2 = await openProject();
		const base0 = byId(d2.labels, 'X2');
		const p0 = await textPoint();
		const sp = await pointOf('lbl', 'X2');
		await page.mouse.move(sp.x, sp.y);
		await page.mouse.down();
		await page.mouse.move(sp.x + 30, sp.y + 15, { steps: 4 });
		await page.mouse.move(sp.x + 60, sp.y + 30, { steps: 4 });
		await page.mouse.up();
		await flush();
		const p5 = await textPoint();
		ok('B2 the Text moved on screen in Fig 5', p5 && (Math.abs(p5.x - p0.x) > 1 || Math.abs(p5.y - p0.y) > 1), JSON.stringify([p0, p5]));
		let sv = await saved();
		ok('B2 Base keeps its position in the file', Math.abs(byId(sv.labels, 'X2').x - base0.x) < 1e-9 && Math.abs(byId(sv.labels, 'X2').y - base0.y) < 1e-9,
			JSON.stringify([byId(sv.labels, 'X2').x, byId(sv.labels, 'X2').y, base0.x, base0.y]));
		const textAlt = (sv.alternatives || []).filter((r) => r.category === 'text')[0];
		ok('B2 the position is in a Text alternative named Fig 5, which Fig 5 names', !!textAlt && textAlt.name === 'Fig 5' &&
			!!(textAlt.values || {})['t:X2'] && typeof textAlt.values['t:X2'].x === 'number' && typeof textAlt.values['t:X2'].y === 'number' &&
			(byId(sv.scenarios, 'f5').alternatives || {}).text === textAlt.id, JSON.stringify(sv.alternatives));
		// Q3: the export from Fig 5 writes the Text where Fig 5 has it, as it writes Fig 5's node values.
		const inp5 = await exportInp(a);
		await scenarioMenu(await L('lpn_scenario_base'));
		const inpB = await exportInp(a);
		const rowOf = (t) => labelRows(t || '').filter((r) => /"Pump"/.test(r))[0] || '';
		ok('Q3 the [LABELS] row of the moved Text differs between a Fig 5 export and a Base export', !!rowOf(inp5) && !!rowOf(inpB) && rowOf(inp5) !== rowOf(inpB), rowOf(inp5) + ' | ' + rowOf(inpB));
		const xy = (r) => r.trim().split(/\s+/).slice(0, 2).map(Number);
		const dx = xy(rowOf(inp5))[0] - xy(rowOf(inpB))[0], dy = xy(rowOf(inp5))[1] - xy(rowOf(inpB))[1];
		ok('Q3 ...moved right and down, the way it was dragged (x up, y down in the file)', dx > 0 && dy < 0, dx + ', ' + dy);
		await scenarioMenu('Fig 4');
		const p4 = await textPoint();
		ok('B2 in Fig 4 the Text is where it was', p4 && Math.abs(p4.x - p0.x) < 1e-6 && Math.abs(p4.y - p0.y) < 1e-6, JSON.stringify([p0, p4]));
		await scenarioMenu(await L('lpn_scenario_base'));
		const pb = await textPoint();
		ok('B2 in Base the Text is where it was', pb && Math.abs(pb.x - p0.x) < 1e-6 && Math.abs(pb.y - p0.y) < 1e-6, JSON.stringify([p0, pb]));
		await scenarioMenu('Fig 5');
		const p5b = await textPoint();
		ok('B2 back in Fig 5 the Text is where it was moved', p5b && Math.abs(p5b.x - p5.x) < 1e-6 && Math.abs(p5b.y - p5.y) < 1e-6, JSON.stringify([p5, p5b]));
		// Its size, typed in the Text table in Fig 5.
		await a.toolbarClick(await L('lpn_pane_toggle'));
		await a.settle(500);
		await tab('text');
		await typeInto('text', 'X2', 'sizeMult', '3');
		await flush();
		sv = await saved();
		ok('B2 a size typed in Fig 5 is an override there; Base keeps its own', byId(sv.labels, 'X2').sizeMult === base0.sizeMult &&
			((sv.alternatives || []).filter((r) => r.category === 'text')[0].values['t:X2'] || {}).sizeMult === 3, JSON.stringify(sv.alternatives));
		await scenarioMenu(await L('lpn_scenario_base'));
		const fsBase = (await textPoint()).fs;
		await scenarioMenu('Fig 5');
		ok('B2 the Text is drawn larger in Fig 5 than in Base', (await textPoint()).fs > fsBase * 1.4, fsBase + ' ' + (await textPoint()).fs);

		// ---- M1 ----
		console.log('\n--- M1. Copy and Paste properties in scenarios ---');
		const dM = await openProject();
		await a.toolbarClick(await L('lpn_pane_toggle'));
		await a.settle(500);
		await tab('junctions');
		a.dialogs.length = 0;
		await rightClickRow(['node', '10', await L('lpn_copy_props_menu')]);
		ok('M1 Copy on an asset with no overrides in Fig 5 says "No overrides to copy." in the dialog (Tom, 2026-10-13)',
			a.dialogs.length === 1 && a.dialogs[0].type === 'alert' && a.dialogs[0].message === (await L('lpn_copy_props_no_overrides')), JSON.stringify(a.dialogs));
		await typeInto('junctions', '10', 'elev', '777');
		await rightClickRow(['node', '10', await L('lpn_copy_props_menu')]);
		ok('M1 with an override, Copy says it copied the overrides', (await a.notice()) === (await L('lpn_copy_props_done_ov')).replace('{id}', '10'), await a.notice());
		await scenarioMenu('Fig 4');
		await tab('junctions');
		const dem23 = await cell('junctions', '23', 'demand');
		await clickNode('23');
		await page.evaluate(() => { const p = document.getElementById('lpn_popup_close'); if (p && p.offsetParent) { p.click(); } });
		await a.settle(300);
		await rightClickRow(['node', '23', await L('lpn_paste_props_menu')]);
		const pasteNote = await a.notice();
		await tab('junctions');
		ok('M1 pasted in Fig 4: junction 23 shows the copied elevation', (await cell('junctions', '23', 'elev')) === '777', await cell('junctions', '23', 'elev'));
		ok('M1 ...and only the override was pasted: its demand is unchanged', (await cell('junctions', '23', 'demand')) === dem23);
		const created = (await L('lpn_paste_alt_created')).replace('{category}', await page.evaluate(() => {
			const o = Array.from(document.querySelectorAll('#lpn_sm_tree_select option')).filter((x) => x.value === 'physical')[0];
			return o ? o.textContent : null;
		}) || '').replace('{name}', 'Fig 4');
		ok('M1 the notice names the alternative the paste created', pasteNote.indexOf((await L('lpn_paste_alt_created')).split('{category}')[0]) >= 0 && pasteNote.indexOf('Fig 4') >= 0, pasteNote + ' | ' + created);
		await flush();
		sv = await saved();
		ok('M1 Base elevation of junction 23 is unchanged (paste elevation in a scenario leaves Base alone)', byId(sv.nodes, '23').elev === byId(dM.nodes, '23').elev, String(byId(sv.nodes, '23').elev));
		const phys4 = (sv.alternatives || []).filter((r) => r.category === 'physical' && r.name === 'Fig 4')[0];
		ok('M1 the elevation is in Fig 4\'s own Physical alternative', !!phys4 && ((phys4.values || {})['n:23'] || {}).elev === 777 && (byId(sv.scenarios, 'f4').alternatives || {}).physical === phys4.id, JSON.stringify(sv.alternatives));
		await scenarioMenu(await L('lpn_scenario_base'));
		await tab('junctions');
		await rightClickRow(['node', '10', await L('lpn_copy_props_menu')]);
		ok('M1 in Base, Copy copies properties as before', (await a.notice()) === (await L('lpn_copy_props_done')).replace('{id}', '10'), await a.notice());

		// ---- M2 and F7 ----
		console.log('\n--- M2, F7. a new scenario in Basic mode; duplicate names ---');
		await openProject(flat);
		ok('M2 a project Basic mode can show keeps it on', (await page.evaluate(() => localStorage.getItem('lpn_scnbasic'))) === null);
		a.answerPromptWith('Fig 7');
		await scenarioMenu(await L('lpn_scenario_new'));
		await flush();
		sv = await saved();
		const f7 = sv.scenarios.filter((s) => s.name === 'Fig 7')[0];
		ok('M2 New, made in Basic mode while Fig 5 is current, is a child of Base', !!f7 && f7.parent === undefined && !f7.root, JSON.stringify(f7));
		const n0 = sv.scenarios.length;
		a.answerPromptWith('Fig 4');
		await scenarioMenu(await L('lpn_scenario_new'));
		await flush();
		sv = await saved();
		ok('F7 New refuses a name another scenario has', sv.scenarios.length === n0, String(sv.scenarios.length));
		ok('F7 ...and says so', (await a.notice()) === (await L('lpn_sm_name_taken')).replace('{name}', 'Fig 4'), await a.notice());
		a.answerPromptWith(await L('lpn_scenario_base'));
		await scenarioMenu(await L('lpn_scenario_rename'));
		await flush();
		sv = await saved();
		ok('F7 Rename refuses Base', sv.scenarios.filter((s) => s.name === 'Fig 7').length === 1, JSON.stringify(sv.scenarios.map((s) => s.name)));

		// ---- B5 / F1 ----
		console.log('\n--- B5, F1. Delete scenario, Basic mode on and off ---');
		const withAlt = (d) => {
			d.alternatives = [{ id: 'a1', category: 'physical', name: 'Fig 6', parent: null, values: { 'n:10': { elev: 701 } } },
				{ id: 'a2', category: 'demand', name: 'Shared', parent: null, values: { 'n:10': { demand: 9 } } }];
			d.scenarios.push({ id: 'f6', name: 'Fig 6', overrides: {}, alternatives: { physical: 'a1', demand: 'a2' } },
				{ id: 'f9', name: 'Fig 9', overrides: {}, alternatives: { demand: 'a2' } });
			d.project.activeScenario = 'f6';
		};
		// Basic mode on needs a project it can show: nothing shared, every scenario a child of Base.
		await openProject((d) => { withAlt(d); flat(d); byId(d.scenarios, 'f6').alternatives = { physical: 'a1' }; });
		a.dialogs.length = 0;
		a.answerConfirmsWith(true);
		await scenarioMenu(await L('lpn_scenario_delete'));
		await flush();
		let asked = (a.dialogs[0] || {}).message || '';
		ok('F1 Basic on: the question names the scenario and the overrides that go',
			asked.indexOf((await L('lpn_scenario_delete_ask')).replace('{name}', 'Fig 6')) === 0 && asked.indexOf((await L('lpn_scenario_delete_goes')).replace('{n}', '1')) >= 0, asked);
		ok('F1 ...and names nothing as staying', asked.indexOf((await L('lpn_scenario_delete_stays')).split('{list}')[0]) < 0, asked);
		sv = await saved();
		ok('B5 Basic on: Fig 6 is deleted, and its alternative with it', !byId(sv.scenarios, 'f6') && !byId(sv.alternatives, 'a1'), JSON.stringify(sv.alternatives));
		ok('B5 ...and the alternative Fig 9 uses stays', !!byId(sv.alternatives, 'a2'));
		await openProject(withAlt, true);
		a.dialogs.length = 0;
		await scenarioMenu(await L('lpn_scenario_delete'));
		await flush();
		asked = (a.dialogs[0] || {}).message || '';
		ok('F1 Basic off: the question says both alternatives stay', asked.indexOf((await L('lpn_scenario_delete_stays')).replace('{list}', 'Fig 6, Shared')) >= 0 &&
			asked.indexOf((await L('lpn_scenario_delete_goes')).split('{n}')[0]) < 0, asked);
		sv = await saved();
		ok('B5 Basic off: Fig 6 is deleted and both alternatives stay', !byId(sv.scenarios, 'f6') && !!byId(sv.alternatives, 'a1') && !!byId(sv.alternatives, 'a2'));
		// The manager's Delete asks the same question.
		await openProject((d) => { withAlt(d); d.project.activeScenario = 'base'; }, true);
		await scenarioMenu(await L('lpn_sm_menu'));
		await page.locator('#lpn_sm_tree .lpn-sm-row', { has: page.locator('.lpn-sm-name', { hasText: /^Fig 6$/ }) }).first().locator('.lpn-sm-name').click();
		await a.settle(300);
		a.dialogs.length = 0;
		await page.keyboard.press('Delete');
		await flush();
		asked = (a.dialogs[0] || {}).message || '';
		ok('F1 the Scenario manager\'s Delete asks the same question', asked.indexOf((await L('lpn_scenario_delete_ask')).replace('{name}', 'Fig 6')) === 0, asked);
		sv = await saved();
		ok('F1 ...and deletes on yes, keeping the alternatives (Basic mode is off)', !byId(sv.scenarios, 'f6') && !!byId(sv.alternatives, 'a1'));

		// ---- B4 ----
		console.log('\n--- B4. one Copy button; a scenario is copied from the menu, in Basic mode ---');
		const COPY = await L('points_data_copy');
		ok('B4 the Scenarios tree\'s button reads Copy, greyed (Tom, 2026-10-12: Copy scenario is Basic mode\'s)',
			(await page.evaluate(() => { const b = document.getElementById('lpn_sm_copy'); return b ? [b.textContent, b.getAttribute('aria-disabled'), b.title] : null; })).join('|') ===
			[COPY, 'true', await L('lpn_scenario_copy_off')].join('|'));
		await page.selectOption('#lpn_sm_tree_select', 'demand');
		await a.settle(500);
		ok('B4 a category tree\'s button reads Copy too', (await page.evaluate(() => (document.getElementById('lpn_sm_copy') || {}).textContent)) === COPY);

		// ---- B3 ----
		console.log('\n--- B3. a right-click action keeps an auto-hidden Scenario manager out ---');
		await page.selectOption('#lpn_sm_tree_select', 'scenarios');
		await a.settle(400);
		await page.evaluate(() => document.querySelector('#lpn_sm_box [data-dock="right"]').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await a.settle(800);
		await page.evaluate(() => document.querySelector('#lpn_sm_box [data-dock="autohide"]').dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await a.settle(800);
		const tabEl = () => page.evaluate(() => {
			const t = Array.from(document.querySelectorAll('.lpn-dock-tab')).filter((x) => x.offsetParent && x.textContent.indexOf(document.getElementById('lpn_smbox_title').textContent.replace('?', '').trim()) >= 0)[0];
			if (!t) { return null; }
			const r = t.getBoundingClientRect();
			return { x: r.left + r.width / 2, y: r.top + r.height / 2, open: t.getAttribute('aria-expanded') };
		});
		const t0 = await tabEl();
		ok('B3 the box is auto-hidden on a tab', !!t0, JSON.stringify(t0));
		if (t0) {
			await page.mouse.move(t0.x, t0.y, { steps: 3 });
			await a.settle(700);
			const rows0 = await page.evaluate(() => document.querySelectorAll('#lpn_sm_tree .lpn-sm-row').length);
			const rb = await page.locator('#lpn_sm_tree .lpn-sm-row').first().boundingBox();
			await page.mouse.move(rb.x + 20, rb.y + rb.height / 2, { steps: 4 });
			await page.mouse.click(rb.x + 20, rb.y + rb.height / 2, { button: 'right' });
			await a.settle(400);
			const ib = await (await page.evaluateHandle(() => document.querySelector('.lpn-sm-menu [data-sm-cmd="add"]'))).asElement().boundingBox();
			await page.mouse.move(ib.x + 10, ib.y + 5, { steps: 4 });
			await page.mouse.click(ib.x + 10, ib.y + 5);
			await a.settle(1500);
			ok('B3 the menu\'s Add child worked', (await page.evaluate(() => document.querySelectorAll('#lpn_sm_tree .lpn-sm-row').length)) === rows0 + 1);
			ok('B3 ...and the box is still out', (await tabEl()).open === 'true', JSON.stringify(await tabEl()));
		}

		// ---- F8 ----
		console.log('\n--- F8. "Shared with" counts only scenarios that name the alternative ---');
		await openProject((d) => {
			d.alternatives = [{ id: 'a1', category: 'physical', name: 'Fig 4', parent: null, values: { 'n:10': { elev: 700 } } }];
			byId(d.scenarios, 'f4').alternatives = { physical: 'a1' };
			d.scenarios.push({ id: 'f9', name: 'Fig 9', overrides: {}, alternatives: { physical: 'a1' } });
			d.project.activeScenario = 'f4';
		}, true);
		await clickNode('10');
		const shared = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup .lpn-ov-shared')).map((e) => e.textContent.trim()));
		const want = (await L('lpn_sm_shared_note')).replace('{list}', 'Fig 9');
		ok('F8 in Fig 4 the elevation note names Fig 9, which names the alternative, and not Fig 5, which inherits it',
			shared.length > 0 && shared.every((t) => t === want), JSON.stringify(shared));

		// ---- Q2 in Properties ----
		console.log('\n--- Q2. Properties says what Clear override restores, and from where ---');
		await openProject((d) => {
			byId(d.scenarios, 'f4').overrides = { 'n:10': { elev: 720 } };
			byId(d.scenarios, 'f5').overrides = { 'n:10': { elev: 730 } };
		});
		await clickNode('10');
		let lines = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup .lpn-ov-base')).filter((e) => !e.classList.contains('lpn-ov-shared')).map((e) => e.textContent.trim()));
		const HB = await L('lpn_settings_held_base'), await0bv = await L('lpn_scenario_base_value');
		ok('Q2 in Fig 5 the elevation line names Fig 4 and its 720', lines.some((t) => t === HB.replace('{base}', 'Fig 4').replace('{value}', '720')), JSON.stringify(lines));
		await page.evaluate(() => { const p = document.getElementById('lpn_popup_close'); if (p && p.offsetParent) { p.click(); } });
		await scenarioMenu('Fig 4');
		await clickNode('10');
		lines = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup .lpn-ov-base')).filter((e) => !e.classList.contains('lpn-ov-shared')).map((e) => e.textContent.trim()));
		const baseElev = String(byId(JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8')).nodes, '10').elev);
		ok('Q2 in Fig 4, a child of Base, it reads Base scenario: ' + baseElev, lines.some((t) => t === (await0bv).replace('{value}', baseElev)), JSON.stringify(lines));

		// ---- q01: what Basic mode can show; Copy scenario ----
		console.log('\n--- q01. a project Basic mode cannot show turns it off; Copy scenario in Basic mode ---');
		await openProject();   // Fig 5 is a child of Fig 4: Basic mode cannot show that
		const MISFIT = await L('lpn_scenario_basic_misfit');
		ok('q01 arriving, Basic mode is turned off (the Scenarios tab shows)', await page.evaluate(() => getComputedStyle(document.getElementById('lpn_pane_tab_scenarios')).display !== 'none'));
		ok('q01 ...for this project only: the remembered choice is not written', (await page.evaluate(() => localStorage.getItem('lpn_scnbasic'))) === null);
		ok('q01 ...and says so in Tom\'s words', (await a.notice()) === MISFIT, await a.notice());
		a.dialogs.length = 0;
		await scenarioMenu(await L('lpn_scenario_basic'));
		ok('q01 ticking Basic mode on is refused for it, with the same sentence, in the dialog (Tom, 2026-10-13)', await page.evaluate(() => getComputedStyle(document.getElementById('lpn_pane_tab_scenarios')).display !== 'none') &&
			a.dialogs.some((x) => x.type === 'alert' && x.message === MISFIT), JSON.stringify(a.dialogs));
		await page.keyboard.press('Escape');
		await page.click('#lpn_scenario_btn');
		await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		const copyRow = await page.evaluate((l) => {
			const b = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).filter((r) => r.textContent.trim() === l)[0];
			return b ? { off: b.disabled || b.getAttribute('aria-disabled') === 'true', tip: b.title || b.getAttribute('data-bs-original-title') || '' } : null;
		}, await L('lpn_scenario_copy'));
		await page.keyboard.press('Escape');
		await a.settle(300);
		ok('q01 with Basic mode off, Copy scenario is greyed', !!copyRow && copyRow.off, JSON.stringify(copyRow));
		await openProject((d) => {
			flat(d);
			d.alternatives = [{ id: 'a1', category: 'physical', name: 'Fig 6', parent: null, values: { 'n:10': { elev: 701 } } }];
			d.scenarios.push({ id: 'f6', name: 'Fig 6', overrides: { 'n:10': { demand: 7 } }, alternatives: { physical: 'a1' } });
			d.project.activeScenario = 'f6';
		});
		ok('q01 a project Basic mode can show opens with it on', (await page.evaluate(() => localStorage.getItem('lpn_scnbasic'))) === null &&
			await page.evaluate(() => getComputedStyle(document.getElementById('lpn_pane_tab_scenarios')).display === 'none'));
		a.dialogs.length = 0;
		await scenarioMenu(await L('lpn_scenario_copy'));
		await flush();
		sv = await saved();
		const cp6 = sv.scenarios.filter((x) => x.name === 'Copy_of_Fig 6')[0];
		const cpAlt = cp6 && byId(sv.alternatives, (cp6.alternatives || {}).physical);
		ok('q01 Copy scenario asks nothing and makes Copy_of_Fig 6 current', !!cp6 && sv.project.activeScenario === cp6.id && !a.dialogs.length && !(await a.dialog()), JSON.stringify(sv.scenarios.map((x) => x.name)));
		ok('q01 ...with its own Physical alternative, named like the copy, holding the same override', !!cpAlt && cpAlt.id !== 'a1' && cpAlt.name === 'Copy_of_Fig 6' &&
			cpAlt.values['n:10'].elev === 701 && (byId(sv.scenarios, 'f6').alternatives || {}).physical === 'a1', JSON.stringify(sv.alternatives));
		ok('q01 ...and the scenario\'s own demand override, and no other alternative', ((cp6.overrides || {})['n:10'] || {}).demand === 7 &&
			JSON.stringify(Object.keys(cp6.alternatives || {})) === '["physical"]' && cp6.calc === undefined, JSON.stringify(cp6));
		ok('q01 the project still fits Basic mode', (await page.evaluate(() => localStorage.getItem('lpn_scnbasic'))) === null);

		// ---- q02: renaming a scenario renames its equally named alternatives ----
		console.log('\n--- q02. rename a scenario: its equally named alternatives ---');
		await scenarioMenu('Fig 6');
		a.dialogs.length = 0;
		a.answerPromptWith('Fig 6b');
		await scenarioMenu(await L('lpn_scenario_rename'));
		await flush();
		sv = await saved();
		ok('q02 Basic mode on: the alternative named Fig 6 is renamed Fig 6b, without asking', byId(sv.alternatives, 'a1').name === 'Fig 6b' &&
			!a.dialogs.some((x) => x.type === 'confirm'), JSON.stringify([byId(sv.alternatives, 'a1'), a.dialogs]));
		await openProject((d) => {
			flat(d);
			d.alternatives = [{ id: 'a1', category: 'physical', name: 'Fig 6', parent: null, values: { 'n:10': { elev: 701 } } }];
			d.scenarios.push({ id: 'f6', name: 'Fig 6', overrides: {}, alternatives: { physical: 'a1' } });
			d.project.activeScenario = 'f6';
		}, true);
		a.dialogs.length = 0;
		a.answerConfirmsWith(true);
		a.answerPromptWith('Fig 6c');
		await scenarioMenu(await L('lpn_scenario_rename'));
		await flush();
		sv = await saved();
		const askedR = a.dialogs.filter((x) => x.type === 'confirm').map((x) => x.message);
		ok('q02 Basic mode off: it asks "' + (await L('lpn_sm_rename_alts_ask')) + '"', askedR.indexOf(await L('lpn_sm_rename_alts_ask')) >= 0, JSON.stringify(a.dialogs));
		ok('q02 ...and Yes renames the alternative', byId(sv.alternatives, 'a1').name === 'Fig 6c', byId(sv.alternatives, 'a1').name);

		// ---- q07: Add base is an independent copy ----
		console.log('\n--- q07. Add base: a copy of Base that later Base edits do not reach ---');
		await scenarioMenu(await L('lpn_scenario_base'));
		await scenarioMenu(await L('lpn_sm_menu'));
		const e10 = String(byId(JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8')).nodes, '10').elev);
		ok('q07 the Scenarios tree\'s Add base tip says it is a copy', (await page.evaluate(() => (document.getElementById('lpn_sm_addbase') || {}).title)) === (await L('lpn_sm_add_base_tip')),
			await page.evaluate(() => (document.getElementById('lpn_sm_addbase') || {}).title));
		await page.evaluate(() => document.getElementById('lpn_sm_addbase').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })));
		await a.settle(500);
		await page.keyboard.press('Escape');
		await flush();
		sv = await saved();
		const b2 = sv.scenarios.filter((x) => x.root === true)[0];
		const b2phys = b2 && byId(sv.alternatives, (b2.alternatives || {}).physical);
		ok('q07 the new Base names its own Base Physical alternative, holding Base\'s elevations', !!b2phys && b2phys.root === true && String(b2phys.values['n:10'].elev) === e10, JSON.stringify(b2phys && b2phys.values['n:10']));
		// The manager's box, with its Scenarios table in it (Tom, 2026-10-16: one box), is wide enough
		// to lie over the Tables pane's cells; it is closed before a cell is typed into, as a person would.
		await page.evaluate(() => { const x = document.getElementById('lpn_sm_close'); if (x && x.offsetParent !== null) { x.click(); } });
		await a.settle(300);
		await a.toolbarClick(await L('lpn_pane_toggle'));
		await a.settle(500);
		await tab('junctions');
		await typeInto('junctions', '10', 'elev', '999');
		await scenarioMenu(b2.name);
		await tab('junctions');
		ok('q07 an edit to Base afterward does not reach the new Base', (await cell('junctions', '10', 'elev')) === e10, await cell('junctions', '10', 'elev'));

		ok('no page error', errors.length === 0, JSON.stringify(errors).slice(0, 400));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
