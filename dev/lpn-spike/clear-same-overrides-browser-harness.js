// CLEAR OVERRIDES EQUAL TO INHERITED: the Override manager's bulk button. Real Chromium.
//   node dev/lpn-spike/clear-same-overrides-browser-harness.js   (takes the browser lock itself)
//
// Sue's wish (dev/agents/utility-planning-engineer/wishlist.md, 2026-10-05, item 3): "'Clear local
// values equal to parent' bulk tool with a preview." The preview is the manager's own "(same)" rows.
//   C1  A child made with New scenario overrides pipe 10 and pipe 11 with Base's own diameters and
//       pipe 12 with a different one; the manager counts 3 and marks exactly two rows "(same)".
//   C2  The new button is on, asks with the count (2) and the scenario name; "No" changes nothing.
//   C3  Yes: the two same rows go, the different one stays, the count is 1, the stored project keeps
//       only L12, and the solved numbers are identical to before.
//   C4  The button is off when no row is marked "(same)".
//   C5  One Undo brings back all three rows, and the solved numbers are still identical.
//   C6  A Spanish page shows the button (English fallback text) and asks in the page's dialog.
'use strict';
const path = require('path');
const U = require('./scenario-ui-helper.js');
const NAME = 'clear-same-overrides-browser-harness';
U.takeBrowserLock(NAME, 'EC_CLEAR_SAME_LOCKED');

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAILED: ') + label + (detail === undefined ? '' : '   ' + detail));
}

async function main() {
	const env = require(path.join(U.REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { chromium } = require(path.join(U.REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const ctx = await U.openNet1(browser, NAME);
		const { a, P } = ctx;
		const L = (k) => U.lang(ctx, k);
		const settle = (ms) => a.settle(ms || 600);
		const press = (sel) => P.evaluate((s) => { const e = document.querySelector(s); e.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); }, sel);
		const pressDialog = (label) => P.evaluate((l) => { const b = Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).find((x) => x.textContent.trim() === l); b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 })); }, label);
		const scenarioMenu = async (label) => {
			await P.click('#lpn_scenario_btn');
			await P.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			let hit = false;
			for (const r of await P.$$('#lpn_menu_list button.lpn-menu-row')) {
				const t = (await r.textContent()).trim().replace(/^✓\s*/, '');
				if (t === label || t.replace(/\s*\(\d+\)$/, '') === label) { await r.click(); hit = true; break; }
			}
			if (!hit) { await P.keyboard.press('Escape'); throw new Error('no scenario menu row ' + label); }
			await settle(1200);
		};
		const dialog = () => P.evaluate(() => {
			const d = document.getElementById('lpn_dialog');
			if (!d || d.style.display !== 'block') { return null; }
			const body = document.getElementById('lpn_dialog_body');
			const same = body.querySelector('button.lpn-ovl-clearsame');
			return {
				msg: (body.querySelector('.lpn-dialog-msg') || {}).textContent,
				text: body.textContent,
				rows: body.querySelectorAll('tbody tr').length,
				marked: body.querySelectorAll('tbody tr .lpn-ovl-same').length,
				markedIds: Array.from(body.querySelectorAll('tbody tr')).filter((r) => r.querySelector('.lpn-ovl-same')).map((r) => r.children[1].textContent.trim()),
				allIds: Array.from(body.querySelectorAll('tbody tr')).map((r) => r.children[1].textContent.trim()),
				sameLabel: same ? same.textContent : null, sameOff: same ? same.disabled : null
			};
		});
		const askText = () => P.evaluate(() => { const d = document.getElementById('lpn_dialog'); return d && d.style.display === 'block' ? document.getElementById('lpn_dialog_body').textContent : null; });
		const solved = () => P.evaluate(() => JSON.stringify(EngCalcs.lpnSolveProbe && EngCalcs.lpnSolveProbe()));
		const MO = await L('lpn_sm_list_overrides');
		const openManage = async (name) => { await scenarioMenu(name); await scenarioMenu(MO); await settle(500); return dialog(); };
		const stored = () => U.storedProject(ctx);
		const ovKeys = async (name) => {
			const sv = await stored();
			const s = sv.scenarios.find((x) => x.name === name);
			const ids = s.alternatives && s.alternatives.physical;
			const h = ids ? (sv.alternatives || []).find((x) => x.id === ids) : s;
			return Object.keys((h && (h.values || h.overrides)) || {}).sort();
		};
		const dia = await L('lpn_field_diameter');

		console.log('--- C1. a child with two overrides equal to Base and one different ---');
		const baseDia = {};
		for (const id of ['10', '11', '12']) {
			await U.openProperties(ctx, 'link', id);
			baseDia[id] = await P.evaluate((t) => {
				const l = Array.from(document.querySelectorAll('#lpn_popup_fields label')).filter((x) => x.textContent.replace(/­/g, '').trim().indexOf(t) === 0)[0];
				return l && l.querySelector('input').value;
			}, dia);
			await P.evaluate(() => { const b = document.getElementById('lpn_popup_close'); if (b && b.offsetParent) { b.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); } });
			await settle(300);
		}
		const made = await U.createScenarioViaMenu(ctx);
		const CHILD = made.scenario.name;
		await U.editPropertyViaUI(ctx, { kind: 'link', id: '10', labelKey: 'lpn_field_diameter', value: baseDia['10'] });
		await U.editPropertyViaUI(ctx, { kind: 'link', id: '11', labelKey: 'lpn_field_diameter', value: baseDia['11'] });
		await U.editPropertyViaUI(ctx, { kind: 'link', id: '12', labelKey: 'lpn_field_diameter', value: String(parseFloat(baseDia['12']) + 2) });
		await settle(1200);
		const before = await solved();
		ok('C1 the solve probe holds a result', before && before.length > 100, String(before).slice(0, 80));
		let d = await openManage(CHILD);
		ok('C1 the manager counts 3 rows', !!d && d.rows === 3 && d.msg === (await L('lpn_scenario_overrides')) + ': 3', JSON.stringify(d && { rows: d.rows, msg: d.msg, base: baseDia }));
		ok('C1 exactly two rows are marked (same), pipes 10 and 11', !!d && d.marked === 2 && d.markedIds.every((t) => /\b1[01]\b/.test(t)) && !d.markedIds.some((t) => /\b12\b/.test(t)), JSON.stringify(d && d.markedIds));

		console.log('--- C2. the button asks first ---');
		ok('C2 the button reads "Clear overrides equal to inherited" and is on', !!d && d.sameLabel === 'Clear overrides equal to inherited' && d.sameOff === false, JSON.stringify(d && [d.sameLabel, d.sameOff]));
		await press('#lpn_dialog_body button.lpn-ovl-clearsame');
		await settle(500);
		const ask = await askText();
		const want = (await L('lpn_ovl_clear_same_ask')).replace('{n}', '2').replace('{name}', CHILD);
		ok('C2 it asks: ' + want, ask !== null && ask.indexOf(want) >= 0, String(ask));
		const labelNo = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).map((b) => b.textContent.trim()));
		await pressDialog(labelNo[labelNo.length - 1]);
		await settle(600);
		ok('C2 declining changes nothing: still 3 overrides stored', (await ovKeys(CHILD)).length === 3, JSON.stringify(await ovKeys(CHILD)));

		console.log('--- C3. Yes ---');
		d = await dialog() || await openManage(CHILD);
		await press('#lpn_dialog_body button.lpn-ovl-clearsame');
		await settle(500);
		await pressDialog(await L('lpn_dialog_ok'));
		await settle(1200);
		d = await dialog();
		ok('C3 the manager is back with 1 row, the different pipe 12, count 1', !!d && d.rows === 1 && /\b12\b/.test(d.allIds[0]) && d.msg === (await L('lpn_scenario_overrides')) + ': 1', JSON.stringify(d && [d.rows, d.allIds, d.msg]));
		const keys = await ovKeys(CHILD);
		ok('C3 the stored child keeps only l:12', keys.length === 1 && /12$/.test(keys[0]), JSON.stringify(keys));
		ok('C4 the button is off with no (same) row', !!d && d.sameOff === true, JSON.stringify(d && d.sameOff));
		await pressDialog(await L('lpn_dialog_ok'));
		await settle(500);
		// The Base diameter in the child's solve: pipe 10 and 11 read it again, pipe 12 is the override.
		const mid = await solved();
		ok('C3 the solved numbers are unchanged (pipes 10 and 11 had Base\'s own values)', mid === before, mid === before ? '' : 'differs, lengths ' + mid.length + ' / ' + before.length);

		console.log('--- C5. one Undo ---');
		await P.mouse.click(5, 5).catch(() => {}); await P.keyboard.press('Escape'); await P.keyboard.press('Control+z'); await settle(1200);
		const back = await ovKeys(CHILD);
		ok('C5 one Undo brings back all three overrides', back.length === 3, JSON.stringify(back));
		ok('C5 the solved numbers are still identical', (await solved()) === before);
		d = await openManage(CHILD);
		ok('C5 the manager shows 3 rows with 2 marked (same)', !!d && d.rows === 3 && d.marked === 2 && d.sameOff === false);
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 3).join(' | '));

		console.log('--- C6. a Spanish page ---');
		await a.goto('Looped-Network.php?lang=es');
		await a.answerTrainingPanel().catch(() => {});
		await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
		await settle(1500);
		ctx.strings = {};
		const MOes = await L('lpn_sm_list_overrides');
		await P.click('#lpn_scenario_btn');
		await P.waitForSelector('#lpn_menu_popup', { state: 'visible' });
		for (const r of await P.$$('#lpn_menu_list button.lpn-menu-row')) {
			if ((await r.textContent()).trim() === MOes) { await r.click(); break; }
		}
		await settle(800);
		d = await dialog();
		ok('C6 the Spanish page shows the button with 2 rows marked', !!d && d.marked === 2 && d.sameOff === false && !!d.sameLabel, JSON.stringify(d && [d.sameLabel, d.marked]));
		await press('#lpn_dialog_body button.lpn-ovl-clearsame');
		await settle(500);
		const askEs = await askText();
		ok('C6 it asks in the dialog with the count and name', askEs !== null && askEs.indexOf('(2)') >= 0 && askEs.indexOf(CHILD) >= 0, String(askEs));
		const lbl = await P.evaluate(() => Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).map((b) => b.textContent.trim()));
		await pressDialog(lbl[0]);
		await settle(1200);
		ok('C6 confirming there leaves 1 override', (await ovKeys(CHILD)).length === 1, JSON.stringify(await ovKeys(CHILD)));
		ok('no uncaught page errors on the Spanish page', a.errors.length === 0, a.errors.slice(0, 3).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
