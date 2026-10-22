// A SCENARIO'S OVERRIDE COUNT FOLLOWS A TABLES PASTE, AND A REPORT'S COLUMNS COME FROM ONE RUN,
// in a real Chromium.
//
//   node dev/lpn-spike/scenario-report-mix-browser-harness.js
//
// Perry's pre-review found two defects on master:
//  A. A paste into a scenario's Tables pane wrote overrides but the scenario button still read the
//     old "No. of overrides" (until a scenario switch recounted).
//  B. With Recalculate off, Calculate in Peak hour, then open Base: the Full report printed Peak's
//     pressures beside Base's Demand. Every column of a results report must come from the same run.
//
// **DO NOT PREFIX THIS WITH `flock`.** It takes /tmp/engcalcs-browser.lock itself.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SCENARIO_REPORT_MIX_LOCKED';
const NAME = 'scenario-report-mix-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- lock contention; re-run it alone.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error(NAME + ': no `flock` binary found -- running WITHOUT the browser lock.');
}

let checks = 0, fails = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8'));
		// Peak hour: junction 11 draws 450 (Base: 150). One override, so the button reads 1.
		d.scenarios.push({ id: 'peak', name: 'Peak hour', overrides: { 'n:11': { demand: 450 } } });
		d.project = Object.assign({}, d.project, { activeScenario: 'peak' });
		d.settings.autoRun = false;
		const a = await Session.open(browser, NAME, { serviceWorkers: 'block', viewport: { width: 1600, height: 1000 },
			permissions: ['clipboard-read', 'clipboard-write'] });
		const P = a.page;
		await P.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (route) => route.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await P.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_rm', txt); localStorage.setItem('lpn_scnbasic', 'off'); }, JSON.stringify(d));
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
		await a.settle(2500);

		const btnCount = () => P.evaluate(() => {
			const t = document.getElementById('lpn_scenario_btn').textContent.trim();
			const m = t.match(/(\d+)\s*$/); return m ? +m[1] : null;
		});
		const btnText = () => P.evaluate(() => document.getElementById('lpn_scenario_btn').textContent.trim());
		const toScenario = async (name) => {
			await P.click('#lpn_scenario_btn');
			await P.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			await P.evaluate((n) => {
				const row = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row, #lpn_menu_list2 button.lpn-menu-row'))
					.find((b) => b.textContent.trim().indexOf(n) === 0);
				if (row) { row.click(); }
			}, name);
			await a.settle(1200);
		};
		const solve = async () => {
			await P.evaluate(() => { window.__prev = EngCalcs.lpnSolveProbe(); });
			const run = P.locator('#lpn_toolbar_run button[data-icon="run"]:visible');
			if (await run.count()) { await run.first().click(); } else { await P.evaluate(() => EngCalcs.lpnTimeRunNow()); }
			await a.waitFor(() => P.evaluate(() => { const r = EngCalcs.lpnSolveProbe(); return !!(r && r !== window.__prev && r.heads); }), 'a solve', 60000);
			await a.settle(800);
		};
		// The Demand column of the Full report, by node id.
		const fullDemand = async (id) => {
			await P.evaluate(() => EngCalcs.lpnOpenFullReportBox());
			await a.settle(600);
			return P.evaluate((nid) => {
				const host = document.getElementById('lpn_full_report');
				const ths = Array.from(host.querySelectorAll('thead th')).map((t) => t.textContent.trim());
				const di = ths.findIndex((t) => /^Demand/.test(t)), ii = ths.findIndex((t) => /^(ID|Id)/.test(t));
				const tr = Array.from(host.querySelectorAll('tbody tr')).find((r) => r.children[ii] && r.children[ii].textContent.trim() === nid);
				return tr ? { ths, v: tr.children[di].textContent.trim() } : { ths, v: null };
			}, id);
		};

		console.log('--- A. the override count after a Tables paste ---');
		ok('Peak hour is open with one override', (await btnCount()) === 1, await btnText());
		await a.toolbarClick(await a.lang('lpn_pane_toggle')); await a.settle(400);
		await P.click('#lpn_pane_tab_pipes'); await a.settle(500);
		await P.evaluate(() => navigator.clipboard.writeText('14\n15\n16'));
		const cell = await P.evaluate(() => {
			const td = Array.from(document.querySelectorAll('#lpn_pane_pipes tbody td')).find((t) => t._lpnPaneId === '10' && t._lpnPaneKey === 'diameter');
			if (!td) { return null; }
			td.scrollIntoView({ block: 'nearest' });
			const r = td.getBoundingClientRect();
			return { x: r.left + Math.min(12, r.width / 2), y: r.top + r.height / 2 };
		});
		ok('the Diameter cell of pipe 10 is there', !!cell);
		await P.mouse.click(cell.x, cell.y);
		await P.keyboard.press('Control+V');
		await a.settle(900);
		// The paste is three Diameter cells of Net1's first three pipes, each a new override, beside
		// the one the scenario already had: four values stored in the scenario.
		const nStored = await P.evaluate(() => {
			const cells = Array.from(document.querySelectorAll('#lpn_pane_pipes tbody td')).filter((t) => t._lpnPaneKey === 'diameter');
			return 1 + cells.slice(0, 3).map((t) => (t.querySelector('input') ? t.querySelector('input').value : t.textContent.trim())).filter((v) => /^1[456]/.test(v)).length;
		});
		const nShown = await btnCount();
		ok('the paste made three overrides beside the one it had (4)', nStored === 4, 'cells ' + nStored + ', notice: ' + await a.notice());
		ok('the button count equals the stored override count', nShown === nStored, 'button ' + nShown + ' / stored ' + nStored);
		await toScenario('Base'); await toScenario('Peak hour');
		ok('and a switch there and back agrees', (await btnCount()) === nStored, await btnText());

		console.log('--- B. the Full report after switching scenario with Recalculate off ---');
		await solve();                                   // Calculate in Peak hour
		const peak = await fullDemand('11');
		ok('Peak run: junction 11 demand reads 450', Math.abs(parseFloat(peak.v) - 450) < 1e-6, JSON.stringify(peak));
		await toScenario('Base');
		const off = await fullDemand('11');
		ok('Base open, Recalculate off: the Demand column is still the Peak run\'s 450', Math.abs(parseFloat(off.v) - 450) < 1e-6, JSON.stringify(off));
		const tab = await P.evaluate(() => {
			const td = Array.from(document.querySelectorAll('#lpn_pane_junctions tbody td')).find((t) => t._lpnPaneId === '11' && t._lpnPaneKey === 'demandActual');
			return td ? (td.querySelector('input') ? td.querySelector('input').value : td.textContent.trim()) : null;
		});
		await P.click('#lpn_pane_tab_junctions'); await a.settle(600);
		const tab2 = await P.evaluate(() => {
			const td = Array.from(document.querySelectorAll('#lpn_pane_junctions tbody td')).find((t) => t._lpnPaneId === '11' && t._lpnPaneKey === 'demandActual');
			return td ? td.textContent.trim() : null;
		});
		ok('the Tables pane Demand result column agrees (450)', Math.abs(parseFloat(tab2) - 450) < 1e-6, String(tab2));
		const csvLike = await P.evaluate(() => typeof EngCalcs.lpnFullReportCsv === 'function' ? EngCalcs.lpnFullReportCsv() : null);
		void tab; void csvLike;

		console.log('--- B2. Recalculate on: Base shows Base ---');
		await P.evaluate(() => { document.getElementById('lpn_scenario_btn'); });
		await P.evaluate(() => EngCalcs.lpnSetAutoRun && EngCalcs.lpnSetAutoRun(true));
		const hasSwitch = await P.evaluate(() => typeof EngCalcs.lpnSetAutoRun === 'function');
		if (hasSwitch) {
			await a.settle(2500);
			const on = await fullDemand('11');
			ok('Recalculate on, Base open: Demand is Base\'s 150', Math.abs(parseFloat(on.v) - 150) < 1e-6, JSON.stringify(on));
		} else {
			// No test door for the setting: use the saved project with autoRun on.
			const d2 = JSON.parse(JSON.stringify(d)); d2.settings.autoRun = true; d2.project.activeScenario = 'base';
			await P.evaluate((txt) => { localStorage.setItem('lpn_project_rm', txt); }, JSON.stringify(d2));
			await a.reload(); await a.answerTrainingPanel().catch(() => {});
			await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			await a.settle(5000);
			const on = await fullDemand('11');
			ok('Recalculate on, Base open: Demand is Base\'s 150', Math.abs(parseFloat(on.v) - 150) < 1e-6, JSON.stringify(on));
		}
		ok('no page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - fails) + '/' + checks + ' passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
