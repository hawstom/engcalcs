// **MATCH PROPERTIES** (Roadmap Task 782; Tom, 2026-10-10: *"Match properties from one asset to
// others (as applicable)"*, the AutoCAD MATCHPROP). In real Chromium on Net1, with real clicks:
//   1. right-click pipe 10 on the map -> "Match properties" -> press pipes 11 and 12: their
//      diameter, roughness and minor loss equal pipe 10's; IDs and end nodes are unchanged; the
//      flows are SOLVED again and differ; Undo takes each match back;
//   2. a multi-selection offered the match: Yes applies to all in ONE undo step;
//   3. a junction matched onto a tank changes only what both have (elevation), and Undo restores it
//      with the solved flows;
//   4. Escape ends the tool; the Edit menu row exists, also on a non-English page.
//
//   node dev/lpn-spike/match-property-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_MATCHPROP_BROWSER_LOCKED';
const NAME = 'match-property-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
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

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		let a = await Session.open(browser, 'A');
		let page = a.page;
		await a.goto('Looped-Network.php');
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1500);
		await page.evaluate(() => {
			delete window.lpnDialogAnswerer;   // click the real box, not the native seam
			let e = document.querySelector('.ec-consent-actions');
			while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
			if (e) { e.style.display = 'none'; }
		});
		await a.toolbarClick(await a.lang('lpn_pane_toggle'));
		await a.settle(500);
		const MATCH = await a.lang('lpn_match_menu');
		const showTab = async (kind) => { await page.click('#lpn_pane_tab_' + kind); await a.settle(700); };
		// a table cell's text or input value
		const cell = (kind, id, key) => page.evaluate(([k, i, c]) => {
			const td = Array.from(document.querySelectorAll('#lpn_pane_' + k + ' td.lpn-pane-col-' + c)).filter((t) => t._lpnPaneId === i)[0];
			if (!td) { return null; }
			const inp = td.querySelector('input,select');
			return inp ? (inp.type === 'checkbox' ? (inp.checked ? '1' : '0') : inp.value) : td.textContent.trim();
		}, [kind, id, key]);
		const flows = async () => {
			await showTab('pipes');   // a hidden table is not refilled, so look at the one that shows the solve
			const out = {};
			for (const id of ['10', '11', '12', '21', '22', '31', '110', '111', '112', '113', '121', '122']) {
				const v = await cell('pipes', id, 'flow');
				if (v !== null) { out[id] = v; }
			}
			return out;
		};
		const typeInto = async (kind, id, key, text) => {
			const sel = '#lpn_pane_' + kind + ' td.lpn-pane-col-' + key;
			const h = await page.evaluateHandle(([s, i]) => Array.from(document.querySelectorAll(s)).filter((t) => t._lpnPaneId === i)[0], [sel, id]);
			const inp = await h.asElement().$('input');
			await inp.click();
			await page.keyboard.press('Control+A');
			await page.keyboard.type(text, { delay: 10 });
			await page.keyboard.press('Tab');
			await a.settle(900);
		};
		// the screen point of a link's midpoint or of a node's centre
		const pointOf = (group, id) => page.evaluate(([g, i]) => {
			const els = Array.from(document.querySelectorAll('#lpn_canvas [data-' + g + '="' + i + '"]'));
			for (const el of els) {
				if (g === 'link' && el.getTotalLength && el.getScreenCTM) {
					const L = el.getTotalLength(), p = el.getPointAtLength(L / 2), m = el.getScreenCTM();
					return { x: m.a * p.x + m.c * p.y + m.e, y: m.b * p.x + m.d * p.y + m.f };
				}
				const r = el.getBoundingClientRect();
				if (r.width > 0) { return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
			}
			return null;
		}, [group, id]);
		const rightClick = async (pt) => { await page.mouse.move(pt.x, pt.y); await page.mouse.click(pt.x, pt.y, { button: 'right' }); await a.settle(400); };
		const menuRow = (label) => page.$$eval('.lpn-pane-ctxmenu button', (bs, l) => bs.filter((b) => b.textContent.trim() === l).length, label);
		const hint = () => page.evaluate(() => (document.getElementById('lpn_mode_hint') || {}).textContent || '');
		const undo = async () => { await page.keyboard.press('Control+z'); await a.settle(900); };

		// ---- setup: give pipe 10 its own roughness and minor loss, typed in the Tables ----
		await showTab('pipes');
		await typeInto('pipes', '10', 'roughness', '130');
		await typeInto('pipes', '10', 'km', '2.5');
		const src = { d: await cell('pipes', '10', 'diameter'), r: await cell('pipes', '10', 'roughness'), k: await cell('pipes', '10', 'km') };
		ok('pipe 10 carries roughness 130 and k 2.5', src.r === '130' && src.k === '2.5', JSON.stringify(src));
		const before11 = { d: await cell('pipes', '11', 'diameter'), r: await cell('pipes', '11', 'roughness'), k: await cell('pipes', '11', 'km'), from: await cell('pipes', '11', 'from'), to: await cell('pipes', '11', 'to') };
		const before12 = { d: await cell('pipes', '12', 'diameter'), from: await cell('pipes', '12', 'from'), to: await cell('pipes', '12', 'to') };
		ok('pipes 11 and 12 start different from pipe 10', before11.d !== src.d && before11.r !== src.r && before12.d !== src.d, JSON.stringify([before11, before12]));
		const flowsBefore = await flows();

		// Pressing the source asks first: OK writes, Cancel writes nothing. Returns the question's text.
		const askedText = { last: null };
		const pickSource = async (group, id, answerIdx) => {
			await clickAt(group, id);
			const dlg = await a.waitDialog(3000);
			askedText.last = dlg ? dlg.text : null;
			if (dlg) { await page.evaluate((i) => document.querySelectorAll('#lpn_dialog_buttons button')[i].dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })), answerIdx || 0); await a.settle(900); }
		};
		const selCount = () => page.evaluate(() => document.querySelectorAll('#lpn_canvas .lpn-selected').length);
		const clickAt = async (group, id, shift) => {
			const p = await pointOf(group, id);
			if (shift) { await page.keyboard.down('Shift'); }
			await page.mouse.click(p.x, p.y);
			if (shift) { await page.keyboard.up('Shift'); }
			await a.settle(600);
		};
		// Targets first: the selection. Rightmost first, because the Properties box opens to the right of it.
		const selectTargets = async (group, ids) => {
			for (let i = 0; i < ids.length; i++) { await clickAt(group, ids[i], i > 0); }
		};
		const clearSelection = async () => {
			const open = await page.evaluate(() => { const p = document.getElementById('lpn_popup'); return !!p && getComputedStyle(p).display !== 'none'; });
			if (open) { await page.click('#lpn_popup_close'); await a.settle(300); }
			await page.evaluate(() => { if (document.activeElement && document.activeElement.blur) { document.activeElement.blur(); } });
			await page.keyboard.press('Escape'); await a.settle(300);
			await page.keyboard.press('Escape'); await a.settle(300);
		};
		const startFromEdit = async () => { await a.menuClick(MATCH, 'edit'); await a.settle(400); };
		const menuClickRow = () => page.$$eval('.lpn-pane-ctxmenu button', (bs, l) => bs.filter((b) => b.textContent.trim() === l)[0].dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })), MATCH);

		// ---- 0. nothing selected: the command does not start, and says why ----
		await startFromEdit();
		ok('with nothing selected the tool does not start', !/Match properties/.test(await hint()), await hint());
		ok('...and a notice says to select the targets first', (await a.notice()) === (await a.lang('lpn_match_select_first')), await a.notice());
		await rightClick(await pointOf('link', '10'));
		ok('right-click with nothing selected: the row is shown but greyed', await page.$$eval('.lpn-pane-ctxmenu button', (bs, l) => bs.filter((b) => b.textContent.trim() === l && b.getAttribute('aria-disabled') === 'true').length, MATCH) === 1);
		await page.keyboard.press('Escape');
		await a.settle(300);

		// ---- 1. select pipes 12 and 11, right-click one of them, choose Match properties, press pipe 10 ----
		await selectTargets('link', ['12', '11']);
		await rightClick(await pointOf('link', '11'));
		ok('a right-click on a pipe offers Match properties', (await menuRow(MATCH)) === 1);
		await menuClickRow();
		await a.settle(400);
		ok('the status line asks for the source and discloses what is not copied', (await hint()) === (await a.lang('lpn_mode_match')), await hint());
		await pickSource('link', '10');
		await a.settle(1000);
		for (const id of ['11', '12']) {
			ok('pipe ' + id + ' diameter equals pipe 10', (await cell('pipes', id, 'diameter')) === src.d, await cell('pipes', id, 'diameter'));
			ok('pipe ' + id + ' roughness equals pipe 10', (await cell('pipes', id, 'roughness')) === src.r, await cell('pipes', id, 'roughness'));
			ok('pipe ' + id + ' minor loss equals pipe 10', (await cell('pipes', id, 'km')) === src.k, await cell('pipes', id, 'km'));
		}
		ok('pipe 11 keeps its ID and both end nodes', (await cell('pipes', '11', 'from')) === before11.from && (await cell('pipes', '11', 'to')) === before11.to);
		ok('pipe 12 keeps its ID and both end nodes', (await cell('pipes', '12', 'from')) === before12.from && (await cell('pipes', '12', 'to')) === before12.to);
		ok('the network was solved again: flows changed', JSON.stringify(await flows()) !== JSON.stringify(flowsBefore));
		ok('the notice says what was left out', /Matched 2 assets to 10, except status and location\. Values changed: \d+\./.test(await a.notice()), await a.notice());
		ok('the tool ended by itself', !/Match properties/.test(await hint()), await hint());
		await undo();
		ok('ONE Undo takes both back', (await cell('pipes', '12', 'diameter')) === before12.d && (await cell('pipes', '11', 'diameter')) === before11.d && (await cell('pipes', '11', 'roughness')) === before11.r && (await cell('pipes', '11', 'km')) === before11.k);
		ok('and the flows are what they were', JSON.stringify(await flows()) === JSON.stringify(flowsBefore));
		await clearSelection();


		// ---- 1a. the confirmation: the question, then Cancel writes nothing and OK writes ----
		await selectTargets('link', ['12', '11']);
		await startFromEdit();
		await pickSource('link', '10', 1);   // Cancel
		const askMany = (await a.lang('lpn_match_selected_ask')).replace('{n}', '2');
		ok('the question is Tom\'s sentence with the count', askedText.last === askMany, askedText.last);
		ok('Cancel wrote nothing to pipe 11', (await cell('pipes', '11', 'diameter')) === before11.d && (await cell('pipes', '11', 'roughness')) === before11.r);
		ok('Cancel wrote nothing to pipe 12', (await cell('pipes', '12', 'diameter')) === before12.d);
		ok('Cancel ended the tool', !/Match properties/.test(await hint()), await hint());
		await clearSelection();
		await selectTargets('link', ['11']);
		await startFromEdit();
		await pickSource('link', '10', 0);   // OK
		ok('one target asks the one-object sentence', askedText.last === (await a.lang('lpn_match_selected_ask_one')), askedText.last);
		ok('OK wrote pipe 11', (await cell('pipes', '11', 'diameter')) === src.d);
		await undo();
		await clearSelection();

		// ---- 1c. a greyed right-click row carries the styled tip ----
		await rightClick(await pointOf('link', '10'));
		const offRow = await page.evaluateHandle((l) => Array.from(document.querySelectorAll('.lpn-pane-ctxmenu button')).filter((b) => b.textContent.trim() === l)[0], MATCH);
		const offBox = await offRow.asElement().boundingBox();
		await page.mouse.move(offBox.x + 6, offBox.y + 6);
		await a.settle(900);
		const tipText = await page.evaluate(() => { const t = document.querySelector('.tooltip.show .tooltip-inner'); return t ? t.textContent.trim() : null; });
		ok('hovering the greyed row shows a styled tip with Tom\'s sentence', tipText === (await a.lang('lpn_match_menu_off_tip')), String(tipText));
		ok('...and no native title is left on the row', await offRow.asElement().evaluate((b) => !b.getAttribute('title')));
		await offRow.asElement().evaluate((b) => b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })));
		await a.settle(300);
		ok('clicking the greyed row starts nothing', !/Match properties/.test(await hint()), await hint());
		await page.keyboard.press('Escape');
		await a.settle(300);

		// ---- 1b. right-click an asset that is NOT in the selection: the tool starts for the selection ----
		await selectTargets('link', ['11']);
		const d31 = await cell('pipes', '31', 'diameter');
		await rightClick(await pointOf('link', '31'));
		await menuClickRow();
		await a.settle(400);
		await pickSource('link', '10');
		await a.settle(1000);
		ok('right-click outside the selection: the selected pipe changed', (await cell('pipes', '11', 'diameter')) === src.d);
		ok('...and the pipe right-clicked did not', (await cell('pipes', '31', 'diameter')) === d31, await cell('pipes', '31', 'diameter'));
		await undo();
		await clearSelection();

		// ---- 2. three pipes, ONE Undo ----
		await selectTargets('link', ['22', '21', '31']);
		ok('three pipes are selected', (await selCount()) === 3, String(await selCount()));
		const sel3 = { d: [await cell('pipes', '21', 'diameter'), await cell('pipes', '22', 'diameter'), await cell('pipes', '31', 'diameter')] };
		await startFromEdit();
		await pickSource('link', '10');
		await a.settle(1000);
		ok('all three received pipe 10\'s diameter', (await cell('pipes', '21', 'diameter')) === src.d && (await cell('pipes', '22', 'diameter')) === src.d && (await cell('pipes', '31', 'diameter')) === src.d);
		ok('and roughness 130', (await cell('pipes', '21', 'roughness')) === src.r && (await cell('pipes', '31', 'roughness')) === src.r);
		await undo();
		ok('ONE Undo restores all three', (await cell('pipes', '21', 'diameter')) === sel3.d[0] && (await cell('pipes', '22', 'diameter')) === sel3.d[1] && (await cell('pipes', '31', 'diameter')) === sel3.d[2], JSON.stringify(sel3.d));
		ok('and the flows are what they were', JSON.stringify(await flows()) === JSON.stringify(flowsBefore));
		await clearSelection();
		ok('the selection is clear before the junction test', (await selCount()) === 0, String(await selCount()));

		// ---- 3a. junction 23 selected, junction 10 the source: elevation and demand move, the flows are re-solved ----
		await showTab('junctions');
		const j23 = { elev: await cell('junctions', '23', 'elev'), demand: await cell('junctions', '23', 'demand'), p: await cell('junctions', '23', 'pressure') };
		const j10 = { elev: await cell('junctions', '10', 'elev'), demand: await cell('junctions', '10', 'demand') };
		const jFlows = await flows();
		ok('junction 23 starts different from junction 10', j23.elev !== j10.elev && j23.demand !== j10.demand, JSON.stringify([j10, j23]));
		await selectTargets('node', ['23']);
		await startFromEdit();
		await pickSource('node', '10');
		await a.settle(1000);
		await showTab('junctions');
		ok('junction 23 took junction 10\'s elevation and demand', (await cell('junctions', '23', 'elev')) === j10.elev && (await cell('junctions', '23', 'demand')) === j10.demand, await cell('junctions', '23', 'elev') + ' / ' + await cell('junctions', '23', 'demand'));
		ok('...and kept its ID', (await cell('junctions', '23', 'id')) === '23');
		ok('the network was solved again: flows changed', JSON.stringify(await flows()) !== JSON.stringify(jFlows));
		await showTab('junctions');
		ok('...and the pressure at 23 changed', (await cell('junctions', '23', 'pressure')) !== j23.p, j23.p + ' -> ' + await cell('junctions', '23', 'pressure'));
		await undo();
		await showTab('junctions');
		ok('Undo restores junction 23', (await cell('junctions', '23', 'elev')) === j23.elev && (await cell('junctions', '23', 'demand')) === j23.demand);
		ok('...and the flows and pressure', JSON.stringify(await flows()) === JSON.stringify(jFlows) && (await (async () => { await showTab('junctions'); return cell('junctions', '23', 'pressure'); })()) === j23.p);
		await clearSelection();

		// ---- 3b. the tank selected, junction 10 the source: only what both have changes ----
		await showTab('junctions');
		const jElev = await cell('junctions', '10', 'elev');
		await showTab('tanks');
		const t0 = { elev: await cell('tanks', '2', 'elev'), level: await cell('tanks', '2', 'level'), min: await cell('tanks', '2', 'minLevel'), dia: await cell('tanks', '2', 'tankDiameter') };
		ok('tank 2 starts at a different elevation than junction 10', t0.elev !== jElev, t0.elev + ' vs ' + jElev);
		await selectTargets('node', ['2']);
		await startFromEdit();
		await pickSource('node', '10');
		await a.settle(1000);
		await showTab('tanks');
		ok('the tank took the junction\'s elevation', (await cell('tanks', '2', 'elev')) === jElev, await cell('tanks', '2', 'elev'));
		ok('and kept its level, minimum level and diameter', (await cell('tanks', '2', 'level')) === t0.level && (await cell('tanks', '2', 'minLevel')) === t0.min && (await cell('tanks', '2', 'tankDiameter')) === t0.dia);
		await undo();
		await showTab('tanks');
		ok('Undo restores the tank elevation', (await cell('tanks', '2', 'elev')) === t0.elev, await cell('tanks', '2', 'elev'));
		await clearSelection();

		// ---- 4. the Edit menu row, in English and on a Spanish page ----
		await a.openMenu('edit');
		let rows = await page.$$eval('#lpn_menu_list button.lpn-menu-row', (els) => els.map((e) => e.textContent.trim()));
		ok('Edit > Match properties exists', rows.indexOf(MATCH) >= 0, JSON.stringify(rows));
		await a.closeMenu();
		// ---- 5. crafted cases, each on a project built from Net1 ----
		const openProject = async (edit) => {
			const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8'));
			edit(d);
			const s = await Session.open(browser, 'C', { serviceWorkers: 'block' });
			await s.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
			await s.goto('Looped-Network.php?ec_nolog=1');
			await s.page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); }, JSON.stringify(d));
			await s.reload();
			await s.answerTrainingPanel().catch(() => {});
			await s.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
			await s.settle(2500);
			a = s; page = s.page;
			await a.toolbarClick(await a.lang('lpn_pane_toggle'));
			await a.settle(500);
			return d;
		};
		const matchOnto = async (srcGroup, srcId, dstGroup, dstId) => {
			await clickAt(dstGroup, dstId);
			await startFromEdit();
			await pickSource(srcGroup, srcId);
			await a.settle(1000);
			const n = await a.notice();
			await clearSelection();
			return n;
		};
		const saved = () => page.evaluate(() => JSON.parse(localStorage.getItem('lpn_project_hover')));
		const byId = (arr, id) => arr.filter((x) => x.id === id)[0];

		// 5a. In a scenario: only values that differ become overrides, and Base is never written.
		await openProject((d) => {
			d.scenarios.push({ id: 's1', name: 'S1', overrides: {} });
			d.project = Object.assign({}, d.project, { activeScenario: 's1' });
			byId(d.links, '11')._diameter = 14;
		});
		await showTab('pipes');
		let note = await matchOnto('link', '10', 'link', '11');
		await a.settle(1500);
		let sv = await saved();
		const s1 = sv.scenarios.filter((x) => x.id === 's1')[0];
		ok('scenario: pipe 10 onto 11 writes exactly one override (the diameter)', JSON.stringify(Object.keys((s1.overrides || {})['l:11'] || {})) === '["diameter"]', JSON.stringify(s1.overrides));
		ok('scenario: Base diameter of pipe 11 is untouched', byId(sv.links, '11')._diameter === 14);
		ok('scenario: the notice counts the one value changed', /Values changed: 1\./.test(note), note);
		note = await matchOnto('node', '10', 'node', '23');
		await a.settle(1500);
		sv = await saved();
		const base23 = byId(sv.nodes, '23');
		ok('scenario: Base elevation of junction 23 is untouched', base23.elev === 690, String(base23.elev));
		ok('scenario: Base demand of junction 23 is untouched', base23._demand === 150, String(base23._demand));
		ok('scenario: the notice names what a scenario cannot hold, and where to change it', /Not copied: [^.]*Elevation[^.]*\. A scenario cannot hold its own value for these; change them in Base\./.test(note), note);

		// 5a2. A junction's demand pattern IS held per scenario, so it is copied as an override, not skipped.
		await openProject((d) => {
			d.scenarios.push({ id: 's1', name: 'S1', overrides: {} });
			d.project = Object.assign({}, d.project, { activeScenario: 's1' });
			byId(d.nodes, '10').demandPattern = '1';
		});
		await showTab('junctions');
		note = await matchOnto('node', '10', 'node', '23');
		await a.settle(1500);
		ok('scenario: the notice does not list Demand pattern as uncopyable', !/Not copied:[^.]*pattern/i.test(note), note);

		// 5b. A valve cannot take another valve type's setting.
		await openProject((d) => {
			const v = (id, type, setting, dia) => { const l = byId(d.links, id); l.type = 'valve'; l.valveType = type; l._setting = setting; l._diameter = dia; l._k = 0; delete l._roughness; delete l._length; };
			v('11', 'PRV', 60, 14); v('12', 'FCV', 300, 10);
		});
		await showTab('valves');
		note = await matchOnto('link', '11', 'link', '12');
		ok('valve: diameter copied', (await cell('valves', '12', 'diameter')) === '14', await cell('valves', '12', 'diameter'));
		ok('valve: PRV setting did not land on the FCV', (await cell('valves', '12', 'setting')) === '300', await cell('valves', '12', 'setting'));
		ok('valve: the notice says the types differ', /Not copied: 1 \(the valve types differ\)\./.test(note), note);

		// 5c. A junction with a demand breakdown keeps it, and the notice says so.
		await openProject((d) => { byId(d.nodes, '23').extraDemands = [{ base: 50, pattern: null, category: null }]; });
		await showTab('junctions');
		const d23 = await cell('junctions', '23', 'demand');
		note = await matchOnto('node', '10', 'node', '23');
		await showTab('junctions');
		ok('breakdown: demand of junction 23 is unchanged', (await cell('junctions', '23', 'demand')) === d23, d23 + ' -> ' + await cell('junctions', '23', 'demand'));
		ok('breakdown: the notice says why', /Not copied: 1 \(demand is a list of categories\)\./.test(note), note);

		// 5d. A pump: speed is copied, status is not.
		await openProject((d) => {
			const p9 = byId(d.links, '9'), l = byId(d.links, '12');
			Object.keys(l).forEach((k) => { delete l[k]; });
			Object.assign(l, JSON.parse(JSON.stringify(p9)), { id: '12', from: '12', to: '13', _status: 'closed', speed: 1 });
			p9.speed = 1.5; p9._status = 'open';
		});
		await showTab('pumps');
		note = await matchOnto('link', '9', 'link', '12');
		await showTab('pumps');
		ok('pump: speed copied', (await cell('pumps', '12', 'speed')) === '1.5', await cell('pumps', '12', 'speed'));
		ok('pump: status (Shut) not copied', (await cell('pumps', '12', 'closed')) === '1', await cell('pumps', '12', 'closed'));

		// 5e. Right-drag on empty canvas still pans; no menu appears.
		await openProject(() => {});
		const n10 = await pointOf('node', '10');
		const emptyAt = { x: n10.x + 60, y: n10.y - 140 };
		const hitEmpty = await page.evaluate(([x, y]) => document.elementsFromPoint(x, y)[0].tagName, [emptyAt.x, emptyAt.y]);
		await page.mouse.move(emptyAt.x, emptyAt.y);
		await page.mouse.down({ button: 'right' });
		await page.mouse.move(emptyAt.x + 80, emptyAt.y + 40, { steps: 6 });
		await page.mouse.up({ button: 'right' });
		await a.settle(500);
		const n10b = await pointOf('node', '10');
		ok('right-drag on empty canvas pans the map', Math.abs((n10b.x - n10.x) - 80) < 6 && Math.abs((n10b.y - n10.y) - 40) < 6, hitEmpty + ' ' + JSON.stringify([n10, n10b]));
		ok('...and offers no menu', (await page.$$('.lpn-pane-ctxmenu')).length === 0);

		const b = await Session.open(browser, 'B');
		await b.goto('Looped-Network.php?lang=es');
		await b.settle(800);
		await b.openMenu('edit');
		rows = await b.page.$$eval('#lpn_menu_list button.lpn-menu-row', (els) => els.map((e) => e.textContent.trim()));
		ok('the row renders on the Spanish page (with a fallback if untranslated)', rows.some((r) => /match|coincid|igual/i.test(r)) , JSON.stringify(rows));
		ok('no page error on either page', a.errors.length === 0 && b.errors.length === 0, JSON.stringify(a.errors.concat(b.errors)).slice(0, 300));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
