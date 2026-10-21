// EPANET-MSX PHASE 1 (Task 717): an .msx file is attached, kept, and written back byte for byte,
// in a real Chrome, through the real File menu rows.
//
//   node dev/lpn-spike/msx-attach-browser-harness.js
//
// File > Import > EPANET-MSX file attaches dev/lpn-spike/fixtures/chlorine-decay.msx to an imported
// network; the report says it is kept and will run, names the species and the ID the network lacks.
// File > Export > EPANET-MSX file (only present once one is attached) sends exactly ONE download,
// byte-identical. A second file with a BOM, CRLF line ends and a non-UTF-8 byte round-trips too.
// Save as, then Open in a fresh page, brings the file back; Remove takes the row away again.
// Phase 2: EPA's EPANET-MSX example network runs its .msx and the Tables pane shows a species.
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_MSX_ATTACH_BROWSER_LOCKED';
const NAME = 'msx-attach-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a failure of what this measures; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error(NAME + ': no `flock` binary found -- running WITHOUT the browser lock.');
}

let checks = 0, failures = 0, Session;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

const INP = ['[TITLE]', 'msx carry', '', '[JUNCTIONS]', ' J1  10  100', ' J2  10  100', '',
	'[RESERVOIRS]', ' R1  50', '', '[PIPES]', ' P1  R1  J1  1000  12  100  0  Open', ' P2  J1  J2  1000  8  100  0  Open', '',
	'[DEMANDS]', ' J2  50', '', '[OPTIONS]', ' Units  GPM', ' Headloss  H-W', '',
	'[COORDINATES]', ' R1  1100  2100', ' J1  1200  2150', ' J2  1300  2250', '', '[END]', ''].join('\n');
const MSX1 = fs.readFileSync(path.join(__dirname, 'fixtures', 'chlorine-decay.msx'));
// BOM, CRLF, a lone 0xB5 (not valid UTF-8), no final newline.
const MSX2 = Buffer.concat([Buffer.from([0xEF, 0xBB, 0xBF]), Buffer.from('[SPECIES]\r\nBULK CL2 '), Buffer.from([0xB5]), Buffer.from('G\r\n[PIPES]\r\nRATE CL2 -0.1*CL2')]);

async function open(browser) {
	const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
	await a.settle(1000);
	return a;
}
async function closeDialogs(a) {
	for (let k = 0; k < 6; k++) {
		const shown = await a.page.evaluate(() => { const bd = document.getElementById('lpn_dialog_backdrop'); return !!bd && getComputedStyle(bd).display !== 'none'; });
		if (!shown) { return; }
		await a.page.click('#lpn_dialog_buttons button:visible');
		await a.settle(300);
	}
}
const dialogText = (a) => a.page.evaluate(() => (document.getElementById('lpn_dialog_body') || {}).textContent || '');
// Click File > Import > EPANET-MSX file (or Replace) and answer the file chooser it opens.
async function attach(a, L, name, buf, viaReplace) {
	const [chooser] = await Promise.all([
		a.page.waitForEvent('filechooser'),
		viaReplace ? a.page.click('#lpn_dialog_buttons button:has-text("' + L.replace + '")') : a.menuClickSub(L.imp, L.impMsx, 'file')
	]);
	await chooser.setFiles({ name: name, mimeType: 'text/plain', buffer: buf });
	await a.settle(900);
}
async function exportMsx(a, L) {
	const got = [];
	const onDl = (d) => got.push(d);
	a.page.on('download', onDl);
	await a.menuClickSub(L.exp, L.expMsx, 'file');
	for (let i = 0; i < 60 && got.length < 1; i++) { await a.page.waitForTimeout(100); }
	await a.page.waitForTimeout(1200);   // long enough for a second download, if one were sent
	a.page.off('download', onDl);
	const files = [];
	for (const d of got) { files.push({ name: d.suggestedFilename(), bytes: fs.readFileSync(await d.path()) }); }
	return files;
}
async function exportRows(a, L) {
	await a.openMenu('file');
	await a.page.evaluate((l) => {
		const r = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).find((b) => b.textContent.trim().indexOf(l) === 0);
		r.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
	}, L.exp);
	await a.page.waitForSelector('#lpn_menu_popup2', { state: 'visible' });
	const rows = await a.page.$$eval('#lpn_menu_list2 button.lpn-menu-row', (els) => els.map((b) => b.textContent.trim()));
	await a.closeMenu();
	return rows;
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	({ Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js')));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await open(browser);
		const L = {};
		for (const [k, key] of [['imp', 'lpn_file_import_menu'], ['impMsx', 'lpn_file_import_msx'], ['exp', 'lpn_file_export_menu'], ['expMsx', 'lpn_file_export_item_msx'],
			['replace', 'lpn_replace_btn'], ['remove', 'lpn_fitting_remove'], ['kept', 'lpn_msx_report_kept'], ['saveas', 'lpn_file_saveas'], ['open', 'lpn_file_open']]) {
			L[k] = (await a.lang(key)).trim();
		}
		await a.page.setInputFiles('#lpn_inp_file', { name: 'msxnet.inp', mimeType: 'text/plain', buffer: Buffer.from(INP) });
		await a.settle(900);
		await closeDialogs(a);

		console.log('\n--- before anything is attached ---');
		const rows0 = await exportRows(a, L);
		ok('the Export fly-out has no EPANET-MSX row yet', !rows0.some((t) => t.indexOf(L.expMsx) === 0), rows0.join(' | '));

		console.log('\n--- File > Import > EPANET-MSX file ---');
		await attach(a, L, 'cl.msx', MSX1, false);
		const rep = await dialogText(a);
		ok('the report says the file is kept and set to run', rep.indexOf(L.kept) >= 0, rep);
		ok('...names the species CL2', /Species in the file: CL2\./.test(rep), rep);
		ok('...names the ID the network lacks (NOWHERE) and not J1', rep.indexOf('NOWHERE') >= 0 && !/this network does not have:[^.]*J1/.test(rep), rep);
		await closeDialogs(a);
		const rows1 = await exportRows(a, L);
		ok('the Export fly-out now has the EPANET-MSX row', rows1.some((t) => t.indexOf(L.expMsx) === 0), rows1.join(' | '));

		console.log('\n--- File > Export > EPANET-MSX file ---');
		const e1 = await exportMsx(a, L);
		ok('one click is ONE download, ending .msx', e1.length === 1 && /\.msx$/.test(e1[0].name), e1.map((f) => f.name).join(', '));
		ok('the exported file is byte-identical to the one attached', e1.length === 1 && Buffer.compare(e1[0].bytes, MSX1) === 0);

		console.log('\n--- view, then Replace with a BOM / CRLF / non-UTF-8 file ---');
		await a.menuClickSub(L.imp, L.impMsx, 'file');
		await a.settle(500);
		const shown = await a.page.evaluate(() => (document.getElementById('lpn_msx_text') || {}).value || '');
		ok('the Import row now shows the attached file', shown.indexOf('[SPECIES]') >= 0 && shown.indexOf('BULK CL2 MG') >= 0);
		await attach(a, L, 'odd.msx', MSX2, true);
		await closeDialogs(a);
		const e2 = await exportMsx(a, L);
		ok('BOM + CRLF + a non-UTF-8 byte come back byte-identical', e2.length === 1 && Buffer.compare(e2[0].bytes, MSX2) === 0, e2.length && e2[0].bytes.length + ' vs ' + MSX2.length);

		console.log('\n--- back to the first file, then the project file ---');
		await a.menuClickSub(L.imp, L.impMsx, 'file');
		await attach(a, L, 'cl.msx', MSX1, true);
		await closeDialogs(a);
		await a.menuClick(L.saveas);
		await a.settle(600);
		if (await a.dialog()) { await a.answerTrainingPanel(); await a.settle(1500); }
		const files = (await a.listFiles()).filter((f) => /\.epp$/.test(f));
		ok('Save as wrote one project file', files.length === 1, files.join(', '));
		const text = await a.readFile(files[0]);
		const saved = JSON.parse(text);
		ok('the project file carries the .msx text', saved.msx && saved.msx.text === MSX1.toString('utf8'));

		const b = await open(browser);
		await b.writeFile('Carried.epp', text);
		await b.queuePick('Carried.epp');
		await b.menuClick(L.open);
		await b.settle(1500);
		for (let k = 0; k < 3 && (await b.dialog()); k++) {
			const d = await b.dialog();
			if ((d.buttons || []).indexOf('Open read-only') >= 0) { await b.dialogClick('Open read-only'); } else { await b.answerTrainingPanel().catch(() => {}); }
			await b.settle(1500);
		}
		const e3 = await exportMsx(b, L);
		ok('reopened project exports the same bytes', e3.length === 1 && Buffer.compare(e3[0].bytes, MSX1) === 0, e3.map((f) => f.name + ':' + f.bytes.length).join(', '));

		console.log('\n--- a file the browser cannot keep (6 MB) is refused, and the old one stays ---');
		const BIG = Buffer.concat([Buffer.from('[SPECIES]\nBULK CL2 MG\n[TERMS]\n'), Buffer.alloc(6 * 1024 * 1024, 'x')]);
		await b.menuClickSub(L.imp, L.impMsx, 'file');
		await b.settle(400);
		await attach(b, L, 'big.msx', BIG, true);
		const bigSaid = await dialogText(b);
		ok('the visitor is told it is too large to keep and was not attached', bigSaid.indexOf((await b.lang('lpn_msx_too_big')).replace('{file}', 'big.msx')) >= 0, bigSaid.slice(0, 160));
		await closeDialogs(b);
		const e4 = await exportMsx(b, L);
		ok('the previous .msx is still attached and exports unchanged', e4.length === 1 && Buffer.compare(e4[0].bytes, MSX1) === 0);
		const stored = await b.page.evaluate(() => Object.keys(localStorage).some((k) => (localStorage.getItem(k) || '').indexOf('xxxxxxxxxxxxxxxx') >= 0));
		ok('nothing of the big file reached browser storage', !stored);

		console.log('\n--- Remove ---');
		await b.menuClickSub(L.imp, L.impMsx, 'file');
		await b.settle(400);
		await b.page.click('#lpn_dialog_buttons button:has-text("' + L.remove + '")');
		await b.settle(600);
		const rows2 = await exportRows(b, L);
		ok('after Remove the Export row is gone', !rows2.some((t) => t.indexOf(L.expMsx) === 0), rows2.join(' | '));
		console.log('\n--- phase 2: EPA\'s EPANET-MSX example runs, and the Tables pane shows a species ---');
		const c = await open(browser);
		const FIX = path.join(__dirname, 'fixtures', 'msx-example');
		await c.page.setInputFiles('#lpn_inp_file', { name: 'example.inp', mimeType: 'text/plain', buffer: fs.readFileSync(path.join(FIX, 'example.inp')) });
		await c.settle(1500);
		await closeDialogs(c);
		await attach(c, L, 'example.msx', fs.readFileSync(path.join(FIX, 'example.msx')), false);
		await closeDialogs(c);
		await c.settle(4000);
		ok('the run raised no diagnostic', !/error|refus|could not/i.test(await c.status()), await c.status());
		await c.toolbarClick((await c.lang('lpn_time_last')).trim());
		await c.settle(800);
		await c.toolbarClick((await c.lang('lpn_pane_toggle')).trim());
		await c.settle(1200);
		const ths = await c.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_pane_junctions th')).map((t) => t.textContent.trim()));
		ok('the Junctions table heads a column with the first species in the file\'s unit, AS3 (UG/L)', ths.indexOf('AS3 (UG/L)') >= 0, ths.slice(-3).join(' | '));
		console.log('\n--- the .inp and its .msx chosen together open together (Tom, 2026-10-18) ---');
		const d = await open(browser);
		await d.page.setInputFiles('#lpn_inp_file', [
			{ name: 'example.inp', mimeType: 'text/plain', buffer: fs.readFileSync(path.join(FIX, 'example.inp')) },
			{ name: 'example.msx', mimeType: 'text/plain', buffer: fs.readFileSync(path.join(FIX, 'example.msx')) }]);
		await d.settle(1500);
		const both = await dialogText(d);
		ok('one report names both files: the network imported and the .msx attached', /example\.inp/.test(both) && /Attached example\.msx/.test(both) && both.indexOf(L.kept) >= 0, both.slice(0, 200));
		ok('...and Settings, Quality is now Multi-species', await d.page.evaluate(() => (EngCalcs.lpnDebug && EngCalcs.lpnDebug.settings ? EngCalcs.lpnDebug.settings().quality.mode : document.querySelector('#lpn_set_quality_fields select') && document.querySelector('#lpn_set_quality_fields select').value)) === 'msx');
		ok('no uncaught page errors', a.errors.length === 0 && b.errors.length === 0 && c.errors.length === 0 && d.errors.length === 0, a.errors.concat(b.errors, c.errors, d.errors).slice(0, 2).join(' | '));
		await d.close();
		await c.close();
		await b.close();
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
