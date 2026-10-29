// A MAP LABEL'S DEMAND IS A RESULT OF THE KEPT RUN (Task 820), in a real Chromium.
//
// With Recalculate off, Calculate in Peak hour, then open Base: the label's Demand (the actual
// demand, a result) stays Peak's 450, as the Full report and the Tables pane do; the Base demand
// beside it is an input and shows Base's 150 at once. Fails on master (Demand read 150).
//
//   node dev/lpn-spike/label-snapshot-demand-browser-harness.js
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
const LOCK_ENV = 'EC_LABEL_SNAPSHOT_DEMAND_LOCKED';
const NAME = 'label-snapshot-demand-browser-harness';

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
		d.labelSettings = d.labelSettings || {};
		d.labelSettings.node = Object.assign({}, d.labelSettings.node, { id: true, demandActual: true, demand: true });
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

		const labelText = () => P.evaluate(() => {
			const t = document.querySelector('text[data-nodelbl="11"]');
			if (!t) { return null; }
			const rows = [];
			Array.from(t.children).forEach((s) => {
				if (s.tagName !== 'tspan') { return; }
				if (s.hasAttribute('x') || !rows.length) { rows.push(''); }
				rows[rows.length - 1] += s.textContent;
			});
			return rows;
		});
		// Q= is the Demand (actual), Qb= the Base demand.
		const pick = (rows, pre) => { const r = (rows || []).find((x) => x.indexOf(pre + '=') === 0); return r ? parseFloat(r.slice(pre.length + 1)) : NaN; };
		await solve();                                   // Calculate in Peak hour
		let rows = await labelText();
		console.log('   Peak label rows: ' + JSON.stringify(rows));
		ok('Peak run: label shows Demand 450 and Base demand 450', Math.abs(pick(rows, 'Q') - 450) < 1e-6 && Math.abs(pick(rows, 'Qb') - 450) < 1e-6, JSON.stringify(rows));
		await toScenario('Base');
		rows = await labelText();
		console.log('   Base-open label rows: ' + JSON.stringify(rows));
		ok('Base open, Recalculate off: Demand is still the Peak run\'s 450', Math.abs(pick(rows, 'Q') - 450) < 1e-6, JSON.stringify(rows));
		ok('...and Base demand (an input) shows Base\'s 150 at once', Math.abs(pick(rows, 'Qb') - 150) < 1e-6, JSON.stringify(rows));
		await solve();                                   // Calculate in Base
		rows = await labelText();
		ok('Calculate in Base: Demand becomes 150', Math.abs(pick(rows, 'Q') - 150) < 1e-6, JSON.stringify(rows));
		ok('no page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - fails) + '/' + checks + ' passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
