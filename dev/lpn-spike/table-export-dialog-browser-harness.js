// FILE > EXPORT TABLE... IN A REAL CHROME: CSV, ODS AND XLSX, CURRENT OR ALL (Task 776).
//
//   node dev/lpn-spike/table-export-dialog-browser-harness.js
//
// Tom, 2026-10-07: "Can you make the heading cells wrap, put freeze rows and columns for ID and
// headings, and give a little more attention to column widths?" and "Export current table? Sure. CSV
// possibly with a followup box to ask Tables and Scenarios, current or all to zip, ODS etc with same
// questions."
//
// Clicks the real menu row, the real box and its real Export button on Net1's Junctions table, then
// reads the DOWNLOADED BYTES with Python's zipfile and ElementTree (no spreadsheet program is
// installed here, so the files are checked against their formats' own structure, not opened in one):
//   1. A project with no scenario: the box has Format and Tables and no Scenarios question.
//   2. CSV: BOM, CRLF, the headings and every row as the screen shows them.
//   3. ODS: mimetype stored first, heading style wraps, columns have measured and unequal widths, the
//      heading row and the ID column are frozen, numbers are floats whose text is the screen's text.
//   4. XLSX: the same, as a frozen pane, wrapped heading style, column widths, numbers as numbers.
//   5. Tables: All, ODS and XLSX: one sheet per table that has rows; CSV: a zip, one file each.
//   6. With a scenario: the Scenarios question appears; XLSX of the current table, all scenarios, has
//      a sheet per scenario; CSV of all tables and all scenarios is a zip with a file per pair; the
//      table on screen keeps its order and its scenario state.
//
// **DO NOT PREFIX THIS WITH `flock`.** It takes /tmp/engcalcs-browser.lock itself.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_TABLE_EXPORT_DIALOG_LOCKED';
const NAME = 'table-export-dialog-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Re-run it alone.');
			process.exit(1);
		}
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

// Reads a downloaded file by its format's own structure and prints JSON.
const PY = String.raw`
import sys, json, zipfile, xml.etree.ElementTree as ET
path, kind = sys.argv[1], sys.argv[2]
z = zipfile.ZipFile(path)
out = {'bad': z.testzip(), 'names': z.namelist(), 'sheets': []}
infos = z.infolist()
out['stored'] = all(i.compress_type == 0 for i in infos)
def strip(t): return t.split('}')[1] if '}' in t else t
if kind == 'ods':
    raw = open(path, 'rb').read()
    out['sniff'] = raw[30:38] == b'mimetype' and raw[38:].startswith(b'application/vnd.oasis.opendocument.spreadsheet')
    C = ET.fromstring(z.read('content.xml'))
    ns = {'o': 'urn:oasis:names:tc:opendocument:xmlns:office:1.0', 't': 'urn:oasis:names:tc:opendocument:xmlns:table:1.0',
          'x': 'urn:oasis:names:tc:opendocument:xmlns:text:1.0', 's': 'urn:oasis:names:tc:opendocument:xmlns:style:1.0',
          'f': 'urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0'}
    T = '{%s}' % ns['t']; O = '{%s}' % ns['o']; S = '{%s}' % ns['s']; F = '{%s}' % ns['f']
    widths = {}; styles = {}
    for st in C.iter(S + 'style'):
        n = st.get(S + 'name'); p = st.find(S + 'table-column-properties'); c = st.find(S + 'table-cell-properties')
        if p is not None: widths[n] = p.get(S + 'column-width')
        if c is not None: styles[n] = {'wrap': c.get(F + 'wrap-option')}
    for tb in C.iter(T + 'table'):
        sh = {'name': tb.get(T + 'name'), 'rows': [], 'floats': [], 'widths': [], 'headStyleWrap': None}
        for col in tb.findall(T + 'table-column'): sh['widths'].append(widths.get(col.get(T + 'style-name')))
        hdr = tb.find(T + 'table-header-rows')
        sh['headerRows'] = 0 if hdr is None else len(hdr.findall(T + 'table-row'))
        rows = (list(hdr.findall(T + 'table-row')) if hdr is not None else []) + tb.findall(T + 'table-row')
        for ri, r in enumerate(rows):
            vals = []; fl = []
            for c in r.findall(T + 'table-cell'):
                txt = ''.join(''.join(p.itertext()) for p in c.findall('{%s}p' % ns['x']))
                vals.append(txt); fl.append(c.get(O + 'value') if c.get(O + 'value-type') == 'float' else None)
                if ri == 0 and sh['headStyleWrap'] is None:
                    sh['headStyleWrap'] = (styles.get(c.get(T + 'style-name')) or {}).get('wrap')
            sh['rows'].append(vals); sh['floats'].append(fl)
        out['sheets'].append(sh)
    St = ET.fromstring(z.read('settings.xml'))
    CF = '{urn:oasis:names:tc:opendocument:xmlns:config:1.0}'
    frozen = {}
    for ent in St.iter(CF + 'config-item-map-entry'):
        nm = ent.get(CF + 'name')
        if nm:
            frozen[nm] = {i.get(CF + 'name'): i.text for i in ent.findall(CF + 'config-item')}
    out['settings'] = frozen
elif kind == 'xlsx':
    M = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
    R = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
    wb = ET.fromstring(z.read('xl/workbook.xml'))
    st = ET.fromstring(z.read('xl/styles.xml'))
    xfs = st.find(M + 'cellXfs').findall(M + 'xf')
    fmts = {n.get('numFmtId'): n.get('formatCode') for n in st.find(M + 'numFmts')}
    out['xfWrap'] = [(x.find(M + 'alignment').get('wrapText') if x.find(M + 'alignment') is not None else None) for x in xfs]
    out['xfFmt'] = [fmts.get(x.get('numFmtId')) for x in xfs]
    for i, sh in enumerate(wb.find(M + 'sheets')):
        w = ET.fromstring(z.read('xl/worksheets/sheet%d.xml' % (i + 1)))
        pane = w.find(M + 'sheetViews').find(M + 'sheetView').find(M + 'pane')
        s = {'name': sh.get('name'), 'rows': [], 'floats': [], 'styles': [], 'pane': dict(pane.attrib) if pane is not None else None,
             'widths': [float(c.get('width')) for c in w.find(M + 'cols')]}
        for r in w.find(M + 'sheetData'):
            vals = {}; fl = {}; sty = {}
            for c in r:
                ref = c.get('r'); col = 0
                for ch in ref:
                    if ch.isalpha(): col = col * 26 + ord(ch) - 64
                col -= 1
                if c.get('t') == 'inlineStr': vals[col] = ''.join(c.find(M + 'is').itertext()); fl[col] = None
                else: vals[col] = c.find(M + 'v').text; fl[col] = c.find(M + 'v').text
                sty[col] = int(c.get('s') or 0)
            n = (max(vals) + 1) if vals else 0
            s['rows'].append([vals.get(k, '') for k in range(n)]); s['floats'].append([fl.get(k) for k in range(n)])
            s['styles'].append([sty.get(k, 0) for k in range(n)])
        out['sheets'].append(s)
print(json.dumps(out))
`;
function inspect(file, kind) {
	const r = spawnSync('python3', ['-c', PY, file, kind], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
	if (r.status !== 0) { throw new Error('python: ' + r.stderr); }
	return JSON.parse(r.stdout);
}
function parseCsv(text) {
	const rows = []; let row = [], f = '', q = false;
	for (let i = 0; i < text.length; i++) {
		const ch = text[i];
		if (q) { if (ch === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else { q = false; } } else { f += ch; } }
		else if (ch === '"') { q = true; } else if (ch === ',') { row.push(f); f = ''; }
		else if (ch === '\r') { /* CRLF */ } else if (ch === '\n') { row.push(f); rows.push(row); row = []; f = ''; }
		else { f += ch; }
	}
	return rows;
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'table-export-'));
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
		await page.click('#lpn_pane_tab_junctions');
		await a.settle(600);

		// What the screen shows: headings and each row's cells as text.
		const screen = () => page.evaluate(() => {
			const t = document.querySelector('#lpn_pane_junctions table');
			const heads = Array.from(t.querySelectorAll('thead th')).map((th) => {
				const b = th.querySelector('.lpn-pane-sort');
				return (b || th).textContent.replace(/\u00AD/g, '').trim();
			});
			const rows = Array.from(t.querySelectorAll('tbody tr')).map((tr) => Array.from(tr.querySelectorAll('td')).map((td) => {
				const i = td.querySelector('input, select');
				if (!i) { return td.textContent.trim(); }
				if (i.type === 'checkbox') { return i.checked ? '1' : ''; }
				if (i.tagName === 'SELECT') { return i.options[i.selectedIndex] ? i.options[i.selectedIndex].text : ''; }
				return i.value;
			}));
			return { heads, rows };
		});
		const idOrder = async () => (await screen()).rows.map((r) => r[0]).join(',');
		const before = await screen();
		const orderBefore = await idOrder();
		ok('the Junctions table is on screen with rows', before.rows.length > 5, before.rows.length + ' rows, ' + before.heads.length + ' columns');

		const rowLabel = await a.lang('lpn_file_export_table');
		const lbl = {
			title: await a.lang('lpn_export_table_title'), go: await a.lang('lpn_export_table_go'),
			tables: await a.lang('lpn_tables_menu'), scn: await a.lang('lpn_scenario_menu'), cancel: await a.lang('lpn_cancel')
		};
		const boxOpen = async () => {
			await a.menuClick(rowLabel);
			await page.waitForSelector('#lpn_dialog', { state: 'visible' });
		};
		const groups = () => page.evaluate(() => Array.from(document.querySelectorAll('#lpn_dialog_body .lpn-export-group')).map((g) => ({
			head: g.firstChild.textContent, options: Array.from(g.querySelectorAll('input')).map((i) => i.value + (i.checked ? '*' : '') + (i.disabled ? '!' : ''))
		})));
		async function pick(format, tables, scenarios) {
			await page.evaluate(([f, t, s]) => {
				const set = (k, v) => { const e = document.getElementById('lpn_export_' + k + '_' + v); if (e) { e.checked = true; } };
				set('format', f); set('tables', t); if (s) { set('scenarios', s); }
			}, [format, tables, scenarios]);
		}
		// Press the box's own Export button with a real mouse click (detail 1) and take the download.
		async function runExport(format, tables, scenarios) {
			await boxOpen();
			await pick(format, tables, scenarios);
			const [dl] = await Promise.all([page.waitForEvent('download'), page.evaluate((go) => {
				const b = Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).find((x) => x.textContent.trim() === go);
				b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
			}, lbl.go)]);
			const file = path.join(tmp, dl.suggestedFilename());
			await dl.saveAs(file);
			await a.settle(300);
			return { file, name: dl.suggestedFilename() };
		}

		// ---- 1. the box, in a project with no scenario ---------------------------------------
		console.log('\n--- the box ---');
		await boxOpen();
		let g = await groups();
		ok('Format and Tables are asked, Scenarios is not (no scenario yet)', g.length === 2 && g[0].options.join() === 'csv*,ods,xlsx' && g[1].head === lbl.tables, JSON.stringify(g));
		ok('Tables opens on Current', g[1].options[0] === 'current*', g[1].options.join());
		await page.evaluate((c) => {
			Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).find((x) => x.textContent.trim() === c)
				.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
		}, lbl.cancel);
		await a.settle(200);

		// ---- 2. CSV --------------------------------------------------------------------------
		console.log('\n--- CSV ---');
		let r = await runExport('csv', 'current');
		ok('file name is Project-Table.csv', /Junctions\.csv$/.test(r.name), r.name);
		const csvBytes = fs.readFileSync(r.file);
		ok('CSV opens with a UTF-8 byte order mark and uses CRLF', csvBytes[0] === 0xEF && csvBytes[1] === 0xBB && csvBytes[2] === 0xBF && csvBytes.includes(Buffer.from('\r\n')));
		const csv = parseCsv(csvBytes.toString('utf8').replace(/^﻿/, ''));
		ok('CSV headings are the screen headings', JSON.stringify(csv[0]) === JSON.stringify(before.heads), JSON.stringify(before.heads));
		ok('CSV has every row as shown', csv.length - 1 === before.rows.length && JSON.stringify(csv.slice(1)) === JSON.stringify(before.rows), JSON.stringify(before.rows[0]) + ' vs ' + JSON.stringify(csv[1]));

		// ---- 3. ODS --------------------------------------------------------------------------
		console.log('\n--- ODS ---');
		r = await runExport('ods', 'current');
		let f = inspect(r.file, 'ods'), sh = f.sheets[0];
		ok('ODS zip is sound, all entries stored, mimetype sniffable at byte 38', f.bad === null && f.stored && f.sniff, f.names.join(','));
		ok('ODS carries a settings.xml', f.names.includes('settings.xml'));
		ok('ODS has one sheet named for the table', f.sheets.length === 1 && /Junctions/.test(sh.name), sh.name);
		ok('ODS cells equal the CSV cells (heading row and body)', JSON.stringify(sh.rows) === JSON.stringify(csv), sh.rows.length + ' rows');
		ok('ODS heading cells wrap', sh.headStyleWrap === 'wrap');
		ok('ODS heading row is the repeated header row', sh.headerRows === 1);
		const cfg = f.settings[sh.name] || {};
		ok('ODS freezes the heading row and the ID column', cfg.HorizontalSplitMode === '2' && cfg.VerticalSplitMode === '2' &&
			cfg.HorizontalSplitPosition === '1' && cfg.VerticalSplitPosition === '1', JSON.stringify(cfg));
		const cm = sh.widths.map((w) => parseFloat(w));
		ok('ODS has a width for every column, in cm, not all alike', cm.length === before.heads.length && cm.every((x) => x > 0) && new Set(cm).size > 2, cm.join(' '));
		const idW = cm[0], descW = cm[cm.length - 1];
		ok('widths follow content (a long heading column is not squeezed to its full text)', Math.max(...cm) < 8.5 && Math.min(...cm) >= 1.2, 'min ' + Math.min(...cm) + ' max ' + Math.max(...cm) + ' id ' + idW + ' last ' + descW);
		const floatCols = sh.floats[1].map((v, i) => v !== null ? i : -1).filter((i) => i >= 0);
		ok('ODS number cells are floats whose value text is the screen text', floatCols.length > 3 && sh.floats.slice(1).every((row, ri) =>
			row.every((v, i) => v === null || v === sh.rows[ri + 1][i])), 'float columns ' + floatCols.join(','));
		ok('ID column is text, never a float', sh.floats.slice(1).every((row) => row[0] === null));

		// ---- 4. XLSX -------------------------------------------------------------------------
		console.log('\n--- XLSX ---');
		r = await runExport('xlsx', 'current');
		f = inspect(r.file, 'xlsx'); sh = f.sheets[0];
		ok('XLSX zip is sound and has the parts Excel needs', f.bad === null && ['[Content_Types].xml', '_rels/.rels', 'xl/workbook.xml', 'xl/styles.xml', 'xl/worksheets/sheet1.xml'].every((n) => f.names.includes(n)), f.names.join(','));
		ok('XLSX [Content_Types].xml is the first entry', f.names[0] === '[Content_Types].xml');
		ok('XLSX cells equal the CSV cells', JSON.stringify(sh.rows) === JSON.stringify(csv), sh.rows.length + ' rows');
		ok('XLSX freezes the heading row and the ID column', sh.pane && sh.pane.state === 'frozen' && sh.pane.xSplit === '1' && sh.pane.ySplit === '1' && sh.pane.topLeftCell === 'B2', JSON.stringify(sh.pane));
		ok('XLSX heading cells use a wrapping style', sh.styles[0].every((s) => f.xfWrap[s] === '1'), JSON.stringify(sh.styles[0].slice(0, 4)));
		ok('XLSX has a width per column, not all alike', sh.widths.length === before.heads.length && new Set(sh.widths).size > 2, sh.widths.join(' '));
		const nums = sh.floats.slice(1).map((row) => row.map((v, i) => (v !== null ? i : -1)).filter((i) => i >= 0));
		ok('XLSX numbers are numbers (<v>) whose digits are the screen text', nums.every((c) => c.length > 3) && sh.floats.slice(1).every((row, ri) => row.every((v, i) => v === null || v === sh.rows[ri + 1][i])));
		const decimalCell = (() => {
			for (let ri = 1; ri < sh.rows.length; ri++) {
				for (let i = 1; i < sh.rows[ri].length; i++) {
					const m = /^-?\d*\.(\d+)$/.exec(sh.rows[ri][i]);
					if (m && sh.floats[ri][i] !== null) { return { ri, i, d: m[1].length }; }
				}
			}
			return null;
		})();
		ok('a number shown with decimals carries a matching number format', !!decimalCell &&
			f.xfFmt[sh.styles[decimalCell.ri][decimalCell.i]] === '0.' + '0'.repeat(decimalCell.d), JSON.stringify(decimalCell));
		ok('the ID column is text', sh.floats.slice(1).every((row) => row[0] === null));
		ok('XLSX tells Excel not to flag numbers stored as text', /<ignoredErrors><ignoredError sqref="A1:XFD1048576" numberStoredAsText="1"\/><\/ignoredErrors><\/worksheet>$/.test(spawnSync('unzip', ['-p', r.file, 'xl/worksheets/sheet1.xml'], { encoding: 'utf8' }).stdout));

		// ---- 5. All tables ---------------------------------------------------------------------
		console.log('\n--- all tables ---');
		r = await runExport('xlsx', 'all');
		f = inspect(r.file, 'xlsx');
		const names = f.sheets.map((s) => s.name);
		ok('XLSX of all tables: one sheet per table with rows', f.sheets.length >= 4 && names.includes('Junctions') && new Set(names).size === names.length && f.sheets.every((s) => s.rows.length > 1), names.join(', '));
		ok('every sheet is frozen and every sheet name is valid', f.sheets.every((s) => s.pane && s.pane.state === 'frozen' && s.name.length <= 31 && !/[\[\]*?:\/\\]/.test(s.name)));
		r = await runExport('ods', 'all');
		f = inspect(r.file, 'ods');
		ok('ODS of all tables: the same sheets, each with its own freeze', f.sheets.length === names.length && f.sheets.every((s) => (f.settings[s.name] || {}).VerticalSplitMode === '2'), f.sheets.map((s) => s.name).join(', '));
		r = await runExport('csv', 'all');
		f = inspect(r.file, 'zip');
		ok('CSV of all tables is a zip with one .csv per table', /\.zip$/.test(r.name) && f.bad === null && f.names.length === names.length && f.names.every((n) => /\.csv$/.test(n)), r.name + ': ' + f.names.join(', '));
		ok('the table on screen is untouched', (await idOrder()) === orderBefore);

		// ---- 6. scenarios ----------------------------------------------------------------------
		console.log('\n--- scenarios ---');
		await a.menuClickSub(lbl.scn, await a.lang('lpn_scenario_new'), 'project');
		await page.waitForSelector('#lpn_dialog', { state: 'visible' });
		await page.fill('#lpn_dialog_body input', 'A/B: C? Peak');
		await page.evaluate(() => {
			const b = document.querySelector('#lpn_dialog_buttons button');
			b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
		});
		await a.settle(1500);
		await page.click('#lpn_pane_tab_junctions');
		await a.settle(500);
		await boxOpen();
		g = await groups();
		ok('with a scenario the box also asks Scenarios', g.length === 3 && g[2].head === lbl.scn, JSON.stringify(g.map((x) => x.head)));
		const noteShown = () => page.evaluate(() => { const n = document.getElementById('lpn_export_scn_note'); return !!n && n.style.display !== 'none'; });
		ok('the results note is hidden while Scenarios is Current', !(await noteShown()));
		await page.evaluate(() => { const e = document.getElementById('lpn_export_scenarios_all'); e.checked = true; e.dispatchEvent(new Event('change', { bubbles: true })); });
		ok('the results note shows when Scenarios is All', await noteShown());
		await page.evaluate((c) => {
			Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).find((x) => x.textContent.trim() === c)
				.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
		}, lbl.cancel);
		await a.settle(200);
		r = await runExport('xlsx', 'current', 'all');
		f = inspect(r.file, 'xlsx');
		ok('XLSX, current table, all scenarios: a sheet per scenario', f.sheets.length === 2 && /Peak/.test(f.sheets.map((s) => s.name).join()) && f.sheets.some((s) => /Base/.test(s.name)), f.sheets.map((s) => s.name).join(', '));
		ok('each scenario sheet has the table\'s rows and no Scenario column', f.sheets.every((s) => s.rows.length === before.rows.length + 1 && s.rows[0].join() === before.heads.join()), JSON.stringify(f.sheets.map((s) => [s.rows.length, s.rows[0].length])) + ' ' + before.rows.length);
		r = await runExport('csv', 'current', 'current');
		ok('CSV, current scenario: one file named with the scenario', /Junctions-A_B_ C_ Peak\.csv$/.test(r.name), r.name);
		r = await runExport('xlsx', 'all', 'all');
		f = inspect(r.file, 'xlsx');
		ok('workbook sheet names keep the scenario and stay within 31 characters, unique', f.sheets.every((x) => x.name.length <= 31 && /Peak/.test(x.name) || /Base/.test(x.name)) && new Set(f.sheets.map((x) => x.name.toLowerCase())).size === f.sheets.length, f.sheets.map((x) => x.name).join(' | '));
		r = await runExport('csv', 'all', 'all');
		f = inspect(r.file, 'zip');
		const nJ = f.names.filter((n) => /Junctions-/.test(n));
		ok('CSV of all tables and all scenarios: a zip with a file per table and scenario', f.bad === null && nJ.length === 2 && f.names.length >= 8 && f.names.every((n) => !/[\/\\:*?"<>|]/.test(n)), f.names.join(', '));
		ok('the table on screen keeps its order, and still shows no scenario column', (await idOrder()) === orderBefore && !(await screen()).heads.includes(await a.lang('lpn_scenario_label')));
		ok('no page errors', a.errors.length === 0, a.errors.join(' | ').slice(0, 300));
	} finally {
		await browser.close();
		env.stopServer();
		fs.rmSync(tmp, { recursive: true, force: true });
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' ok' + (failures ? ', ' + failures + ' FAILED' : ''));
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
