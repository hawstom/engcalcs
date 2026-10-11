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
		const a = await Session.open(browser, 'A');
		const page = a.page;
		await a.goto('Looped-Network.php');
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1500);
		await page.evaluate(() => {
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

		// ---- 1. right-click pipe 10, Match properties, press 11 and 12 ----
		await rightClick(await pointOf('link', '10'));
		ok('a right-click on a pipe offers Match properties', (await menuRow(MATCH)) === 1);
		ok('and did not open a property sheet', !(await page.evaluate(() => { const p = document.getElementById('lpn_popup'); return p && getComputedStyle(p).display !== 'none'; })));
		await page.$$eval('.lpn-pane-ctxmenu button', (bs, l) => bs.filter((b) => b.textContent.trim() === l)[0].dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })), MATCH);
		await a.settle(400);
		ok('the status line names the source and asks for destinations', /10/.test(await hint()) && /Match/i.test(await hint()), await hint());
		await page.mouse.click((await pointOf('link', '11')).x, (await pointOf('link', '11')).y);
		await a.settle(900);
		await page.mouse.click((await pointOf('link', '12')).x, (await pointOf('link', '12')).y);
		await a.settle(1500);
		for (const id of ['11', '12']) {
			ok('pipe ' + id + ' diameter equals pipe 10', (await cell('pipes', id, 'diameter')) === src.d, await cell('pipes', id, 'diameter'));
			ok('pipe ' + id + ' roughness equals pipe 10', (await cell('pipes', id, 'roughness')) === src.r, await cell('pipes', id, 'roughness'));
			ok('pipe ' + id + ' minor loss equals pipe 10', (await cell('pipes', id, 'km')) === src.k, await cell('pipes', id, 'km'));
		}
		ok('pipe 11 keeps its ID and both end nodes', (await cell('pipes', '11', 'from')) === before11.from && (await cell('pipes', '11', 'to')) === before11.to);
		ok('pipe 12 keeps its ID and both end nodes', (await cell('pipes', '12', 'from')) === before12.from && (await cell('pipes', '12', 'to')) === before12.to);
		const flowsAfter = await flows();
		ok('the network was solved again: flows changed', JSON.stringify(flowsAfter) !== JSON.stringify(flowsBefore), JSON.stringify([flowsBefore['11'], flowsAfter['11']]));
		ok('a notice says what happened', /Matched/.test(await a.notice()), await a.notice());
		await page.keyboard.press('Escape');
		await a.settle(400);
		ok('Escape ends the tool', !/Match properties/.test(await hint()), await hint());

		await undo();
		ok('Undo takes the second match back', (await cell('pipes', '12', 'diameter')) === before12.d, await cell('pipes', '12', 'diameter'));
		await undo();
		ok('Undo takes the first match back', (await cell('pipes', '11', 'diameter')) === before11.d && (await cell('pipes', '11', 'roughness')) === before11.r && (await cell('pipes', '11', 'km')) === before11.k);
		ok('and the flows are what they were', JSON.stringify(await flows()) === JSON.stringify(flowsBefore));

		// ---- 2. a multi-selection is offered the match, and one Undo takes it all back ----
		// The page's question box is answered for real here: the harness seam that turns it into a
		// native confirm is removed, as dialog-modal-browser-harness.js does.
		await page.evaluate(() => { delete window.lpnDialogAnswerer; });
		const selCount = () => page.evaluate(() => document.querySelectorAll('#lpn_canvas .lpn-selected').length);
		// Rightmost first: the Properties box opens to the right of the selection and would cover the next.
		for (const id of ['22', '21', '31']) {
			const p = await pointOf('link', id);
			await page.keyboard.down('Shift'); await page.mouse.click(p.x, p.y); await page.keyboard.up('Shift');
			await a.settle(600);
		}
		ok('three pipes are selected', (await selCount()) === 3, String(await selCount()));
		const sel3 = { d: [await cell('pipes', '21', 'diameter'), await cell('pipes', '22', 'diameter'), await cell('pipes', '31', 'diameter')] };
		await rightClick(await pointOf('link', '10'));
		await page.$$eval('.lpn-pane-ctxmenu button', (bs, l) => bs.filter((b) => b.textContent.trim() === l)[0].dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })), MATCH);
		await a.settle(500);
		const dlg = await a.dialog();
		ok('the selected pipes are offered the match', !!dlg && /3/.test(dlg.text) && /10/.test(dlg.text), dlg && dlg.text);
		if (dlg) {
			await page.$$eval('#lpn_dialog_buttons button', (bs, l) => bs.filter((b) => b.textContent.trim() === l)[0].dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })), dlg.buttons[0]);
			await a.settle(1500);
		}
		ok('all three received pipe 10\'s diameter', (await cell('pipes', '21', 'diameter')) === src.d && (await cell('pipes', '22', 'diameter')) === src.d && (await cell('pipes', '31', 'diameter')) === src.d);
		ok('and roughness 130', (await cell('pipes', '21', 'roughness')) === src.r && (await cell('pipes', '31', 'roughness')) === src.r);
		await undo();
		ok('ONE Undo restores all three', (await cell('pipes', '21', 'diameter')) === sel3.d[0] && (await cell('pipes', '22', 'diameter')) === sel3.d[1] && (await cell('pipes', '31', 'diameter')) === sel3.d[2], JSON.stringify(sel3.d));
		ok('and the flows are what they were', JSON.stringify(await flows()) === JSON.stringify(flowsBefore));

		await page.evaluate(() => { if (document.activeElement && document.activeElement.blur) { document.activeElement.blur(); } });
		await page.keyboard.press('Escape');   // closes the Properties box
		await a.settle(300);
		await page.keyboard.press('Escape');   // and then clears the selection
		await a.settle(300);
		ok('the selection is clear before the junction test', (await selCount()) === 0, String(await selCount()));
		// ---- 3a. a junction matched onto another junction: elevation and demand move, the flows are re-solved ----
		await showTab('junctions');
		const j23 = { elev: await cell('junctions', '23', 'elev'), demand: await cell('junctions', '23', 'demand'), p: await cell('junctions', '23', 'pressure') };
		const j10 = { elev: await cell('junctions', '10', 'elev'), demand: await cell('junctions', '10', 'demand') };
		const jFlows = await flows();
		ok('junction 23 starts different from junction 10', j23.elev !== j10.elev && j23.demand !== j10.demand, JSON.stringify([j10, j23]));
		await rightClick(await pointOf('node', '10'));
		await page.$$eval('.lpn-pane-ctxmenu button', (bs, l) => bs.filter((b) => b.textContent.trim() === l)[0].dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })), MATCH);
		await a.settle(400);
		const p23 = await pointOf('node', '23');
		await page.mouse.click(p23.x, p23.y);
		await a.settle(1500);
		await page.keyboard.press('Escape');
		await a.settle(300);
		await showTab('junctions');
		ok('junction 23 took junction 10\'s elevation and demand', (await cell('junctions', '23', 'elev')) === j10.elev && (await cell('junctions', '23', 'demand')) === j10.demand, await cell('junctions', '23', 'elev') + ' / ' + await cell('junctions', '23', 'demand'));
		ok('...and kept its ID', (await cell('junctions', '23', 'id')) === '23');
		await showTab('pipes'); ok('the network was solved again: flows changed', JSON.stringify(await flows()) !== JSON.stringify(jFlows), JSON.stringify(jFlows) + ' -> ' + JSON.stringify(await flows())); await showTab('junctions');
		ok('...and the pressure at 23 changed', (await cell('junctions', '23', 'pressure')) !== j23.p, j23.p + ' -> ' + await cell('junctions', '23', 'pressure'));
		await undo();
		await showTab('junctions');
		ok('Undo restores junction 23', (await cell('junctions', '23', 'elev')) === j23.elev && (await cell('junctions', '23', 'demand')) === j23.demand);
		await showTab('pipes'); const fl2 = JSON.stringify(await flows()); await showTab('junctions'); ok('...and the flows and pressure', fl2 === JSON.stringify(jFlows) && (await cell('junctions', '23', 'pressure')) === j23.p);

		// ---- 3b. a junction matched onto the tank changes only what both have ----
		await showTab('junctions');
		const jElev = await cell('junctions', '10', 'elev');
		await showTab('tanks');
		const t0 = { elev: await cell('tanks', '2', 'elev'), level: await cell('tanks', '2', 'level'), min: await cell('tanks', '2', 'minLevel'), dia: await cell('tanks', '2', 'tankDiameter') };
		const tankFlows = await flows();
		ok('tank 2 starts at a different elevation than junction 10', t0.elev !== jElev, t0.elev + ' vs ' + jElev);
		await rightClick(await pointOf('node', '10'));
		ok('a right-click on a junction offers Match properties', (await menuRow(MATCH)) === 1);
		await page.$$eval('.lpn-pane-ctxmenu button', (bs, l) => bs.filter((b) => b.textContent.trim() === l)[0].dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })), MATCH);
		await a.settle(400);
		const tp = await pointOf('node', '2');
		await page.mouse.click(tp.x, tp.y);
		await a.settle(1500);
		await showTab('tanks');
		ok('the tank took the junction\'s elevation', (await cell('tanks', '2', 'elev')) === jElev, await cell('tanks', '2', 'elev'));
		ok('and kept its level, minimum level and diameter', (await cell('tanks', '2', 'level')) === t0.level && (await cell('tanks', '2', 'minLevel')) === t0.min && (await cell('tanks', '2', 'tankDiameter')) === t0.dia);
		// (Net1's tank does not move any steady-state flow, so no hydraulic claim is made for the tank itself.)
		await page.keyboard.press('Escape');
		await a.settle(300);
		await undo();
		await showTab('tanks');
		ok('Undo restores the tank elevation', (await cell('tanks', '2', 'elev')) === t0.elev, await cell('tanks', '2', 'elev'));
		ok('and the flows', JSON.stringify(await flows()) === JSON.stringify(tankFlows));

		// ---- 4. the Edit menu row, in English and on a Spanish page ----
		await a.openMenu('edit');
		let rows = await page.$$eval('#lpn_menu_list button.lpn-menu-row', (els) => els.map((e) => e.textContent.trim()));
		ok('Edit > Match properties exists', rows.indexOf(MATCH) >= 0, JSON.stringify(rows));
		await a.closeMenu();
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
