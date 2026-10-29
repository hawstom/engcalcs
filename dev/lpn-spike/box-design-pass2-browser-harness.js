// BOX-DESIGN PASS 2 (Tom's browser-pass items 2-5, 7, 9, 10, 2026-10-29), real mouse and keyboard. Run with:
//   node dev/lpn-spike/box-design-pass2-browser-harness.js   (takes the browser lock itself)
//   P2  an empty editable cell is plain (no dotted or dashed underline) in Properties and the Demand categories table;
//   P3  the draggable divider stands on the ID row too: it spans from the ID row's top to the last row's bottom, and a
//       real drag that starts on the ID row moves the Value column;
//   P4  Elevation's Read DEM / Use DEM buttons are ruled off from Base demand and not from Elevation;
//   P5  a real drag of the divider lets the Value column down to the floor the box itself can be sized to (few characters);
//   P7  the time series graph's and the Contour plot box's pull-downs look like the sheet's other pull-down cells;
//   P9  Contour plot "Show contours": each real click flips the tick and the plot together, three clicks in a row;
//   P10 opening the Contour plot box changes no Settings (node colouring stays as the user set it).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_P2_LOCKED';
const NAME = 'box-design-pass2-browser-harness';
const SHOTS = process.env.EC_SHOTS || '';
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
const { openBox } = require('./dock-boxes.js');
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
	if (!executablePath) { console.error(NAME + ': no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const net1 = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8'));
	const errors = [];
	try {
		const a = await Session.open(browser, NAME, { serviceWorkers: 'block' });
		const page = a.page;
		page.on('pageerror', (e) => errors.push(String(e && e.message)));
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (r) => r.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); localStorage.setItem('lpn_hovercard', 'off'); }, JSON.stringify(net1));
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await page.setViewportSize({ width: 1366, height: 768 });
		await a.settle(2500);
		const shot = async (n) => { if (SHOTS) { await page.screenshot({ path: path.join(SHOTS, n + '.png') }); } };
		async function openNode(id) {
			const p = await page.evaluate((i) => {
				const el = Array.from(document.querySelectorAll('#lpn_canvas [data-node="' + i + '"]')).filter((e) => e.getBoundingClientRect().width > 0)[0];
				const r = el.getBoundingClientRect();
				return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
			}, id);
			await page.mouse.click(p.x, p.y);
			await a.settle(900);
		}
		const settingsNow = () => page.evaluate(() => { try { const t = localStorage.getItem('lpn_project_hover'); return t ? JSON.parse(t) : null; } catch (e) { return null; } });
		const plotParts = () => page.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas .lpn-contour-fill, #lpn_canvas .lpn-contour-lines, #lpn_canvas .lpn-contour-line')).length);
		const nodeColoured = () => page.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas .lpn-node-junction')).filter((c) => c.style && c.style.color).length);

		console.log('\n--- P2, P3, P5, P7: the Properties box (a junction) ---');
		await openBox(a, 'lpn_popup');
		await a.settle(600);
		const emptyProbe = await page.evaluate(() => {
			const cands = Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-grow > input.lpn-gval')).filter((e) => e.type === 'text' && !e.value && !e.disabled && e.getBoundingClientRect().width > 0);
			const e = cands[0];
			if (!e) { return null; }
			const r = e.getBoundingClientRect();
			return { id: e.id || e.getAttribute('data-gprop'), x: r.left + r.width / 2, y: r.top + r.height / 2, img: getComputedStyle(e).backgroundImage };
		});
		ok('P2 an empty editable cell in Properties exists and has no dotted underline', !!emptyProbe && !/gradient|url/.test(emptyProbe.img), JSON.stringify(emptyProbe));
		await page.mouse.move(5, 400);
		const split0 = await page.evaluate(() => {
			const s = document.querySelector('.lpn-propbox .lpn-popover-body > .lpn-gsplit'), t = document.getElementById('lpn_popup_title'), f = document.getElementById('lpn_popup_fields');
			if (!s) { return null; }
			const r = s.getBoundingClientRect(), tr = t.getBoundingClientRect(), fr = f.getBoundingClientRect();
			const nm = t.querySelector('.lpn-gname').getBoundingClientRect();
			return { top: r.top, bottom: r.bottom, x: r.left + r.width / 2, titleTop: tr.top, titleMid: tr.top + tr.height / 2, fieldsBottom: fr.bottom, nameW: nm.width, display: getComputedStyle(s).display };
		});
		ok('P3 the divider starts at the top of the ID row', !!split0 && Math.abs(split0.top - split0.titleTop) <= 3, JSON.stringify(split0));
		ok('P3 ...and runs down to the last row', !!split0 && split0.bottom >= split0.fieldsBottom - 3, JSON.stringify(split0));
		// A real drag that starts on the ID row.
		await page.mouse.move(split0.x, split0.titleMid);
		await page.mouse.down();
		await page.mouse.move(split0.x + 30, split0.titleMid, { steps: 5 });
		await page.mouse.up();
		await a.settle(300);
		const afterId = await page.evaluate(() => document.getElementById('lpn_popup_title').querySelector('.lpn-gname').getBoundingClientRect().width);
		ok('P3 a drag started on the ID row moves the divider (the name column widens)', afterId > split0.nameW + 15, split0.nameW + ' -> ' + afterId);
		// P5: drag far right: the Value column falls to a few characters.
		const split1 = await page.evaluate(() => { const r = document.querySelector('.lpn-propbox .lpn-popover-body > .lpn-gsplit').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + 80 }; });
		await page.mouse.move(split1.x, split1.y);
		await page.mouse.down();
		await page.mouse.move(split1.x + 600, split1.y, { steps: 12 });
		await page.mouse.up();
		await a.settle(300);
		const valW = await page.evaluate(() => { const c = Array.from(document.querySelectorAll('#lpn_popup_fields .lpn-grow > select.lpn-gval, #lpn_popup_fields .lpn-grow > input.lpn-gval')).filter((e) => e.type !== 'checkbox' && e.getBoundingClientRect().width > 0)[0]; return c.getBoundingClientRect().width; });
		ok('P5 dragging the divider all the way leaves the Value column a few characters wide (under 80 px)', valW < 80, String(Math.round(valW)) + ' px');
		await page.evaluate(() => { const s = document.querySelector('.lpn-propbox .lpn-popover-body > .lpn-gsplit'); s.dispatchEvent(new MouseEvent('dblclick', { bubbles: true })); });
		await a.settle(300);
		// P7: the Time series pull-down at the foot of Properties looks like the sheet's other pull-downs.
		const sty = (q) => page.evaluate((q) => { const e = document.querySelector(q); if (!e) { return null; } const c = getComputedStyle(e); return { bg: c.backgroundColor, border: c.borderTopWidth + '/' + c.borderLeftWidth, rad: c.borderTopLeftRadius, pad: c.padding, fs: c.fontSize }; }, q);
		const sheetSel = await sty('#lpn_popup_fields .lpn-grow > select.lpn-gval');
		const tsSel = await sty('#lpn_pgraph_field');
		ok('P7 the Time series pull-down has the sheet pull-down\'s look (no border, flat, same padding and size)', !!tsSel && !!sheetSel && JSON.stringify(tsSel) === JSON.stringify(sheetSel), JSON.stringify({ sheetSel, tsSel }));
		await shot('props');

		console.log('\n--- P7: the Contour plot box ---');
		const namesC = await page.evaluate(() => ({ g: EngCalcs.pageConfig.lpn_graphs_menu, c: EngCalcs.pageConfig.lpn_contour_menu }));
		await a.menuClickSub(namesC.g, namesC.c, 'project');
		await a.settle(1200);
		const cSel = await sty('#lpn_contour_field');
		ok('P7 the Contour plot pull-downs look like the sheet\'s', !!cSel && JSON.stringify(cSel) === JSON.stringify(sheetSel), JSON.stringify({ sheetSel, cSel }));
		const ramp = await page.evaluate(() => { const b = document.querySelector('#lpn_contour_body .lpn-ramp-btn'); const c = getComputedStyle(b); const s = document.getElementById('lpn_contour_fill'); return { bg: c.backgroundColor, border: c.borderTopWidth, h: Math.round(b.getBoundingClientRect().height), selH: Math.round(s.getBoundingClientRect().height) }; });
		ok('P7 the Colour scheme bar is a flat cell too (no border, same row height as the pull-down)', ramp.border === '0px' && Math.abs(ramp.h - ramp.selH) <= 2, JSON.stringify(ramp));
		await shot('contour');
		await page.evaluate(() => { const x = document.querySelector('#lpn_contour_box .lpn-popover-x, #lpn_contour_box [aria-label="Close"]'); if (x) { x.click(); } });
		await a.settle(300);

		console.log('\n--- P10: opening the Contour plot box changes no Settings ---');
		const VAR = process.env.EC_P9 || '';
		if (VAR === 'scn') {
			await a.menuClickSub(await a.lang('lpn_scenario_menu'), await a.lang('lpn_scenario_new'), 'project');
			await a.waitDialog(3000);
			await page.evaluate((l) => { const b = Array.from(document.querySelectorAll('dialog button, .lpn-dialog button, button')).filter((x) => x.textContent.trim() === l && x.getBoundingClientRect().width > 0)[0]; if (b) { b.click(); } }, await a.lang('lpn_dialog_ok'));
			await a.settle(1000);
		}
		const before = await settingsNow();
		const namesG = await page.evaluate(() => ({ g: EngCalcs.pageConfig.lpn_graphs_menu, c: EngCalcs.pageConfig.lpn_contour_menu }));
		await a.menuClickSub(namesG.g, namesG.c, 'project');
		await a.settle(1500);
		const afterOpen = await settingsNow();
		const nodeField = (st) => st && st.settings ? (st.settings.colorNodeField || '') : null;
		ok('P10 before: no node colouring', nodeField(before) === '', JSON.stringify(nodeField(before)));
		ok('P10 opening the box leaves Settings > Colors off (no node colour field written)', nodeField(afterOpen) === '', JSON.stringify(nodeField(afterOpen)));
		ok('P10 ...no node is painted', (await nodeColoured()) === 0, String(await nodeColoured()));
		ok('P10 ...yet the contour plot is drawn', (await plotParts()) > 0, String(await plotParts()));
		ok('P10 ...with a colour key on the map for it', await page.evaluate(() => { const l = document.getElementById('lpn_color_legend'); return !!l && getComputedStyle(l).display !== 'none' && l.textContent.length > 10; }));
		await shot('contour-open');

		console.log('\n--- P9: three real clicks on Show contours ---');
		const state = () => page.evaluate(() => ({ tick: document.getElementById('lpn_contour_show').checked }));
		const seq = [];
		if (process.env.EC_DBG) { await page.evaluate(() => { window.__ev = []; ['click', 'change'].forEach((t) => document.addEventListener(t, (e) => window.__ev.push(t + ':' + (e.target.id || e.target.className || e.target.tagName) + ':' + (e.target.checked)), true)); }); }
		for (let i = 1; i <= 4; i++) {
			const at = await page.evaluate((v) => { const c = document.getElementById(v === 'label' ? 'lpn_contour_show' : 'lpn_contour_show'), r = (v === 'label' ? c.parentElement.querySelector('.lpn-gname') : c).getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, VAR);
			await page.mouse.click(at.x, at.y);
			await a.settle(900);
			if (process.env.EC_DBG) { console.log('EV', i, JSON.stringify(await page.evaluate(() => { const e = window.__ev; window.__ev = []; return e; }))); }
			seq.push({ click: i, tick: (await state()).tick, plot: (await plotParts()) > 0 });
		}
		ok('P9 click 1: unticked and the plot is gone', seq[0].tick === false && seq[0].plot === false, JSON.stringify(seq[0]));
		ok('P9 click 2: ticked and the plot is back', seq[1].tick === true && seq[1].plot === true, JSON.stringify(seq[1]));
		ok('P9 click 3: unticked and the plot is gone again', seq[2].tick === false && seq[2].plot === false, JSON.stringify(seq[2]));
		ok('P9 click 4: ticked and the plot is back again', seq[3].tick === true && seq[3].plot === true, JSON.stringify(seq[3]));
		const afterToggle = await settingsNow();
		ok('P9/P10 toggling never touched node colouring either', nodeField(afterToggle) === '', JSON.stringify(nodeField(afterToggle)));

		console.log('\n--- P4: the DEM buttons belong to Elevation (a located project) ---');
		const novato = fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net3-Novato-CA-World.lwn'), 'utf8');
		await page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); localStorage.setItem('lpn_hovercard', 'off'); }, novato);
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } EngCalcs.pageConfig.lpn_mapbox_token = 'pk.harness'; });
		await a.settle(2500);
		let dem = null;
		for (let tries = 0; tries < 8 && !dem; tries++) {
			await page.evaluate((n) => { const els = Array.from(document.querySelectorAll('#lpn_canvas .lpn-symbols circle:not(.lpn-node-hit)')).filter((c) => c.getBoundingClientRect().width > 0 && document.elementFromPoint(c.getBoundingClientRect().left + 2, c.getBoundingClientRect().top + 2) === c); const c = els[(n * 7) % els.length]; const r = c.getBoundingClientRect(); window.__pt = { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, tries);
			const pt = await page.evaluate(() => window.__pt);
			await page.mouse.click(pt.x, pt.y);
			await a.settle(700);
			dem = await page.evaluate(() => {
				const tr = document.querySelector('#lpn_popup_fields > .lpn-elev-dem');
				if (!tr || !/DEM/.test(tr.textContent)) { return null; }
				let prev = tr.previousElementSibling; if (prev && prev.tagName === 'BR') { prev = prev.previousElementSibling; } const next = tr.nextElementSibling;
				const sh = (e) => e ? getComputedStyle(e).boxShadow : null;
				return { prevShadow: sh(prev), trailShadow: sh(tr), nextTag: next && next.textContent.slice(0, 20) };
			});
		}
		ok('P4 found a junction whose Elevation row has the DEM buttons under it', !!dem, JSON.stringify(dem));
		if (dem) {
			ok('P4 no rule between Elevation and its buttons', dem.prevShadow === 'none', dem.prevShadow);
			ok('P4 the rule is under the buttons, before the next row', dem.trailShadow !== 'none', dem.trailShadow);
		}
		await shot('dem');
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + ' of ' + checks + ' checks passed' + (errors.length ? '; page errors: ' + errors.join(' | ') : ''));
	process.exit(failures || errors.length ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
