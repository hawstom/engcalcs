// ATTACHING THE BACKDROP AN IMPORTED .inp NAMES (ROADMAP Task 282), in a real Chrome.
//
//   flock /tmp/engcalcs-browser.lock node dev/lpn-spike/backdrop-attach-browser-harness.js
//
// Import a small .inp whose [BACKDROP] gives DIMENSIONS and FILE: the import report offers
// "Attach <file>...", a picked image lands with its corners at DIMENSIONS (within 1e-9) in model
// coordinates, a BMP and a differently named picture are accepted (the latter says so), a file with
// no DIMENSIONS offers nothing and keeps today's sentence, and the export of the import is
// unchanged by the offer.
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_BACKDROP_ATTACH_BROWSER_LOCKED';
const NAME = 'backdrop-attach-browser-harness';

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
const zlib = require('zlib');
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
// A w x h grey PNG, so the picture has the shape under test.
function png(w, h) {
	const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 0;
	const raw = Buffer.alloc((w + 1) * h, 0x80);
	for (let y = 0; y < h; y++) { raw[y * (w + 1)] = 0; }
	return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
// A w x h 24-bit BMP.
function bmp(w, h) {
	const rowSize = Math.ceil(w * 3 / 4) * 4, size = 54 + rowSize * h, b = Buffer.alloc(size, 0);
	b.fill(0x80, 54);
	b.write('BM', 0); b.writeUInt32LE(size, 2); b.writeUInt32LE(54, 10); b.writeUInt32LE(40, 14);
	b.writeInt32LE(w, 18); b.writeInt32LE(h, 22); b.writeUInt16LE(1, 26); b.writeUInt16LE(24, 28);
	b.writeUInt32LE(rowSize * h, 34);
	return b;
}

function inp(backdropLines) {
	return ['[TITLE]', 'attach test', '', '[JUNCTIONS]', ' J1  10  100', ' J2  10  100', '',
		'[RESERVOIRS]', ' R1  50', '', '[PIPES]', ' P1  R1  J1  1000  12  100  0  Open', ' P2  J1  J2  1000  8  100  0  Open', '',
		'[DEMANDS]', ' J2  50', '', '[OPTIONS]', ' Units  GPM', ' Headloss  H-W', '',
		'[COORDINATES]', ' R1  0  0', ' J1  100  0', ' J2  200  50', '', '[BACKDROP]'].concat(backdropLines, ['', '[END]', '']).join('\n');
}
const WITH = inp([' DIMENSIONS  1000.5  2000.25  1400.5  2200.25', ' UNITS  Feet', ' FILE  C:\\maps\\site.bmp', ' OFFSET  0.00  0.00']);
const WITHOUT = inp([' UNITS  Feet', ' FILE  C:\\maps\\site.bmp']);
const NAMING_NOTHING = inp([' DIMENSIONS  1000.5  2000.25  1400.5  2200.25', ' UNITS  Feet', ' FILE', ' OFFSET  0.00  0.00']);

async function open(browser) {
	const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
	await a.settle(1500);
	return a;
}
async function importInp(a, text) {
	await a.page.setInputFiles('#lpn_inp_file', { name: 'attach.inp', mimeType: 'text/plain', buffer: Buffer.from(text) });
	await a.settle(800);
}
const dialogText = (a) => a.page.evaluate(() => (document.getElementById('lpn_dialog_body') || {}).textContent || '');
const attachButton = (a) => a.page.$('#lpn_dialog_body button');
const probe = (a) => a.page.evaluate(() => EngCalcs.lpnBackdropProbe());
async function pick(a, file) {
	const [chooser] = await Promise.all([a.page.waitForEvent('filechooser'), (await attachButton(a)).click()]);
	await chooser.setFiles(file);
	await a.settle(800);
}
const pcOf = (a) => a.page.evaluate(() => EngCalcs.pageConfig);
const near = (x, y) => Math.abs(x - y) <= 1e-9;

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	({ Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js')));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		console.log('\n--- a file with DIMENSIONS and FILE ---');
		let a = await open(browser);
		await importInp(a, WITH);
		const pc = await pcOf(a);
		let btn = await attachButton(a);
		ok('the report offers a button', !!btn);
		ok('it names the file, not the path', btn && (await btn.textContent()) === pc.lpn_inp_backdrop_attach.replace('{file}', 'site.bmp'), btn && await btn.textContent());
		ok('the old sentence is still there', (await dialogText(a)).includes(pc.lpn_inp_drop_backdrop));
		const before = await probe(a);
		ok('before attaching, the export writes no [BACKDROP] rows', !before.section || !/FILE|DIMENSIONS/.test(before.section), JSON.stringify(before.section));
		await pick(a, { name: 'site.bmp', mimeType: 'image/bmp', buffer: bmp(40, 20) });
		const t = await dialogText(a), p = await probe(a), want = [1000.5, 2000.25, 1400.5, 2200.25];
		ok('a BMP of the named name is accepted and says so', t.includes(pc.lpn_inp_backdrop_attached.replace('{file}', 'site.bmp')), t.slice(-160));
		ok('its extent equals DIMENSIONS to 1e-9 (a picture of the same shape)', p.corners && p.corners.every((v, i) => near(v, want[i])), JSON.stringify(p.corners));
		const dims = p.section && /DIMENSIONS\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)/.exec(p.section);
		ok('the export now writes the same DIMENSIONS', dims && [1, 2, 3, 4].every((i) => near(Number(dims[i]), want[i - 1])), p.section);
			ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();

		console.log('\n--- a differently named picture, of another shape ---');
		a = await open(browser);
		await importInp(a, WITH);
		await pick(a, { name: 'other.png', mimeType: 'image/png', buffer: png(20, 20) });
		const t2 = await dialogText(a), p2 = await probe(a);
		ok('it is attached and the remark names both', t2.includes((await pcOf(a)).lpn_inp_backdrop_attached_other.replace('{picked}', 'other.png').replace('{file}', 'site.bmp')), t2.slice(-260));
		ok('the shape remark appears', t2.includes((await pcOf(a)).lpn_inp_backdrop_shape));
		ok('width and the upper-left corner still match DIMENSIONS', p2.corners && near(p2.corners[0], 1000.5) && near(p2.corners[2], 1400.5) && near(p2.corners[3], 2200.25), JSON.stringify(p2.corners));
		await a.close();

		console.log('\n--- no DIMENSIONS: today\'s flow ---');
		a = await open(browser);
		await importInp(a, WITHOUT);
		ok('no attach button', !(await attachButton(a)));
		ok('the old sentence still tells the user to add it', (await dialogText(a)).includes((await pcOf(a)).lpn_inp_drop_backdrop));
		await a.close();

		console.log('\n--- DIMENSIONS but no FILE ---');
		a = await open(browser);
		await importInp(a, NAMING_NOTHING);
		ok('nothing to attach, no button', !(await attachButton(a)));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
