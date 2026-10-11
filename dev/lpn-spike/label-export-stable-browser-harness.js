// A TEXT'S [LABELS] ROW DOES NOT MOVE ACROSS A RELOAD, AND AN IMPORTED ONE COMES BACK AS IT WENT IN, in a
// real Chrome.
//
//   node dev/lpn-spike/label-export-stable-browser-harness.js   (takes the browser lock itself)
//
// CLAUDE.md: import -> export is byte-identical for unedited values. (1) Open the Net1 and Net3 examples,
// File > Export EPANET file, reload the page, open the example again, export again: the [LABELS] section
// must be identical. (2) Import the EPANET distribution's Net1.inp, export without an edit: its
// [LABELS] rows must equal the source's, character for character.
'use strict';

const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_LABEL_EXPORT_STABLE_BROWSER_LOCKED';
const NAME = 'label-export-stable-browser-harness';

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

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}

let Session;
// A .zip read back by its central directory, each entry inflated by node's zlib and its CRC checked
// against node's own crc32, so nothing here shares code with the page's writer.
function unzip(buf) {
	const out = {};
	let e = buf.length - 22;
	while (e >= 0 && buf.readUInt32LE(e) !== 0x06054b50) { e--; }
	if (e < 0) { return null; }
	const n = buf.readUInt16LE(e + 10);
	let p = buf.readUInt32LE(e + 16);
	for (let i = 0; i < n; i++) {
		if (buf.readUInt32LE(p) !== 0x02014b50) { return null; }
		const method = buf.readUInt16LE(p + 10), crc = buf.readUInt32LE(p + 16), csize = buf.readUInt32LE(p + 20),
			usize = buf.readUInt32LE(p + 24), nlen = buf.readUInt16LE(p + 28), xlen = buf.readUInt16LE(p + 30),
			clen = buf.readUInt16LE(p + 32), loc = buf.readUInt32LE(p + 42), name = buf.toString('utf8', p + 46, p + 46 + nlen);
		if (buf.readUInt32LE(loc) !== 0x04034b50) { return null; }
		const start = loc + 30 + buf.readUInt16LE(loc + 26) + buf.readUInt16LE(loc + 28), body = buf.subarray(start, start + csize);
		const data = method === 8 ? zlib.inflateRawSync(body) : method === 0 ? Buffer.from(body) : null;
		if (!data || data.length !== usize || zlib.crc32(data) !== crc) { return null; }
		out[name] = data;
		p += 46 + nlen + xlen + clen;
	}
	return out;
}
// A project with a background picture exports ONE .zip (the .inp, a .bmp and a .bpw) whose entries carry
// the clock's time, so two exports differ in the zip's bytes alone. Compare the .inp inside it.
function inpText(buf) {
	if (buf.length > 4 && buf.toString('latin1', 0, 2) === 'PK') {
		const z = unzip(buf), n = z && Object.keys(z).find((k) => /\.inp$/i.test(k));
		return n ? z[n].toString('utf8') : null;
	}
	return buf.toString('utf8');
}

async function open(browser) {
	const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 }, acceptDownloads: true });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php?ec_nolog=1');
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
	await a.settle(1500);
	return a;
}
async function closeDialog(a) {
	for (let k = 0; k < 6; k++) {
		const shown = await a.page.evaluate(() => {
			const bd = document.getElementById('lpn_dialog_backdrop');
			return !!bd && getComputedStyle(bd).display !== 'none';
		});
		if (!shown) { return; }
		await a.page.click('#lpn_dialog_buttons button:visible');
		await a.settle(400);
	}
}
async function exportInp(a) {
	const got = [];
	const onDl = (d) => got.push(d);
	a.page.on('download', onDl);
	await closeDialog(a);
	await a.menuClickSub(await a.lang('lpn_file_export_menu'), await a.lang('lpn_file_export_item_inp'), 'file');
	for (let i = 0; i < 60 && got.length < 1; i++) { await a.page.waitForTimeout(100); }
	await a.page.waitForTimeout(800);
	a.page.off('download', onDl);
	if (!got.length) { return null; }
	return inpText(fs.readFileSync(await got[0].path()));
}
// The [LABELS] rows, exactly as written (whitespace included), without the header comment line.
function labelRows(text) {
	const out = [];
	let on = false;
	for (const line of String(text).split(/\r?\n/)) {
		const m = /^\s*\[(\w+)\]/.exec(line);
		if (m) { on = m[1].toUpperCase() === 'LABELS'; continue; }
		if (on && line.trim() && line.trim()[0] !== ';') { out.push(line); }
	}
	return out;
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
		for (const [label, key] of [['Net1', 'lpn_ex_net1_title'], ['Net3', 'lpn_ex_net3_title']]) {
			console.log('\n--- ' + label + ': export, reload, export ---');
			let a = await open(browser);
			await a.openExampleCard(await a.lang(key));
			const first = await exportInp(a);
			// A different window size on the second visit: the page fits the drawing to its window, so
			// a position that depended on the zoom would move.
			await a.page.setViewportSize({ width: 1100, height: 760 });
			await a.page.reload();
			await a.settle(2000);
			await a.answerTrainingPanel().catch(() => {});
			await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
			// The project is restored from the browser's own autosave; a wall of examples means it was not.
			if (await a.page.$('#lpn_examples_pane .lpn-example-card')) { await a.openExampleCard(await a.lang(key)); }
			const second = await exportInp(a);
			ok(label + ': both exports downloaded', !!first && !!second);
			if (first && second) {
				const r1 = labelRows(first), r2 = labelRows(second);
				if (label === 'Net1') { ok(label + ': has [LABELS] rows', r1.length > 0, r1.length + ' rows'); }
				ok(label + ': [LABELS] identical across the reload', JSON.stringify(r1) === JSON.stringify(r2), '\n    ' + r1.join('\n    ') + '\n  vs\n    ' + r2.join('\n    '));
				const l1 = first.split(/\r?\n/), l2 = second.split(/\r?\n/), diffs = [];
				for (let k = 0; k < Math.max(l1.length, l2.length) && diffs.length < 12; k++) { if (l1[k] !== l2[k]) { diffs.push('line ' + (k + 1) + ': ' + JSON.stringify(l1[k]) + ' vs ' + JSON.stringify(l2[k])); } }
				ok(label + ': the whole file is identical across the reload', first === second, diffs.length ? '\n    ' + diffs.join('\n    ') : '');
			}
			await a.close();
		}

		console.log('\n--- the EPANET distribution\'s Net1.inp: import, export untouched ---');
		for (const f of ['Net1.inp', 'Net3.inp']) {
			const src = fs.readFileSync(path.join(REPO, 'dev', 'water-network-examples', f), 'utf8');
			const a = await open(browser);
			await a.page.setInputFiles('#lpn_inp_file', { name: f, mimeType: 'text/plain', buffer: Buffer.from(src) });
			await a.settle(1500);
			const out = await exportInp(a);
			ok(f + ': exported', !!out);
			if (out) {
				const flat = (rows) => rows.map((r) => r.trim().split(/\s+/).join(' ')), s = flat(labelRows(src)), o = flat(labelRows(out));
				ok(f + ': [LABELS] rows equal the source\'s, every token character for character (padding aside)', s.length > 0 && JSON.stringify(s) === JSON.stringify(o), '\n    ' + s.join('\n    ') + '\n  vs\n    ' + o.join('\n    '));
			}
			await a.close();
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + (checks - failures) + '/' + checks + ' checks passed');
	process.exit(failures ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
