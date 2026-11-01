// A VALUE WITH A PLACE OR A TIME IS SPLIT INTO COLUMNS UNDER A COMPOUND HEADING (Task 840).
//   node dev/lpn-spike/report-split-columns-browser-harness.js
// (it takes /tmp/engcalcs-browser.lock itself; never wrap it in that lock).
//
// Tom, 2026-10-27: "The conventional solution for this is to split the sentence into two columns with
// a compound heading". Net1 with a 24-hour clock and a second scenario. For Criticality (the whole
// run), Scenario comparison and Fire flow (design check on): no cell on screen, in Copy HTML or in
// the CSV is a sentence ("97.01 psi at 4:00", "N40 drops to 5.68 psi"); the screen table and the
// printed sheet have a two-row head with the group spanning its columns; Copy HTML is a real
// two-row <thead> with colspan (and rowspan 2 on a plain heading); the CSV has one header row
// reading "Group: Heading (unit)". A heading's unit may split across lines (no nowrap on it).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_RPTSPLIT_LOCKED';
if (process.env[LOCK_ENV] !== '1') {
	let has = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); has = true; } catch (e) { /* none */ }
	if (has) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' }) });
		if (r.status === 75) { console.error('report-split-columns-browser-harness: NOT RUN -- browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}
let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}
// A CSV as rows of cells (quoted cells honoured).
function parseCsv(t) {
	return t.replace(/^﻿/, '').split(/\r?\n/).filter((l) => l).map((l) => {
		const out = []; let cur = '', q = false;
		for (let i = 0; i < l.length; i++) {
			const ch = l[i];
			if (q) { if (ch === '"' && l[i + 1] === '"') { cur += '"'; i++; } else if (ch === '"') { q = false; } else { cur += ch; } }
			else if (ch === '"') { q = true; } else if (ch === ',') { out.push(cur); cur = ''; } else { cur += ch; }
		}
		out.push(cur); return out;
	});
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
		await page.evaluate(() => {
			window.__clip = null;
			Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
				write: async (items) => { const it = items[0], out = {}; for (const t of it.types) { out[t] = await (await it.getType(t)).text(); } window.__clip = out; },
				writeText: async (t) => { window.__clip = { 'text/plain': t }; }
			} });
			window.print = function () { window.__printed = true; };
		});
		const runLabel = (await a.lang('lpn_ff_calculate')).trim();
		const waitReport = (sel) => a.waitFor(() => page.evaluate((s) => {
			const r = document.querySelector(s), box = document.getElementById('lpn_ff_run_box');
			return !!r && !!r.querySelector('tbody tr') && (!box || box.style.display === 'none');
		}, sel), 'a table in ' + sel, 300000);
		const closeBox = async (id) => { await page.evaluate((i) => { const x = document.querySelector('#' + i + ' .lpn-popover-x'); if (x) { x.click(); } }, id); await a.settle(250); };
		// Sets the control in the row whose label starts with `label`.
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

		// What the three outputs say, for one box. `groups` is [heading, [its sub-headings]].
		const checkBox = async (label, boxId, prefix, groups, sentence, titleKey) => {
			console.log('\n--- ' + label + ' ---');
			const title = (await a.lang(titleKey)).trim();
			const scr = await page.evaluate((b) => {
				const t = document.querySelector('#' + b + ' .lpn-popover-body table.lpn-ff-table');
				const rows = Array.from(t.querySelectorAll('thead tr'));
				return {
					nrows: rows.length,
					top: Array.from(rows[0].children).map((th) => ({ text: th.textContent.trim(), cs: th.colSpan, rs: th.rowSpan })),
					sub: rows[1] ? Array.from(rows[1].children).map((th) => th.textContent.trim()) : [],
					cells: Array.from(t.querySelectorAll('tbody td')).map((td) => td.textContent.trim()),
					nbsp: !!t.querySelector('th bdi[style*="nowrap"]'),
					bdiNowrap: Array.from(t.querySelectorAll('th bdi')).map((x) => getComputedStyle(x).whiteSpace),
					cols: t.querySelector('tbody tr').children.length
				};
			}, boxId);
			ok(label + ': the screen table has a two-row head', scr.nrows === 2, String(scr.nrows));
			groups.forEach(([g, subs]) => {
				const th = scr.top.find((x) => x.text === g);
				ok(label + ': "' + g + '" spans ' + subs.length + ' columns on screen', !!th && th.cs === subs.length && th.rs === 1, JSON.stringify(th));
			});
			ok(label + ': a heading with no group spans both rows', scr.top.some((x) => x.rs === 2), JSON.stringify(scr.top.map((x) => x.rs)));
			const subJoined = scr.sub.join('|');
			groups.forEach(([g, subs]) => ok(label + ': under "' + g + '": ' + subs.join(', '),
				subs.every((s) => scr.sub.some((x) => x === s || x.indexOf(s) === 0)), subJoined));
			ok(label + ': no cell on screen is a sentence', !scr.cells.some((c) => sentence.test(c)), scr.cells.filter((c) => sentence.test(c))[0]);
			ok(label + ': the head spans as many columns as a body row has cells (' + scr.cols + ')',
				scr.top.reduce((n, x) => n + x.cs, 0) === scr.cols, String(scr.top.reduce((n, x) => n + x.cs, 0)));
			ok(label + ': a heading\'s unit has no nowrap holding it whole', scr.bdiNowrap.every((w) => w !== 'nowrap'), scr.bdiNowrap.join(','));

			// Copy HTML: a real two-row thead, colspan over each group, rowspan 2 on the rest.
			await page.evaluate(() => { window.__clip = null; });
			await page.click('#' + prefix + '_copyhtml');
			await a.settle(300);
			const clip = await page.evaluate(() => window.__clip), html = (clip && clip['text/html']) || '';
			const thead = (/<thead>([\s\S]*?)<\/thead>/.exec(html) || [])[1] || '';
			ok(label + ': Copy HTML has a thead of two <tr>', (thead.match(/<tr>/g) || []).length === 2, thead.slice(0, 120));
			groups.forEach(([g, subs]) => ok(label + ': ...colspan="' + subs.length + '" over "' + g + '"',
				new RegExp('<th colspan="' + subs.length + '"[^>]*>' + g.replace(/[()]/g, '\\$&') + '</th>').test(thead)));
			ok(label + ': ...rowspan="2" on a heading with no group', /<th rowspan="2"/.test(thead));
			ok(label + ': ...no sentence in a cell', !sentence.test(html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')), (html.replace(/<[^>]+>/g, ' ').match(sentence) || [])[0]);
			ok(label + ': ...the plain-text copy has "Group: Heading" headings', !!clip && groups.every(([g]) => clip['text/plain'].indexOf(g + ': ') >= 0));

			// Print report: the same two-row head.
			await page.click('#' + prefix + '_print');
			await a.settle(200);
			const pr = await page.evaluate(() => {
				const t = document.querySelector('#lpn_print_area table'); if (!t) { return null; }
				const rows = Array.from(t.querySelectorAll('thead tr'));
				return { n: rows.length, top: Array.from(rows[0].children).map((th) => [th.textContent.trim(), th.colSpan, th.rowSpan]) };
			});
			ok(label + ': Print report has a two-row head with the groups spanning', !!pr && pr.n === 2 && groups.every(([g, subs]) => pr.top.some((x) => x[0] === g && x[1] === subs.length)), JSON.stringify(pr));
			await page.evaluate(() => { const b = document.getElementById('lpn_print_area'); if (b) { b.remove(); } document.body.classList.remove('lpn-printing-table'); });

			// Download CSV: one header row, "Group: Heading".
			const dl = page.waitForEvent('download', { timeout: 10000 }).catch(() => null);
			await page.click('#' + prefix + '_csv');
			const f = await dl;
			const csv = f ? fs.readFileSync(await f.path(), 'utf8') : '';
			const all = parseCsv(csv), head = all[0] || [];
			// The first table only: a box that holds a second table (Results by asset) has a second header after it.
			let n = 1; while (n < all.length && all[n].length === head.length) { n++; }
			const rows = all.slice(0, n);
			ok(label + ': the CSV has one header row (the next row is data)', rows.length > 1 && /\d/.test(rows[1].join('')) && !groups.some(([g]) => rows[1][0] === g), (rows[1] || []).slice(0, 4).join('|'));
			groups.forEach(([g, subs]) => ok(label + ': ...columns "' + g + ': ' + subs.join('", "' + g + ': ') + '"',
				subs.every((s) => head.some((h) => h === g + ': ' + s || h.indexOf(g + ': ' + s) === 0)), head.join(' | ')));
			ok(label + ': ...every row has as many cells as the header', rows.every((r) => r.length === head.length), rows.map((r) => r.length).join(','));
			ok(label + ': ...no cell is a sentence', !rows.some((r) => r.some((c) => sentence.test(c))), rows.flat().filter((c) => sentence.test(c))[0]);
			return { csv: rows, head, scr, html };
		};

		// ---- Criticality, the whole run ----
		await dock.openBox(a, 'lpn_crit_box');
		ok('Criticality: the whole-run choice is offered', await setRow('#lpn_crit_controls', (await a.lang('lpn_when')).trim(), 'run'));
		const btns = await page.$$('#lpn_crit_controls button.lpn-ff-run');
		for (const b of btns) { if (((await b.textContent()) || '').trim() === runLabel) { await b.click(); break; } }
		await waitReport('#lpn_crit_report');
		const lg = async (k) => (await a.lang(k)).trim();
		const L = { peak: await lg('lpn_crit_col_unserved_peak'), lowP: await lg('bpn_p_min'), empty: await lg('lpn_crit_col_empty'),
			highV: await lg('lpn_scncmp_col_maxvelocity'), worst: await lg('lpn_ff_col_affected'), more: await lg('lpn_ff_col_more'),
			flow: await lg('lpn_result_flow'), time: await lg('lpn_full_col_time'), junction: await lg('lpn_ff_col_junction'),
			pressure: await lg('lpn_result_pressure'), velocity: await lg('lpn_result_velocity'), link: await lg('lpn_ds_col_link'),
			tank: await lg('lpn_time_tank'), asset: await lg('lpn_crit_col_asset') };
		const sentence = /\b(at|drops to|reaches)\b\s*\d|\d\s*(psi|gpm|ft\/s|ft)\b.*\bat\b|\d\s*psi\s+at\s|\bdrops to\b|\breaches\b|run stopped at/;
		const crit = await checkBox('Criticality (whole run)', 'lpn_crit_box', 'lpn_crit', [
			[L.peak, [L.flow, L.time]],
			[L.lowP, [L.junction, L.pressure, L.time]],
			[L.empty, [L.tank, L.time]]
		], sentence, 'lpn_crit_title');
		const li = crit.head.findIndex((h) => new RegExp('^' + L.lowP + ': ' + L.pressure).test(h));
		ok('Criticality: the pressure column is bare numbers, its unit (psi) in the heading', li > 0 && /\(psi\)/.test(crit.head[li]) && crit.csv.slice(1).every((r) => r[li] === '' || /^-?\d+(\.\d+)?$/.test(r[li])), crit.head[li]);
		const lj = crit.head.findIndex((h) => new RegExp('^' + L.lowP + ': ' + L.junction).test(h)), lt = crit.head.findIndex((h) => new RegExp('^' + L.lowP + ': ' + L.time.replace(/[()]/g, '\\$&')).test(h));
		ok('Criticality: a row with a pressure also names its junction and its time', crit.csv.slice(1).some((r) => r[li] !== '' && r[lj] !== '' && /^\d+:\d\d$/.test(r[lt])), (crit.csv[1] || []).join('|'));
		await closeBox('lpn_crit_box');

		// ---- Scenario comparison ----
		await dock.openBox(a, 'lpn_scncmp_box');
		await a.waitFor(() => page.evaluate(() => !!document.querySelector('#lpn_scncmp_report tbody tr')), 'the comparison table', 120000);
		const scn = await checkBox('Scenario comparison', 'lpn_scncmp_box', 'lpn_scncmp', [
			[L.lowP, [L.junction, L.pressure, L.time]],
			[L.highV, [L.link, L.velocity, L.time]]
		], sentence, 'lpn_scncmp_title');
		const pi = scn.head.findIndex((h) => new RegExp('^' + L.lowP + ': ' + L.pressure).test(h)), vi = scn.head.findIndex((h) => new RegExp('^' + L.highV + ': ' + L.velocity).test(h));
		ok('Scenario comparison: pressure and velocity are bare numbers, units in the headings', /\(psi\)/.test(scn.head[pi]) && /\(ft\/s\)|\(ft\/sec\)/.test(scn.head[vi]) && scn.csv.slice(1).every((r) => /^-?\d+(\.\d+)?$/.test(r[pi]) && /^-?\d+(\.\d+)?$/.test(r[vi])), scn.head[pi] + ' / ' + scn.head[vi]);
		ok('Scenario comparison: a run\'s extreme carries its time and an id in its own columns', scn.csv.slice(1).some((r) => /^\d+:\d\d$/.test(r[pi + 1]) && r[pi - 1] !== ''), scn.csv[1].join('|'));
		await closeBox('lpn_scncmp_box');

		// ---- Fire flow, design check on ----
		await dock.openBox(a, 'lpn_ff_box');
		await setRow('#lpn_ff_controls', (await a.lang('lpn_ff_design')).trim(), 'all');
		await setRow('#lpn_ff_controls', (await a.lang('lpn_ff_required')).trim(), '400');
		await setRow('#lpn_ff_controls', (await a.lang('lpn_ff_minpressure')).trim(), '100');
		const fbtns = await page.$$('#lpn_ff_controls button.lpn-ff-run');
		for (const b of fbtns) { if (((await b.textContent()) || '').trim() === runLabel) { await b.click(); break; } }
		await waitReport('#lpn_ff_report');
		const ff = await checkBox('Fire flow', 'lpn_ff_box', 'lpn_ff', [
			[L.worst, [L.asset, L.pressure, L.velocity, L.more]]
		], sentence, 'lpn_ff_title');
		const wp = ff.head.findIndex((h) => new RegExp('^' + L.worst + ': ' + L.pressure).test(h)), wa = ff.head.findIndex((h) => new RegExp('^' + L.worst + ': ' + L.asset).test(h));
		ok('Fire flow: a junction\'s worst effect is an asset and a pressure in its own columns', ff.csv.slice(1).some((r) => r[wa] && /^-?\d+(\.\d+)?$/.test(r[wp])), (ff.csv.find((r) => r[wp]) || []).join('|'));
		ok('Fire flow: the Worst effect pressure heading carries (psi)', /\(psi\)/.test(ff.head[wp]), ff.head[wp]);
		await closeBox('lpn_ff_box');

		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\nFAILED: ' + fails : '\nreport-split-columns-browser-harness: all ok');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
