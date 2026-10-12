// QUOTED CELLS IN THE TABLES' PASTE AND COPY, IN A REAL CHROME (Perry, 2026-10-11, reviewing Shapes).
//   node dev/lpn-spike/paste-quote-browser-harness.js
// (it takes /tmp/engcalcs-browser.lock itself; never wrap it in that lock).
//
// A spreadsheet copies a cell holding a tab, a line break or a double quote as a quoted field
// ("Lot, ""B"" 7" for Lot, "B" 7). The shared reader libPasteCells() must read that back as the
// characters typed, take a field that does NOT start with a quote literally (6" pipe stays 6" pipe),
// and the Tables' copy must quote the same cells so copy then paste is byte-exact. Driven through
// the real Junctions and Pipes tables with real ClipboardEvents; the last check is Undo.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PASTE_QUOTE_LOCKED';
const NAME = 'paste-quote-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) { console.error(NAME + ': NOT RUN -- lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error(NAME + ': no `flock` binary found -- running WITHOUT the browser lock.');
}

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

// What the sheet holds, and what a Description keeps: lpnDescText() folds a line break to a space (a
// description is one line, so the .inp can carry it), so the third cell reads back folded. A tab stays.
const SENT = ['Lot, "B" 7', 'a\tb', 'line1\nline2', '"quoted" start'];
const WANT = ['Lot, "B" 7', 'a\tb', 'line1 line2', '"quoted" start'];
const q = (s) => '"' + s.replace(/"/g, '""') + '"';
const SHEET = SENT.map(q);
// A cell with a tab, line break or quote is quoted; a space or comma alone is not a reason to.
const COPIED = WANT.map((w) => (/[\t\r\n"]/.test(w) ? q(w) : w));

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	let chromium;
	try { chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium; }
	catch (err) { console.error('playwright-core is not installed (cd dev/browser-pass && npm install).'); process.exit(1); }
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
		const page = a.page;
		await page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
		await a.settle(1500);
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1500);
		await page.click('#lpn_pane_btn');
		await a.settle(500);

		// The Description cell of the Nth body row, as the document holds it (an <input> would fold a line break).
		const tdSel = (tab, n) => '#lpn_pane_' + tab + ' table tbody tr:nth-child(' + n + ') td';
		const descCell = (tab, n) => page.evaluateHandle(([t, k]) => {
			const tds = Array.from(document.querySelectorAll('#lpn_pane_' + t + ' table tbody tr:nth-child(' + k + ') td'));
			return tds.find((x) => x._lpnPaneKey === 'desc') || null;
		}, [tab, n]);
		const readDesc = (tab, from, count) => page.evaluate(([t, f, c]) => {
			const out = [];
			for (let k = f; k < f + c; k++) {
				const td = Array.from(document.querySelectorAll('#lpn_pane_' + t + ' table tbody tr:nth-child(' + k + ') td')).find((x) => x._lpnPaneKey === 'desc');
				const i = td && td.querySelector('input, textarea');
				out.push(i ? i.value : (td ? td.textContent : null));
			}
			return out;
		}, [tab, from, count]);
		const pasteText = (tab, n, text) => page.evaluate(([t, k, tx]) => {
			const td = Array.from(document.querySelectorAll('#lpn_pane_' + t + ' table tbody tr:nth-child(' + k + ') td')).find((x) => x._lpnPaneKey === 'desc');
			td.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, detail: 1 }));
			td.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, detail: 1 }));
			const dt = new DataTransfer(); dt.setData('text/plain', tx);
			td.closest('table').dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
		}, [tab, n, text]);
		const copyRange = (tab, n1, n2) => page.evaluate(([t, k1, k2]) => {
			const cell = (k) => Array.from(document.querySelectorAll('#lpn_pane_' + t + ' table tbody tr:nth-child(' + k + ') td')).find((x) => x._lpnPaneKey === 'desc');
			const a1 = cell(k1), a2 = cell(k2);
			a1.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, detail: 1 }));
			a1.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, detail: 1 }));
			a2.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, detail: 1, shiftKey: true }));
			a2.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, detail: 1, shiftKey: true }));
			const dt = new DataTransfer();
			a2.closest('table').dispatchEvent(new ClipboardEvent('copy', { clipboardData: dt, bubbles: true, cancelable: true }));
			return dt.getData('text/plain');
		}, [tab, n1, n2]);
		const same = (x, y) => JSON.stringify(x) === JSON.stringify(y);

		for (const tab of ['junctions', 'pipes']) {
			await page.click('#lpn_pane_tab_' + tab);
			await a.settle(600);
			const probe = await descCell(tab, 1);
			ok(tab + ': a Description column is on screen', !!(await probe.jsonValue().catch(() => 1)) );
			const before = await readDesc(tab, 1, 9);

			const variants = {
				'LF, no trailing line end': SHEET.join('\n'),
				'CRLF with trailing line end': SHEET.join('\r\n') + '\r\n',
				'LF with trailing line end': SHEET.join('\n') + '\n'
			};
			for (const name of Object.keys(variants)) {
				await pasteText(tab, 1, variants[name]);
				await a.settle(400);
				const got = await readDesc(tab, 1, 4);
				ok(tab + ' paste, ' + name + ': four cells arrive as typed', same(got, WANT), JSON.stringify(got));
			}
			const after = await readDesc(tab, 6, 4);
			ok(tab + ': no row below the block was touched', same(after, before.slice(5, 9)));

			// Copy out, and paste the copy over the rows below: byte-identical.
			const out = await copyRange(tab, 1, 4);
			ok(tab + ' copy: a one-column copy quotes exactly the cells with a tab, line break or quote', out === COPIED.join('\n'), JSON.stringify(out));
			await pasteText(tab, 6, out);
			await a.settle(400);
			const back = await readDesc(tab, 6, 4);
			ok(tab + ': copy then paste elsewhere is byte-identical', same(back, WANT), JSON.stringify(back));
			const out2 = await copyRange(tab, 6, 9);
			ok(tab + ': and copies out the same text again', out2 === out);

			// Undo, twice (the second paste, then the first block's last), restores the rows' own text.
			await page.evaluate(() => { document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', ctrlKey: true, bubbles: true })); });
			await a.settle(300);
			const undone = await readDesc(tab, 6, 4);
			ok(tab + ': Undo puts the pasted block back', same(undone, before.slice(5, 9)), JSON.stringify(undone));
		}

		// An unquoted field is taken literally, quotes and all; a quote in mid-field is not a field start.
		await page.click('#lpn_pane_tab_junctions');
		await a.settle(400);
		await pasteText('junctions', 1, '6" pipe\t7"\nx\ty');
		await a.settle(300);
		ok('an unquoted 6" value keeps its quote mark', same(await readDesc('junctions', 1, 2), ['6" pipe', 'x']));

		// A tab-less text/plain is ONE COLUMN, one cell per line: never split on spaces, commas or semicolons.
		const STREETS = ['Main St', 'Oak Ave, North', 'A; B  C', '12 Elm Court'];
		await pasteText('junctions', 1, STREETS.join('\n') + '\n');
		await a.settle(300);
		let got = await readDesc('junctions', 1, 4);
		ok('one column of tab-less lines pastes one cell per line, spaces and commas kept', same(got, STREETS), JSON.stringify(got));
		ok('and the column to the right was not written',
			await page.evaluate(() => Array.from(document.querySelectorAll('#lpn_pane_junctions table tbody tr:nth-child(1) td')).every((x) => !/Main|St$/.test(x._lpnPaneKey === 'desc' ? '' : x.textContent))));
		const copied = await copyRange('junctions', 1, 4);
		ok('a one-column copy of plain text carries no quote marks', copied === STREETS.join('\n'), JSON.stringify(copied));
		// Multi-column tab-separated still fills across.
		await pasteText('junctions', 1, 'Main St\t5\nOak Ave\t6');
		await a.settle(300);
		got = await readDesc('junctions', 1, 2);
		ok('tab-separated text still pastes across columns', same(got, ['Main St', 'Oak Ave']), JSON.stringify(got));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(failures ? 'FAILED: ' + failures + ' of ' + checks : 'all ' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
