// A GEOGRAPHIC PROJECT'S BACKDROP EXPORTS AS LONGITUDE/LATITUDE, in a real Chrome.
//
//   flock /tmp/engcalcs-browser.lock node dev/lpn-spike/backdrop-geo-export-browser-harness.js
//
// Map > Backdrop > Add puts a picture into a geographic project (EPANET Net3, lat/lon). Its stored
// top-left is in the drawing frame, whose y is Mercator, not latitude. File > Export EPANET file must
// write [BACKDROP] DIMENSIONS as the picture's true lon/lat corners (within 1e-9), computed here from
// the stored placement by the spherical-Mercator inverse written out independently of the page's own
// code. A grid project's DIMENSIONS stays the plain numbers it always was.
'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_BACKDROP_GEO_EXPORT_BROWSER_LOCKED';
const NAME = 'backdrop-geo-export-browser-harness';

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
function png(w, h) {
	const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 0;
	const raw = Buffer.alloc((w + 1) * h, 0x80);
	for (let y = 0; y < h; y++) { raw[y * (w + 1)] = 0; }
	return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
const GRID_INP = ['[TITLE]', 'grid backdrop', '', '[JUNCTIONS]', ' J1  10  100', ' J2  10  100', '',
	'[RESERVOIRS]', ' R1  50', '', '[PIPES]', ' P1  R1  J1  1000  12  100  0  Open', ' P2  J1  J2  1000  8  100  0  Open', '',
	'[DEMANDS]', ' J2  50', '', '[OPTIONS]', ' Units  GPM', ' Headloss  H-W', '',
	'[COORDINATES]', ' R1  0  0', ' J1  100  0', ' J2  200  50', '', '[END]', ''].join('\n');

// Spherical Mercator inverse, written out here: the drawing frame's y is in degrees of longitude.
const latOfMercY = (y) => Math.atan(Math.sinh(y * Math.PI / 180)) * 180 / Math.PI;
const near = (x, y) => Math.abs(x - y) <= 1e-9;

async function open(browser) {
	const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
	await a.settle(1500);
	return a;
}
// Map > Backdrop's own door: the file input the Add row opens.
async function addPicture(a) {
	await a.page.setInputFiles('#lpn_backdrop_file', { name: 'pic.png', mimeType: 'image/png', buffer: png(40, 20) });
	await a.settle(1000);
}
// File > Export EPANET file, by its own words; returns the downloaded text.
async function exportInp(a) {
	const label = await a.lang('lpn_file_export_item_inp');
	await a.page.click('#lpn_menu_file');
	await a.page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
	// Export is a fly-out of File: open it by its row, then press the row inside it.
	await a.page.evaluate((l) => {
		const r = Array.from(document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')).find((b) => b.textContent.trim().indexOf(l) === 0);
		if (r) { r.click(); }
	}, await a.lang('lpn_file_export_menu'));
	await a.page.waitForSelector('#lpn_menu_list2 button.lpn-menu-row', { state: 'attached' });
	const [dl] = await Promise.all([a.page.waitForEvent('download'), a.page.evaluate((l) => {
		const r = Array.from(document.querySelectorAll('#lpn_menu_list2 button.lpn-menu-row')).find((b) => b.textContent.trim().indexOf(l) === 0);
		if (r) { r.click(); }
	}, label)]);
	return fs.readFileSync(await dl.path(), 'utf8');
}
// The picture's stored placement, from the saved document, plus the document origin.
function storedBackdrop(a) {
	return a.page.evaluate(() => {
		for (let i = 0; i < localStorage.length; i++) {
			const v = localStorage.getItem(localStorage.key(i));
			if (v && v.indexOf('"backdrop"') >= 0 && v.indexOf('"href"') >= 0) {
				try {
					const d = JSON.parse(v);
					if (d.backdrop && d.backdrop.href) {
						const o = d.origin || { x: 0, y: 0 }, b = d.backdrop;
						return { geo: !!(d.project && d.project.coords === 'geo'), ox: o.x || 0, oy: o.y || 0, tx: b.tx || 0, ty: b.ty || 0,
							w: (b.width || 0) * (b.s || 1), h: (b.height || 0) * (b.s || 1) };
					}
				} catch (e) { /* not a project */ }
			}
		}
		return null;
	});
}
const dims = (inp) => { const m = /\[BACKDROP\][\s\S]*?DIMENSIONS\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)/.exec(inp); return m && m.slice(1).map(Number); };

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	({ Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js')));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		console.log('\n--- a geographic project: DIMENSIONS are longitude and latitude ---');
		let a = await open(browser);
		await a.openExampleCard(await a.lang('lpn_ex_net3_world_title'));
		await a.settle(1500);
		await addPicture(a);
		let s = await storedBackdrop(a);
		ok('the picture is stored in a geographic project', !!s && s.geo, JSON.stringify(s));
		let inp = await exportInp(a), d = dims(inp);
		ok('the export has a DIMENSIONS row', !!d, d && d.join(' '));
		if (s && d) {
			const x0 = s.tx + s.ox, x1 = x0 + s.w, yTop = s.ty + s.oy, yBot = yTop - s.h;
			const want = [x0, latOfMercY(yBot), x1, latOfMercY(yTop)];
			ok('lower-left and upper-right equal the true lon/lat corners within 1e-9', want.every((v, i) => near(d[i], v)), 'got ' + d.join(' ') + ' want ' + want.join(' '));
			ok('the corners are Novato latitudes, not Mercator y (42.57 for the top edge here)', d[1] > 37 && d[3] < 40 && d[3] > d[1], d[1] + ' .. ' + d[3]);
			ok('the picture is the shape of the 40 x 20 image in the frame (west < east)', d[0] < d[2]);
		}
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();

		console.log('\n--- a grid project: DIMENSIONS stay plain numbers ---');
		a = await open(browser);
		await a.page.setInputFiles('#lpn_inp_file', { name: 'grid.inp', mimeType: 'text/plain', buffer: Buffer.from(GRID_INP) });
		await a.settle(800);
		await a.page.click('#lpn_dialog_buttons button');
		await a.settle(500);
		await addPicture(a);
		s = await storedBackdrop(a);
		ok('the picture is stored in a grid project', !!s && !s.geo, JSON.stringify(s));
		inp = await exportInp(a); d = dims(inp);
		if (s && d) {
			const want = [s.tx + s.ox, s.ty + s.oy - s.h, s.tx + s.ox + s.w, s.ty + s.oy];
			ok('DIMENSIONS are the stored numbers, untouched by any projection', want.every((v, i) => near(d[i], v)), 'got ' + d.join(' ') + ' want ' + want.join(' '));
		} else { ok('the grid export has a DIMENSIONS row', false); }
		ok('a grid export writes no UNITS Degrees row', !/UNITS\s+DEGREES/i.test(inp));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
