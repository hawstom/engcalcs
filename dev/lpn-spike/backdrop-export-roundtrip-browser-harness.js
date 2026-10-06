// EXPORT EPANET FILE SAVES THE PICTURE AND ITS WORLD FILE, AND THEY COME BACK REGISTERED, in a real
// Chrome.
//
//   node dev/lpn-spike/backdrop-export-roundtrip-browser-harness.js   (takes the browser lock itself)
//
// File > Export EPANET file on a project with a background picture downloads ONE .zip holding three
// files: the .inp, a 24-bit BMP (the format EPANET 2.2 opens; dev/backdrop-export.md) and its .bpw
// world file. One, because Chrome lets a click download one file; a second waits on a permission
// that drops it unseen. The last section proves that in Chrome's OWN download path (raw CDP, never
// Playwright's, which bypasses the multiple-download limit and so passed three loose files). The
// .inp's [BACKDROP] names the BMP and gives DIMENSIONS equal to the picture's corners with OFFSET 0 0.
// Re-importing that .inp in a fresh browser and attaching the downloaded BMP puts the picture back
// within one pixel of where it was; so does Background image's own door with the BMP and the world
// file picked together. Run on Elm Street Center (a site plan in a state-plane grid), and on pictures
// first placed from a NON-zero OFFSET and of a different shape from the rectangle, landscape and
// portrait, whose first placement is checked against EPANET's own rule written out here.
'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_BACKDROP_EXPORT_RT_BROWSER_LOCKED';
const NAME = 'backdrop-export-roundtrip-browser-harness';

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
function crc32(buf) {
	let c, crc = 0xffffffff;
	for (let n = 0; n < buf.length; n++) {
		c = (crc ^ buf[n]) & 0xff;
		for (let k = 0; k < 8; k++) { c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; }
		crc = (crc >>> 8) ^ c;
	}
	return (crc ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
	const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
	const td = Buffer.concat([Buffer.from(type), data]), crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
	return Buffer.concat([len, td, crc]);
}
// A w x h RGB PNG whose top half is red and bottom half blue, so an upside-down BMP shows.
function png(w, h) {
	const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
	const raw = Buffer.alloc((w * 3 + 1) * h);
	for (let y = 0; y < h; y++) {
		const o = y * (w * 3 + 1);
		raw[o] = 0;
		for (let x = 0; x < w; x++) {
			const top = y < h / 2;
			raw[o + 1 + x * 3] = top ? 255 : 0; raw[o + 2 + x * 3] = 0; raw[o + 3 + x * 3] = top ? 0 : 255;
		}
	}
	return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
// The header of a 24-bit BMP, and the colour of the first pixel of its first STORED row (the
// bottom row of the picture, since the rows run bottom-up).
function readBmp(buf) {
	if (buf.length < 54 || buf.toString('latin1', 0, 2) !== 'BM') { return null; }
	const off = buf.readUInt32LE(10);
	return { w: buf.readInt32LE(18), h: buf.readInt32LE(22), bpp: buf.readUInt16LE(28), size: buf.readUInt32LE(2),
		len: buf.length, firstStored: [buf[off + 2], buf[off + 1], buf[off]] };
}

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

function inp(backdropLines) {
	return ['[TITLE]', 'export round trip', '', '[JUNCTIONS]', ' J1  10  100', ' J2  10  100', '',
		'[RESERVOIRS]', ' R1  50', '', '[PIPES]', ' P1  R1  J1  1000  12  100  0  Open', ' P2  J1  J2  1000  8  100  0  Open', '',
		'[DEMANDS]', ' J2  50', '', '[OPTIONS]', ' Units  GPM', ' Headloss  H-W', '',
		'[COORDINATES]', ' R1  1100  2100', ' J1  1200  2150', ' J2  1300  2250', '', '[BACKDROP]'].concat(backdropLines, ['', '[END]', '']).join('\n');
}

async function open(browser) {
	const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
	await a.settle(1500);
	return a;
}
async function importInp(a, name, text) {
	await a.page.setInputFiles('#lpn_inp_file', { name: name, mimeType: 'text/plain', buffer: Buffer.from(text) });
	await a.settle(800);
}
const attachButton = (a) => a.page.$('#lpn_dialog_body button');
const corners = (a) => a.page.evaluate(() => EngCalcs.lpnBackdropProbe().corners);
async function attach(a, file) {
	const btn = await attachButton(a);
	if (!btn) { return false; }
	const [chooser] = await Promise.all([a.page.waitForEvent('filechooser'), btn.click()]);
	await chooser.setFiles(file);
	await a.settle(1000);
	return true;
}
async function closeDialog(a) {
	// The import report can be followed by another box; answer each with its first button.
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
// File > Export EPANET file, by its own words. Collects every download it starts.
async function exportAll(a) {
	const got = [];
	const onDl = (d) => got.push(d);
	a.page.on('download', onDl);
	await closeDialog(a);
	const label = await a.lang('lpn_file_export_inp');
	await a.page.click('#lpn_menu_file');
	await a.page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
	await a.page.evaluate((l) => {
		const r = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).find((b) => b.textContent.trim().indexOf(l) === 0);
		if (r) { r.click(); }
	}, label);
	for (let i = 0; i < 60 && got.length < 1; i++) { await a.page.waitForTimeout(100); }
	await a.page.waitForTimeout(1200);   // long enough for a second download, if one were sent
	a.page.off('download', onDl);
	a.lastNotice = await a.page.evaluate(() => (document.getElementById('lpn_map_notice') || {}).textContent || '');
	const files = {};
	for (const d of got) { files[d.suggestedFilename()] = fs.readFileSync(await d.path()); }
	a.downloads = Object.keys(files);
	return files;
}
// What the export put inside its one .zip, or null when it sent anything but exactly one .zip.
async function exportZip(a) {
	const dl = await exportAll(a), names = Object.keys(dl);
	a.zipName = names.length === 1 && /\.zip$/i.test(names[0]) ? names[0] : null;
	return a.zipName ? unzip(dl[a.zipName]) : null;
}
const pick = (files, ext) => Object.keys(files).find((n) => n.toLowerCase().endsWith(ext));
const bdRow = (text, key) => { const m = new RegExp('\\[BACKDROP\\][\\s\\S]*?^\\s*' + key + '\\s+(.*)$', 'mi').exec(text); return m ? m[1].trim().split(/\s+/) : null; };
const near = (x, y, tol) => Math.abs(x - y) <= tol;

// Export from the open page, re-import into fresh pages, and compare. `label` names the case.
async function roundTrip(browser, a, label, geo) {
	const before = await corners(a);
	const files = (await exportZip(a)) || {};
	ok(label + ': ONE download, a .zip', !!a.zipName, (a.downloads || []).join(', '));
	const names = Object.keys(files), inpN = pick(files, '.inp'), bmpN = pick(files, '.bmp'), bpwN = pick(files, '.bpw');
	ok(label + ': the .zip holds three files, .inp, .bmp and .bpw, each intact (CRC)', names.length === 3 && inpN && bmpN && bpwN, names.join(', '));
	ok(label + ': the .zip is named as the files are', !!a.zipName && !!inpN && a.zipName.replace(/\.zip$/i, '') === inpN.replace(/\.inp$/i, ''), a.zipName + ' / ' + inpN);
	if (!inpN || !bmpN || !bpwN || !before) { return; }
	const text = files[inpN].toString('utf8'), bmp = readBmp(files[bmpN]);
	const stem = (n) => n.replace(/\.[^.]+$/, '');
	ok(label + ': the three share one name', stem(inpN) === stem(bmpN) && stem(bmpN) === stem(bpwN), names.join(', '));
	const fileRow = bdRow(text, 'FILE'), offRow = bdRow(text, 'OFFSET'), dimRow = bdRow(text, 'DIMENSIONS');
	ok(label + ': [BACKDROP] FILE names the BMP by its bare name', fileRow && fileRow.join(' ') === bmpN, fileRow && fileRow.join(' '));
	ok(label + ': OFFSET is 0 0', offRow && Number(offRow[0]) === 0 && Number(offRow[1]) === 0, offRow && offRow.join(' '));
	ok(label + ': DIMENSIONS are the picture\'s corners', dimRow && dimRow.map(Number).every((v, i) => near(v, before[i], 1e-6)), (dimRow || []).join(' ') + ' vs ' + before.join(' '));
	ok(label + ': the BMP is a 24-bit Windows bitmap of the right length', bmp && bmp.bpp === 24 && bmp.size === bmp.len && bmp.len === 54 + Math.ceil(bmp.w * 3 / 4) * 4 * bmp.h, JSON.stringify(bmp && { w: bmp.w, h: bmp.h, bpp: bmp.bpp }));
	// A geographic project's world file is degrees per pixel on each axis, so E is the height's.
	const px = (before[2] - before[0]) / bmp.w, py = geo ? (before[3] - before[1]) / bmp.h : px;
	const w = String(files[bpwN]).trim().split(/\r?\n/).map(Number);
	ok(label + ': the world file is six numbers, unrotated' + (geo ? '' : ', E = -A'), w.length === 6 && w[1] === 0 && w[2] === 0 && (geo ? near(w[3], -py, 1e-9 * py) : w[3] === -w[0]), w.join(' | '));
	ok(label + ': A is the picture\'s width over its pixels', near(w[0], px, 1e-9 * Math.abs(px) + 1e-12), w[0] + ' vs ' + px);
	ok(label + ': C and F are the CENTRE of the upper-left pixel', near(w[4], before[0] + px / 2, 1e-6) && near(w[5], before[3] - py / 2, 1e-6),
		w[4] + ', ' + w[5] + ' vs ' + (before[0] + px / 2) + ', ' + (before[3] - py / 2));

	// Back in, through the .inp and the attach button, in a browser that has never seen it.
	const b = await open(browser);
	await importInp(b, inpN, text);
	const attached = await attach(b, { name: bmpN, mimeType: 'image/bmp', buffer: files[bmpN] });
	ok(label + ': the re-imported file offers to attach the picture it names', attached);
	const after = attached ? await corners(b) : null;
	ok(label + ': re-attached, every corner is within one pixel of where it was', after && after.every((v, i) => near(v, before[i], i % 2 ? py : px)),
		JSON.stringify(after) + ' vs ' + JSON.stringify(before) + ' (pixel ' + px + ')');
	ok(label + ': no uncaught page errors on re-import', b.errors.length === 0, b.errors.slice(0, 2).join(' | '));
	await b.close();

	// And through Background image's own door, the BMP and the world file picked together. Not in a
	// geographic project: its world file is in degrees, which that door does not read.
	if (geo) { return { bmp, files }; }
	const c = await open(browser);
	await importInp(c, inpN, text);
	await closeDialog(c);
	await c.page.setInputFiles('#lpn_backdrop_file', [{ name: bmpN, mimeType: 'image/bmp', buffer: files[bmpN] },
		{ name: bpwN, mimeType: 'text/plain', buffer: files[bpwN] }]);
	await c.settle(1200);
	const viaWorld = await corners(c);
	ok(label + ': picked with its world file, every corner is within one pixel', viaWorld && viaWorld.every((v, i) => near(v, before[i], px)),
		JSON.stringify(viaWorld) + ' vs ' + JSON.stringify(before));
	await c.close();
	return { bmp, files };
}

// **CHROME'S OWN DOWNLOAD PATH, NOT PLAYWRIGHT'S.** Playwright routes every download through
// Browser.setDownloadBehavior, which skips Chrome's one-download-per-gesture limit, so the first
// version of this harness passed three loose files that a visitor's Chrome dropped to one. Here the
// browser is driven by raw CDP that never touches download behaviour, with a fresh profile whose
// download folder is a temp dir and whose "automatic downloads" setting is Chrome's default (ask).
// The export click is a real mouse event. What lands in the folder is what a visitor gets.
async function realChromeExport(exe, url) {
	const os = require('os'), http = require('http');
	const base = fs.mkdtempSync(path.join(os.tmpdir(), 'ec-real-dl-')), prof = path.join(base, 'profile'), dl = path.join(base, 'downloads');
	fs.mkdirSync(path.join(prof, 'Default'), { recursive: true }); fs.mkdirSync(dl);
	fs.writeFileSync(path.join(prof, 'Default', 'Preferences'), JSON.stringify({ download: { default_directory: dl, prompt_for_download: false, directory_upgrade: true } }));
	const port = await require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js')).freePort();
	const chrome = require('child_process').spawn(exe, ['--headless=new', '--no-sandbox', '--no-first-run', '--no-default-browser-check', '--user-data-dir=' + prof,
		'--remote-debugging-port=' + port, '--window-size=1400,900', 'about:blank'], { stdio: 'ignore' });
	const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
	const getJson = (p) => new Promise((res, rej) => http.get('http://127.0.0.1:' + port + p, (r) => {
		let t = ''; r.on('data', (d) => { t += d; }); r.on('end', () => { try { res(JSON.parse(t)); } catch (e) { rej(e); } });
	}).on('error', rej));
	let ws;
	try {
		let targets = null;
		for (let i = 0; i < 75 && !targets; i++) { try { targets = await getJson('/json'); } catch (e) { await sleep(200); } }
		const t = targets && targets.find((x) => x.type === 'page');
		if (!t) { ok('real Chrome: a page to drive', false, 'no CDP page target'); return; }
		ws = new WebSocket(t.webSocketDebuggerUrl);
		await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
		let id = 0; const pending = {};
		ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending[d.id]) { pending[d.id](d); delete pending[d.id]; } };
		const send = (method, params) => new Promise((r) => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params: params || {} })); });
		const ev = async (expr) => { const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true }); return r.result && r.result.result && r.result.result.value; };
		const waitFor = async (expr, ms) => { for (let i = 0; i < ms / 100; i++) { if (await ev(expr)) { return true; } await sleep(100); } return false; };
		const closeDialogs = `(async () => { for (let k = 0; k < 6; k++) { const bd = document.getElementById('lpn_dialog_backdrop'); if (!bd || getComputedStyle(bd).display === 'none') break;
			const b = Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).find((x) => x.offsetParent); if (!b) break; b.click(); await new Promise((r) => setTimeout(r, 400)); }
			const c = document.getElementById('ec-consent'); if (c) c.remove(); })()`;
		const click = async (expr) => {
			const r = await ev(`(() => { const e = ${expr}; if (!e) return null; const b = e.getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; })()`);
			if (!r) { return false; }
			for (const type of ['mousePressed', 'mouseReleased']) { await send('Input.dispatchMouseEvent', { type, x: r[0], y: r[1], button: 'left', clickCount: 1 }); }
			return true;
		};
		await send('Page.enable'); await send('Runtime.enable');
		await send('Page.navigate', { url });
		await waitFor(`!!(window.EngCalcs && EngCalcs.pageConfig && document.querySelector('#lpn_examples_pane .lpn-example-card'))`, 20000);
		await sleep(800); await ev(closeDialogs);
		await ev(`(() => { const t = EngCalcs.pageConfig.lpn_ex_elm_street_title; const c = Array.from(document.querySelectorAll('#lpn_examples_pane .lpn-example-card'))
			.find((c) => c.querySelector('.lpn-example-title').textContent.trim() === t); if (c) c.click(); })()`);
		await waitFor(`!!(EngCalcs.lpnBackdropProbe && EngCalcs.lpnBackdropProbe() && EngCalcs.lpnBackdropProbe().corners)`, 15000);
		await sleep(1500); await ev(closeDialogs);
		await click(`document.getElementById('lpn_menu_file')`); await sleep(500);
		const clicked = await click(`Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).find((b) => b.textContent.trim().indexOf(EngCalcs.pageConfig.lpn_file_export_inp) === 0)`);
		ok('real Chrome: File > Export EPANET file was clicked with a real mouse event', clicked);
		for (let i = 0; i < 100; i++) { const f = fs.readdirSync(dl); if (f.length && !f.some((n) => /crdownload$/.test(n))) { break; } await sleep(100); }
		await sleep(2500);   // room for any further download to arrive, or to be held by the limit
		const got = fs.readdirSync(dl);
		ok('real Chrome, default settings: the downloads folder holds exactly Elm-Street-Center.zip', got.length === 1 && got[0] === 'Elm-Street-Center.zip', JSON.stringify(got));
		const z = got[0] === 'Elm-Street-Center.zip' ? unzip(fs.readFileSync(path.join(dl, got[0]))) : null;
		ok('real Chrome: and the .zip holds the .inp, the .bmp and the .bpw', !!z && ['Elm-Street-Center.inp', 'Elm-Street-Center.bmp', 'Elm-Street-Center.bpw'].every((n) => z[n] && z[n].length),
			JSON.stringify(z && Object.keys(z)));
		ok('real Chrome: the .inp in it names the .bmp beside it', !!z && /^\s*FILE\s+Elm-Street-Center\.bmp\s*$/mi.test(String(z['Elm-Street-Center.inp'])));
		const bmp = z && readBmp(z['Elm-Street-Center.bmp']);
		ok('real Chrome: the .bmp is the 1590 x 1599 site plan, 24-bit', !!bmp && bmp.w === 1590 && bmp.h === 1599 && bmp.bpp === 24, JSON.stringify(bmp && { w: bmp.w, h: bmp.h, bpp: bmp.bpp }));
	} finally {
		try { if (ws) { ws.close(); } } catch (e) { /* closed */ }
		chrome.kill();
		await sleep(300);
		fs.rmSync(base, { recursive: true, force: true });
	}
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
		console.log('\n--- Elm Street Center: a site plan in a state-plane grid ---');
		let a = await open(browser);
		await a.openExampleCard(await a.lang('lpn_ex_elm_street_title'));
		await a.settle(1500);
		const pc = await a.page.evaluate(() => EngCalcs.pageConfig);
		await roundTrip(browser, a, 'Elm Street');
		const notice = a.lastNotice || '';
		ok('Elm Street: the notice names the .zip and all three files, and says how to open them in EPANET', notice.includes(pc.lpn_status_inp_exported_picture
			.replace('{zip}', 'Elm-Street-Center.zip').replace('{picture}', 'Elm-Street-Center.bmp').replace('{world}', 'Elm-Street-Center.bpw')
			.replace('{file}', 'Elm-Street-Center.inp')) && /EPANET/.test(notice), notice.slice(0, 300));
		ok('Elm Street: no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();

		// EPANET's rule, Umap.pas GetBackdropBounds, written out independently of the page:
		//   x0 = LLx + OffX; yTop = URy - OffY; w = URx - LLx; h = URy - LLy;
		//   if pictureW/pictureH > 1 then h = w / AR else w = h * AR.
		const DIMS = [1000, 2000, 1400, 2300], OFF = [15, -7];
		const epanet = (pw, ph) => {
			const ar = pw / ph, x0 = DIMS[0] + OFF[0], yTop = DIMS[3] - OFF[1];
			let w = DIMS[2] - DIMS[0], h = DIMS[3] - DIMS[1];
			if (ar > 1) { h = w / ar; } else { w = h * ar; }
			return [x0, yTop - h, x0 + w, yTop];
		};
		for (const [label, pw, ph] of [['landscape 3:1 in a 4:3 rectangle, OFFSET 15 -7', 60, 20], ['portrait 1:3 in a 4:3 rectangle, OFFSET 15 -7', 20, 60]]) {
			console.log('\n--- ' + label + ' ---');
			a = await open(browser);
			await importInp(a, 'offset.inp', inp([' DIMENSIONS  ' + DIMS.join('  '), ' UNITS  Feet', ' FILE  plan.png', ' OFFSET  ' + OFF.join('  ')]));
			await attach(a, { name: 'plan.png', mimeType: 'image/png', buffer: png(pw, ph) });
			const first = await corners(a), want = epanet(pw, ph);
			ok(label + ': first placement is EPANET\'s (Y offset subtracted from the top)', first && first.every((v, i) => near(v, want[i], 1e-9)), JSON.stringify(first) + ' want ' + JSON.stringify(want));
			const rt = await roundTrip(browser, a, label);
			if (rt) {
				ok(label + ': the BMP keeps the picture\'s pixels, ' + pw + ' x ' + ph, rt.bmp.w === pw && rt.bmp.h === ph, rt.bmp.w + ' x ' + rt.bmp.h);
				ok(label + ': and is the right way up (bottom row stored first, blue)', rt.bmp.firstStored.join(',') === '0,0,255', rt.bmp.firstStored.join(','));
			}
			await a.close();
		}

		console.log('\n--- a geographic project (Net3 at Novato): the frame the export writes is lon/lat ---');
		a = await open(browser);
		await a.openExampleCard(await a.lang('lpn_ex_net3_world_title'));
		await a.settle(1500);
		await a.page.setInputFiles('#lpn_backdrop_file', { name: 'aerial.png', mimeType: 'image/png', buffer: png(48, 30) });
		await a.settle(1200);
		await roundTrip(browser, a, 'Net3 lat/lon', true);
		await a.close();

		console.log('\n--- no picture: one file, as before ---');
		a = await open(browser);
		await importInp(a, 'plain.inp', inp([' UNITS  Feet']));
		const plain = await exportAll(a);
		ok('a project with no picture downloads only its .inp, no .zip', Object.keys(plain).length === 1 && !!pick(plain, '.inp'), Object.keys(plain).join(', '));
		ok('and its [BACKDROP] names no file', !/^\s*FILE/mi.test(String(plain[pick(plain, '.inp')] || '')));
		await a.close();

		console.log('\n--- a picture the page cannot read back: said on screen, and the .inp names none ---');
		a = await open(browser);
		const elm = JSON.parse(fs.readFileSync(path.join(REPO, 'examples', 'Elm-Street-Center.lwn'), 'utf8'));
		elm.backdrop.href = 'data:image/png;base64,AAAAAAAA';
		await a.page.setInputFiles('#lpn_project_file', { name: 'Broken-Picture.lwn', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(elm)) });
		await a.settle(1500);
		const broken = await exportAll(a), pcB = await a.page.evaluate(() => EngCalcs.pageConfig);
		const bInp = pick(broken, '.inp');
		ok('an unreadable picture: the .inp alone is downloaded', Object.keys(broken).length === 1 && !!bInp, Object.keys(broken).join(', '));
		ok('and its [BACKDROP] names no file', !!bInp && !/^\s*FILE/mi.test(String(broken[bInp])));
		ok('and the notice says the picture could not be saved', !!bInp && a.lastNotice.includes(pcB.lpn_status_inp_exported_no_picture.replace('{file}', bInp)), a.lastNotice.slice(0, 300));
		await a.close();
		await browser.close();

		console.log('\n--- Chrome\'s own download path, default settings, as a visitor has it ---');
		await realChromeExport(executablePath, env.pageUrl());
	} finally {
		await browser.close().catch(() => {});
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
