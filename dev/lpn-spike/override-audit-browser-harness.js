// A SCENARIO'S OWN OVERRIDES, COUNTED AND LISTED, IN A REAL CHROMIUM (Task 800). Run with:
//   node dev/lpn-spike/override-audit-browser-harness.js   (takes the browser lock itself)
//
// Tom, 2026-10-15, on his Fotobi project, scenario "1-hr drain w pump off", shown as 24 overrides
// beside its siblings' 23: *"I don't know how to see a tidy list of overrides to audit ... that count
// seems inflated ... I should see the count of only the present overrides, not the inherited
// overrides. I count 13 diameter overrides, 1 text override, and 2 calculation overrides."*
//
// fixtures/fotobi-override-audit.epp is the file he sent that day (~/tom-files/2026-10-15), unchanged;
// the harness only opens it in "1-hr drain w pump off" with Recalculate off.
//   O1  the count beside each scenario (the Scenarios menu, the status strip) is its OWN overrides:
//       EPS 5, EPS Pump off 5, 1-hr 17, 8-hr, 12-hr and 16-hr 16 each. 1-hr's 17 is Tom's 16 plus one
//       he did not see: junction J-NE-S-3's Demand, an override holding 1 gpm, the same as Base's.
//       (His "2 calculation" are the demand multiplier, 26, and the default pattern, P1; the model
//       files the default pattern under Demand, as Bentley does.) The 24 counted what the scenario
//       inherits: EPS Pump off's Active topology (2) and Initial settings (2 + EPS's 2), the run time
//       from EPS's calculation set (1);
//   O2  the Scenario manager's Scenarios tree has "List overrides", greyed on Base, saying why;
//   O3  pressed on 1-hr it lists the 17, grouped by category and alternative, in category order:
//       Physical (13), Demand (2), Text (1), Calculation (1), and the groups add up to the count;
//   O4  each row: the asset, the field as the Tables pane heads it, this scenario's value and the
//       value it replaces (a diameter's Base value; the multiplier's project value; a dash for no
//       default pattern), an override equal to it marked "(same)"; nothing reads "1 overrides";
//   O5  clicking an asset's ID closes the list and goes to it on the map, selected.
//   O6  a yes/no reads in words both ways (a pump switched off: No, replacing Yes); and deleting an
//       alternative says the number of overrides the list showed for it (13, 2, 1).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_OVLIST_LOCKED';
const NAME = 'override-audit-browser-harness';
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
const ONE_HR = '1-hr drain w pump off';
const WANT = { 'EPS': 5, 'EPS Pump off': 5, [ONE_HR]: 17, '8-hr drain w pump off': 16, '12-hr drain w pump off': 16, '16-hr drain w pump off': 16 };
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
		const d = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'fotobi-override-audit.epp'), 'utf8'));
		d.project = Object.assign({}, d.project, { activeScenario: 's3' });
		d.settings.autoRun = false;
		a = await Session.open(browser, 'A', { serviceWorkers: 'block' });
		page = a.page;
		page.on('pageerror', (e) => errors.push(String(e && e.message)));
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); localStorage.setItem('lpn_scnbasic', 'off'); }, JSON.stringify(d));
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
		await page.setViewportSize({ width: 1600, height: 1000 });
		await a.settle(2500);
		const L = (k) => a.lang(k);
		const settle = (ms) => a.settle(ms);
		const click = async (sel) => { await page.evaluate((s) => document.querySelector(s).dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })), sel); await settle(500); };
		const rowOf = (name) => page.locator('#lpn_sm_tree .lpn-sm-row', { has: page.locator('.lpn-sm-name', { hasText: new RegExp('^' + name.replace(/[-]/g, '\\-') + '$') }) }).first();
		const clickRow = async (name) => { await rowOf(name).locator('.lpn-sm-name').click(); await settle(300); };
		const listBtn = () => page.evaluate(() => { const b = document.getElementById('lpn_sm_overrides'); return b ? { text: b.textContent, off: b.getAttribute('aria-disabled') === 'true', title: b.title } : null; });
		const dialogOpen = () => page.evaluate(() => { const box = document.getElementById('lpn_dialog'); return !!box && getComputedStyle(box).display !== 'none'; });

		console.log('--- O1. the count is the scenario\'s own ---');
		const base = await L('lpn_scenario_base');
		await page.click('#lpn_scenario_btn');
		await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		const rows = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).map((r) => r.textContent.replace(/^[✓\s]+/, '').trim()));
		Object.keys(WANT).forEach((n) => {
			ok('O1 the Scenarios menu reads "' + n + ' (' + WANT[n] + ')"', rows.indexOf(n + ' (' + WANT[n] + ')') >= 0, JSON.stringify(rows.filter((r) => r.indexOf(n) === 0)));
		});
		ok('O1 ...and Base, with no count', rows.indexOf(base) >= 0);
		const strip = await page.evaluate(() => document.getElementById('lpn_scenario_btn').textContent);
		ok('O1 the status strip reads "' + (await L('lpn_scenario_overrides')) + ': 17" in ' + ONE_HR, strip.indexOf(ONE_HR) >= 0 && strip.indexOf((await L('lpn_scenario_overrides')) + ': 17') >= 0, strip);
		for (const r of await page.$$('#lpn_menu_list button.lpn-menu-row')) {
			if ((await r.textContent()).trim() === (await L('lpn_sm_menu')).trim()) { await r.click(); break; }
		}
		await settle(900);
		ok('O1 the Scenario manager is open', await page.evaluate(() => getComputedStyle(document.getElementById('lpn_sm_box')).display !== 'none'));

		console.log('--- O2. the command ---');
		const LO = await L('lpn_sm_list_overrides');
		await clickRow(base);
		let lb = await listBtn();
		ok('O2 the Scenarios tree has a "' + LO + '" button', !!lb && lb.text === LO && LO === 'List overrides', JSON.stringify(lb));
		ok('O2 ...greyed on Base, saying why', lb.off === true && lb.title === await L('lpn_sm_list_overrides_none'), JSON.stringify(lb));
		await clickRow(ONE_HR);
		lb = await listBtn();
		ok('O2 ...live on ' + ONE_HR, lb.off === false && lb.title === await L('lpn_sm_list_overrides_tip'), JSON.stringify(lb));
		await rowOf(ONE_HR).locator('.lpn-sm-name').click({ button: 'right' });
		await settle(400);
		const ctx = await page.evaluate(() => Array.from(document.querySelectorAll('.lpn-sm-menu [role=menuitem]')).map((e) => e.textContent.trim()));
		ok('O2 ...and a right-click row', ctx.indexOf(LO) >= 0, JSON.stringify(ctx));
		await page.keyboard.press('Escape');
		await page.evaluate(() => document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })));
		await settle(300);

		console.log('--- O3. the list, grouped ---');
		await click('#lpn_sm_overrides');
		ok('O3 the list opens in the dialog', await dialogOpen());
		const got = await page.evaluate(() => {
			const body = document.getElementById('lpn_dialog_body');
			return {
				title: document.getElementById('lpn_dialog_title').textContent,
				all: body.textContent,
				msg: (body.querySelector('.lpn-dialog-msg') || {}).textContent,
				heads: Array.from(body.querySelectorAll('.lpn-ovl-group')).map((g) => g.querySelector('.lpn-ff-summary').textContent),
				cols: Array.from(body.querySelectorAll('.lpn-ovl-group')[0].querySelectorAll('th')).map((t) => t.textContent),
				groups: Array.from(body.querySelectorAll('.lpn-ovl-group')).map((g) => ({ cat: g.getAttribute('data-cat'),
					rows: Array.from(g.querySelectorAll('tbody tr')).map((tr) => Array.from(tr.children).map((td) => td.textContent)) }))
			};
		});
		ok('O3 titled "' + (await L('lpn_ovl_title')).replace('{name}', ONE_HR) + '"', got.title === (await L('lpn_ovl_title')).replace('{name}', ONE_HR), got.title);
		ok('O3 the count it audits: "' + (await L('lpn_scenario_overrides')) + ': 17"', got.msg === (await L('lpn_scenario_overrides')) + ': 17', got.msg);
		const grp = (await L('lpn_ovl_group'));
		const head = async (catKey, alt, n) => grp.replace('{category}', await L(catKey)).replace('{alternative}', alt) + ' (' + n + ')';
		const wantHeads = [await head('lpn_alt_cat_physical', ONE_HR, 13), await head('lpn_alt_cat_demand', '1-hr drain w pumps off', 2),
			await head('lpn_alt_cat_text', ONE_HR, 1), await head('lpn_alt_cat_calculation', ONE_HR, 1)];
		ok('O3 four groups, in category order, named by category and alternative', JSON.stringify(got.heads) === JSON.stringify(wantHeads), JSON.stringify(got.heads));
		ok('O3 ...their rows add up to the count', got.groups.reduce((s, g) => s + g.rows.length, 0) === 17, JSON.stringify(got.groups.map((g) => g.rows.length)));
		ok('O3 the columns: Asset, Property, Override, Inherited value', JSON.stringify(got.cols) === JSON.stringify([await L('lpn_crit_col_asset'), await L('lpn_find_property'), await L('lpn_ovl_col_override'), await L('lpn_ovl_col_inherited')]), JSON.stringify(got.cols));

		console.log('--- O4. the rows ---');
		const phys = got.groups[0].rows, pipe = await L('lpn_tool_add_pipe');
		const dia = await L('lpn_field_diameter');
		ok('O4 thirteen pipe diameters, in ID order', phys.length === 13 && phys.every((r) => r[0].indexOf(pipe + ' L') === 0 && r[1].indexOf(dia) === 0) &&
			phys.map((r) => r[0].slice(pipe.length + 1)).join(',') === 'L7,L10,L11,L12,L15,L16,L17,L19,L20,L21,L22,L23,L24', JSON.stringify(phys.map((r) => r[0] + ' / ' + r[1])));
		const l10 = phys.filter((r) => r[0] === pipe + ' L10')[0], l7 = phys.filter((r) => r[0] === pipe + ' L7')[0];
		ok('O4 pipe L10: ' + dia + ', 2 replacing Base\'s 1.25', !!l10 && l10[1].indexOf(dia) === 0 && l10[2] === '2' && l10[3] === '1.25', JSON.stringify(l10));
		ok('O4 pipe L7: 1.75 replacing Base\'s 1', !!l7 && l7[2] === '1.75' && l7[3] === '1', JSON.stringify(l7));
		const dem = got.groups[1].rows;
		const jn = dem.filter((r) => r[0].indexOf('J-NE-S-3') >= 0)[0];
		ok('O4 the override Tom did not see: junction J-NE-S-3\'s Demand, 1 replacing Base\'s 1', !!jn && jn[0] === (await L('lpn_tool_add_junction')) + ' J-NE-S-3' && jn[2] === '1 ' + (await L('lpn_ovl_same')) && jn[3] === '1', JSON.stringify(dem));
		ok('O4 ...marked "' + (await L('lpn_ovl_same')) + '", with a tip saying it still counts', await page.evaluate(() => {
			const m = Array.from(document.querySelectorAll('#lpn_dialog_body .lpn-ovl-same'));
			return m.length === 1 && !!m[0].title;
		}));
		const pat = dem.filter((r) => r[0].indexOf('J-NE-S-3') < 0)[0];
		ok('O4 the default pattern P1, replacing none (a dash)', !!pat && pat[2] === 'P1' && pat[3] === '–', JSON.stringify(pat));
		const txt = got.groups[2].rows[0];
		ok('O4 the Text X42, its first line shown', !!txt && txt[0] === (await L('lpn_tool_add_text')) + ' X42' && txt[2].indexOf('Scenario: 1-hr drain w pump off') === 0 && txt[3].indexOf('Scenario: Base') === 0, JSON.stringify(txt));
		const calc = got.groups[3].rows[0];
		ok('O4 the demand multiplier, 26 replacing the project\'s 6.4', !!calc && calc[2] === '26' && calc[3] === '6.4', JSON.stringify(calc));
		ok('O4 nothing reads "1 overrides"', !/\b1 overrides\b/.test(got.all) && !/\(1\) overrides/.test(got.all));

		console.log('--- O5. an ID goes to the asset ---');
		const v0 = await page.evaluate(() => { const g = document.querySelector('#lpn_canvas g'); return g ? g.getAttribute('transform') : null; });
		await page.evaluate(() => { const b = document.querySelector('#lpn_dialog_body button[data-goto="link:L10"]'); b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); });
		await settle(900);
		ok('O5 the list closes', !(await dialogOpen()));
		const sel = await page.evaluate(() => document.querySelectorAll('#lpn_canvas .lpn-selected').length);
		ok('O5 ...and pipe L10 is selected on the map', sel === 1, String(sel));
		const v1 = await page.evaluate(() => { const g = document.querySelector('#lpn_canvas g'); return g ? g.getAttribute('transform') : null; });
		ok('O5 ...the map moved to it', v0 !== v1, JSON.stringify([v0, v1]));


		console.log('--- O6. a yes/no in words; Delete counts what the list shows ---');
		await clickRow('EPS Pump off');
		await click('#lpn_sm_overrides');
		const topo = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_dialog_body .lpn-ovl-group[data-cat="topology"] tbody tr')).map((tr) => Array.from(tr.children).map((td) => td.textContent)));
		const yes = await L('lpn_settings_table_yes'), no = await L('lpn_settings_table_no');
		ok('O6 EPS Pump off: each pump switched off reads "' + no + '", replacing "' + yes + '" (never a dash)', topo.length === 2 && topo.every((r) => r[2] === no && r[3] === yes), JSON.stringify(topo));
		await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#lpn_dialog_buttons button'))[0]; b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); });
		await settle(500);
		// Deleting 1-hr (Basic mode off) keeps its alternatives, unused; deleting one then asks, counting.
		await clickRow(ONE_HR);
		await click('#lpn_sm_del');
		await page.evaluate(() => { const b = Array.from(document.querySelectorAll('#lpn_dialog_buttons button'))[0]; b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); });
		await settle(800);
		const goes = await L('lpn_scenario_delete_goes');
		for (const [tree, name, n] of [['physical', ONE_HR, 13], ['demand', '1-hr drain w pumps off', 2], ['calculation', ONE_HR, 1]]) {
			await page.selectOption('#lpn_sm_tree_select', tree);
			await settle(500);
			await clickRow(name);
			await click('#lpn_sm_del');
			const q = await page.evaluate(() => { const m = document.querySelector('#lpn_dialog .lpn-dialog-msg'); return m ? m.textContent : ''; });
			ok('O6 deleting the ' + tree + ' alternative ' + name + ' says ' + n + ' go, as the list showed', q.indexOf(goes.replace('{n}', String(n))) >= 0, q);
			await page.evaluate((c) => { const b = Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).find((x) => x.textContent.trim() === c); if (b) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); } }, await L('lpn_cancel'));
			await settle(400);
		}

		ok('no page error', errors.length === 0, JSON.stringify(errors).slice(0, 400));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(NAME + ': ' + (failures ? failures + ' of ' + checks + ' FAILED' : checks + '/' + checks + ' checks passed'));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
