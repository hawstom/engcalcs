// **COPY / PASTE PROPERTIES** (Roadmap Task 782; Tom, 2026-10-12: a clipboard, right-click "Copy
// properties" and "Paste properties to selection", no confirmation). In real Chromium on Net1:
//   1. nothing copied: Paste is greyed with a tip; Copy is enabled and says what it copied;
//   2. copy pipe 10, paste onto a two-pipe selection: diameter, roughness and minor loss move, IDs and
//      end nodes do not, the flows are solved again, NO question box appears, ONE Undo reverses it;
//   3. a selection nothing in the clipboard fits greys Paste with its own tip;
//   4. junction to junction (elevation, demand), junction to tank (only what both have);
//   5. activation status is copied like any property; the clipboard is memory only (the device
//      storage is byte-identical after a copy); there is no Match properties row anywhere;
//   6. in a scenario the write goes through the one seam (an override for an overridable property).
//
//   node dev/lpn-spike/copy-paste-properties-browser-harness.js   (takes the browser lock itself)
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_COPYPASTE_BROWSER_LOCKED';
const NAME = 'copy-paste-properties-browser-harness';

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
		const COPY = await a.lang('lpn_copy_props_menu'), PASTE = await a.lang('lpn_paste_props_menu');
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
		const closePopup = async () => { const open = await page.evaluate(() => { const p = document.getElementById('lpn_popup'); return !!p && getComputedStyle(p).display !== 'none'; }); if (open) { await page.click('#lpn_popup_close'); await a.settle(300); } };
		const rightClick = async (pt) => { await closePopup(); await page.mouse.move(pt.x, pt.y); await page.mouse.click(pt.x, pt.y, { button: 'right' }); await a.settle(400); };
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
		const rowClick = (label) => page.$$eval('.lpn-pane-ctxmenu button', (bs, l) => bs.filter((b) => b.textContent.trim() === l)[0].dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })), label);
		const rowOff = (label) => page.$$eval('.lpn-pane-ctxmenu button', (bs, l) => bs.filter((b) => b.textContent.trim() === l && b.getAttribute('aria-disabled') === 'true').length, label);
		const copyFrom = async (group, id) => { await rightClick(await pointOf(group, id)); await rowClick(COPY); await a.settle(400); };
		const pasteVia = async (group, id) => { await rightClick(await pointOf(group, id)); await rowClick(PASTE); await a.settle(1000); };
		const dialogOpen = () => page.evaluate(() => { const d = document.getElementById('lpn_dialog_buttons'); return !!d && d.offsetParent !== null; });
		const hoverTip = async (label) => {
			const row = await page.evaluateHandle((l) => Array.from(document.querySelectorAll('.lpn-pane-ctxmenu button')).filter((b) => b.textContent.trim() === l)[0], label);
			const box = await row.asElement().boundingBox();
			await page.mouse.move(box.x + 6, box.y + 6);
			await a.settle(900);
			return page.evaluate(() => { const t = document.querySelector('.tooltip.show .tooltip-inner'); return t ? t.textContent.trim() : null; });
		};
		const storageNow = () => page.evaluate(() => JSON.stringify([Object.keys(localStorage).sort().map((k) => [k, localStorage.getItem(k)]), document.cookie]));

		// ---- 1. nothing copied: Copy works, Paste is greyed with its tip ----
		await selectTargets('link', ['12', '11']);
		await rightClick(await pointOf('link', '11'));
		ok('the menu offers Copy properties and Paste properties to selection', (await page.$$eval('.lpn-pane-ctxmenu button', (bs) => bs.length)) === 2 && (await rowOff(COPY)) === 0);
		ok('Paste is greyed while nothing is copied', (await rowOff(PASTE)) === 1);
		ok('...and its tip says nothing is copied', (await hoverTip(PASTE)) === (await a.lang('lpn_paste_props_off_none')));
		await rowClick(PASTE);
		await a.settle(300);
		ok('clicking the greyed Paste writes nothing', (await cell('pipes', '11', 'diameter')) === before11.d);
		await page.keyboard.press('Escape'); await a.settle(300);
		await clearSelection();

		// ---- 2. copy pipe 10 (memory only), paste onto a selection, no question, one Undo ----
		const store0 = await storageNow();
		await copyFrom('link', '10');
		ok('Copy says what it copied', (await a.notice()) === (await a.lang('lpn_copy_props_done')).replace('{id}', '10'), await a.notice());
		ok('the clipboard is in memory only: device storage is unchanged', (await storageNow()) === store0);
		await selectTargets('link', ['12', '11']);
		await pasteVia('link', '11');
		ok('no confirmation box appeared', !(await dialogOpen()));
		for (const id of ['11', '12']) {
			ok('pipe ' + id + ' diameter equals pipe 10', (await cell('pipes', id, 'diameter')) === src.d, await cell('pipes', id, 'diameter'));
			ok('pipe ' + id + ' roughness equals pipe 10', (await cell('pipes', id, 'roughness')) === src.r, await cell('pipes', id, 'roughness'));
			ok('pipe ' + id + ' minor loss equals pipe 10', (await cell('pipes', id, 'km')) === src.k, await cell('pipes', id, 'km'));
		}
		ok('pipe 11 keeps its ID and both end nodes', (await cell('pipes', '11', 'from')) === before11.from && (await cell('pipes', '11', 'to')) === before11.to);
		ok('pipe 12 keeps its ID and both end nodes', (await cell('pipes', '12', 'from')) === before12.from && (await cell('pipes', '12', 'to')) === before12.to);
		ok('the network was solved again: flows changed', JSON.stringify(await flows()) !== JSON.stringify(flowsBefore));
		ok('the notice reports the paste', /^Pasted properties of 10 to 2 assets\. Values changed: \d+\./.test(await a.notice()), await a.notice());
		await undo();
		ok('ONE Undo takes both back', (await cell('pipes', '12', 'diameter')) === before12.d && (await cell('pipes', '11', 'diameter')) === before11.d && (await cell('pipes', '11', 'roughness')) === before11.r && (await cell('pipes', '11', 'km')) === before11.k);
		ok('and the flows are what they were', JSON.stringify(await flows()) === JSON.stringify(flowsBefore));
		await clearSelection();

		// ---- 2b. right-click an asset OUTSIDE the selection: Paste still goes to the selection ----
		await selectTargets('link', ['11']);
		const d31 = await cell('pipes', '31', 'diameter');
		await pasteVia('link', '31');
		ok('the selected pipe changed', (await cell('pipes', '11', 'diameter')) === src.d);
		ok('...and the pipe right-clicked did not', (await cell('pipes', '31', 'diameter')) === d31);
		await undo();
		await clearSelection();

		// ---- 3. three pipes, ONE Undo ----
		await selectTargets('link', ['22', '21', '31']);
		ok('three pipes are selected', (await selCount()) === 3, String(await selCount()));
		const sel3 = [await cell('pipes', '21', 'diameter'), await cell('pipes', '22', 'diameter'), await cell('pipes', '31', 'diameter')];
		await pasteVia('link', '22');
		ok('all three received pipe 10\'s diameter and roughness', (await cell('pipes', '21', 'diameter')) === src.d && (await cell('pipes', '22', 'diameter')) === src.d && (await cell('pipes', '31', 'diameter')) === src.d && (await cell('pipes', '31', 'roughness')) === src.r);
		await undo();
		ok('ONE Undo restores all three', (await cell('pipes', '21', 'diameter')) === sel3[0] && (await cell('pipes', '22', 'diameter')) === sel3[1] && (await cell('pipes', '31', 'diameter')) === sel3[2], JSON.stringify(sel3));
		await clearSelection();

		// ---- 3b. a selection nothing in the clipboard fits ----
		await selectTargets('node', ['23']);
		await rightClick(await pointOf('node', '23'));
		ok('a pipe clipboard cannot be pasted onto a junction: Paste is greyed', (await rowOff(PASTE)) === 1);
		ok('...with its own tip', (await hoverTip(PASTE)) === (await a.lang('lpn_paste_props_off_kind')));
		await page.keyboard.press('Escape'); await a.settle(300);
		await clearSelection();

		// ---- 4a. junction 10 copied onto junction 23: elevation and demand move, the flows are re-solved ----
		await showTab('junctions');
		const j23 = { elev: await cell('junctions', '23', 'elev'), demand: await cell('junctions', '23', 'demand'), p: await cell('junctions', '23', 'pressure') };
		const j10 = { elev: await cell('junctions', '10', 'elev'), demand: await cell('junctions', '10', 'demand') };
		const jFlows = await flows();
		ok('junction 23 starts different from junction 10', j23.elev !== j10.elev && j23.demand !== j10.demand, JSON.stringify([j10, j23]));
		await copyFrom('node', '10');
		await selectTargets('node', ['23']);
		await pasteVia('node', '23');
		await showTab('junctions');
		ok('junction 23 took junction 10\'s elevation and demand', (await cell('junctions', '23', 'elev')) === j10.elev && (await cell('junctions', '23', 'demand')) === j10.demand);
		ok('...and kept its ID', (await cell('junctions', '23', 'id')) === '23');
		ok('the network was solved again: flows changed', JSON.stringify(await flows()) !== JSON.stringify(jFlows));
		await undo();
		await showTab('junctions');
		ok('Undo restores junction 23', (await cell('junctions', '23', 'elev')) === j23.elev && (await cell('junctions', '23', 'demand')) === j23.demand);
		await clearSelection();

		// ---- 4b. the tank selected, junction 10 still on the clipboard: only what both have changes ----
		await showTab('tanks');
		const t0 = { elev: await cell('tanks', '2', 'elev'), level: await cell('tanks', '2', 'level'), min: await cell('tanks', '2', 'minLevel'), dia: await cell('tanks', '2', 'tankDiameter') };
		await selectTargets('node', ['2']);
		await pasteVia('node', '2');
		await showTab('tanks');
		ok('the tank took the junction\'s elevation', (await cell('tanks', '2', 'elev')) === j10.elev, await cell('tanks', '2', 'elev'));
		ok('and kept its level, minimum level and diameter', (await cell('tanks', '2', 'level')) === t0.level && (await cell('tanks', '2', 'minLevel')) === t0.min && (await cell('tanks', '2', 'tankDiameter')) === t0.dia);
		await undo();
		await showTab('tanks');
		ok('Undo restores the tank elevation', (await cell('tanks', '2', 'elev')) === t0.elev, await cell('tanks', '2', 'elev'));
		await clearSelection();

		// ---- 4c. no Match properties row anywhere ----
		await a.openMenu('edit');
		let rows = await page.$$eval('#lpn_menu_list button.lpn-menu-row', (els) => els.map((e) => e.textContent.trim()));
		ok('Edit has no Match properties row', rows.indexOf('Match properties') < 0, JSON.stringify(rows));
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
			await copyFrom(srcGroup, srcId);
			await clickAt(dstGroup, dstId);
			await pasteVia(dstGroup, dstId);
			const n = await a.notice();
			await clearSelection();
			return n;
		};
		const saved = () => page.evaluate(() => JSON.parse(localStorage.getItem('lpn_project_hover')));
		const byId = (arr, id) => arr.filter((x) => x.id === id)[0];

		// 5a. In a scenario the write goes through the one seam: an overridable property that differs becomes an override.
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
		// 5a2. A junction's demand pattern IS held per scenario, so it is copied as an override, not skipped.
		await openProject((d) => {
			d.scenarios.push({ id: 's1', name: 'S1', overrides: {} });
			d.project = Object.assign({}, d.project, { activeScenario: 's1' });
			byId(d.nodes, '10').demandPattern = '1';
		});
		await showTab('junctions');
		note = await matchOnto('node', '10', 'node', '23');
		await a.settle(1500);
		sv = await saved();
		ok('scenario: pasting a demand pattern raises no notice of a skipped property', !/Not pasted/i.test(note), note);

		// 5b. A valve cannot take another valve type's setting.
		await openProject((d) => {
			const v = (id, type, setting, dia) => { const l = byId(d.links, id); l.type = 'valve'; l.valveType = type; l._setting = setting; l._diameter = dia; l._k = 0; delete l._roughness; delete l._length; };
			v('11', 'PRV', 60, 14); v('12', 'FCV', 300, 10);
		});
		await showTab('valves');
		note = await matchOnto('link', '11', 'link', '12');
		ok('valve: diameter copied', (await cell('valves', '12', 'diameter')) === '14', await cell('valves', '12', 'diameter'));
		ok('valve: PRV setting did not land on the FCV', (await cell('valves', '12', 'setting')) === '300', await cell('valves', '12', 'setting'));
		ok('valve: the notice says the types differ', /Not pasted: 1 \(the valve types differ\)\./.test(note), note);

		// 5c. A junction with a demand breakdown keeps it, and the notice says so.
		await openProject((d) => { byId(d.nodes, '23').extraDemands = [{ base: 50, pattern: null, category: null }]; });
		await showTab('junctions');
		const d23 = await cell('junctions', '23', 'demand');
		note = await matchOnto('node', '10', 'node', '23');
		await showTab('junctions');
		ok('breakdown: demand of junction 23 is unchanged', (await cell('junctions', '23', 'demand')) === d23, d23 + ' -> ' + await cell('junctions', '23', 'demand'));
		ok('breakdown: the notice says why', /Not pasted: 1 \(demand is a list of categories\)\./.test(note), note);

		// 5d. A pump: speed AND status are copied (status is a property like any other).
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
		ok('pump: status (Shut) copied too', (await cell('pumps', '12', 'closed')) === '0', await cell('pumps', '12', 'closed'));

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
		await b.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		ok('the Spanish page serves the menu strings (English fallback while untranslated)', (await b.lang('lpn_copy_props_menu')).length > 0 && (await b.lang('lpn_paste_props_menu')).length > 0);
		ok('no page error on either page', a.errors.length === 0 && b.errors.length === 0, JSON.stringify(a.errors.concat(b.errors)).slice(0, 300));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
