// RESULTS BY ASSET, ONE COLUMN PER SCENARIO, IN A REAL CHROMIUM (Task 752, step 1).
//   node dev/lpn-spike/scenario-results-by-asset-browser-harness.js   (takes the browser lock itself)
// Net1 with three scenarios (Base, Max day at 1.8 times the demand, Big main with pipe 10 at 24 in.),
// Max day open. Water > Reports > Scenario comparison, then the Results by asset table under it.
//   S1  Steady state: each cell equals what the Tables pane shows when that scenario is open and
//       solved -- junction pressures, the tank and reservoir heads, pipe flows, the pump's head.
//   S2  Copy puts tab-separated text on the clipboard, units in the headings, full numbers; Download
//       CSV gives one file per click with the same headings and numbers.
//   S3  The open scenario and its results on screen are untouched by the comparison.
//   S4  Stop, pressed while the scenarios are solving, keeps what was finished and says so.
//   S5  A 24-hour run: a scenario's column is that scenario's frame at the time step on screen.
//   S6  ?lang=es: the asset names come out in Spanish and the table and Copy still work.
//   S7  A scenario that cannot be solved keeps blank columns and is named in a note; one that did
//       not converge is marked in the heading, on screen and in the copy; columns follow a stored
//       scenario order, not the alphabet.
//   S8  Recalculate off, open scenario switched: the box says its column is solved from the
//       current inputs and may differ from the results on screen.
// The Demand column is the one that moves with the scenario swap alone (the solve result does not
// carry it), so S1 asserts it against the demands in the file times each scenario's multiplier:
// with the swap removed, every column reads the open scenario's multiplier and S1 fails.
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = process.env.EC_REPO || path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SCNRES_LOCKED';
const NAME = 'scenario-results-by-asset-browser-harness';
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
// One CSV line into its fields: quoted fields may hold commas and doubled quotes.
function csvCells(line) {
	const out = [];
	let cur = '', q = false;
	for (let i = 0; i < line.length; i++) {
		const c = line[i];
		if (q) {
			if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') { q = false; } else { cur += c; }
		} else if (c === '"') { q = true; } else if (c === ',') { out.push(cur); cur = ''; } else { cur += c; }
	}
	out.push(cur);
	return out;
}
function project(steady) {
	const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8'));
	d.scenarios.push({ id: 'smax', name: 'Max day', overrides: {}, demandMultiplier: 1.8 });
	d.scenarios.push({ id: 'sbig', name: 'Big main', overrides: { 'l:10': { diameter: 24 } } });
	d.project = Object.assign({}, d.project, { name: 'Elm Street', activeScenario: 'smax' });
	if (steady) {
		d.times.duration = 0; d.times.text.duration = '0:00';
		d.settings.engine = 'native';
	} else {
		// A run that ends at 2:00, read with 6:00 on screen: it shows its last step and says so.
		d.scenarios.push({ id: 'sshort', name: 'Short', overrides: {}, times: { duration: 7200, text: { duration: '2:00' } } });
	}
	return d;
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	let a = null;
	try {
		const open = async (d, query) => {
			if (a) { await a.close(); }
			a = await Session.open(browser, 'A', { serviceWorkers: 'block', acceptDownloads: true });
			await a.context.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
			const page = a.page;
			await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
			await a.goto('Looped-Network.php?ec_nolog=1' + (query || ''));
			await page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); }, JSON.stringify(d));
			await a.reload();
			await a.answerTrainingPanel().catch(() => {});
			await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
			await page.setViewportSize({ width: 1600, height: 1000 });
			await a.settle(2500);
			return page;
		};
		const L = (k) => a.lang(k);
		const clickRow = (sel, text) => a.page.evaluate(([s, t]) => {
			const r = Array.from(document.querySelectorAll(s)).find((b) => b.textContent.replace(/[▸✓\s]+$/, '').replace(/^[✓\s]+/, '').trim().indexOf(t) === 0);
			if (r) { r.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); }
			return !!r;
		}, [sel, text]);
		const openCompare = async () => {
			await a.page.click('#lpn_menu_project');
			await a.page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			await clickRow('#lpn_menu_list button.lpn-menu-row', (await L('lpn_reports_menu')).trim());
			await a.page.waitForSelector('#lpn_menu_popup2', { state: 'visible' });
			await clickRow('#lpn_menu_list2 button.lpn-menu-row', (await L('lpn_scncmp_title')).trim());
			await a.page.waitForSelector('#lpn_scnres_table', { state: 'attached', timeout: 60000 });
			await a.settle(300);
		};
		const closeCompare = () => a.page.evaluate(() => document.getElementById('lpn_scncmp_close').click());
		// The Results by asset table as text: headings and rows.
		const resTable = () => a.page.evaluate(() => {
			const t = document.getElementById('lpn_scnres_table');
			if (!t) { return null; }
			const heads = Array.from(t.querySelectorAll('thead th')).map((th) => th.textContent.replace(/[▲▼↑↓]/g, '').trim());
			const rows = Array.from(t.querySelectorAll('tbody tr')).map((tr) => Array.from(tr.children).map((td) => td.textContent.trim()));
			return { heads, rows };
		});
		const chooseKind = async (kind, qs) => {
			await a.page.selectOption('#lpn_scnres_kind', kind);
			await a.settle(200);
			for (const q of qs) {
				const on = await a.page.$eval('#lpn_scnres input[value="' + q + '"]', (e) => e.checked);
				if (!on) { await a.page.click('#lpn_scnres input[value="' + q + '"]'); await a.settle(150); }
			}
			const all = await a.page.$$eval('#lpn_scnres input[type=checkbox]', (es) => es.map((e) => [e.value, e.checked]));
			for (const [v, c] of all) {
				if (c && qs.indexOf(v) < 0) { await a.page.click('#lpn_scnres input[value="' + v + '"]'); await a.settle(150); }
			}
		};
		const switchTo = async (name) => {
			await a.page.click('#lpn_scenario_btn');
			await a.page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			const hit = await clickRow('#lpn_menu_list button.lpn-menu-row', name);
			await a.settle(1500);
			return hit;
		};
		const paneCells = (kind, key) => a.page.evaluate(([k, c]) => {
			const out = {};
			Array.from(document.querySelectorAll('#lpn_pane_' + k + ' td.lpn-pane-col-' + c)).forEach((td) => {
				if (td._lpnPaneId !== undefined) { out[td._lpnPaneId] = td.textContent.trim(); }
			});
			return out;
		}, [kind, key]);
		const showPane = async (kind) => {
			const open = await a.page.evaluate(() => { const p = document.getElementById('lpn_pane'); return !!p && p.offsetParent !== null && p.getBoundingClientRect().height > 30; });
			if (!open) { await a.toolbarClick(await L('lpn_pane_toggle')); await a.settle(500); }
			await a.page.click('#lpn_pane_tab_' + kind);
			await a.settle(700);
		};
		const activeName = () => a.page.evaluate(() => (document.getElementById('lpn_scenario_btn') || {}).textContent.trim());
		// The column of the table that holds quantity label q (by its heading text) in scenario s.
		// A heading's scenario part may carry a time or a mark after the name: "Max day (6:00)".
		const colOf = (t, qLabel, s) => t.heads.findIndex((h) => {
			if (h.indexOf(qLabel + ' (') !== 0) { return false; }
			const tail = h.slice(h.indexOf('), ') + 3);
			return tail === s || tail.indexOf(s + ' (') === 0;
		});

		// ================================ STEADY STATE ================================
		let page = await open(project(true));
		console.log('\n--- S3 before: the open scenario and its results ---');
		await showPane('junctions');
		const before = { name: await activeName(), p: await paneCells('junctions', 'pressure'),
			doc: await page.evaluate(() => localStorage.getItem('lpn_project_hover')) };
		ok('Max day is the open scenario', before.name.indexOf('Max day') >= 0, before.name);
		ok('the Tables pane shows Max day pressures', Object.keys(before.p).length === 9 && Object.values(before.p).every((v) => v !== ''), JSON.stringify(before.p));

		console.log('\n--- S1: Water > Reports > Scenario comparison, Results by asset ---');
		await openCompare();
		const P = (await L('lpn_result_pressure')), H = await L('lpn_result_head'), F = await L('lpn_result_flow'), PH = await L('lpn_result_pump_head');
		let t = await resTable();
		ok('the default table is junction pressure in three scenarios', t && t.heads.length === 4 && t.rows.length === 9, t && t.heads.join(' | '));
		ok('the headings name the unit and the scenario', t && t.heads[1] === P + ' (psi), Base' && t.heads[2] === P + ' (psi), Big main' && t.heads[3] === P + ' (psi), Max day', t && t.heads.join(' | '));
		const views = {};
		await chooseKind('junctions', ['pressure', 'head', 'demandActual']);
		views.junctions = await resTable();
		ok('three results checked give nine scenario columns', views.junctions.heads.length === 10, views.junctions.heads.join(' | '));
		// Independent of the page: Net1's base demands times pattern 1 at 0:00 (1.0) times the multiplier.
		const D = await L('bpn_demand'), net1 = project(true), mult = { 'Base': 1, 'Max day': 1.8, 'Big main': 1 };
		for (const s of ['Base', 'Max day', 'Big main']) {
			const dc = colOf(views.junctions, D, s);
			const bad = views.junctions.rows.filter((r) => {
				const n = net1.nodes.find((x) => x.id === r[0]), want = n._demand * mult[s];
				return !(Math.abs(+r[dc] - want) <= 0.006 * Math.max(1, want));
			});
			ok(s + ': every junction demand is the file\'s base demand times ' + mult[s], dc > 0 && bad.length === 0,
				bad.slice(0, 3).map((r) => r[0] + '=' + r[dc]).join(' '));
		}
		ok('no Recalculate-off note while Recalculate is on', (await page.evaluate(() => document.getElementById('lpn_scnres').textContent)).indexOf(await L('lpn_scnres_stale').then((x) => x.slice(0, 20))) < 0);
		await chooseKind('tanks', ['head']);
		views.tanks = await resTable();
		await chooseKind('reservoirs', ['head']);
		views.reservoirs = await resTable();
		await chooseKind('pipes', ['flow']);
		views.pipes = await resTable();
		await chooseKind('pumps', ['headloss']);
		views.pumps = await resTable();

		// Copy and Download CSV of the pipe-flow view.
		console.log('\n--- S2: Copy and Download CSV ---');
		await chooseKind('pipes', ['flow']);
		// Task 829: the box's shared row (Download CSV, Copy HTML, Print report) replaced this section's own
		// Copy and Download CSV. The CSV holds the comparison table and then Results by asset, the
		// last block, with the unrounded numbers.
		const dls = [];
		page.on('download', (d) => dls.push(d));
		await page.click('#lpn_scncmp_csv');
		await a.settle(1200);
		ok('Download CSV gives exactly one file per click', dls.length === 1, dls.length);
		const csvFile = dls.length ? fs.readFileSync(await dls[0].path(), 'utf8').replace(/^\uFEFF/, '') : '';
		const csvBlocks = csvFile.replace(/\r\n$/, '').split('\r\n\r\n');
		const resBlock = csvBlocks[csvBlocks.length - 1].split('\r\n');
		const copied = resBlock.map((l) => csvCells(l).join('\t')).join('\n');
		const lines = copied.split('\n'), headRow = lines[0].split('\t');
		ok('the copied text is tab-separated, one line per pipe plus the headings', lines.length === 13 && headRow.length === 4, lines.length + ' lines, ' + headRow.length + ' columns');
		ok('the copied headings carry the units', headRow[1] === F + ' (gpm), Base' && headRow[3] === F + ' (gpm), Max day', headRow.join(' | '));
		const pipeRow10 = lines.find((l) => l.split('\t')[0] === '10') || '';
		const shown10 = views.pipes.rows.find((r) => r[0] === '10') || [];
		const full10 = pipeRow10.split('\t');
		ok('a copied number is the full one, the box shows it rounded', full10.length === 4 && /^-?\d+(\.\d+)?$/.test(full10[1]) &&
			full10[1].length > shown10[1].length && Math.abs(+full10[1] - +shown10[1]) < 1, full10.join(' | ') + '  vs  ' + shown10.join(' | '));
		ok('the copied flows carry the minus sign of a reversed one', lines.slice(1).some((l) => /^[^\t]*\t-\d/.test(l)), lines.slice(1).map((l) => l.split('\t')[1]).join(' '));
		ok('the table carries the sign note', (await page.evaluate(() => document.getElementById('lpn_scnres').textContent)).indexOf((await L('lpn_scnres_flow_tip')).slice(0, 30)) >= 0);
		if (dls.length) {
			ok('the CSV is named for the project, the open scenario and the box', dls[0].suggestedFilename() === 'Elm_Street-Max_day-Scenario_comparison.csv', dls[0].suggestedFilename());
			ok('a heading with a comma in it is quoted', resBlock[0].indexOf('"' + F + ' (gpm), Base"') >= 0, resBlock[0]);
		}

		console.log('\n--- S3 after: nothing on screen moved ---');
		await closeCompare();
		await showPane('junctions');
		const after = { name: await activeName(), p: await paneCells('junctions', 'pressure'),
			doc: await page.evaluate(() => localStorage.getItem('lpn_project_hover')) };
		ok('the open scenario is still Max day', after.name === before.name, after.name);
		ok('its pressures in the Tables pane are unchanged', JSON.stringify(after.p) === JSON.stringify(before.p));
		ok('the stored project is unchanged', after.doc === before.doc);
		ok('...and Max day column equals the Max day pressures on screen',
			views.junctions.rows.every((r) => r[colOf(views.junctions, P, 'Max day')] === before.p[r[0]]),
			JSON.stringify(views.junctions.rows.slice(0, 2)));

		// S1 proper: open each scenario in turn, let the page solve it, and read the Tables pane.
		for (const s of ['Base', 'Max day', 'Big main']) {
			ok('switched to ' + s, await switchTo(s));
			await showPane('junctions');
			const pj = await paneCells('junctions', 'pressure'), hj = await paneCells('junctions', 'head');
			const pc = colOf(views.junctions, P, s), hc = colOf(views.junctions, H, s);
			ok(s + ': every junction pressure equals the Tables pane', pc > 0 && views.junctions.rows.every((r) => r[pc] === pj[r[0]]),
				views.junctions.rows.map((r) => r[0] + '=' + r[pc] + '/' + pj[r[0]]).slice(0, 3).join(' '));
			ok(s + ': every junction head equals the Tables pane', hc > 0 && views.junctions.rows.every((r) => r[hc] === hj[r[0]]));
			await showPane('tanks');
			const ht = await paneCells('tanks', 'head');
			ok(s + ': the tank head equals the Tables pane', views.tanks.rows.length === 1 && views.tanks.rows[0][colOf(views.tanks, H, s)] === ht['2'], JSON.stringify(views.tanks.rows) + ' ' + JSON.stringify(ht));
			await showPane('reservoirs');
			const hr = await paneCells('reservoirs', 'pressure');
			ok(s + ': a reservoir row is there', views.reservoirs.rows.length === 1 && views.reservoirs.rows[0][0] === '9', JSON.stringify(hr));
			await showPane('pipes');
			const fp = await paneCells('pipes', 'flow');
			const fc = colOf(views.pipes, F, s);
			ok(s + ': every pipe flow equals the Tables pane', fc > 0 && views.pipes.rows.every((r) => r[fc].replace(/^[+-]/, '') === fp[r[0]]),
				views.pipes.rows.map((r) => r[0] + '=' + r[fc] + '/' + fp[r[0]]).slice(0, 3).join(' '));
			ok(s + ': every pipe flow cell leads with + or -, or is a bare zero', views.pipes.rows.every((r) => /^[+-]/.test(r[fc]) || +r[fc] === 0), views.pipes.rows.map((r) => r[fc]).join(' '));
			await showPane('pumps');
			const hp = await paneCells('pumps', 'headloss');
			ok(s + ': the pump head equals the Tables pane', views.pumps.rows[0][colOf(views.pumps, PH, s)] === hp['9'], JSON.stringify(views.pumps.rows) + ' ' + JSON.stringify(hp));
		}
		{
			const fb = colOf(views.pipes, F, 'Base'), fm = colOf(views.pipes, F, 'Max day');
			const flipped = views.pipes.rows.filter((r) => /^-/.test(r[fb]) !== /^-/.test(r[fm]));
			ok('a pipe that reverses between scenarios shows opposite signs (Base vs Max day)',
				flipped.length > 0 && flipped.every((r) => /^[+-]/.test(r[fb]) && /^[+-]/.test(r[fm])),
				flipped.map((r) => r[0] + ': ' + r[fb] + ' / ' + r[fm]).join('; '));
			ok('a positive flow is not shown as a magnitude only',
				views.pipes.rows.some((r) => /^\+\d/.test(r[fb])) && views.pipes.rows.some((r) => /^-\d/.test(r[fb])));
		}
		const mx = colOf(views.junctions, P, 'Max day'), bs = colOf(views.junctions, P, 'Base');
		ok('more demand is less pressure at every junction', views.junctions.rows.every((r) => +r[mx] < +r[bs]));

		console.log('\n--- S4: Stop ---');
		const stopped = await page.evaluate(() => {
			const p = document.querySelector('#lpn_menu_project');
			return !!p;
		});
		await page.click('#lpn_menu_project');
		await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		await clickRow('#lpn_menu_list button.lpn-menu-row', (await L('lpn_reports_menu')).trim());
		await page.waitForSelector('#lpn_menu_popup2', { state: 'visible' });
		// The menu row and the Stop press in one turn of the page, before the first scenario is solved.
		const stopShown = await page.evaluate((label) => {
			const r = Array.from(document.querySelectorAll('#lpn_menu_list2 button.lpn-menu-row')).find((b) => b.textContent.trim().indexOf(label) === 0);
			r.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
			const s = document.getElementById('lpn_scncmp_stop'), prog = document.getElementById('lpn_scncmp_progress');
			const seen = { stop: !!s, prog: prog ? prog.textContent : '' };
			if (s) { s.click(); }
			return seen;
		}, (await L('lpn_scncmp_title')).trim());
		await a.settle(800);
		ok('a run in progress shows its count and a Stop button', stopped && stopShown.stop && stopShown.prog === 'Solving scenario 1 of 3…', JSON.stringify(stopShown));
		const stopNote = await page.evaluate(() => (document.getElementById('lpn_scncmp_report') || {}).textContent || '');
		ok('Stop keeps what was finished and says so', stopNote.indexOf('Stopped after 0 of 3 scenarios.') >= 0, stopNote.slice(0, 160));
		ok('...with no results table for scenarios never solved', !(await page.$('#lpn_scnres_table')));
		await closeCompare();
		ok('no uncaught page errors (steady)', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));

		// ================================ A 24-HOUR RUN ================================
		console.log('\n--- S5: a run, read at the time step on screen ---');
		page = await open(project(false));
		await page.evaluate(() => window.EngCalcs.lpnTimeGoTo(6 * 3600));
		await a.settle(1500);
		const shownT = await page.evaluate(() => window.EngCalcs.lpnTimeNow());
		ok('the transport is at 6:00', shownT === 21600, shownT);
		await openCompare();
		await chooseKind('junctions', ['pressure']);
		const run = await resTable();
		const note = await page.evaluate(() => (document.getElementById('lpn_scnres') || {}).textContent || '');
		ok('the table says which time step it shows', note.indexOf((await L('lpn_scnres_time_note')).replace('{time}', '6:00')) >= 0, note.slice(-160));
		ok('each run column names the time it was read at', run.heads[1] === P + ' (psi), Base (6:00)', run.heads.join(' | '));
		ok('a run shorter than the time on screen names its last step', run.heads.indexOf(P + ' (psi), Short (2:00)') > 0, run.heads.join(' | '));
		await chooseKind('tanks', ['head']);
		const runTank = await resTable();
		await closeCompare();
		for (const s of ['Base', 'Max day']) {
			await switchTo(s);
			await page.evaluate(() => window.EngCalcs.lpnTimeGoTo(6 * 3600));
			await a.settle(1500);
			await showPane('junctions');
			const pj = await paneCells('junctions', 'pressure');
			const pc = colOf(run, P, s);
			ok(s + ' at 6:00: every junction pressure equals the Tables pane', pc > 0 && run.rows.every((r) => r[pc] === pj[r[0]]),
				run.rows.map((r) => r[0] + '=' + r[pc] + '/' + pj[r[0]]).slice(0, 3).join(' '));
			await showPane('tanks');
			const ht = await paneCells('tanks', 'head');
			ok(s + ' at 6:00: the tank head (a run result) equals the Tables pane', runTank.rows[0][colOf(runTank, H, s)] === ht['2'], JSON.stringify(runTank.rows) + ' ' + JSON.stringify(ht));
		}
		ok('no uncaught page errors (run)', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));

		// ================================ SPANISH ================================
		console.log('\n--- S6: ?lang=es ---');
		page = await open(project(true), '&lang=es');
		await openCompare();
		const es = await page.evaluate(() => ({
			opts: Array.from(document.querySelectorAll('#lpn_scnres_kind option')).map((o) => o.textContent),
			title: (document.querySelector('#lpn_scnres .lpn-ff-summary') || {}).textContent
		}));
		const esJ = await L('lpn_pane_tab_junctions');
		ok('the page is Spanish: Junctions is not the English word', esJ !== 'Junctions' && es.opts[0] === esJ, es.opts.join(' | '));
		ok('the section title is the Spanish page\'s own string (English until translated)', es.title === await L('lpn_scnres_title'), es.title);
		const esT = await resTable();
		ok('the Spanish table has nine junction rows and three scenarios', esT && esT.rows.length === 9 && esT.heads.length === 4, esT && esT.heads.join(' | '));
		ok('Spanish numbers use a point, as a spreadsheet reads them', esT && esT.rows.every((r) => /^-?\d+(\.\d+)?$/.test(r[1])), esT && esT.rows[0].join(' | '));
		const esDl = a.page.waitForEvent('download', { timeout: 10000 }).catch(() => null);
		await page.click('#lpn_scncmp_csv');
		const esF = await esDl;
		const esCsv = esF ? fs.readFileSync(await esF.path(), 'utf8') : '';
		const esBlocks = esCsv.replace(/\r\n$/, '').split('\r\n\r\n');
		ok('Download CSV works on the Spanish page', esBlocks[esBlocks.length - 1].split('\r\n').length === 10, esBlocks[esBlocks.length - 1].split('\r\n').length);
		ok('no uncaught page errors (es)', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));

		// ================================ FAILED, NOT CONVERGED, ORDER ================================
		console.log('\n--- S7: a scenario that fails, one that does not converge, stored order ---');
		const d7 = project(true);
		d7.scenarios = d7.scenarios.filter((x) => x.isBase);
		d7.scenarios.push({ id: 'strial', name: 'One trial', overrides: {}, settings: { settings: { hydraulics: { trials: 1, accuracy: 1e-9 } } } });
		d7.scenarios.push({ id: 'sdead', name: 'Dead', overrides: { 'n:9': { active: false }, 'n:2': { active: false } } });
		d7.project.activeScenario = 'base';
		d7.project.scenarioOrdered = true;   // One trial before Dead, which the alphabet would reverse
		page = await open(d7);
		await openCompare();
		const t7 = await resTable();
		const NC = await L('lpn_scnres_not_converged');
		ok('columns follow the stored scenario order', t7 && t7.heads[1].indexOf(', Base') > 0 && t7.heads[2].indexOf(', One trial') > 0 && t7.heads[3].indexOf(', Dead') > 0, t7 && t7.heads.join(' | '));
		ok('the scenario that cannot be solved keeps its column, blank', t7 && t7.heads[3] === P + ' (psi), Dead' && t7.rows.every((r) => r[3] === ''), t7 && t7.heads[3]);
		const n7 = await page.evaluate(() => document.getElementById('lpn_scnres').textContent);
		const failedLead = (await L('lpn_scnres_failed')).replace('{scenario}', 'Dead').split('{why}')[0];
		ok('...and a note names it and says why', n7.indexOf(failedLead) >= 0 && n7.indexOf(failedLead) + failedLead.length < n7.length, n7.slice(n7.indexOf('Dead'), n7.indexOf('Dead') + 160));
		ok('the scenario that did not converge is marked in its heading', t7 && t7.heads[2] === P + ' (psi), One trial ' + NC, t7 && t7.heads[2]);
		ok('...with a note saying what the mark means', n7.indexOf((await L('lpn_scnres_not_converged_note')).replace('{mark}', NC)) >= 0);
		const d7dl = a.page.waitForEvent('download', { timeout: 10000 }).catch(() => null);
		await page.click('#lpn_scncmp_csv');
		const d7f = await d7dl;
		const d7csv = d7f ? fs.readFileSync(await d7f.path(), 'utf8') : '';
		const d7blocks = d7csv.replace(/\r\n$/, '').split('\r\n\r\n');
		const h7 = csvCells(d7blocks[d7blocks.length - 1].split('\r\n')[0]);
		ok('the CSV heading carries the mark too', h7[2] === P + ' (psi), One trial ' + NC && h7[3] === P + ' (psi), Dead', h7.join(' | '));
		ok('no uncaught page errors (S7)', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));

		// ================================ RECALCULATE OFF ================================
		console.log('\n--- S8: Recalculate off, the open scenario switched ---');
		const d8 = project(true);
		d8.project.activeScenario = 'base';
		d8.settings.autoRun = false;
		page = await open(d8);
		await switchTo('Max day');   // the screen keeps Base's solve: a snapshot
		await openCompare();
		const n8 = await page.evaluate(() => document.getElementById('lpn_scnres').textContent);
		ok('the box says the open scenario\'s column is solved from the current inputs', n8.indexOf((await L('lpn_scnres_stale')).replace('{scenario}', 'Max day')) >= 0, n8.slice(-220));
		ok('no uncaught page errors (S8)', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally {
		if (a) { await a.close().catch(() => {}); }
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (failures === 0 ? 'ALL PASS' : failures + ' FAILURE(S)') + ' (' + checks + ' checks)');
	process.exit(failures === 0 ? 0 : 1);
}
main().catch((e) => { console.error(e); process.exit(1); });
