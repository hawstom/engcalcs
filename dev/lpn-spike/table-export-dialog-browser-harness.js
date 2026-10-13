// FILE, EXPORT TO, ODS / XLSX / CSV FILE IN A REAL CHROME: CURRENT OR ALL, WITH LIBRARIES (Task 776).
//
//   node dev/lpn-spike/table-export-dialog-browser-harness.js
//
// Tom, 2026-10-07: "Can you make the heading cells wrap, put freeze rows and columns for ID and
// headings, and give a little more attention to column widths?" and "Export current table? Sure. CSV
// possibly with a followup box to ask Tables and Scenarios, current or all to zip, ODS etc with same
// questions."
//
// Tom, 2026-10-07: "File, Export should not say 'Export table'. It should say File, Export to, and we
// are adding ODS/XLSX/CSV. And we include Libraries so that we can include Curve, Pattern, etc
// references." and "the top row and the ID column stay put when you scroll: Bad. Doesn't work."
//
// Clicks the real File, Export to submenu row, the real box and its real Export button on Net1's
// Junctions table, then
// reads the DOWNLOADED BYTES with Python's zipfile and ElementTree (no spreadsheet program is
// installed here, so the files are checked against their formats' own structure, not opened in one):
//   1. A project with no scenario: the box is titled for its format and asks only Tables.
//   2. CSV: BOM, CRLF, the headings and every row as the screen shows them.
//   3. ODS: mimetype stored first, heading style wraps, columns have measured and unequal widths, the
//      heading row and the ID column are frozen, numbers are floats whose text is the screen's text.
//   4. XLSX: the same, as a frozen pane, wrapped heading style, column widths, numbers as numbers.
//   5. Tables: All, ODS and XLSX: one sheet per table that has rows; CSV: a zip, one file each.
//   5b. Libraries: a pipe type and a fittings list added through the real Libraries box; every
//      workbook carries Patterns, Curves - Pump head, Pipe types and Fittings sheets whose IDs are
//      the ones the asset tables name; a single CSV stays one file; a CSV zip carries them too.
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
    views = [e for e in St.iter(CF + 'config-item-map-indexed') if e.get(CF + 'name') == 'Views']
    v0 = views[0].find(CF + 'config-item-map-entry') if views else None
    out['view'] = {i.get(CF + 'name'): i.text for i in v0.findall(CF + 'config-item')} if v0 is not None else None
    out['viewSetName'] = [e.get(CF + 'name') for e in St.iter(CF + 'config-item-set')]
    man = ET.fromstring(z.read('META-INF/manifest.xml'))
    MF = '{urn:oasis:names:tc:opendocument:xmlns:manifest:1.0}'
    out['manifest'] = [e.get(MF + 'full-path') for e in man.iter(MF + 'file-entry')]
    # A second, independent reader: odfpy, when it is importable (EC_PYLIBS on PYTHONPATH).
    try:
        from odf.opendocument import load
        from odf import config as ODFC
        d = load(path)
        got = {}
        for ent in d.settings.getElementsByType(ODFC.ConfigItemMapEntry):
            nm = ent.getAttribute('name')
            if not nm: continue
            got[nm] = {it.getAttribute('name'): str(it) for it in ent.getElementsByType(ODFC.ConfigItem)}
        out['odfpy'] = got
    except ImportError:
        out['odfpy'] = None
elif kind == 'xlsx':
    M = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'
    R = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
    wb = ET.fromstring(z.read('xl/workbook.xml'))
    st = ET.fromstring(z.read('xl/styles.xml'))
    xfs = st.find(M + 'cellXfs').findall(M + 'xf')
    fmts = {n.get('numFmtId'): n.get('formatCode') for n in st.find(M + 'numFmts')}
    out['xfWrap'] = [(x.find(M + 'alignment').get('wrapText') if x.find(M + 'alignment') is not None else None) for x in xfs]
    out['xfFmt'] = [fmts.get(x.get('numFmtId')) for x in xfs]
    bv = wb.find(M + 'bookViews')
    out['workbookViews'] = 0 if bv is None else len(bv.findall(M + 'workbookView'))
    out['workbookOrder'] = [strip(c.tag) for c in wb]
    out['openpyxl'] = None
    try:
        import openpyxl
        ob = openpyxl.load_workbook(path)
        out['openpyxl'] = [ws.freeze_panes for ws in ob.worksheets]
    except ImportError:
        pass
    for i, sh in enumerate(wb.find(M + 'sheets')):
        w = ET.fromstring(z.read('xl/worksheets/sheet%d.xml' % (i + 1)))
        pane = w.find(M + 'sheetViews').find(M + 'sheetView').find(M + 'pane')
        s = {'name': sh.get('name'), 'rows': [], 'floats': [], 'styles': [], 'pane': dict(pane.attrib) if pane is not None else None,
             'widths': [float(c.get('width')) for c in w.find(M + 'cols')],
             'order': [strip(c.tag) for c in w], 'viewId': int(w.find(M + 'sheetViews').find(M + 'sheetView').get('workbookViewId')),
             'selections': [x.get('pane') for x in w.find(M + 'sheetViews').find(M + 'sheetView').findall(M + 'selection')]}
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
	const env = Object.assign({}, process.env);
	if (process.env.EC_PYLIBS) { env.PYTHONPATH = process.env.EC_PYLIBS + (env.PYTHONPATH ? ':' + env.PYTHONPATH : ''); }
	const r = spawnSync('python3', ['-c', PY, file, kind], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, env });
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

		const exportMenu = (await a.lang('lpn_file_export_menu')).trim();
		const rowFor = { ods: await a.lang('lpn_file_export_item_ods'), xlsx: await a.lang('lpn_file_export_item_xlsx'), csv: await a.lang('lpn_file_export_item_csv') };
		const lbl = {
			title: await a.lang('lpn_export_table_title'), go: await a.lang('lpn_export_table_go'),
			tables: await a.lang('lpn_tables_menu'), scn: await a.lang('lpn_scenario_menu'), cancel: await a.lang('lpn_cancel')
		};
		const boxOpen = async (format) => {
			await a.menuClickSub(exportMenu, rowFor[format]);
			await page.waitForSelector('#lpn_dialog', { state: 'visible' });
		};
		const ns = (t) => t.replace(/\s+-\s+/g, '-').replace(/\s+/g, '_');
		const libLbl = { pat: ns(await a.lang('lpn_library_patterns')), cur: ns(await a.lang('lpn_library_curves')),
			typ: ns(await a.lang('lpn_library_pipetypes')), fit: ns(await a.lang('lpn_library_fittings')) };
		const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const LIBS = new RegExp('^(' + [libLbl.pat, libLbl.typ, libLbl.fit].map((t) => esc(t) + '$').concat([esc(libLbl.cur) + '-']).join('|') + ')');
		const boxTitle = () => page.evaluate(() => { const t = document.getElementById('lpn_dialog_title'); return t ? t.textContent.trim() : ''; });
		const groups = () => page.evaluate(() => Array.from(document.querySelectorAll('#lpn_dialog_body .lpn-export-group')).map((g) => ({
			head: g.firstChild.textContent, options: Array.from(g.querySelectorAll('input')).map((i) => i.value + (i.checked ? '*' : '') + (i.disabled ? '!' : ''))
		})));
		async function pick(tables, scenarios) {
			await page.evaluate(([t, s]) => {
				const set = (k, v) => { const e = document.getElementById('lpn_export_' + k + '_' + v); if (e) { e.checked = true; } };
				set('tables', t); if (s) { set('scenarios', s); }
			}, [tables, scenarios]);
		}
		// Press the box's own Export button with a real mouse click (detail 1) and take the download.
		async function runExport(format, tables, scenarios) {
			await boxOpen(format);
			await pick(tables, scenarios);
			const [dl] = await Promise.all([page.waitForEvent('download'), page.evaluate((go) => {
				const b = Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).find((x) => x.textContent.trim() === go);
				b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
			}, lbl.go)]);
			const file = path.join(tmp, dl.suggestedFilename());
			await dl.saveAs(file);
			await a.settle(300);
			// Tom, 2026-10-07: "Remove spaces from library file and tab names." Nothing a download
			// names -- the file, a zip entry, a sheet -- may hold a space.
			const inner = /\.csv$/.test(dl.suggestedFilename()) ? { sheets: [], names: [] } : inspect(file, format === 'csv' ? 'zip' : format);
			const names = (inner.sheets && inner.sheets.length ? inner.sheets.map((x) => x.name) : []).concat(/\.zip$/.test(dl.suggestedFilename()) ? inner.names : []);
			ok('no space in ' + dl.suggestedFilename() + ' or in what is inside it', !/\s/.test(dl.suggestedFilename()) && names.every((n) => !/\s/.test(n)), names.filter((n) => /\s/.test(n)).join(' | '));
			return { file, name: dl.suggestedFilename() };
		}

		// ---- 1. the box, in a project with no scenario ---------------------------------------
		console.log('\n--- the box ---');
		await boxOpen('xlsx');
		let g = await groups();
		const title = await boxTitle();
		ok('the box is titled for the row chosen', title === lbl.title.replace('{format}', 'XLSX'), title);
		ok('only Tables is asked: no Format (the row is the format), no Scenarios (no scenario yet)', g.length === 1 && g[0].head === lbl.tables, JSON.stringify(g));
		ok('Tables opens on Current', g[0].options[0] === 'current*', g[0].options.join());
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
		ok('ODS opens on the table, named for it, the library sheets after it', /Junctions/.test(sh.name) && f.sheets.slice(1).every((x) => LIBS.test(x.name)), f.sheets.map((x) => x.name).join(', '));
		ok('ODS cells equal the CSV cells (heading row and body)', JSON.stringify(sh.rows) === JSON.stringify(csv), sh.rows.length + ' rows');
		ok('ODS heading cells wrap', sh.headStyleWrap === 'wrap');
		ok('ODS heading row is the repeated header row', sh.headerRows === 1);
		const cfg = f.settings[sh.name] || {};
		ok('ODS freezes the heading row and the ID column', cfg.HorizontalSplitMode === '2' && cfg.VerticalSplitMode === '2' &&
			cfg.HorizontalSplitPosition === '1' && cfg.VerticalSplitPosition === '1', JSON.stringify(cfg));
		ok('ODS freeze: the cursor and the active pane are the bottom-right, scrolling pane', cfg.ActiveSplitRange === '3' && cfg.PositionRight === '1' && cfg.PositionBottom === '1' && cfg.CursorPositionX === '1' && cfg.CursorPositionY === '1', JSON.stringify(cfg));
		ok('ODS settings.xml: ooo:view-settings > Views > entry with ViewId, ActiveTable a real sheet, zoom stated', f.viewSetName.includes('ooo:view-settings') && f.view && f.view.ViewId === 'view1' && f.view.ActiveTable === sh.name && f.view.ZoomValue === '100', JSON.stringify(f.view));
		ok('ODS manifest lists settings.xml', f.manifest.includes('settings.xml'), f.manifest.join(','));
		if (f.odfpy) {
			const o = f.odfpy[sh.name] || {};
			ok('odfpy reads the same freeze from settings.xml', o.HorizontalSplitMode === '2' && o.VerticalSplitMode === '2' && o.HorizontalSplitPosition === '1' && o.VerticalSplitPosition === '1', JSON.stringify(o));
		} else { console.log('  note odfpy not importable; set EC_PYLIBS to a directory holding it for a second reader'); }
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
		const CT_WS = ['sheetPr', 'dimension', 'sheetViews', 'sheetFormatPr', 'cols', 'sheetData', 'ignoredErrors'];
		ok('XLSX worksheet children follow the CT_Worksheet sequence (ECMA-376 18.3.1.99)', sh.order.every((t, i) => i === 0 || CT_WS.indexOf(sh.order[i - 1]) < CT_WS.indexOf(t)) && sh.order.every((t) => CT_WS.includes(t)), sh.order.join(','));
		ok('XLSX sheetView names a workbookView that exists (bookViews before sheets)', f.workbookViews > sh.viewId && f.workbookOrder.join() === 'bookViews,sheets', f.workbookViews + ' views; workbook ' + f.workbookOrder.join(','));
		ok('XLSX pane has a selection for each of its three panes', JSON.stringify(sh.selections) === '["topRight","bottomLeft","bottomRight"]', JSON.stringify(sh.selections));
		if (f.openpyxl) {
			ok('openpyxl reads the freeze as B2', f.openpyxl[0] === 'B2', JSON.stringify(f.openpyxl));
		} else { console.log('  note openpyxl not importable; set EC_PYLIBS to a directory holding it for a second reader'); }
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
		const tableNames = names.filter((n) => !LIBS.test(n));
		ok('XLSX of all tables: one sheet per table with rows, then the libraries', tableNames.length >= 4 && names.includes('Junctions') && new Set(names).size === names.length && f.sheets.every((s) => s.rows.length > 1), names.join(', '));
		ok('every sheet is frozen and every sheet name is valid', f.sheets.every((s) => s.pane && s.pane.state === 'frozen' && s.name.length <= 31 && !/[\[\]*?:\/\\]/.test(s.name)));
		r = await runExport('ods', 'all');
		f = inspect(r.file, 'ods');
		ok('ODS of all tables: the same sheets, each with its own freeze', f.sheets.length === names.length && f.sheets.every((s) => (f.settings[s.name] || {}).VerticalSplitMode === '2'), f.sheets.map((s) => s.name).join(', '));
		r = await runExport('csv', 'all');
		f = inspect(r.file, 'zip');
		ok('CSV of all tables is a zip with one .csv per table', /\.zip$/.test(r.name) && f.bad === null && f.names.length === names.length && f.names.every((n) => /\.csv$/.test(n)), r.name + ': ' + f.names.join(', '));
		ok('the table on screen is untouched', (await idOrder()) === orderBefore);

		// ---- 5b. libraries -----------------------------------------------------------------------
		console.log('\n--- libraries ---');
		await a.menuClick(await a.lang('lpn_library_menu'), 'project');
		await page.waitForSelector('#lpn_library_box', { state: 'visible' });
		const libClick = async (sel, text) => page.evaluate(([sl, t]) => {
			const b = sl ? document.querySelector(sl) : Array.from(document.querySelectorAll('#lpn_libbox_content button')).find((x) => x.textContent.trim() === t);
			b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
		}, [sel, text]);
		await libClick('#lpn_libbox_link_pipetypes');
		await libClick(null, await a.lang('lpn_library_pipetype_add'));
		await a.settle(200);
		await page.evaluate(() => {
			const i = document.querySelector('#lpn_libbox_content input[type=number]');
			i.value = '8'; i.dispatchEvent(new Event('change', { bubbles: true }));
		});
		await libClick('#lpn_libbox_link_fittings');
		await libClick(null, await a.lang('lpn_library_fittings_add'));
		await a.settle(200);
		await libClick(null, await a.lang('lpn_fitting_add'));
		await a.settle(200);
		const fitRow = await page.evaluate(() => {
			const sel = document.querySelector('#lpn_libbox_content select');
			return sel ? sel.options[sel.selectedIndex].text : null;
		});
		await page.evaluate(() => { const x = document.getElementById('lpn_libbox_close'); if (x) { x.click(); } });
		await a.settle(200);
		r = await runExport('xlsx', 'all');
		f = inspect(r.file, 'xlsx');
		const byName = {};
		f.sheets.forEach((x) => { byName[x.name] = x; });
		const pat = byName[libLbl.pat], crv = f.sheets.find((x) => x.name.indexOf(libLbl.cur + '-') === 0),
			typ = byName[libLbl.typ], fit = byName[libLbl.fit];
		ok('the workbook carries a sheet per library: patterns, curves by type, pipe types, fittings', !!pat && !!crv && !!typ && !!fit, Object.keys(byName).join(', '));
		ok('Patterns: Net1 pattern 1, its 12 multipliers across, as numbers', !!pat && pat.rows[1][0] === '1' && pat.rows[1].slice(1).map(Number).join() === '1,1.2,1.4,1.6,1.4,1.2,1,0.8,0.6,0.4,0.6,0.8' && pat.floats[1][1] !== null, pat && JSON.stringify(pat.rows[1]));
		ok('Curves: Net1 curve 1, one point 1500 by 250, headed as the Library heads a pump head curve', !!crv && crv.rows.length === 2 && crv.rows[1][0] === '1' && crv.rows[1][2] === '1500' && crv.rows[1][3] === '250' && /\(/.test(crv.rows[0][2]), crv && JSON.stringify(crv.rows));
		ok('Pipe types: the type added in the Library, its diameter 8, blank where it states nothing', !!typ && typ.rows.length === 2 && typ.rows[1][2] === '8' && typ.rows[1].slice(3).every((v) => v === ''), typ && JSON.stringify(typ.rows));
		ok('Fittings: the list added, one row per fitting, named as the Library names it, quantity 1', !!fit && fit.rows.length === 2 && fit.rows[1][2] === fitRow && fit.rows[1][3] === '1' && fit.floats[1][4] !== null, fit && JSON.stringify(fit.rows) + ' vs ' + fitRow);
		ok('every library sheet is frozen on its ID column', [pat, crv, typ, fit].every((x) => x && x.pane && x.pane.state === 'frozen' && x.rows[0][0] === 'ID'));
		const pumps = f.sheets.find((x) => /Pumps/.test(x.name));
		const curveCol = pumps ? pumps.rows[0].findIndex((h) => /curve/i.test(h)) : -1;
		ok('the curve a pump names is found by ID on the Curves sheet', curveCol > 0 && crv.rows.slice(1).some((row) => row[0] === pumps.rows[1][curveCol]), pumps && JSON.stringify([pumps.rows[0][curveCol], pumps.rows[1][curveCol]]));
		r = await runExport('ods', 'current');
		f = inspect(r.file, 'ods');
		ok('ODS of the current table carries the same four library sheets, each frozen', f.sheets.length === 5 && f.sheets.slice(1).every((x) => LIBS.test(x.name) && (f.settings[x.name] || {}).VerticalSplitMode === '2'), f.sheets.map((x) => x.name).join(', '));
		r = await runExport('csv', 'current');
		ok('one table to CSV is still one .csv file, no zip', /Junctions\.csv$/.test(r.name), r.name);
		r = await runExport('csv', 'all');
		f = inspect(r.file, 'zip');
		ok('a CSV zip carries a file per library too', [libLbl.pat, libLbl.typ, libLbl.fit].every((n) => f.names.includes(n + '.csv')) && f.names.some((n) => n.indexOf(libLbl.cur + '-') === 0), f.names.join(', '));

		// ---- 5c. the right-click rows ----------------------------------------------------------------
		console.log('\n--- right-click ---');
		const ctxRows = async () => {
			await page.click('#lpn_pane_junctions tbody td', { button: 'right' });
			await page.waitForSelector('.lpn-pane-ctxmenu', { state: 'visible' });
			return page.evaluate(() => Array.from(document.querySelector('.lpn-pane-ctxmenu').children).map((x) => x.textContent.replace(/\s+/g, ' ').trim()));
		};
		let rows = await ctxRows();
		const want = ['CSV', 'ODS', 'XLSX'].map((x) => lbl.title.replace('{format}', x));
		ok('the table right-click offers Export to CSV, Export to ODS and Export to XLSX in a row', want.every((w) => rows.some((x) => x.indexOf(w) === 0)) &&
			rows.findIndex((x) => x.indexOf(want[0]) === 0) + 2 === rows.findIndex((x) => x.indexOf(want[2]) === 0), rows.join(' | '));
		ok('the old "Export table as" wording is gone', !rows.some((x) => /Export table/.test(x)), rows.join(' | '));
		const ctxExport = async (w) => {
			if (!(await page.$('.lpn-pane-ctxmenu'))) { await ctxRows(); }
			const [dl] = await Promise.all([page.waitForEvent('download'), page.evaluate((t) => {
				const row = Array.from(document.querySelector('.lpn-pane-ctxmenu').children).find((x) => x.textContent.replace(/\s+/g, ' ').trim().indexOf(t) === 0);
				row.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
			}, w)]);
			const file = path.join(tmp, 'ctx-' + dl.suggestedFilename());
			await dl.saveAs(file);
			await a.settle(300);
			return { file, name: dl.suggestedFilename() };
		};
		r = await ctxExport(want[2]);
		f = inspect(r.file, 'xlsx');
		ok('right-click XLSX: a valid workbook, one sheet, the one table, no space in any name', /Junctions\.xlsx$/.test(r.name) && !/\s/.test(r.name) && f.bad === null && f.names.includes('[Content_Types].xml') &&
			f.sheets.length === 1 && f.sheets[0].name === 'Junctions' && JSON.stringify(f.sheets[0].rows) === JSON.stringify(csv), r.name + ' ' + f.sheets.map((x) => x.name).join());
		ok('right-click XLSX is frozen and has numbers as numbers like the File menu one', f.sheets[0].pane && f.sheets[0].pane.state === 'frozen' && f.sheets[0].floats.slice(1).some((row) => row.some((v) => v !== null)));
		r = await ctxExport(want[1]);
		f = inspect(r.file, 'ods');
		ok('right-click ODS: one sheet, the table', /Junctions\.ods$/.test(r.name) && f.sheets.length === 1 && f.sheets[0].name === 'Junctions', r.name);
		r = await ctxExport(want[0]);
		ok('right-click CSV: the table CSV', /Junctions\.csv$/.test(r.name) && JSON.stringify(parseCsv(fs.readFileSync(r.file, 'utf8').replace(/^\uFEFF/, ''))) === JSON.stringify(csv), r.name);

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
		await boxOpen('ods');
		g = await groups();
		ok('with a scenario the box also asks Scenarios', g.length === 2 && g[1].head === lbl.scn, JSON.stringify(g.map((x) => x.head)));
		const noteShown = () => page.evaluate(() => { const n = document.getElementById('lpn_export_scn_note'); return !!n && n.textContent.length > 0; });
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
		f.sheets = f.sheets.filter((x) => !LIBS.test(x.name));
		ok('XLSX, current table, all scenarios: a sheet per scenario', f.sheets.length === 2 && /Peak/.test(f.sheets.map((s) => s.name).join()) && f.sheets.some((s) => /Base/.test(s.name)), f.sheets.map((s) => s.name).join(', '));
		ok('each scenario sheet has the table\'s rows and no Scenario column', f.sheets.every((s) => s.rows.length === before.rows.length + 1 && s.rows[0].join() === before.heads.join()), JSON.stringify(f.sheets.map((s) => [s.rows.length, s.rows[0].length])) + ' ' + before.rows.length);
		r = await runExport('csv', 'current', 'current');
		ok('CSV, current scenario: one file named with the scenario', /Junctions-A_B__C__Peak\.csv$/.test(r.name), r.name);
		r = await runExport('xlsx', 'all', 'all');
		f = inspect(r.file, 'xlsx');
		f.sheets = f.sheets.filter((x) => !LIBS.test(x.name));
		ok('workbook sheet names keep the scenario (the Scenarios table is one sheet of its own) and stay within 31 characters, unique', f.sheets.every((x) => x.name.length <= 31 && /Peak/.test(x.name) || /Base/.test(x.name) || x.name === 'Scenarios') && new Set(f.sheets.map((x) => x.name.toLowerCase())).size === f.sheets.length, f.sheets.map((x) => x.name).join(' | '));
		r = await runExport('csv', 'all', 'all');
		f = inspect(r.file, 'zip');
		const nJ = f.names.filter((n) => /Junctions-/.test(n));
		ok('CSV of all tables and all scenarios: a zip with a file per table and scenario', f.bad === null && nJ.length === 2 && f.names.length >= 8 && f.names.includes('Patterns.csv') && f.names.every((n) => !/[\/\\:*?"<>|]/.test(n)), f.names.join(', '));
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
