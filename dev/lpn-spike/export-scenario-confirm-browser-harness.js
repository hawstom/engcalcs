// EXPORTS TO .inp, GeoJSON AND DXF CONFIRM, NAME THE SCENARIO AND END IN ONE RECEIPT, IN A REAL
// CHROMIUM (Task 814, standard items 3, 5 and 6; Tom, 2026-10-18). Every command is reached through
// its real menu row, File > Export > Network.
//   node dev/lpn-spike/export-scenario-confirm-browser-harness.js   (takes the browser lock itself)
//
//   E1  A project of Base alone asks nothing, writes <project>.<ext>, and ends in a receipt dialog
//       naming the file, the scenario Base and the project.
//   E2  A project with Peak hour open asks first (the box names Peak hour and what is left),
//       Cancel writes nothing and shows no receipt, OK writes <project>-<scenario>.<ext> holding
//       Peak hour's values, and the receipt names Peak hour.
//   E3  The same on the Spanish page, so a hard-coded English fallback cannot pass: the question,
//       the receipt and the button are the strings the page itself supplies.
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = process.env.EC_REPO || path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_EXPCONFIRM_LOCKED';
const NAME = 'export-scenario-confirm-browser-harness';
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
const FORMATS = [
	{ key: 'lpn_file_export_item_inp', ext: 'inp' },
	{ key: 'lpn_file_export_item_geojson', ext: 'geojson' },
	{ key: 'lpn_file_export_item_dxf', ext: 'dxf' }
];
async function load(browser, Session, env, d, url) {
	const a = await Session.open(browser, NAME, { serviceWorkers: 'block', acceptDownloads: true, viewport: { width: 1600, height: 1000 } });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto(url);
	await a.page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); }, JSON.stringify(d));
	await a.reload();
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
	await a.settle(2500);
	return a;
}
async function openScenario(a, name) {
	await a.page.click('#lpn_scenario_btn');
	await a.page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
	await a.page.evaluate((n) => {
		const r = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row, #lpn_menu_list2 button.lpn-menu-row')).find((b) => b.textContent.indexOf(n) >= 0);
		if (r) { r.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); }
	}, name);
	await a.settle(1200);
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
		const net = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net3-Novato-CA-World.lwn'), 'utf8'));
		net.project = Object.assign({}, net.project, { name: 'Elm Street', activeScenario: 'base' });
		net.settings.engine = 'native';
		const multi = JSON.parse(JSON.stringify(net));
		// Pipe 20's roughness is 199 in Base and 123 in Peak hour: the one number each file must carry.
		multi.scenarios.push({ id: 's1', name: 'Peak hour', overrides: { 'l:20': { roughness: 123 } }, demandMultiplier: 3 });
		const solo = JSON.parse(JSON.stringify(net));
		solo.scenarios = solo.scenarios.filter((s) => s.isBase);

		const run = async (a, tag, project, scn, expectAsk) => {
			const L = (k) => a.lang(k);
			const goBtn = (await L('lpn_export_table_go')).trim(), cancelBtn = (await L('lpn_cancel')).trim(), okBtn = (await L('lpn_dialog_ok')).trim();
			const exportLabel = (await L('lpn_file_export_menu')).trim();
			const baseName = (await L('lpn_scenario_base')).trim();
			const scnName = scn || baseName;
			a.autoConfirmExport = false;   // this harness is about the question itself
			for (const f of FORMATS) {
				const row = (await L(f.key)).trim(), kind = row.replace(/…$/, '');
				const want = scn ? 'Elm-Street-' + scn.replace(/\s+/g, '-') + '.' + f.ext : 'Elm-Street.' + f.ext;
				const attempt = async (answer) => {
					let got = null;
					const w = a.page.waitForEvent('download', { timeout: answer === cancelBtn ? 2500 : 8000 }).then((x) => { got = x; }, () => {});
					await a.menuClickSub(exportLabel, row);
					await a.settle(600);
					const asked = await a.dialog();
					if (expectAsk && asked && asked.buttons.indexOf(goBtn) >= 0) {
						if (answer === 'none') { return { asked, got: () => got, w }; }
						await a.dialogClick(answer);
					}
					await w;
					await a.settle(500);
					return { asked, got: () => got, w };
				};
				if (expectAsk) {
					const r = await attempt(cancelBtn);
					const lead = (await L('lpn_export_confirm_lead')).replace('{format}', kind).replace('{n}', '2');
					ok(`${tag} ${kind}: asks first, with ${goBtn} and ${cancelBtn}`, !!r.asked && r.asked.buttons.join('|') === goBtn + '|' + cancelBtn, JSON.stringify(r.asked));
					ok(`${tag} ${kind}: the question names the scenario and what is left`, !!r.asked && r.asked.text.indexOf(lead) >= 0
						&& r.asked.text.indexOf((await L('lpn_export_holds_scenario')).replace('{scenario}', scn).trim()) >= 0, r.asked && r.asked.text);
					ok(`${tag} ${kind}: Cancel writes nothing`, !r.got());
					const after = await a.dialog();
					ok(`${tag} ${kind}: Cancel leaves no receipt`, !after, after && after.text.slice(0, 80));
				}
				const r2 = await attempt(goBtn);
				const dl = r2.got();
				ok(`${tag} ${kind}: ${expectAsk ? goBtn + ' writes' : 'no question, and'} ${want}`, !!dl && dl.suggestedFilename() === want, dl ? dl.suggestedFilename() : 'no file');
				if (!expectAsk) {
					ok(`${tag} ${kind}: no question was asked`, !(r2.asked && r2.asked.buttons.indexOf(goBtn) >= 0), JSON.stringify(r2.asked));
				}
				const text = dl ? fs.readFileSync(await dl.path(), 'latin1') : '';
				// Pipe 20's roughness as this file states it: 123 in Peak hour, 199 in Base.
				const rough = (t) => {
					if (f.ext === 'inp') { const m = /^\s*20\s+3\s+20\s+\S+\s+\S+\s+(\S+)/m.exec(t); return m && m[1]; }
					if (f.ext === 'geojson') {
						try { const g = JSON.parse(t).features.find((x) => x.properties && String(x.properties.name) === "20" && x.properties.link_type === "Pipe" && x.properties.roughness !== undefined); return g && String(g.properties.roughness); } catch (e) { return 'unparsed'; }
					}
					const lines = t.split(/\r?\n/).map((x) => x.trim());
					return lines.indexOf(scn ? '123' : '199') >= 0 ? (scn ? '123' : '199') : null;
				};
				const got = rough(text);
				ok(`${tag} ${kind}: the file holds ${scn || baseName}'s values (roughness ${scn ? 123 : 199})`, String(got) === (scn ? '123' : '199'), String(got));
				const rcpt = await a.dialog();
				const head = (await L('lpn_export_receipt_heading')).split('{file}').join(want).split('{scenario}').join(scnName).split('{project}').join('Elm Street');
				ok(`${tag} ${kind}: one receipt dialog names the file, the scenario and the project`, !!rcpt && rcpt.text.indexOf(head) === 0, rcpt && rcpt.text.slice(0, 160));
				ok(`${tag} ${kind}: and says it is an export, not a save`, !!rcpt && rcpt.text.indexOf((await L('lpn_export_receipt_note')).trim()) >= 0);
				if (scn) {
					ok(`${tag} ${kind}: and says what the file leaves behind`, !!rcpt && rcpt.text.indexOf((await L('lpn_export_holds_scenario')).replace('{scenario}', scn).trim()) >= 0);
				} else {
					ok(`${tag} ${kind}: and, with Base alone, claims nothing is left behind`, !!rcpt && rcpt.text.indexOf((await L('lpn_export_holds_base')).trim()) < 0);
				}
				ok(`${tag} ${kind}: the receipt has the one OK button`, !!rcpt && rcpt.buttons.join('|') === okBtn, rcpt && rcpt.buttons.join('|'));
				if (rcpt) { await a.dialogClick(okBtn); }
				ok(`${tag} ${kind}: OK dismisses it`, !(await a.dialog()));
			}
		};

		console.log('--- E1. a project of Base alone (English) ---');
		let a = await load(browser, Session, env, solo, 'Looped-Network.php?ec_nolog=1');
		a.page.on('pageerror', (e) => errors.push(String(e && e.message)));
		await run(a, 'E1', solo, null, false);

		console.log('--- E2. Peak hour open (English) ---');
		a = await load(browser, Session, env, multi, 'Looped-Network.php?ec_nolog=1');
		a.page.on('pageerror', (e) => errors.push(String(e && e.message)));
		await openScenario(a, 'Peak hour');
		await run(a, 'E2', multi, 'Peak hour', true);

		console.log('--- E3. the Spanish page ---');
		a = await load(browser, Session, env, multi, 'Looped-Network.php?ec_nolog=1&lang=es');
		a.page.on('pageerror', (e) => errors.push(String(e && e.message)));
		const esGo = (await a.lang('lpn_export_table_go')).trim(), esMenu = (await a.lang('lpn_file_export_menu')).trim();
		ok('the page is Spanish: its Export menu is not the English word', esMenu !== 'Export', esMenu);
		await openScenario(a, 'Peak hour');
		await run(a, 'E3', multi, 'Peak hour', true);
		ok('E3 the question button is the page\'s own (' + esGo + ')', esGo.length > 0);
		ok('no page error', errors.length === 0, JSON.stringify(errors).slice(0, 400));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
