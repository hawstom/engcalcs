// THE ANALYSIS REPORTS FIT THEIR BOX, AND COPY HTML PASTES WITH ONLY ITS HEADINGS BOLD (Task 840 follow-up).
//   node dev/lpn-spike/report-width-browser-harness.js
// (it takes /tmp/engcalcs-browser.lock itself; never wrap it in that lock).
//
// Tom, 2026-10-27: "this approach, if not applied with aggressive economy, can result in more wasted
// width ... let's see if we can debug (microtweak) what made them wider." Net3 with a second scenario,
// the box at its first-open width. Measured 2026-10-27 at an 814 px box: Scenario comparison 1213 px
// (the box grid's `minmax(max-content, 1fr)` track took the one-line width of a table and of its long
// notes), Fire flow 1018 px (an 18 px sort gutter on each of 13 headings). Now Scenario comparison
// fills the box (642 px at its narrowest), Fire flow needs 787 px at its narrowest, Criticality 814.
// Also: "Time (hr)" and "And others" headings; "Static failed, so not checked" is one cell across
// its three columns; and Copy HTML says every weight (Tom's paste into Google Docs came out all bold).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_RPTWIDTH_LOCKED';
if (process.env[LOCK_ENV] !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' }) });
		if (r.status === 75) { console.error('report-width-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
// The widest a table may be at its narrowest layout (its min-content), in px, with slack over what was measured.
const MAX_FF_MIN = 830, MAX_CMP_MIN = 700, MAX_CRIT = 816;
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
		await a.reload();
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
		await page.setViewportSize({ width: 1700, height: 1000 });
		await a.settle(2500);
		await page.evaluate(() => {
			window.__clip = null;
			Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
				write: async (items) => { const it = items[0], out = {}; for (const t of it.types) { out[t] = await (await it.getType(t)).text(); } window.__clip = out; },
				writeText: async (t) => { window.__clip = { 'text/plain': t }; }
			} });
		});
		const lg = async (k) => (await a.lang(k)).trim();
		const runLabel = await lg('lpn_ff_calculate');
		ok('the "More affected" heading is now "And others"', (await lg('lpn_ff_col_more')) === 'And others', await lg('lpn_ff_col_more'));
		ok('the report Time heading is now "Time (hr)"', (await lg('lpn_full_col_time')) === 'Time (hr)', await lg('lpn_full_col_time'));
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
		// Every table in the box: its width as laid out, at its narrowest (min-content), the scroll of its wrap,
		// the heading of each leaf column, and each body row's cell spans.
		const measure = (id) => page.evaluate((i) => {
			const box = document.getElementById(i), body = box.querySelector('.lpn-popover-body');
			return Array.from(box.querySelectorAll('table.lpn-ff-table')).map((t) => {
				const wrap = t.closest('.lpn-ff-tablewrap'), rows = Array.from(t.querySelectorAll('thead tr')), lf = [];
				if (rows.length < 2) { lf.push(...rows[0].children); } else { const sec = Array.from(rows[1].children); let k = 0; Array.from(rows[0].children).forEach((th) => { if (th.colSpan > 1) { for (let q = 0; q < th.colSpan; q++) { lf.push(sec[k++]); } } else { lf.push(th); } }); }
				const w = t.getBoundingClientRect().width; t.style.width = 'min-content'; const wmin = t.getBoundingClientRect().width; t.style.width = '';
				const spans = Array.from(t.querySelectorAll('tbody tr')).map((tr) => Array.from(tr.children).reduce((n, td) => n + (td.colSpan || 1), 0));
				const wide = Array.from(t.querySelectorAll('tbody td')).filter((td) => td.colSpan > 1).map((td) => ({ n: td.colSpan, text: td.textContent.trim() }));
				return { w: Math.round(w), min: Math.round(wmin), body: Math.round(body.clientWidth), scroll: wrap.scrollWidth - wrap.clientWidth,
					broken: Array.from(t.querySelectorAll('tbody td')).filter((td) => {
						const cs = getComputedStyle(td), inner = td.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
						const words = (td.textContent || '').split(/\s+/).filter(Boolean); if (!words.length || td.colSpan > 1) { return false; }
						const sp = document.createElement('span'); sp.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;font:' + cs.font + ';letter-spacing:' + cs.letterSpacing;
						document.body.appendChild(sp); let mx = 0; words.forEach((wd) => { sp.textContent = wd; mx = Math.max(mx, sp.getBoundingClientRect().width); }); sp.remove();
						return mx > inner + 1;
					}).map((td) => td.textContent.trim().slice(0, 30)),
					heads: lf.map((th) => th.textContent.replace(/\s+/g, ' ').trim()), nleaf: lf.length, spans, wide };
			});
		}, id);
		// The Copy HTML string of a report, and what a document editor would draw of it.
		const copyHtml = async (prefix) => {
			await page.evaluate(() => { window.__clip = null; });
			await page.click('#' + prefix + '_copyhtml');
			await a.settle(300);
			const html = await page.evaluate(() => (window.__clip && window.__clip['text/html']) || '');
			const drawn = await page.evaluate((h) => {
				const host = document.createElement('div'); host.style.cssText = 'position:absolute;left:-9999px;top:0;font-weight:700'; host.innerHTML = h; document.body.appendChild(host);
				const w = (el) => getComputedStyle(el).fontWeight;
				const r = { th: Array.from(host.querySelectorAll('th')).map(w), td: Array.from(host.querySelectorAll('td')).map(w),
					p: Array.from(host.querySelectorAll('p')).map((p) => ({ t: p.textContent.slice(0, 30), w: w(p) })),
					rowCells: Array.from(host.querySelectorAll('tbody tr')).map((tr) => tr.children.length),
					leaf: 0 };
				const hr = host.querySelectorAll('thead tr'); r.leaf = hr.length ? Array.from(hr[hr.length - 1].children).length + (hr.length > 1 ? Array.from(hr[0].children).filter((x) => x.rowSpan > 1).length : 0) : 0;
				host.remove(); return r;
			}, html);
			return { html, drawn };
		};
		const bold = (w) => w === 'bold' || +w >= 600;

		// ---- Criticality, one step ----
		await dock.openBox(a, 'lpn_crit_box');
		await runBtn('#lpn_crit_controls');
		await waitReport('#lpn_crit_report');
		const crit = await measure('lpn_crit_box');
		ok('Criticality: the table fits its box with no sideways scroll', crit.length > 0 && crit.every((t) => t.scroll <= 1 && t.w <= MAX_CRIT), crit.map((t) => t.w + '/' + t.body + ' scroll ' + t.scroll).join(', '));
		ok('Criticality: no body cell breaks a word', crit.every((t) => t.broken.length === 0), crit.map((t) => t.broken.slice(0, 3).join('/')).join(', '));
		await closeBox('lpn_crit_box');

		// ---- Scenario comparison ----
		await dock.openBox(a, 'lpn_scncmp_box');
		await a.waitFor(() => page.evaluate(() => !!document.querySelector('#lpn_scncmp_report tbody tr')), 'the comparison table', 600000);
		const cmp = await measure('lpn_scncmp_box');
		ok('Scenario comparison: every table fills its box and does not scroll sideways (was 1213 px in 814)', cmp.length > 0 && cmp.every((t) => t.w <= t.body + 1 && t.scroll <= 1), cmp.map((t) => t.w + '/' + t.body + ' scroll ' + t.scroll).join(', '));
		ok('Scenario comparison: at its narrowest the table is under ' + MAX_CMP_MIN + ' px', cmp.every((t) => t.min <= MAX_CMP_MIN), cmp.map((t) => t.min).join(', '));
		ok('Scenario comparison: both Time columns read "Time (hr)"', cmp[0].heads.filter((h) => /^Time/.test(h)).length === 2 && cmp[0].heads.filter((h) => /^Time/.test(h)).every((h) => h === 'Time (hr)'), cmp[0].heads.join(' | '));
		ok('Scenario comparison: no body cell breaks a word', cmp.every((t) => t.broken.length === 0), cmp.map((t) => t.broken.slice(0, 3).join('/')).join(', '));
		ok('Scenario comparison: "The same in every scenario" has rows but no Label / Value heading row', await page.evaluate(() => { const b = document.getElementById('lpn_scncmp_box'); return b.querySelectorAll('.lpn-ghdr').length === 0 && b.querySelectorAll('.lpn-grow').length >= 2; }));
		const cc = await copyHtml('lpn_scncmp');
		ok('Scenario comparison Copy HTML: no <b> or <strong>', !/<(b|strong)[\s>]/i.test(cc.html));
		ok('Scenario comparison Copy HTML: body cells and paragraphs after the title draw normal, headings bold',
			cc.drawn.td.length > 0 && cc.drawn.td.every((w) => !bold(w)) && cc.drawn.th.length > 0 && cc.drawn.th.every(bold) && cc.drawn.p.slice(1).every((p) => !bold(p.w)),
			'td ' + Array.from(new Set(cc.drawn.td)) + ' th ' + Array.from(new Set(cc.drawn.th)) + ' p ' + cc.drawn.p.map((p) => p.w));
		await closeBox('lpn_scncmp_box');

		// ---- Fire flow, design check on, every junction ----
		await dock.openBox(a, 'lpn_ff_box');
		await setRow('#lpn_ff_controls', (await lg('lpn_ff_design')), 'all');
		await runBtn('#lpn_ff_controls');
		await waitReport('#lpn_ff_report');
		const ff = await measure('lpn_ff_box');
		const t0 = ff[0], why = await lg('lpn_ff_static_failed');
		ok('Fire flow: the table fits its box with no sideways scroll (was 1018 px in 814)', t0.scroll <= 1 && t0.w <= t0.body + 1, t0.w + '/' + t0.body + ' scroll ' + t0.scroll);
		ok('Fire flow: at its narrowest the table is under ' + MAX_FF_MIN + ' px', t0.min <= MAX_FF_MIN, String(t0.min));
		ok('Fire flow: no body cell breaks a word', t0.broken.length === 0, t0.broken.slice(0, 4).join(' / '));
		console.log('  info Fire flow width ' + t0.w + ' px, narrowest ' + t0.min + ' px, box ' + t0.body);
		ok('Fire flow: the last Worst effect heading reads "And others"', t0.heads.indexOf('And others') > 0, t0.heads.join(' | '));
		ok('Fire flow: a junction that failed static has the sentence once, across 3 columns', t0.wide.length > 0 && t0.wide.every((x) => x.n === 3 && x.text === why), JSON.stringify(t0.wide.slice(0, 2)));
		ok('Fire flow: every row still spans as many columns as the head has (' + t0.nleaf + ')', t0.spans.every((n) => n === t0.nleaf), Array.from(new Set(t0.spans)).join(','));
		ok('Fire flow: the unit still moves into the heading with a spanning cell in the table', t0.heads.some((h) => /^Pressure at required flow \(/.test(h)), t0.heads.join(' | '));
		const fc = await copyHtml('lpn_ff');
		ok('Fire flow Copy HTML: no <b> or <strong>', !/<(b|strong)[\s>]/i.test(fc.html));
		ok('Fire flow Copy HTML: body cells and paragraphs after the title draw normal, headings bold',
			fc.drawn.td.length > 0 && fc.drawn.td.every((w) => !bold(w)) && fc.drawn.th.length > 0 && fc.drawn.th.every(bold) && fc.drawn.p.slice(1).every((p) => !bold(p.w)),
			'td ' + Array.from(new Set(fc.drawn.td)) + ' th ' + Array.from(new Set(fc.drawn.th)) + ' p ' + fc.drawn.p.map((p) => p.w));
		ok('Fire flow Copy HTML: the title alone is a bold paragraph', bold(fc.drawn.p[0].w), JSON.stringify(fc.drawn.p[0]));
		ok('Fire flow Copy HTML: every body row has one cell per column, a spanned cell included', fc.drawn.rowCells.length > 0 && fc.drawn.rowCells.every((n) => n === t0.nleaf), Array.from(new Set(fc.drawn.rowCells)).join(','));
		await closeBox('lpn_ff_box');

		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\nFAILED: ' + fails : '\nreport-width-browser-harness: all ok');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
