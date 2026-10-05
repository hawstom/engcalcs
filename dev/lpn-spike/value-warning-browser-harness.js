// A ⚠ BESIDE AN UNREASONABLE STORED VALUE, IN A REAL CHROMIUM -- dev/value-warning.md. Run with:
//   node dev/lpn-spike/value-warning-browser-harness.js
//
// Sue (utility adviser): a scenario that switches the friction method without its own roughness
// values reads C = 130 as a Darcy-Weisbach roughness of 130, and it solves, with garbage. Tom,
// 2026-10-05: *"Yes. Add the glyph to every unreasonable value like a diameter over 150 inches or
// under 12 mm; a roughness under 10 for C, over 1 or under 0.001 for n or over 0.001 for e; etc."*
//
// Net1 (US units: inches, feet, C). Values are set across each threshold in the Tables pane and the
// ⚠ must appear and disappear there and in the Properties box; the typed number must never change;
// and C = 130 must carry a ⚠ the moment the method becomes Darcy-Weisbach, with no edit to it.
//
// DO NOT PREFIX THIS WITH `flock`: it takes /tmp/engcalcs-browser.lock itself.
'use strict';
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
if (process.env.EC_VALWARN_LOCKED !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { EC_VALWARN_LOCKED: '1' }) });
		if (r.status === 75) { console.error('value-warning-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0;
function ok(name, cond, extra) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
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
		// The cookie question stands over the bottom pane in a fresh profile; answering it posts and
		// reloads, so it is set aside instead, which is what a visitor's scroll past it amounts to.
		await page.evaluate(() => {
			let e = document.querySelector('.ec-consent-actions');
			while (e && getComputedStyle(e).position !== 'fixed') { e = e.parentElement; }
			if (e) { e.style.display = 'none'; }
		});

		// ---- the pure check, through its exposed name: the seam the scenario branches call ----
		const pure = await page.evaluate(() => {
			const w = EngCalcs.lpnValueWarning, k = (r) => (r ? r.key : null);
			return {
				d11: k(w('diameter', 0.011, 'hw')), d12: k(w('diameter', 0.012, 'hw')),
				d381: k(w('diameter', 3.81, 'hw')), d382: k(w('diameter', 3.82, 'hw')), dneg: k(w('diameter', -1, 'hw')),
				c130dw: k(w('roughness', 130, 'dw')), c130hw: k(w('roughness', 130, 'hw')),
				c9: k(w('roughness', 9, 'hw')), c201: k(w('roughness', 201, 'hw')),
				n013: k(w('roughness', 0.013, 'manning')), n0005: k(w('roughness', 0.0005, 'manning')), n2: k(w('roughness', 2, 'manning')),
				e0: k(w('roughness', 0, 'dw')), e15mm: k(w('roughness', 0.0015, 'dw')), e11mm: k(w('roughness', 0.011, 'dw')),
				len0: k(w('length', 0, 'hw')), len1: k(w('length', 1, 'hw')),
				kneg: k(w('k', -0.1, 'hw')), k0: k(w('k', 0, 'hw')),
				emneg: k(w('emitter', -1, 'hw')), em0: k(w('emitter', 0, 'hw')),
				tankBad: k(w('minLevel', 0, 'hw', { level: 5, minLevel: 9, maxLevel: 8 })),
				tankOk: k(w('level', 0, 'hw', { level: 5, minLevel: 1, maxLevel: 8 }))
			};
		});
		ok('pure: diameter 11 mm flagged, 12 mm not', pure.d11 && !pure.d12, JSON.stringify([pure.d11, pure.d12]));
		ok('pure: diameter 3.81 m (150 in) not flagged, 3.82 m flagged, negative flagged', !pure.d381 && pure.d382 && pure.dneg);
		ok('pure: 130 under Darcy-Weisbach flagged, under Hazen-Williams not', pure.c130dw === 'lpn_valwarn_dw' && !pure.c130hw);
		ok('pure: C 9 and C 201 flagged', pure.c9 === 'lpn_valwarn_hw' && pure.c201 === 'lpn_valwarn_hw');
		ok('pure: n 0.013 fine, 0.0005 and 2 flagged', !pure.n013 && pure.n0005 && pure.n2);
		ok('pure: e 0 and e 11 mm flagged, e 1.5 mm not', pure.e0 && pure.e11mm && !pure.e15mm);
		ok('pure: length 0, k < 0, emitter < 0 flagged; 1, 0, 0 not',
			pure.len0 && !pure.len1 && pure.kneg && !pure.k0 && pure.emneg && !pure.em0);
		ok('pure: tank minimum above maximum flagged; ordered levels not', pure.tankBad && !pure.tankOk);

		// ---- the Tables pane ----
		await a.toolbarClick(await a.lang('lpn_pane_toggle'));
		await a.settle(500);
		await page.click('#lpn_pane_tab_pipes');
		await a.settle(1000);
		const cell = (tab, id, key) => page.evaluate(([tab, id, key]) => {
			const tds = Array.from(document.querySelectorAll('#lpn_pane_' + tab + ' td.lpn-pane-col-' + key));
			const td = tds.filter((t) => t._lpnPaneId === id)[0];
			if (!td) { return null; }
			const m = td.querySelector('.lpn-valwarn'), inp = td.querySelector('input');
			return { mark: !!m, text: m ? m.textContent : '', tip: m ? (m.getAttribute('data-bs-original-title') || m.title || '') : '',
				help: m ? / ec-help/.test(' ' + m.className) : false, value: inp ? inp.value : td.textContent };
		}, [tab, id, key]);
		const setCell = async (tab, id, key, v) => {
			await page.evaluate(([tab, id, key, v]) => {
				const tds = Array.from(document.querySelectorAll('#lpn_pane_' + tab + ' td.lpn-pane-col-' + key));
				const inp = tds.filter((t) => t._lpnPaneId === id)[0].querySelector('input');
				inp.value = v;
				inp.dispatchEvent(new Event('change', { bubbles: true }));
			}, [tab, id, key, v]);
			await a.settle(700);
		};
		const marksIn = (tab) => page.evaluate((tab) => document.querySelectorAll('#lpn_pane_' + tab + ' .lpn-valwarn').length, tab);
		ok('Net1 as shipped: no ⚠ anywhere in the Pipes table', (await marksIn('pipes')) === 0);

		await setCell('pipes', '11', 'diameter', '200');
		let c = await cell('pipes', '11', 'diameter');
		ok('diameter 200 in: ⚠ in the cell', c && c.mark && c.text === '⚠', JSON.stringify(c));
		ok('...the glyph is a tip target (ec-help) and its tip quotes the range in inches', c && c.help && /0\.472/.test(c.tip) && /150/.test(c.tip), c && c.tip);
		ok('...and the typed number is unchanged', c && c.value === '200');
		await setCell('pipes', '11', 'diameter', '150');
		c = await cell('pipes', '11', 'diameter');
		ok('diameter 150 in: no ⚠', c && !c.mark, JSON.stringify(c));
		await setCell('pipes', '11', 'diameter', '0.4');
		c = await cell('pipes', '11', 'diameter');
		ok('diameter 0.4 in (10 mm): ⚠', c && c.mark);
		await setCell('pipes', '11', 'diameter', '0.5');
		c = await cell('pipes', '11', 'diameter');
		ok('diameter 0.5 in (12.7 mm): no ⚠', c && !c.mark);
		await setCell('pipes', '11', 'diameter', '14');

		await setCell('pipes', '11', 'roughness', '9');
		c = await cell('pipes', '11', 'roughness');
		ok('C 9: ⚠', c && c.mark, JSON.stringify(c));
		await setCell('pipes', '11', 'roughness', '201');
		c = await cell('pipes', '11', 'roughness');
		ok('C 201: ⚠', c && c.mark);
		await setCell('pipes', '11', 'roughness', '130');
		c = await cell('pipes', '11', 'roughness');
		ok('C 130 under Hazen-Williams: no ⚠', c && !c.mark);

		await setCell('pipes', '12', 'length', '0');
		c = await cell('pipes', '12', 'length');
		ok('length 0: ⚠', c && c.mark, JSON.stringify(c));
		await setCell('pipes', '12', 'length', '5280');
		c = await cell('pipes', '12', 'length');
		ok('length 5280: no ⚠', c && !c.mark);

		// ---- the Properties box, on pipe 11, opened from the table's own menu ----
		const openProps = async (id) => {
			// The keyboard's own door to the table menu (Shift+F10 on a cell), on the row's ID cell.
			await page.evaluate((id) => {
				const td = Array.from(document.querySelectorAll('#lpn_pane_pipes td.lpn-pane-col-id')).filter((t) => t._lpnPaneId === id)[0];
				td.querySelector('input').focus();
			}, id);
			await a.settle(200);
			await page.keyboard.press('Shift+F10');
			await a.settle(300);
			const want = await a.lang('lpn_pane_goto_tip');
			const items = await page.evaluate((want) => {
				const all = Array.from(document.querySelectorAll('[role=menuitem]'));
				const b = all.filter((e) => (e.textContent || '').trim().indexOf(want) === 0);
				if (b.length) { b[0].click(); }
				return all.map((e) => e.textContent.trim());
			}, want);
			ok('the table menu offers ' + want, items.some((t) => t.indexOf(want) === 0), JSON.stringify(items));
			await a.settle(800);
		};
		await openProps('11');
		const propMark = (labelKeyText) => page.evaluate((t) => {
			const labels = Array.from(document.querySelectorAll('#lpn_popup_fields label'))
				.filter((l) => (l.textContent || '').trim().indexOf(t) === 0);
			if (!labels.length) { return null; }
			const m = labels[0].querySelector('.lpn-valwarn'), inp = labels[0].querySelector('input');
			return { mark: !!m, tip: m ? (m.getAttribute('data-bs-original-title') || m.title || '') : '', value: inp ? inp.value : null };
		}, labelKeyText);
		const diaLabel = await a.lang('lpn_field_diameter');
		const roughLabel = await a.lang('lpn_field_roughness');
		const popupId = await page.evaluate(() => { const e = document.querySelector('#lpn_popup input'); return e ? e.value : null; });
		ok('Properties opens on pipe 11', popupId === '11', JSON.stringify(popupId));
		let p = await propMark(diaLabel);
		ok('Properties opens on pipe 11 with a Diameter row and no ⚠ (14 in)', p && !p.mark, JSON.stringify(p));
		await setCell('pipes', '11', 'diameter', '200');
		p = await propMark(diaLabel);
		ok('diameter 200 in from the table: ⚠ in Properties too', p && p.mark, JSON.stringify(p));
		ok('...and Properties shows the number as typed', p && p.value === '200');
		await page.evaluate((t) => {
			const l = Array.from(document.querySelectorAll('#lpn_popup_fields label')).filter((l) => (l.textContent || '').trim().indexOf(t) === 0)[0];
			const inp = l.querySelector('input'); inp.value = '12'; inp.dispatchEvent(new Event('change', { bubbles: true }));
		}, diaLabel);
		await a.settle(800);
		p = await propMark(diaLabel);
		ok('typed 12 in Properties: the ⚠ goes', p && !p.mark, JSON.stringify(p));
		c = await cell('pipes', '11', 'diameter');
		ok('...and goes from the table cell too', c && !c.mark && c.value === '12', JSON.stringify(c));
		p = await propMark(roughLabel);
		ok('roughness 130 under Hazen-Williams: no ⚠ in Properties', p && !p.mark, JSON.stringify(p));

		// ---- Sue's case: C = 130 left standing while the method becomes Darcy-Weisbach ----
		const setMethod = async (m) => {
			await a.toolbarClick(await a.lang('lpn_tool_settings'));
			await page.waitForSelector('#lpn_settings_box', { state: 'visible' });
			await a.settle(400);
			const sel = await page.evaluateHandle(() => Array.from(document.querySelectorAll('#lpn_settings_box select'))
				.filter((s) => Array.from(s.options).some((o) => o.value === 'dw') && Array.from(s.options).some((o) => o.value === 'manning'))[0]);
			await sel.asElement().selectOption(m);
			await a.settle(400);
			const d = await a.dialog();
			if (d) { await a.dialogClick(await a.lang('lpn_dialog_ok')); }
			await a.settle(1500);
			await page.evaluate(() => { const b = document.getElementById('lpn_setbox_close'); if (b) { b.click(); } });
			await a.settle(500);
		};
		await setMethod('dw');
		c = await cell('pipes', '11', 'roughness');
		ok('C 130 left as it was, method now Darcy-Weisbach: ⚠ in the table', c && c.mark, JSON.stringify(c));
		ok('...its tip is the Darcy-Weisbach one, naming C and n', c && /Darcy-Weisbach/.test(c.tip), c && c.tip);
		ok('...and the 130 is untouched', c && c.value === '130');
		ok('...and every other pipe in Net1 (C 100) is flagged too', (await marksIn('pipes')) >= 12, String(await marksIn('pipes')));
		p = await propMark(roughLabel);
		ok('...and in the Properties box', p && p.mark, JSON.stringify(p));
		if (process.env.VALWARN_SHOTS) { await page.screenshot({ path: process.env.VALWARN_SHOTS + '/value-warning-dw.png' }); }
		await setCell('pipes', '11', 'roughness', '0.005');
		c = await cell('pipes', '11', 'roughness');
		ok('e 0.005 ft (1.5 mm): no ⚠', c && !c.mark, JSON.stringify(c));
		await setCell('pipes', '11', 'roughness', '0.04');
		c = await cell('pipes', '11', 'roughness');
		ok('e 0.04 ft (12 mm): ⚠', c && c.mark, JSON.stringify(c));

		await setMethod('manning');
		await setCell('pipes', '11', 'roughness', '0.013');
		c = await cell('pipes', '11', 'roughness');
		ok('Manning n 0.013: no ⚠', c && !c.mark, JSON.stringify(c));
		await setCell('pipes', '11', 'roughness', '0.0005');
		c = await cell('pipes', '11', 'roughness');
		ok('Manning n 0.0005: ⚠', c && c.mark);
		await setCell('pipes', '11', 'roughness', '1.5');
		c = await cell('pipes', '11', 'roughness');
		ok('Manning n 1.5: ⚠', c && c.mark);

		// ---- a tank whose lowest depth is above its highest (EPANET error 225) ----
		await page.click('#lpn_pane_tab_tanks');
		await a.settle(800);
		ok('Net1 tank as shipped: no ⚠ in the Tanks table', (await marksIn('tanks')) === 0);
		await setCell('tanks', '2', 'minLevel', '160');
		const mn = await cell('tanks', '2', 'minLevel'), mx = await cell('tanks', '2', 'maxLevel'), lv = await cell('tanks', '2', 'level');
		ok('lowest depth 160 above highest 150: ⚠ on lowest, highest and the water depth',
			mn && mn.mark && mx && mx.mark && lv && lv.mark, JSON.stringify([mn, mx, lv]));
		await setCell('tanks', '2', 'minLevel', '100');
		ok('lowest depth back to 100: the ⚠ go', (await marksIn('tanks')) === 0);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall value warning checks passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
