// EXPORT EPANET FILE SAVES THE PICTURE AND ITS WORLD FILE, AND THEY COME BACK REGISTERED, in a real
// Chrome.
//
//   node dev/lpn-spike/backdrop-export-roundtrip-browser-harness.js   (takes the browser lock itself)
//
// File > Export EPANET file on a project with a background picture downloads three files: the .inp,
// a 24-bit BMP (the format EPANET 2.2 opens; dev/backdrop-export.md) and its .bpw world file. The
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
	for (let i = 0; i < 40 && got.length < 3; i++) { await a.page.waitForTimeout(100); }
	await a.page.waitForTimeout(400);
	a.page.off('download', onDl);
	a.lastNotice = await a.page.evaluate(() => (document.getElementById('lpn_map_notice') || {}).textContent || '');
	const files = {};
	for (const d of got) { files[d.suggestedFilename()] = fs.readFileSync(await d.path()); }
	return files;
}
const pick = (files, ext) => Object.keys(files).find((n) => n.toLowerCase().endsWith(ext));
const bdRow = (text, key) => { const m = new RegExp('\\[BACKDROP\\][\\s\\S]*?^\\s*' + key + '\\s+(.*)$', 'mi').exec(text); return m ? m[1].trim().split(/\s+/) : null; };
const near = (x, y, tol) => Math.abs(x - y) <= tol;

// Export from the open page, re-import into fresh pages, and compare. `label` names the case.
async function roundTrip(browser, a, label, geo) {
	const before = await corners(a);
	const files = await exportAll(a);
	const names = Object.keys(files), inpN = pick(files, '.inp'), bmpN = pick(files, '.bmp'), bpwN = pick(files, '.bpw');
	ok(label + ': three files are downloaded, .inp, .bmp and .bpw', names.length === 3 && inpN && bmpN && bpwN, names.join(', '));
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
		ok('Elm Street: the notice names all three files', notice.includes(pc.lpn_status_inp_exported_picture
			.replace('{file}', 'Elm-Street-Center.inp').replace('{picture}', 'Elm-Street-Center.bmp').replace('{world}', 'Elm-Street-Center.bpw')), notice.slice(0, 300));
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
		ok('a project with no picture downloads only its .inp', Object.keys(plain).length === 1 && !!pick(plain, '.inp'), Object.keys(plain).join(', '));
		ok('and its [BACKDROP] names no file', !/^\s*FILE/mi.test(String(plain[pick(plain, '.inp')] || '')));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
