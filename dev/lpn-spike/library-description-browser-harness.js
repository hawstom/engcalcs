// A DESCRIPTION TYPED IN THE LIBRARY ON A PATTERN, A CONTROL AND A RULE SURVIVES SAVE, RELOAD,
// EXPORT AND RE-IMPORT. Real Chromium, the real page, real typing.
//   node dev/lpn-spike/library-description-browser-harness.js   (takes the browser lock itself)
//
// Tom, 2026-10-14: "Let's add Description to the Library Patterns, Controls, and Rules." The gallery
// Net1 (patterns, controls and two rules):
//   1. each of the three sections shows a field headed with the Curves section's own word;
//   2. a description typed into each one is still there after the autosave and a reload;
//   3. File > Export writes each as a `;` line directly above the thing it describes;
//   4. that file, opened again, shows the same three descriptions;
//   5. ?lang=es heads the field with the Spanish word for it.
// The .inp placement rules themselves are library-description-inp-harness.js's.
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
const LOCK_ENV = 'EC_LIBDESC_BROWSER_LOCKED';
const NAME = 'library-description-browser-harness';

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

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

// A .zip read back by its central directory (an export with a picture is a .zip).
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
function section(text, name) {
	const out = [];
	let on = false;
	text.split(/\r?\n/).forEach((l) => {
		const m = /^\s*\[(\w+)\]/.exec(l);
		if (m) { on = m[1].toUpperCase() === name; return; }
		if (on && l.trim()) { out.push(l.replace(/\s+$/, '')); }
	});
	return out;
}

const DESC = { patterns: 'Harness pattern description', controls: 'Harness control description',
	rules: 'Harness rule description' };

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	let chromium;
	try { chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium; }
	catch (err) { console.error('playwright-core is not installed (cd dev/browser-pass && npm install).'); process.exit(1); }
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
		await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		const P = (fn, arg) => a.page.evaluate(fn, arg);
		const dismiss = () => P(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		const closeDialogs = async () => {
			for (let k = 0; k < 6; k++) {
				const shown = await P(() => { const bd = document.getElementById('lpn_dialog_backdrop'); return !!bd && getComputedStyle(bd).display !== 'none'; });
				if (!shown) { return; }
				await a.page.click('#lpn_dialog_buttons button:visible');
				await a.settle(300);
			}
		};
		const openLib = async (sec) => {
			const open = await P(() => { const b = document.getElementById('lpn_library_box'); return !!b && getComputedStyle(b).display !== 'none'; });
			if (!open) {
				await a.menuClick(await a.lang('lpn_library_menu'), 'project');
				await a.page.waitForSelector('#lpn_library_box', { state: 'visible' });
			}
			await P((s) => {
				document.getElementById('lpn_libbox_link_' + s)
					.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
			}, sec);
			await a.settle(300);
		};
		const closeLib = async () => { await P(() => { const x = document.getElementById('lpn_libbox_close'); if (x) { x.click(); } }); await a.settle(200); };
		// The description field of the FIRST entry: its heading and its value.
		const firstDesc = () => P(() => {
			const e = document.querySelector('#lpn_libbox_content .lpn-lib-entry');
			const i = e && e.querySelector('input.lpn-lib-desc');
			if (!i) { return null; }
			const head = i.closest('label').querySelector('.lpn-lib-fieldname');
			return { value: i.value, head: head ? head.textContent : null };
		});
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
				const z = unzip(buf), n = Object.keys(z).find((k) => /\.inp$/i.test(k));
				buf = z[n];
			}
			return buf.toString('utf8');
		};

		await a.goto('Looped-Network.php');
		await a.answerTrainingPanel().catch(() => {});
		await dismiss();
		await a.openExampleCard(await a.lang('lpn_ex_net1_title'));
		await a.settle(1200);
		const word = await a.lang('lpn_library_curve_note_label');

		console.log('\n--- 1. type a description in each of the three sections ---');
		for (const sec of ['patterns', 'controls', 'rules']) {
			await openLib(sec);
			const before = await firstDesc();
			ok(sec + ': the first entry has a Description field headed "' + word + '"',
				!!before && before.head === word, JSON.stringify(before));
			if (!before) { continue; }
			const box = a.page.locator('#lpn_libbox_content .lpn-lib-entry').first().locator('input.lpn-lib-desc');
			await box.click();
			await box.fill(DESC[sec]);
			await box.press('Tab');
			await a.settle(300);
		}
		const docNow = await P(() => ({ ok: true }));
		ok('the page is still alive after the edits', docNow.ok);
		await closeLib();

		console.log('\n--- 2. autosave, reload, and they are still there ---');
		await a.settle(1200);
		await a.reload();
		await dismiss();
		await a.settle(1500);
		for (const sec of ['patterns', 'controls', 'rules']) {
			await openLib(sec);
			const d = await firstDesc();
			ok(sec + ': after the reload the description reads "' + DESC[sec] + '"', !!d && d.value === DESC[sec], JSON.stringify(d));
		}
		await closeLib();

		console.log('\n--- 3. File > Export writes each above the thing it describes ---');
		const inp = await exportInp();
		ok('an .inp was exported', inp.length > 500, 'len ' + inp.length);
		const P1 = section(inp, 'PATTERNS'), C1 = section(inp, 'CONTROLS'), R1 = section(inp, 'RULES');
		ok('[PATTERNS] starts with the description line, then the pattern\'s rows',
			P1[0] === ';' + DESC.patterns && /^\s*\S+\s+[-\d.]/.test(P1[1] || ''), JSON.stringify(P1.slice(0, 2)));
		ok('[CONTROLS] starts with the description line, then the control',
			C1[0] === ';' + DESC.controls && /^LINK\s/i.test(C1[1] || ''), JSON.stringify(C1.slice(0, 2)));
		const ri = R1.findIndex((l) => /^\s*RULE\s/i.test(l));
		ok('[RULES] has the description directly above the first RULE line',
			ri > 0 && R1[ri - 1] === ';' + DESC.rules, JSON.stringify(R1.slice(0, ri + 1)));

		console.log('\n--- 4. that file, opened again ---');
		await a.page.setInputFiles('#lpn_inp_file', { name: 'libdesc-roundtrip.inp', mimeType: 'text/plain', buffer: Buffer.from(inp) });
		await a.settle(1500);
		await closeDialogs();
		await a.settle(500);
		for (const sec of ['patterns', 'controls', 'rules']) {
			await openLib(sec);
			const d = await firstDesc();
			ok(sec + ': the re-imported file shows "' + DESC[sec] + '"', !!d && d.value === DESC[sec], JSON.stringify(d));
		}
		const again = await exportInp();
		ok('and exports the same three sections again, line for line',
			JSON.stringify([section(again, 'PATTERNS'), section(again, 'CONTROLS'), section(again, 'RULES')]) ===
			JSON.stringify([P1, C1, R1]));
		await closeLib();

		console.log('\n--- 5. ?lang=es ---');
		const b = await Session.open(browser, NAME + '-es', { viewport: { width: 1400, height: 900 } });
		await b.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await b.goto('Looped-Network.php?lang=es');
		await b.answerTrainingPanel().catch(() => {});
		await b.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await b.openExampleCard(await b.lang('lpn_ex_net1_title'));
		await b.settle(1200);
		await b.menuClick(await b.lang('lpn_library_menu'), 'project');
		await b.page.waitForSelector('#lpn_library_box', { state: 'visible' });
		const esWord = await b.lang('lpn_library_curve_note_label');
		for (const sec of ['patterns', 'controls', 'rules']) {
			await b.page.evaluate((s) => {
				document.getElementById('lpn_libbox_link_' + s)
					.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, detail: 1 }));
			}, sec);
			await b.settle(300);
			const h = await b.page.evaluate(() => {
				const i = document.querySelector('#lpn_libbox_content .lpn-lib-entry input.lpn-lib-desc');
				return i ? i.closest('label').querySelector('.lpn-lib-fieldname').textContent : null;
			});
			ok('es ' + sec + ': the field is headed "' + esWord + '"', h === esWord && esWord !== word, JSON.stringify(h));
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log(fails ? '\n' + fails + ' FAILED' : '\nall passed');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
