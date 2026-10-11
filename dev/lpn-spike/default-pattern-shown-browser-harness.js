// THE DEFAULT DEMAND PATTERN IS NEVER INVISIBLE STATE (Tom, 2026-10-11: renaming Net3's pattern "1"
// turned every run flat with no word anywhere).
//   node dev/lpn-spike/default-pattern-shown-browser-harness.js
// (it takes /tmp/engcalcs-browser.lock itself; never wrap it in that lock).
//
// Real Chromium, the real page. Net3 from the gallery, then:
//   1. renaming pattern 1 in the Libraries box carries the default with it: Settings shows the new
//      name, the EPS run is NOT flat (a junction's demand varies over time);
//   2. an unedited Net3 exports with no PATTERN option, and choosing the shown "1" in Settings
//      writes nothing either;
//   3. a blank-pattern junction reads "(default: 1)" in the Tables pane, and the Libraries list marks
//      the default row; with no pattern "1" the selector offers "None (constant)" and a junction
//      reads "(constant)";
//   4. ?lang=es renders the same rows (English fallbacks for the new keys).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const fs = require('fs');
const zlib = require('zlib');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_DEFPAT_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '180', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error('default-pattern-shown-browser-harness: flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error('default-pattern-shown-browser-harness: NOT RUN -- another session held ' + LOCK_FILE + ' for 180 s.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error('default-pattern-shown-browser-harness: no `flock` binary found -- running WITHOUT the browser lock.');
}

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

// A .zip read back by its central directory (Net3 carries a picture, so File > Export sends a .zip).
function unzip(buf) {
	const out = {};
	let e = buf.length - 22;
	while (e >= 0 && buf.readUInt32LE(e) !== 0x06054b50) { e--; }
	if (e < 0) { return null; }
	const n = buf.readUInt16LE(e + 10);
	let p = buf.readUInt32LE(e + 16);
	for (let i = 0; i < n; i++) {
		const method = buf.readUInt16LE(p + 10), csize = buf.readUInt32LE(p + 20), nlen = buf.readUInt16LE(p + 28),
			xlen = buf.readUInt16LE(p + 30), clen = buf.readUInt16LE(p + 32), loc = buf.readUInt32LE(p + 42),
			name = buf.toString('utf8', p + 46, p + 46 + nlen);
		const start = loc + 30 + buf.readUInt16LE(loc + 26) + buf.readUInt16LE(loc + 28), body = buf.subarray(start, start + csize);
		out[name] = method === 8 ? zlib.inflateRawSync(body) : Buffer.from(body);
		p += 46 + nlen + xlen + clen;
	}
	return out;
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	let chromium;
	try { chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium; }
	catch (err) { console.error('playwright-core is not installed (cd dev/browser-pass && npm install).'); process.exit(1); }
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error('default-pattern-shown-browser-harness: no Chromium found (set CHROME_PATH). SKIPPING.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'defpat');
		const P = (fn, arg) => a.page.evaluate(fn, arg);
		const press = (sel, text) => P(([s, t]) => {
			const b = Array.from(document.querySelectorAll(s)).find((x) => !t || x.textContent.trim() === t);
			b.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
		}, [sel, text || null]);
		const closeDialogs = async () => {
			for (let k = 0; k < 6; k++) {
				const shown = await P(() => { const bd = document.getElementById('lpn_dialog_backdrop'); return !!bd && getComputedStyle(bd).display !== 'none'; });
				if (!shown) { return; }
				await a.page.click('#lpn_dialog_buttons button:visible');
				await a.settle(300);
			}
		};
		const exportInp = async () => {
			const got = [];
			const onDl = (d) => got.push(d);
			a.page.on('download', onDl);
			await closeDialogs();
			await a.menuClickSub(await a.lang('lpn_file_export_menu'), await a.lang('lpn_file_export_item_inp'), 'file');
			for (let i = 0; i < 60 && got.length < 1; i++) { await a.page.waitForTimeout(100); }
			a.page.off('download', onDl);
			if (!got.length) { return ''; }
			let buf = fs.readFileSync(await got[0].path());
			if (buf.readUInt32LE(0) === 0x04034b50) {
				const z = unzip(buf), name = Object.keys(z).find((k) => /\.inp$/i.test(k));
				buf = z[name];
			}
			return buf.toString('utf8');
		};
		// The Default demand pattern row in Settings: {value, options}.
		const settingsRow = async () => {
			await a.toolbarClick(await a.lang('lpn_tool_settings'));
			await a.page.waitForSelector('#lpn_settings_box', { state: 'visible' });
			await a.settle(500);
			const want = await a.lang('lpn_settings_default_pattern');
			return P((w) => {
				const rows = Array.from(document.querySelectorAll('#lpn_settings_box label')).filter((l) => l.textContent.indexOf(w) >= 0 && l.querySelector('select'));
				if (!rows.length) { return null; }
				const s = rows[0].querySelector('select');
				return { value: s.value, shown: s.options[s.selectedIndex].text, options: Array.from(s.options).map((o) => o.text) };
			}, want);
		};
		const closeSettings = async () => { await P(() => { const b = document.getElementById('lpn_setbox_close'); if (b) { b.click(); } }); await a.settle(200); };
		const openLibraries = async () => {
			await a.menuClick(await a.lang('lpn_library_menu'), 'project');
			await a.page.waitForSelector('#lpn_library_box', { state: 'visible' });
			await press('#lpn_libbox_link_patterns');
			await a.settle(300);
		};
		const closeLibraries = async () => { await P(() => { const x = document.getElementById('lpn_libbox_close'); if (x) { x.click(); } }); await a.settle(200); };
		// A junction that carries NO pattern of its own, as the Tables pane shows it: the text of the
		// blank option in its Demand pattern cell.
		const tableBlank = async () => {
			await a.toolbarClick(await a.lang('lpn_pane_toggle'));
			await a.settle(300);
			await a.page.click('#lpn_pane_tab_junctions');
			await a.settle(1200);
			const r = await P(() => {
				const sels = Array.from(document.querySelectorAll('#lpn_pane select')).filter((s) => s.options.length && s.options[0].value === '' && /default|constant/i.test(s.options[0].text));
				return sels.length ? sels[0].options[0].text : null;
			});
			return r;
		};

		let row;
		const net3Flow = async (label, load, stated) => {
		console.log('\n--- ' + label + ': rename pattern 1 ---');
			await a.goto('Looped-Network.php');
			await P(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			await load();
			const plain = await exportInp();
			const optionsOf = (t) => (t.split(/\[OPTIONS\]/i)[1] || '').split(/\n\[/)[0];
			ok(label + ': an unedited export ' + (stated ? 'keeps' : 'writes no') + ' PATTERN option', plain.length > 1000 && /^\s*Pattern\s+1\s*$/mi.test(optionsOf(plain)) === stated, 'len ' + plain.length);
			row = await settingsRow();
			console.log('  Settings row:', JSON.stringify(row));
			ok('Settings shows 1 selected, with no blank option', row && row.value === '1' && row.options.indexOf('1') >= 0 && row.options[0] !== '' && !row.options.some((t) => /none/i.test(t)), JSON.stringify(row));
			// Choosing the shown "1" writes nothing.
			await P(() => { const rows = Array.from(document.querySelectorAll('#lpn_settings_box label')).filter((l) => l.querySelector('select')); });
			await P((w) => {
				const l = Array.from(document.querySelectorAll('#lpn_settings_box label')).find((x) => x.textContent.indexOf(w) >= 0 && x.querySelector('select'));
				const s = l.querySelector('select'); s.value = '1'; s.dispatchEvent(new Event('change', { bubbles: true }));
			}, await a.lang('lpn_settings_default_pattern'));
			await closeSettings();
			const again = await exportInp();
			ok('after choosing the shown 1 the export is byte-identical, still no PATTERN option', again === plain);
			const blankText = await tableBlank();
			ok('a blank-pattern junction reads "(default: 1)" in the Junctions table', blankText === '(default: 1)', JSON.stringify(blankText));
			await a.toolbarClick(await a.lang('lpn_pane_toggle'));
			await a.settle(300);

			await openLibraries();
			const mark = await P(() => Array.from(document.querySelectorAll('#lpn_libbox_content .lpn-lib-entry')).map((e) => ({ id: e.querySelector('input.lpn-lib-id').value, text: e.querySelector('.lpn-lib-head').textContent })));
			ok('only the default row (1) carries the "(default)" mark', mark.length > 1 && mark.filter((m) => /\(default\)/.test(m.text)).map((m) => m.id).join() === '1', JSON.stringify(mark.map((m) => m.id + ':' + /\(default\)/.test(m.text))));
			const tip = await P(() => { const s = Array.from(document.querySelectorAll('#lpn_libbox_content .lpn-lib-head span')).find((x) => /\(default\)/.test(x.textContent)); return s ? (s.title || s.getAttribute('data-ec-title') || '') : ''; });
			console.log('  mark tip:', JSON.stringify(tip));

			// Before the rename: the demand a junction carries over the day.
			const demandSeries = async () => {
				await P(() => { EngCalcs.lpnTimeRunNow(); });
				await a.waitFor(() => P(() => EngCalcs.lpnTimeRunState().frames > 1), 'Net3 EPS frames', 120000);
				return P(() => {
					const fr = EngCalcs.lpnTimeRunFrames();
					const d0 = fr[0].demands; const keys = Object.keys(d0 || {});
					const k = keys.find((x) => d0[x] > 0);
					return { n: fr.length, key: k, series: fr.map((f) => f.demands[k]) };
				});
			};
			await closeLibraries();
			const before = await demandSeries();
			console.log('  before rename:', JSON.stringify(before).slice(0, 200));
			ok('before the rename a junction demand varies over the day', new Set(before.series.map((v) => (+v).toFixed(6))).size > 1);

			await openLibraries();
			await P(() => {
				const i = Array.from(document.querySelectorAll('#lpn_libbox_content input.lpn-lib-id')).find((x) => x.value === '1');
				i.value = 'X'; i.dispatchEvent(new Event('change', { bubbles: true }));
			});
			await a.settle(400);
			const mark2 = await P(() => Array.from(document.querySelectorAll('#lpn_libbox_content .lpn-lib-entry')).filter((e) => /\(default\)/.test(e.querySelector('.lpn-lib-head').textContent)).map((e) => e.querySelector('input.lpn-lib-id').value));
			ok('after the rename the "(default)" mark follows to X', mark2.join() === 'X', mark2.join());
			await closeLibraries();
			row = await settingsRow();
			ok('Settings shows X selected', row && row.value === 'X', JSON.stringify(row));
			await closeSettings();
			const after = await demandSeries();
			console.log('  after rename:', JSON.stringify(after).slice(0, 200));
			ok('after the rename the run is NOT flat, and matches the run before', new Set(after.series.map((v) => (+v).toFixed(6))).size > 1 && JSON.stringify(after.series.map((v) => +(+v).toFixed(5))) === JSON.stringify(before.series.map((v) => +(+v).toFixed(5))));
			const renamed = await exportInp();
			ok(label + ': the export of the renamed project states Pattern X', /^\s*Pattern\s+X\s*$/mi.test(renamed));
			const tb = await tableBlank();
			ok('the junction now reads "(default: X)"', tb === '(default: X)', JSON.stringify(tb));
			await a.toolbarClick(await a.lang('lpn_pane_toggle'));

		};
		await net3Flow('gallery Net3 (states Pattern 1)', async () => { await a.openExampleCard(await a.lang('lpn_ex_net3_title')); await a.settle(800); }, true);
		await net3Flow('Net3 with no PATTERN option (implied 1)', async () => {
			const txt = fs.readFileSync(path.join(__dirname, 'reference', 'Net3.inp'), 'utf8').replace(/^\s*Pattern\s+1\s*$/mi, '');
			await a.page.setInputFiles('#lpn_inp_file', { name: 'Net3-no-default.inp', mimeType: 'text/plain', buffer: Buffer.from(txt) });
			await a.settle(1500);
			await closeDialogs();
		}, false);

		console.log('\n--- delete the default ---');
		await openLibraries();
		await P(() => {
			const e = Array.from(document.querySelectorAll('#lpn_libbox_content .lpn-lib-entry')).find((x) => x.querySelector('input.lpn-lib-id').value === 'X');
			e.querySelector('button.lpn-lib-del').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
		});
		await a.settle(400);
		const note = await a.notice();
		console.log('  notice:', JSON.stringify(note));
		ok('deleting the default says so, and names a constant demand', /X/.test(String(note)) && /default demand pattern/i.test(String(note)) && /constant/i.test(String(note)), JSON.stringify(note));
		await closeLibraries();
		row = await settingsRow();
		ok('with no pattern 1 left Settings offers "None (constant)" and shows it', row && row.value === '' && row.shown === 'None (constant)', JSON.stringify(row));
		await closeSettings();
		const tc = await tableBlank();
		ok('a blank-pattern junction reads "(constant)"', tc === '(constant)', JSON.stringify(tc));

		console.log('\n--- ?lang=es ---');
		const b = await Session.open(browser, 'defpat-es');
		await b.goto('Looped-Network.php?lang=es');
		await b.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await b.openExampleCard(await b.lang('lpn_ex_net3_title'));
		await b.settle(800);
		await b.toolbarClick(await b.lang('lpn_tool_settings'));
		await b.page.waitForSelector('#lpn_settings_box', { state: 'visible' });
		await b.settle(500);
		const esRow = await b.page.evaluate((w) => {
			const l = Array.from(document.querySelectorAll('#lpn_settings_box label')).find((x) => x.textContent.indexOf(w) >= 0 && x.querySelector('select'));
			const s = l && l.querySelector('select'); return s ? { value: s.value, options: Array.from(s.options).map((o) => o.text) } : null;
		}, await b.lang('lpn_settings_default_pattern'));
		ok('es: the Settings row is built and shows 1', !!esRow && esRow.value === '1', JSON.stringify(esRow));
		const esFallback = await b.page.evaluate(() => [EngCalcs.pageConfig.lpn_demand_pattern_default, EngCalcs.pageConfig.lpn_library_pattern_default_mark]);
		ok('es: the new keys fall back to English strings, not empty', esFallback.every((s) => typeof s === 'string' && s.length > 0), JSON.stringify(esFallback));
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
