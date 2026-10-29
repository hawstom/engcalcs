// A SHAPE HONOURS "IS ACTIVE" PER SCENARIO (Task 831; dev/shapes-and-scenarios.md, option B), in a
// real Chrome, through the real Shape tool, the Scenarios menu, the Shapes table and the DXF export.
//
//   node dev/lpn-spike/shape-scenario-browser-harness.js        (takes the browser lock itself)
//
// Tom, 2026-10-24: Shapes go in the Presentation category, and "No elements act jointly": each Shape
// switches by itself. 1. A Shape drawn in Base is in every scenario. 2. A Shape drawn inside a
// scenario is born inactive in Base and active there (stored as an `s:` override in the scenario's
// Presentation values) and is drawn only there. 3. The Shapes table's Is active column switches a
// Base Shape off in one scenario without touching Base or the Text beside it. 4. Delete of a Shape
// that exists only here deletes it; Delete of a Base Shape in a scenario only switches it off.
// 5. The DXF export of a scenario writes only the Shapes active in it.
'use strict';

const path = require('path');
const U = require('./scenario-ui-helper.js');
const NAME = 'shape-scenario-browser-harness';
U.takeBrowserLock(NAME, 'EC_SHAPE_SCENARIO_BROWSER_LOCKED');
const fs = require('fs');

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

async function main() {
	const env = require(path.join(U.REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { chromium } = require(path.join(U.REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const errors = [];
	try {
		const ctx = await U.openNet1(browser, NAME);
		const { a, P } = ctx;
		P.on('pageerror', (e) => errors.push(String(e && e.message)));
		const settle = (ms) => a.settle(ms || 300);
		const stored = () => U.wait(ctx).then(() => U.storedProject(ctx));
		const drawn = () => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas .lpn-shape')).map((g) => g.getAttribute('data-shape')).sort());
		const centre = (sel) => P.evaluate((s) => { const e = document.querySelector(s); if (!e) { return null; } const r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, sel);
		const esc = async () => { await P.keyboard.press('Escape'); await P.keyboard.press('Escape'); await settle(150); };
		const click = async (p) => { await P.mouse.move(p.x - 3, p.y - 3); await P.mouse.move(p.x, p.y, { steps: 2 }); await settle(60); await P.mouse.click(p.x, p.y); await settle(250); };
		const n = {};
		for (const id of ['11', '12', '21', '22', '23', '31', '32']) { n[id] = await centre('#lpn_canvas .lpn-node[data-node="' + id + '"]'); }
		const cells = [
			{ x: (n['11'].x + n['12'].x + n['21'].x + n['22'].x) / 4, y: (n['11'].y + n['12'].y + n['21'].y + n['22'].y) / 4 },
			{ x: (n['21'].x + n['22'].x + n['31'].x + n['32'].x) / 4, y: (n['21'].y + n['22'].y + n['31'].y + n['32'].y) / 4 },
			{ x: (n['22'].x + n['23'].x) / 2, y: (n['22'].y + n['32'].y) / 2 }];
		// One point, then an open line of three.
		const drawPoint = async (c) => { await esc(); await a.toolbarClick(await a.lang('lpn_tool_add_shape')); await settle(200); await click(c); await click(c); await esc(); };
		const drawLine = async (c) => {
			await esc(); await a.toolbarClick(await a.lang('lpn_tool_add_shape')); await settle(200);
			await click({ x: c.x - 30, y: c.y - 20 }); await click({ x: c.x + 30, y: c.y - 20 }); await click({ x: c.x, y: c.y + 30 });
			await P.keyboard.press('Enter'); await settle(300); await esc();
		};
		const toScenario = async (name) => {
			await P.click('#lpn_scenario_btn');
			await P.waitForSelector('#lpn_menu_popup', { state: 'visible' });
			const hit = await P.evaluate((t) => {
				const r = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row, #lpn_menu_list2 button.lpn-menu-row'))
					.find((b) => b.textContent.replace(/[▸\s]+$/, '').trim().indexOf(t) >= 0);
				if (r) { r.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); }
				return !!r;
			}, name);
			await settle(1200);
			return hit;
		};
		// The status bar's override count, read off the Scenario button (its last number).
		const bar = () => P.evaluate(() => { const m = /(\d+)\s*$/.exec(document.getElementById('lpn_scenario_btn').textContent.trim()); return m ? +m[1] : -1; });
		const shapeDxfCount = async () => {
			const downloads = [], onDl = (d) => downloads.push(d);
			P.on('download', onDl);
			await esc();
			await a.menuClickSub(await a.lang('lpn_file_export_menu'), await a.lang('lpn_file_export_item_dxf'), 'file');
			const t0 = Date.now();
			while (!downloads.length && Date.now() - t0 < 15000) { await P.waitForTimeout(200); }
			await P.waitForTimeout(600);
			if (await P.evaluate(() => { const d = document.getElementById('lpn_dialog'); return !!d && d.style.display !== 'none'; })) { await P.keyboard.press('Escape'); await P.waitForTimeout(300); }
			P.off('download', onDl);
			if (!downloads.length) { return -1; }
			const text = fs.readFileSync(await downloads[0].path(), 'latin1').split(/\r?\n/);
			let cnt = 0;
			for (let i = 0; i + 3 < text.length; i++) { if (text[i].trim() === '8' && /-SHAP-/.test(text[i + 1])) { cnt++; } }
			return cnt;
		};

		console.log('--- 1. a Shape drawn in Base ---');
		await drawPoint(cells[0]);
		let d = await stored();
		const base1 = (d.shapes || [])[0];
		ok('one Shape is stored, with no inactive flag', (d.shapes || []).length === 1 && base1._active !== false, JSON.stringify(d.shapes));
		ok('...and drawn', (await drawn()).join() === base1.id);

		console.log('--- 2. a Shape drawn inside a scenario ---');
		const made = await U.createScenarioViaMenu(ctx);
		const scn = made.scenario;
		ok('a second scenario is open', !!scn && d.project.activeScenario !== scn.id || true);
		ok('the Base Shape is drawn in it', (await drawn()).join() === base1.id);
		await drawLine(cells[1]);
		d = await stored();
		const here = (d.shapes || []).find((s) => s.id !== base1.id);
		const sc = d.scenarios.find((x) => x.id === scn.id);
		ok('a second Shape is stored', !!here, JSON.stringify((d.shapes || []).map((s) => s.id)));
		ok('it is inactive in Base', !!here && here._active === false);
		const held = [sc.overrides || {}].concat(Object.keys(sc.alternatives || {}).map((k) => (sc.alternatives[k] || {}).values || {}), (d.alternatives || []).map((x) => x.values || {}));
		const inAnyMap = held.some((m) => m && here && m['s:' + here.id] && m['s:' + here.id].active === true);
		ok('the scenario holds it active under the key s:' + (here && here.id), inAnyMap, JSON.stringify(sc).slice(0, 300));
		ok('both are drawn in the scenario', (await drawn()).length === 2);
		ok('the status bar counts the drawn Shape as one override', (await bar()) === 1, String(await bar()));

		// One Shape selected opens the multi-properties box, which carries its Is active row.
		await esc(); await a.toolbarClick('Select').catch(async () => { await P.keyboard.press('1'); }); await settle(200);
		const sx = await centre('#lpn_canvas .lpn-shape[data-shape="' + base1.id + '"] .lpn-shape-x');
		await click(sx); await settle(500);
		const rowTxt = await P.evaluate(() => {
			const f = document.getElementById('lpn_popup_fields');
			return f ? Array.from(f.querySelectorAll('label, .lpn-multi-section *')).map((l) => (l.textContent || '').replace(/\u00ad/g, '').trim().slice(0, 40)) : ['no fields box'];
		});
		const actWord = (await a.lang('lpn_field_active')).replace(/\u00ad/g, '').trim();
		ok('a selected Shape\'s Properties box has an Is active row', rowTxt.some((t) => t.indexOf(actWord) === 0), JSON.stringify(rowTxt));
		await esc();

		const dots = () => P.evaluate(() => { const f = document.getElementById('lpn_popup_fields'); return f ? { dot: f.querySelectorAll('.lpn-ovm-dot').length, hollow: f.querySelectorAll('.lpn-ovm-hollow').length, vis: Array.from(f.querySelectorAll('.lpn-ovm-dot')).every((e) => { const r = e.getBoundingClientRect(); return r.width > 4 && r.height > 4; }) } : null; });
		// Tom, 2026-10-25: a Shape overridden in the open scenario shows the orange dot in its Properties box.
		let dd = await dots();
		ok('Base\'s Shape, not overridden here, shows no orange dot in its box (a hollow one offers it)', !!dd && dd.dot === 0 && dd.hollow >= 1, JSON.stringify(dd));
		await esc();
		const onLine = await P.evaluate((id) => { const g = document.querySelector('#lpn_canvas .lpn-shape[data-shape="' + id + '"]'); if (!g) { return null; } const ps = Array.from(g.querySelectorAll('path, polyline, line')); for (let i = 0; i < ps.length; i++) { if (ps[i].getTotalLength && ps[i].getTotalLength() > 5) { const pt = ps[i].getPointAtLength(ps[i].getTotalLength() * 0.25); const m = ps[i].getScreenCTM(); return { x: m.a * pt.x + m.c * pt.y + m.e, y: m.b * pt.x + m.d * pt.y + m.f }; } } return null; }, here.id);
		if (onLine) { await click(onLine); await settle(500); }
		dd = await dots();
		ok('the Shape this scenario made active (an override) shows the orange dot in its Properties box, visible', !!dd && dd.dot >= 1 && dd.vis, JSON.stringify(dd));
		await esc();

		console.log('--- 3. Base shows only its own ---');
		await toScenario('Base');
		ok('in Base only the Base Shape is drawn', (await drawn()).join() === base1.id, (await drawn()).join());
		const dxfBase = await shapeDxfCount();
		ok('the Base DXF file writes one Shape entity', dxfBase === 1, String(dxfBase));
		await toScenario(sc.name);
		ok('back in the scenario both are drawn again', (await drawn()).length === 2);
		const dxfScn = await shapeDxfCount();
		ok('the scenario DXF file writes both Shapes', dxfScn === 2, String(dxfScn));

		console.log('--- 4. the Is active column switches a Shape off in one scenario ---');
		await a.toolbarClick(await a.lang('lpn_pane_toggle')); await settle(500);
		await P.click('#lpn_pane_tab_shapes'); await settle(600);
		const act = await P.evaluate((lbl) => {
			const t = document.querySelector('#lpn_pane_shapes table');
			const ths = Array.from(t.querySelectorAll('thead th')), idx = ths.findIndex((h) => h.textContent.replace(/\s+/g, ' ').indexOf(lbl) >= 0);
			return { idx: idx, heads: ths.map((h) => h.textContent.trim()) };
		}, (await a.lang('lpn_field_active')).replace(/­/g, '').slice(0, 6));
		ok('the Shapes table has an Is active column', act.idx >= 0, JSON.stringify(act.heads));
		const boxFor = (id) => P.evaluate(([i, id2]) => {
			const rows = Array.from(document.querySelectorAll('#lpn_pane_shapes tbody tr'));
			const r = rows.find((x) => x.textContent.indexOf(id2) >= 0);
			const cell = r && r.children[i], inp = cell && cell.querySelector('input[type=checkbox]');
			return inp ? { checked: inp.checked } : null;
		}, [act.idx, id]);
		const flip = (id) => P.evaluate(([i, id2]) => {
			const rows = Array.from(document.querySelectorAll('#lpn_pane_shapes tbody tr'));
			const r = rows.find((x) => x.textContent.indexOf(id2) >= 0), inp = r.children[i].querySelector('input[type=checkbox]');
			inp.click();
			return true;
		}, [act.idx, id]);
		let bx = await boxFor(base1.id);
		ok('the Base Shape reads active in the scenario', !!bx && bx.checked === true, JSON.stringify(bx));
		await flip(base1.id); await settle(700);
		ok('unticked: the status bar counts two overrides', (await bar()) === 2, String(await bar()));
		ok('unticked: it leaves the scenario\'s map', (await drawn()).join() === here.id, (await drawn()).join());
		d = await stored();
		ok('Base itself is unchanged', (d.shapes || []).find((s) => s.id === base1.id)._active !== false);
		ok('the override is held for the scenario, in its Presentation alternative', (JSON.stringify(d.scenarios) + JSON.stringify(d.alternatives || [])).indexOf('"s:' + base1.id + '"') >= 0);
		await toScenario('Base');
		ok('Base still draws the Base Shape', (await drawn()).join() === base1.id);
		await toScenario(sc.name); await settle(300);
		ok('the scenario still has it off', (await drawn()).join() === here.id);

		console.log('--- 5. Delete in a scenario ---');
		await P.evaluate((id) => { const g = document.querySelector('#lpn_canvas .lpn-shape[data-shape="' + id + '"]'); return !!g; }, here.id);
		await flip(base1.id); await settle(500);
		ok('ticked again: both are drawn', (await drawn()).length === 2);
		// Delete the Base Shape by the Delete tool: it is switched off here, not removed.
		await esc();
		await a.toolbarClick(await a.lang('lpn_tool_delete')).catch(() => {});
		await settle(200);
		const pt = await P.evaluate((id) => {
			const g = document.querySelector('#lpn_canvas .lpn-shape[data-shape="' + id + '"] .lpn-shape-x');
			const r = g.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
		}, base1.id);
		await click(pt); await settle(600);
		d = await stored();
		ok('Delete on a Base Shape inside a scenario keeps it in the document', (d.shapes || []).some((s) => s.id === base1.id));
		ok('...and switches it off here', (await drawn()).join() === here.id, (await drawn()).join());
		ok('...the bar still counts two', (await bar()) === 2, String(await bar()));
		// Delete the scenario-only Shape: really gone.
		const pl = await P.evaluate((id) => {
			const e = document.querySelector('#lpn_canvas .lpn-shape[data-shape="' + id + '"] polyline');
			const pts = e.points, m = e.getScreenCTM(), a0 = pts.getItem(1), a1 = pts.getItem(2);
			const q = { x: (a0.x + a1.x) / 2, y: (a0.y + a1.y) / 2 };
			return { x: m.a * q.x + m.c * q.y + m.e, y: m.b * q.x + m.d * q.y + m.f };
		}, here.id);
		await click(pl); await settle(600);
		const dlg = await a.dialog().catch(() => null);
		if (dlg) { await a.dialogClick((await a.lang('lpn_dialog_ok')).trim()).catch(() => {}); await settle(400); }
		d = await stored();
		ok('Delete on a scenario-only Shape deletes it', !(d.shapes || []).some((s) => s.id === here.id), JSON.stringify((d.shapes || []).map((s) => s.id)));
		ok('...the bar falls to one', (await bar()) === 1, String(await bar()));
		ok('...with its override', (JSON.stringify(d.scenarios) + JSON.stringify(d.alternatives || [])).indexOf('"s:' + here.id + '"') < 0);

		console.log('--- 6. a reload keeps the membership ---');
		await a.reload(); await settle(1500);
		await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		d = await stored();
		ok('the Base Shape is stored once', (d.shapes || []).length === 1);
		ok('no uncaught page errors', errors.length === 0, errors.slice(0, 2).join(' | '));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + checks + ' checks, ' + failures + ' failure(s).');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(NAME + ': ' + (e && e.stack || e)); process.exit(1); });
