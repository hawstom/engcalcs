// EVERY PRINTED REPORT FITS ITS SHEET AND BREAKS NO WORD (Task 829, Tom 2026-10-25: *"It works. Some of
// the column widths need tweaking."* after printing the reports to PDF).
//   node dev/lpn-spike/report-print-widths-browser-harness.js
// (it takes /tmp/engcalcs-browser.lock itself; never wrap it in that lock).
//
// Net1, 24-hour clock, two scenarios. Each report box's Print report sheet is laid out as paper:
// print media, a viewport as wide as the printable width of US Letter (1 in margins) and of A4.
// For each sheet: no table is wider than the sheet; no WORD of any cell, heading or figure is broken
// across lines (a heading may wrap only at its spaces); and a figure is never parted from its unit.
//
// Task 829 (Tom, 2026-10-26) adds, for every report table on SCREEN and on PAPER: a column whose figures
// share one unit has bare numbers and "Heading (unit)" (units in the heading, not the cells); every asset
// id column is as wide as N9999 and holds it on one line; Type and Status may be cut with an ellipsis,
// the whole text in the cell's title.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_RPTWID_LOCKED';
if (process.env[LOCK_ENV] !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' }) });
		if (r.status === 75) { console.error('report-print-widths-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
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
		const d = JSON.parse(fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', 'Net1.lwn'), 'utf8'));
		d.scenarios.push({ id: 'smax', name: 'Max day', overrides: {}, demandMultiplier: 1.8 });
		d.project = Object.assign({}, d.project, { name: 'Elm Street', activeScenario: 'base' });
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
		await page.evaluate(() => { EngCalcs.lpnTimeRunNow(); });
		await a.waitFor(() => a.page.evaluate(() => EngCalcs.lpnTimeRunState().frames > 1), 'Net1 EPS frames', 120000);

		// Capture what the page puts on the clipboard and on paper.
		await page.evaluate(() => {
			window.__clip = null; window.__print = null;
			Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
				write: async (items) => {
					const it = items[0], out = {};
					for (const t of it.types) { out[t] = await (await it.getType(t)).text(); }
					window.__clip = out;
				},
				writeText: async (t) => { window.__clip = { 'text/plain': t }; }
			} });
			window.print = function () { window.__printed = true; };
		});
		const runLabel = await a.lang('lpn_ff_calculate');
		const pressRun = async (controls, label) => {
			const btns = await page.$$(controls + ' button.lpn-ff-run');
			for (const b of btns) { if (((await b.textContent()) || '').trim() === label) { await b.click(); return; } }
			throw new Error('no ' + label + ' button in ' + controls);
		};
		const waitReport = (sel) => a.waitFor(() => page.evaluate((s) => {
			const r = document.querySelector(s), box = document.getElementById('lpn_ff_run_box');
			return !!r && !!r.querySelector('tbody tr') && (!box || box.style.display === 'none');
		}, sel), 'a table in ' + sel, 300000);

		const PAPERS = [['US Letter', 624], ['A4', 601]];
		const measure = (paperW) => page.evaluate((W) => {
			const area = document.getElementById('lpn_print_area');
			if (!area) { return null; }
			const sheet = area.getBoundingClientRect().width, out = { sheet, tables: [], broken: [], parted: [], idBad: [], unitBad: [], truncBad: [], ids: 0 };
			const probe = (el, text) => { const sp = document.createElement('span'); sp.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;'; sp.textContent = text; el.appendChild(sp); const w = sp.getBoundingClientRect().width; el.removeChild(sp); return w; };
			const UNIT = /^((?:[^\d]*\s)?)([-\u2212]?\d[\d.,]*)\s*(%|[A-Za-z\u00b0\u00b5\u03bc][^\s\d.,]*(?: H2O)?)$/, BARE = /^[-\u2212]?\d[\d.,]*$/;
			const cu = (t) => { t = t.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim(); if (!/\d/.test(t) || BARE.test(t)) { return ''; } const m = UNIT.exec(t); return m ? m[3] : null; };
			area.querySelectorAll('table').forEach((t, ti) => {
				const r = t.getBoundingClientRect();
				out.heads = (out.heads || []).concat(Array.from(t.querySelectorAll('thead th')).map((h) => h.textContent.trim()));
				out.tables.push({ i: ti, width: r.width, right: r.right - area.getBoundingClientRect().left, cols: t.rows[0] ? t.rows[0].cells.length : 0 });
				const ths = ((tb) => { const rs = Array.from(tb.querySelectorAll('thead tr')); if (rs.length < 2) { return Array.from(tb.querySelectorAll('thead th')); } const sec = Array.from(rs[1].children), lf = []; let k = 0; Array.from(rs[0].children).forEach((th) => { if (th.colSpan > 1) { for (let i = 0; i < th.colSpan; i++) { lf.push(sec[k++]); } } else { lf.push(th); } }); return lf; })(t), trs = Array.from(t.querySelectorAll('tbody tr'));
				ths.forEach((th, c) => {
					const cells = trs.map((tr) => tr.children[c]).filter(Boolean);
					if (th.classList.contains('lpn-rpt-id')) {
						out.ids++;
						const need = probe(th, 'N9999');
						cells.concat([th]).forEach((cell) => {
							const cs = getComputedStyle(cell), inner = cell.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
							if (inner + 0.5 < need) { out.idBad.push('table ' + ti + ' col ' + c + ': ' + Math.round(inner) + ' < ' + Math.round(need) + ' px'); }
						});
						return;
					}
					const us = cells.map((cell) => cu(cell.textContent));
					const uniq = Array.from(new Set(us.filter((u) => u)));
					if (us.every((u) => u !== null) && uniq.length === 1) { out.unitBad.push('table ' + ti + ' col ' + c + ' "' + th.textContent.trim() + '" cells still carry "' + uniq[0] + '"'); }
				});
				t.querySelectorAll('.lpn-rpt-trunc').forEach((sp) => { if (!sp.title) { out.truncBad.push(sp.textContent); } });
				Array.from(t.querySelectorAll('th, td')).forEach((c) => {
					const w = document.createTreeWalker(c, NodeFilter.SHOW_TEXT);
					let n;
					while ((n = w.nextNode())) {
						const s = n.nodeValue, re = /[^\s]+/g;
						let m;
						while ((m = re.exec(s))) {
							const rg = document.createRange();
							rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length);
							const rects = Array.from(rg.getClientRects()).filter((q) => q.width > 0);
							if (rects.length && Math.max.apply(null, rects.map((q) => q.top)) - Math.min.apply(null, rects.map((q) => q.top)) > 3) {
								out.broken.push('table ' + ti + ': "' + m[0] + '" in "' + c.textContent.trim().slice(0, 40) + '"');
							}
						}
						// A figure and its unit sit together: a "number unit" cell stays on one line.
						if (/^\s*[-−]?\d[\d.,]*\s+\S+(\s+H2O)?\s*$/.test(s)) {
							const rg = document.createRange(); rg.selectNodeContents(n);
							const rs = Array.from(rg.getClientRects()).filter((q) => q.width > 0);
							if (rs.length && Math.max.apply(null, rs.map((q) => q.top)) - Math.min.apply(null, rs.map((q) => q.top)) > 3) {
								out.parted.push('table ' + ti + ': "' + s.trim() + '"');
							}
						}
					}
				});
			});
			return out;
		}, paperW);
		const checkScreen = async (label, boxId) => {
			const r = await page.evaluate((id) => {
				const UNIT = /^((?:[^\d]*\s)?)([-\u2212]?\d[\d.,]*)\s*(%|[A-Za-z\u00b0\u00b5\u03bc][^\s\d.,]*(?: H2O)?)$/, BARE = /^[-\u2212]?\d[\d.,]*$/;
				const cu = (t) => { t = t.replace(/\s+/g, ' ').trim(); if (!/\d/.test(t) || BARE.test(t)) { return ''; } const m = UNIT.exec(t); return m ? m[3] : null; };
				const out = { tables: 0, headed: [], leftover: [], noParen: [], idBad: [], mixed: [], ids: 0 };
				document.querySelectorAll('#' + id + ' table.lpn-ff-table').forEach((t, ti) => {
					out.tables++;
					const ths = ((tb) => { const rs = Array.from(tb.querySelectorAll('thead tr')); if (rs.length < 2) { return Array.from(tb.querySelectorAll('thead th')); } const sec = Array.from(rs[1].children), lf = []; let k = 0; Array.from(rs[0].children).forEach((th) => { if (th.colSpan > 1) { for (let i = 0; i < th.colSpan; i++) { lf.push(sec[k++]); } } else { lf.push(th); } }); return lf; })(t), trs = Array.from(t.querySelectorAll('tbody tr'));
					ths.forEach((th, c) => {
						const cells = trs.map((tr) => tr.children[c]).filter(Boolean), hu = th.getAttribute('data-ec-hu');
						const probe = (el, text) => { const sp = document.createElement('span'); sp.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;'; sp.textContent = text; el.appendChild(sp); const w = sp.getBoundingClientRect().width; el.removeChild(sp); return w; };
						if (th.classList.contains('lpn-rpt-id')) {
							out.ids++;
							const need = probe(th, 'N9999');
							cells.forEach((cell) => { const cs = getComputedStyle(cell), inner = cell.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight); if (inner + 0.5 < need) { out.idBad.push('table ' + ti + ' col ' + c + ': ' + Math.round(inner) + ' < ' + Math.round(need)); } });
							return;
						}
						const us = cells.map((cell) => cu(cell.textContent)), uniq = Array.from(new Set(us.filter((u) => u)));
						if (hu) {
							out.headed.push(th.textContent.trim());
							if (!/\(.+\)/.test(th.textContent) || th.textContent.replace(/\u00a0/g, ' ').indexOf(hu) < 0) { out.noParen.push(th.textContent.trim()); }
							if (uniq.length) { out.leftover.push(th.textContent.trim() + ' cells carry ' + uniq.join('/')); }
							const bd = th.querySelector('bdi');
							if (!bd) { out.noParen.push('no bdi in ' + th.textContent.trim()); }
							// A heading's unit may split across lines (Tom, 2026-10-27), so its rects are not checked.
						} else if (us.every((u) => u !== null) && uniq.length === 1) { out.leftover.push('"' + th.textContent.trim() + '" cells carry ' + uniq[0]); }
						else if (uniq.length > 1) { out.mixed.push(th.textContent.trim() + ' [' + uniq.join(' | ') + ']'); }
					});
				});
				return out;
			}, boxId.replace('_box', '_report') === 'lpn_ds_report' ? 'lpn_ds_box' : boxId.replace('_box', '_report'));
			console.log('  screen ' + label + ': headed columns: ' + (r.headed.join(' ; ') || '(none)') + (r.mixed.length ? '   MIXED-UNIT COLUMNS: ' + r.mixed.join(' ; ') : ''));
			ok(label + ' (screen): there is a table', r.tables >= 1, r.tables);
			ok(label + ' (screen): units are in the headings, not the cells', r.leftover.length === 0, r.leftover.slice(0, 4).join(' ; '));
			ok(label + ' (screen): a moved unit reads "Heading (unit)" with the unit isolated', r.noParen.length === 0, r.noParen.slice(0, 4).join(' ; '));
			ok(label + ' (screen): every asset id column holds N9999 (' + r.ids + ' id columns)', r.idBad.length === 0, r.idBad.slice(0, 4).join(' ; '));
			return r;
		};
		// COPY HTML pasted into a word processor (Tom pasted it into Google Docs: equal columns, "Junctio|n").
		// The copy is loaded in a fresh page, 6.5 in wide, with a FIXED table layout (columns take their
		// stated widths, as Docs lays them out), and no word of any cell or heading may break across lines.
		// Real Google Docs and Word pastes are NOT tested here.
		const checkCopy = async (label, prefix) => {
			await page.evaluate(() => { window.__clip = null; });
			await page.click('#' + prefix + '_copyhtml');
			await a.waitFor(() => page.evaluate(() => !!(window.__clip && window.__clip['text/html'])), 'copied html', 15000);
			const html = await page.evaluate(() => window.__clip['text/html']);
			const p2 = await page.context().newPage();
			const wide = await p2.evaluate(() => 0).then(() => null);
			for (const layout of ['auto', 'fixed']) {
				await p2.setViewportSize({ width: 624, height: 900 });
				await p2.setContent('<!doctype html><html><body style="margin:0"><div id="w" style="width:6.5in"><style>table{table-layout:' + layout + ';}</style>' + html + '</div></body></html>');
				const r = await p2.evaluate(() => {
					const out = { broken: [], over: [], tables: 0, noClip: [] };
					const w = document.getElementById('w').getBoundingClientRect();
					document.querySelectorAll('table').forEach((t, ti) => {
						out.tables++;
						if (t.getBoundingClientRect().right > w.right + 0.5) { out.over.push('table ' + ti); }
						if (!t.querySelector('colgroup col[width]')) { out.noClip.push('no col widths in table ' + ti); }
						t.querySelectorAll('th, td').forEach((c) => {
							const tw = document.createTreeWalker(c, NodeFilter.SHOW_TEXT); let n;
							while ((n = tw.nextNode())) {
								const re = /[^\s\u00a0]+/g; let m;
								while ((m = re.exec(n.nodeValue))) {
									const rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length);
									const rs = Array.from(rg.getClientRects()).filter((q) => q.width > 0);
									if (rs.length && Math.max.apply(null, rs.map((q) => q.top)) - Math.min.apply(null, rs.map((q) => q.top)) > 3) { out.broken.push('"' + m[0] + '"'); }
								}
							}
						});
					});
					return out;
				});
				ok(label + ' Copy HTML (' + layout + ' layout, 6.5 in): has a table with column widths', r.tables >= 1 && r.noClip.length === 0, r.noClip.join(','));
				ok(label + ' Copy HTML (' + layout + ' layout, 6.5 in): no word is broken', r.broken.length === 0, r.broken.slice(0, 6).join(' '));
				ok(label + ' Copy HTML (' + layout + ' layout, 6.5 in): the table is within the page', r.over.length === 0, r.over.join(','));
			}
			await p2.close();
		};
		const checkPrint = async (label, boxId, prefix) => {
			console.log('\n--- ' + label + ' ---');
			await checkScreen(label, boxId);
			await checkCopy(label, prefix);
			await page.evaluate(() => { window.__printed = false; });
			await page.click('#' + prefix + '_print');
			await a.settle(200);
			await page.emulateMedia({ media: 'print' });
			for (const [paper, w] of PAPERS) {
				// body margin is 8px each side in print too: make the printable sheet exactly w wide.
				await page.setViewportSize({ width: w, height: 900 });
				await a.settle(150);
				const m = await measure(w);
				ok(label + ' on ' + paper + ': there is a sheet with tables', !!m && m.tables.length >= 1, m && m.sheet);
				if (!m) { continue; }
				ok(label + ' on ' + paper + ': every table fits the sheet width (' + Math.round(m.sheet) + ' px)',
					m.tables.every((t) => t.right <= m.sheet + 0.5), m.tables.map((t) => Math.round(t.right) + '/' + t.cols + 'cols').join(' '));
				ok(label + ' on ' + paper + ': no word is broken across lines', m.broken.length === 0, m.broken.slice(0, 6).join(' ; '));
				ok(label + ' on ' + paper + ': no figure is parted from its unit', m.parted.length === 0, m.parted.slice(0, 4).join(' ; '));
				ok(label + ' on ' + paper + ': units are in the headings, not the cells', m.unitBad.length === 0, m.unitBad.slice(0, 4).join(' ; '));
				ok(label + ' on ' + paper + ': every asset id column holds N9999 on one line (' + m.ids + ' id columns)', m.idBad.length === 0, m.idBad.slice(0, 4).join(' ; '));
				if (label === 'Full report') { ok(label + ' on ' + paper + ': the printed concentration heading is the short one, with its unit', (m.heads || []).some((h) => /conc\.\s*\(/.test(h)), (m.heads || []).join('|')); }
				ok(label + ' on ' + paper + ': a cut-off word carries its whole text in its title', m.truncBad.length === 0, m.truncBad.join(','));
			}
			if (process.env.RPT_PDF_DIR) { await page.pdf({ path: path.join(process.env.RPT_PDF_DIR, prefix + '.pdf'), format: 'Letter', margin: { top: '1in', bottom: '1in', left: '1in', right: '1in' } }); }
			await page.emulateMedia({ media: 'screen' });
			await page.setViewportSize({ width: 1700, height: 1000 });
			await page.evaluate(() => { const b = document.getElementById('lpn_print_area'); if (b) { b.remove(); } document.body.classList.remove('lpn-printing-table'); });
		};
		const closeBox = async (id) => { await page.evaluate((i) => { const x = document.querySelector('#' + i + ' .lpn-popover-x'); if (x) { x.click(); } }, id); await a.settle(250); };

		await dock.openBox(a, 'lpn_ff_box');
		await pressRun('#lpn_ff_controls', runLabel);
		await waitReport('#lpn_ff_report');
		await checkPrint('Fire flow box', 'lpn_ff_box', 'lpn_ff');
		// A language chooses its own bracket through the ONE template key (Chinese full-width brackets).
		const tplHead = async (tpl) => {
			await page.evaluate((t) => { EngCalcs.pageConfig.lpn_heading_unit = t; }, tpl);
			await page.click('#lpn_ff_report th.lpn-ff-sortable');
			await a.settle(300);
			return page.evaluate(() => Array.from(document.querySelectorAll('#lpn_ff_report thead th')).map((t) => t.textContent.trim()).join('|'));
		};
		ok('Fire flow: the heading follows the template key (full-width brackets)', /\uFF08(psi|gpm|m H2O|L\/s|kPa)\uFF09/.test(await tplHead('{label}\uFF08{unit}\uFF09')));
		ok('Fire flow: the unit sits in a bdi so a right-to-left heading does not flip it', await page.evaluate(() => !!document.querySelector('#lpn_ff_report thead th bdi')));
		await tplHead('{label} ({unit})');
		await closeBox('lpn_ff_box');

		await dock.openBox(a, 'lpn_crit_box');
		await pressRun('#lpn_crit_controls', runLabel);
		await waitReport('#lpn_crit_report');
		await checkPrint('Criticality analysis', 'lpn_crit_box', 'lpn_crit');
		await closeBox('lpn_crit_box');

		await dock.openBox(a, 'lpn_ds_box');
		await pressRun('#lpn_ds_controls', await a.lang('lpn_ff_calculate'));
		await waitReport('#lpn_ds_box');
		await checkPrint('Demand scaling', 'lpn_ds_box', 'lpn_ds');
		await closeBox('lpn_ds_box');

		await dock.openBox(a, 'lpn_energy_box');
		await a.settle(500);
		await checkPrint('Pump energy box', 'lpn_energy_box', 'lpn_energy');
		await closeBox('lpn_energy_box');

		await dock.openBox(a, 'lpn_scncmp_box');
		await a.waitFor(() => page.evaluate(() => !!document.querySelector('#lpn_scncmp_report tbody tr')), 'the comparison table', 120000);
		await checkPrint('Scenario comparison', 'lpn_scncmp_box', 'lpn_scncmp');
		await closeBox('lpn_scncmp_box');

		await dock.openBox(a, 'lpn_status_box');
		await a.settle(500);
		await checkPrint('Status changes', 'lpn_status_box', 'lpn_status');
		await closeBox('lpn_status_box');

		await dock.openBox(a, 'lpn_calib_box');
		await a.settle(300);
		const calibFile = '/tmp/claude-1000/rptbtn-pressure.dat';
		fs.writeFileSync(calibFile, '; pressure\n 10 0 50\n 11 6 40\n 12 12 45\n 13 18 42\n 21 24 38\n');
		await page.setInputFiles('#lpn_calib_file', calibFile);
		await a.waitFor(() => page.evaluate(() => !!document.querySelector('#lpn_calib_report tbody tr')), 'the calibration table', 60000);
		await checkPrint('Calibration report', 'lpn_calib_box', 'lpn_calib');
		await closeBox('lpn_calib_box');

		await dock.openBox(a, 'lpn_full_box');
		await a.settle(500);
		await checkPrint('Full report', 'lpn_full_box', 'lpn_full');
		await closeBox('lpn_full_box');
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\nFAILED: ' + fails : '\nreport-print-widths-browser-harness: all ok');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
