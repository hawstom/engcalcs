// REPORT COLUMNS A READER CAN DRAG, KEPT PER BROWSER (Task 848).
//   node dev/lpn-spike/report-column-drag-browser-harness.js
// (it takes /tmp/engcalcs-browser.lock itself; never wrap it in that lock).
//
// Net3 with a second scenario. A real mouse drag on a Fire flow column divider widens that column;
// the width survives closing and reopening the report and a page reload; a double-click on the divider
// gives the column back to automatic; Print and Copy HTML are the same with and without a dragged
// width; at automatic widths no report scrolls sideways. The width lives in `lpn_rptcols`.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_RPTCOLDRAG_LOCKED';
if (process.env[LOCK_ENV] !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' }) });
		if (r.status === 75) { console.error('report-column-drag-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const dock = require(path.join(REPO, 'dev', 'lpn-spike', 'dock-boxes.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error('no Chromium; SKIPPING'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net3-Novato-CA-World.lwn'), 'utf8'));
		d.scenarios = d.scenarios || [];
		d.scenarios.push({ id: 'smax', name: 'Max day', overrides: {}, demandMultiplier: 1.8 });
		d.project = Object.assign({}, d.project, { name: 'Novato', activeScenario: 'base' });
		const a = await Session.open(browser, 'A', { serviceWorkers: 'block', acceptDownloads: true });
		const page = a.page;
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php?ec_nolog=1');
		await page.evaluate((txt) => { localStorage.clear(); localStorage.setItem('lpn_project_hover', txt); }, JSON.stringify(d));
		const prep = async () => {
			await a.answerTrainingPanel().catch(() => {});
			await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
			await page.setViewportSize({ width: 1700, height: 1000 });
			await a.settle(2500);
			await page.evaluate(() => {
				window.__clip = null; window.__printed = null;
				Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
					write: async (items) => { const it = items[0], out = {}; for (const t of it.types) { out[t] = await (await it.getType(t)).text(); } window.__clip = out; },
					writeText: async (t) => { window.__clip = { 'text/plain': t }; }
				} });
				window.print = () => { window.__printed = document.body.lastElementChild ? document.body.lastElementChild.outerHTML : ''; };
			});
		};
		await a.reload();
		await prep();
		const lg = async (k) => (await a.lang(k)).trim();
		const runLabel = await lg('lpn_ff_calculate');
		const waitReport = (sel) => a.waitFor(() => page.evaluate((s) => {
			const r = document.querySelector(s), box = document.getElementById('lpn_ff_run_box');
			return !!r && !!r.querySelector('tbody tr') && (!box || box.style.display === 'none');
		}, sel), 'a table in ' + sel, 600000);
		const closeBox = async (id) => { await page.evaluate((i) => { const x = document.querySelector('#' + i + ' .lpn-popover-x'); if (x) { x.click(); } }, id); await a.settle(250); };
		const setRow = (controls, label, value) => page.evaluate(([c, l, v]) => {
			const rows = Array.from(document.querySelectorAll(c + ' > *, ' + c + ' .lpn-ff-row'));
			for (const r of rows) {
				if ((r.textContent || '').trim().indexOf(l) !== 0) { continue; }
				const el = r.querySelector('select, input'); if (!el) { continue; }
				el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true }));
				return true;
			}
			return false;
		}, [controls, label, value]);
		const runBtn = async (ctl) => { for (const b of await page.$$(ctl + ' button.lpn-ff-run')) { if (((await b.textContent()) || '').trim() === runLabel) { await b.click(); break; } } };
		// The first Fire flow table: each leaf heading's width, the grips, the scroll of the wrap, the stored key.
		const ffState = () => page.evaluate(() => {
			const t = document.querySelector('#lpn_ff_report table.lpn-ff-table'), wrap = t.closest('.lpn-ff-tablewrap');
			const rows = Array.from(t.querySelectorAll('thead tr')), lf = [];
			if (rows.length < 2) { lf.push(...rows[0].children); } else { const sec = Array.from(rows[1].children); let k = 0; Array.from(rows[0].children).forEach((th) => { if (th.colSpan > 1) { for (let q = 0; q < th.colSpan; q++) { lf.push(sec[k++]); } } else { lf.push(th); } }); }
			let stored = null; try { stored = localStorage.getItem('lpn_rptcols'); } catch (e) { /* none */ }
			return { widths: lf.map((th) => Math.round(th.getBoundingClientRect().width * 10) / 10), grips: lf.filter((th) => th.querySelector('.lpn-rpt-colgrip')).length, nleaf: lf.length,
				scroll: wrap.scrollWidth - wrap.clientWidth, tableW: Math.round(t.getBoundingClientRect().width), boxW: wrap.clientWidth,
				colgroup: !!t.querySelector(':scope > colgroup'), sized: t.classList.contains('lpn-rpt-sized'), stored };
		});
		const gripBox = (i) => page.evaluate((idx) => {
			const t = document.querySelector('#lpn_ff_report table.lpn-ff-table'), rows = Array.from(t.querySelectorAll('thead tr')), lf = [];
			if (rows.length < 2) { lf.push(...rows[0].children); } else { const sec = Array.from(rows[1].children); let k = 0; Array.from(rows[0].children).forEach((th) => { if (th.colSpan > 1) { for (let q = 0; q < th.colSpan; q++) { lf.push(sec[k++]); } } else { lf.push(th); } }); }
			const r = lf[idx].querySelector('.lpn-rpt-colgrip').getBoundingClientRect();
			return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		}, i);
		const openFire = async () => {
			await dock.openBox(a, 'lpn_ff_box');
			await setRow('#lpn_ff_controls', (await lg('lpn_ff_design')), 'all');
			await runBtn('#lpn_ff_controls');
			await waitReport('#lpn_ff_report');
			await a.settle(300);
		};
		const copyHtml = async () => {
			await page.evaluate(() => { window.__clip = null; });
			await page.click('#lpn_ff_copyhtml');
			await a.settle(300);
			return page.evaluate(() => (window.__clip && window.__clip['text/html']) || '');
		};
		const printHtml = async () => {
			await page.evaluate(() => { window.__printed = null; });
			await page.click('#lpn_ff_print');
			await a.settle(300);
			return page.evaluate(() => window.__printed || '');
		};
		const COL = 3;
		const dragBy = async (i, dx) => {
			const g = await gripBox(i);
			await page.mouse.move(g.x, g.y); await page.mouse.down(); await page.mouse.move(g.x + dx / 2, g.y, { steps: 4 }); await page.mouse.move(g.x + dx, g.y, { steps: 4 }); await page.mouse.up();
			await a.settle(300);
		};

		await openFire();
		const s0 = await ffState();
		ok('Fire flow: every column has a divider', s0.grips === s0.nleaf && s0.nleaf > 5, s0.grips + '/' + s0.nleaf);
		ok('Fire flow at automatic widths: no sideways scroll, no fixed layout, nothing stored', s0.scroll <= 1 && !s0.colgroup && !s0.sized && s0.stored === null, 'scroll ' + s0.scroll + ' stored ' + s0.stored);
		const arrowHit = await page.evaluate(() => {
			const arrows = Array.from(document.querySelectorAll('#lpn_ff_report th .lpn-ff-sortarrow')); let clear = 0;
			arrows.forEach((a) => { const r = a.getBoundingClientRect(); const e = document.elementFromPoint(r.right - 1.5, r.top + r.height / 2); if (e === a) { clear++; } });
			return { n: arrows.length, clear };
		});
		ok('the whole sort arrow of every heading is clickable (the divider does not cover its right half)', arrowHit.n > 5 && arrowHit.clear === arrowHit.n, JSON.stringify(arrowHit));
		const copy0 = await copyHtml(), print0 = await printHtml();

		// ---- a real drag ----
		await dragBy(COL, 90);
		const s1 = await ffState();
		ok('drag: the column grew by about the drag', Math.abs((s1.widths[COL] - s0.widths[COL]) - 90) <= 4, s0.widths[COL] + ' -> ' + s1.widths[COL]);
		ok('drag: the table still fills its box (undragged columns refit around the dragged one)', s1.tableW >= s1.boxW - 2 && s1.tableW <= s1.boxW + 120 && s1.sized, s1.tableW + '/' + s1.boxW + ' scroll ' + s1.scroll);
		ok('drag: the width is stored under lpn_rptcols, in the report\'s own key', !!s1.stored && /lpn_ff_report/.test(s1.stored), String(s1.stored));
		const copy1 = await copyHtml(), print1 = await printHtml();
		ok('drag: Copy HTML is exactly what it was before the drag, with no screen widths', copy1 === copy0 && !/lpn-rpt-(sized|colgrip|gripth|cg)/.test(copy1) && !/px;?["']?\s*>?\s*<col /.test(copy1), copy1.length + ' vs ' + copy0.length);
		ok('drag: the printed sheet is the same as before the drag and carries no dragged layout', print1 === print0 && print1.length > 500 && !/colgroup|table-layout|lpn-rpt-(sized|colgrip|gripth|cg)|<col[ >]/i.test(print1), print1.length + ' vs ' + print0.length);
		// A drag that goes nowhere is no change, and a second column is independent.
		await dragBy(COL + 2, -30);
		const s2 = await ffState();
		ok('a second column dragged narrower changes only itself', Math.abs(s2.widths[COL] - s1.widths[COL]) <= 1.5 && s2.widths[COL + 2] < s1.widths[COL + 2] - 20, s1.widths[COL + 2] + ' -> ' + s2.widths[COL + 2]);
		const stored2 = s2.stored;

		// ---- survives closing and reopening the report ----
		await closeBox('lpn_ff_box');
		await openFire();
		const s3 = await ffState();
		ok('reopened: both dragged widths are back', Math.abs(s3.widths[COL] - s2.widths[COL]) <= 1.5 && Math.abs(s3.widths[COL + 2] - s2.widths[COL + 2]) <= 1.5, s3.widths[COL] + ', ' + s3.widths[COL + 2]);
		await closeBox('lpn_ff_box');

		// ---- survives a reload ----
		await a.reload();
		await prep();
		await openFire();
		const s4 = await ffState();
		ok('after a reload: the widths are back, from this browser', Math.abs(s4.widths[COL] - s2.widths[COL]) <= 1.5 && s4.stored === stored2, s4.widths[COL] + ' vs ' + s2.widths[COL]);
		ok('after a reload the table is in its dragged layout (sideways scroll inside the report is then allowed)', s4.sized && s4.boxW > 0, 'scroll ' + s4.scroll);

		// ---- double-click resets one column ----
		let g = await gripBox(COL);
		await page.mouse.dblclick(g.x, g.y);
		await a.settle(300);
		const s5 = await ffState();
		ok('double-click: that column is back to its automatic width', Math.abs(s5.widths[COL] - s0.widths[COL]) <= 12 && s5.widths[COL] < s2.widths[COL] - 50, s5.widths[COL] + ' vs ' + s0.widths[COL]);
		ok('double-click: the other dragged column keeps its width', Math.abs(s5.widths[COL + 2] - s2.widths[COL + 2]) <= 3, s5.widths[COL + 2] + ' vs ' + s2.widths[COL + 2]);
		g = await gripBox(COL + 2);
		await page.mouse.dblclick(g.x, g.y);
		await a.settle(300);
		const s6 = await ffState();
		ok('both reset: automatic layout again, fitting the box, nothing stored', !s6.colgroup && !s6.sized && s6.scroll <= 1 && s6.stored === null && s6.widths.every((w, i) => Math.abs(w - s0.widths[i]) <= 1.5), 'scroll ' + s6.scroll + ' stored ' + s6.stored);

		// ---- sideways scroll survives pressing, dragging and resetting a divider; undragged columns refit ----
		const wrapState = () => page.evaluate(() => { const w = document.querySelector('#lpn_ff_report .lpn-ff-tablewrap'); return { sl: Math.round(w.scrollLeft), max: w.scrollWidth - w.clientWidth }; });
		await dragBy(COL, 900);
		await page.evaluate((idx) => {
			const t = document.querySelector('#lpn_ff_report table.lpn-ff-table'), w = t.closest('.lpn-ff-tablewrap'), th = t.querySelector('.lpn-rpt-colgrip').closest('tr').children[idx];
			w.scrollLeft = Math.max(1, th.offsetLeft + th.offsetWidth - w.clientWidth + 120);
		}, COL + 2);
		const w0 = await wrapState();
		ok('widened past the box: the report scrolls sideways inside itself', w0.max > 100 && w0.sl > 0, JSON.stringify(w0));
		g = await gripBox(COL + 2);
		await page.mouse.move(g.x, g.y); await page.mouse.down(); await page.mouse.up(); await a.settle(200);
		const w1 = await wrapState();
		ok('pressing a divider keeps the scroll', Math.abs(w1.sl - w0.sl) <= 1, w0.sl + ' -> ' + w1.sl);
		const b0 = (await ffState()).widths[COL + 2];
		g = await gripBox(COL + 2);
		await page.mouse.move(g.x, g.y); await page.mouse.down(); await page.mouse.move(g.x + 25, g.y, { steps: 3 });
		const wMid = await wrapState();
		await page.mouse.move(g.x + 50, g.y, { steps: 3 }); await page.mouse.up(); await a.settle(200);
		const w2 = await wrapState(), b1 = (await ffState()).widths[COL + 2];
		ok('dragging a divider far to the right does not jump the scroll', Math.abs(wMid.sl - w0.sl) <= 1 && Math.abs(w2.sl - w0.sl) <= 1 && Math.abs((b1 - b0) - 50) <= 4, w0.sl + ' -> ' + wMid.sl + ' -> ' + w2.sl + '; width ' + b0 + ' -> ' + b1);
		g = await gripBox(COL + 2);
		await page.mouse.dblclick(g.x, g.y); await a.settle(300);
		const w3 = await wrapState(), s7 = await ffState();
		ok('double-click on a divider reached by scrolling resets that column and keeps the scroll', Math.abs(w3.sl - w0.sl) <= 1 && !/\|pressure at required flow\W/.test('') && s7.stored && JSON.parse(s7.stored).lpn_ff_report && Object.keys(JSON.parse(s7.stored).lpn_ff_report).length === 1, w0.sl + ' -> ' + w3.sl + ' stored ' + s7.stored);
		// Resize the box: undragged columns follow it, larger and smaller (COL is dragged wide; the table now fills the box).
		await dragBy(COL, -880);
		const r0 = await page.evaluate(() => { const b = document.getElementById('lpn_ff_box'); const t = document.querySelector('#lpn_ff_report table.lpn-ff-table'); return { box: b.getBoundingClientRect().width, t: t.getBoundingClientRect().width, body: t.closest('.lpn-ff-tablewrap').clientWidth }; });
		const sizeBox = (dw) => page.evaluate((d) => {
			const b = document.getElementById('lpn_ff_box'); b.style.width = (b.getBoundingClientRect().width + d) + 'px';
			const t = document.querySelector('#lpn_ff_report table.lpn-ff-table'), w = t.closest('.lpn-ff-tablewrap'), ths = Array.from(t.querySelector('thead tr').children);
			return new Promise((res) => setTimeout(() => res({ t: Math.round(t.getBoundingClientRect().width), body: w.clientWidth, scroll: w.scrollWidth - w.clientWidth, other: Math.round(ths.filter((th) => !th.classList.contains('lpn-rpt-dc')).reduce((n, th) => n + th.getBoundingClientRect().width, 0)) }), 200));
		}, dw);
		const big = await sizeBox(300), small = await sizeBox(-300);
		ok('box made larger: the table fills it and the undragged columns took the room', big.body > r0.body + 200 && Math.abs(big.t - big.body) <= 2 && big.other > small.other + 200, JSON.stringify({ r0, big, small }));
		ok('box made smaller again: the table follows, no blank space', Math.abs(small.t - small.body) <= 2 || small.scroll > 0, JSON.stringify(small));
		g = await gripBox(COL); await page.mouse.dblclick(g.x, g.y); await a.settle(300);
		ok('everything reset at the end: automatic layout, nothing stored', (await ffState()).stored === null);
		await closeBox('lpn_ff_box');

		// ---- other reports carry dividers and fit at automatic widths ----
		await dock.openBox(a, 'lpn_scncmp_box');
		await a.waitFor(() => page.evaluate(() => !!document.querySelector('#lpn_scncmp_report tbody tr')), 'the comparison table', 600000);
		const cmp = await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_scncmp_report table.lpn-ff-table')).map((t) => {
			const w = t.closest('.lpn-ff-tablewrap'); return { grips: t.querySelectorAll('.lpn-rpt-colgrip').length, scroll: w.scrollWidth - w.clientWidth };
		}));
		ok('Scenario comparison: dividers on every table, no sideways scroll at automatic widths', cmp.length > 0 && cmp.every((t) => t.grips > 1 && t.scroll <= 1), JSON.stringify(cmp));
		await closeBox('lpn_scncmp_box');

		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\nFAILED: ' + fails : '\nreport-column-drag-browser-harness: all ok');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
