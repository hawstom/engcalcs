// THE 1PX HEADING/COLUMN DIVIDER MISALIGNMENT (Tom's screenshot, reported against Windows 125%
// display scaling = device pixel ratio 1.25, a real vertical scrollbar showing, 100% browser
// zoom). Two earlier sessions could not reproduce it -- they varied device scale factor, zoom and
// a forced classic scrollbar one axis at a time, and read only `getBoundingClientRect`. Neither
// axis alone shows it and that geometry call cannot see it at all: the heading's divider and the
// body's divider sit at IDENTICAL CSS-pixel positions (0px difference, every time), because they
// are the SAME table column. They still paint 1-2 DEVICE pixels apart at a fractional device pixel
// ratio, because they were drawn by two different mechanisms that round independently:
//
//   * the heading's divider is an `inset box-shadow` on the (sticky) TH -- positioned from that
//     cell's own box edge, inside a layer the compositor snaps to whole device pixels on its own
//     schedule (`css/engcalcs.css`, the `thead tr { position: sticky }` block, 2026-09-19);
//   * the body's divider USED TO BE a real `border` on the TD, resolved instead through the
//     table's own collapsed-border grid -- a different pipeline that rounds differently once one
//     CSS pixel does not divide evenly into device pixels.
//
// Fixed 2026-09-23 by making the body's divider an `inset box-shadow` too, so both are positioned
// by the same cell-box-edge arithmetic and inherit whatever rounding the compositor applies,
// identically. This harness is the regression net: it renders the REAL Tables pane in a REAL
// Chromium (a DOM stub cannot paint anything, so it cannot see this class of bug at all -- see
// dev/testing-notes.md on stubs removing the coupling they exist to test), reads the actual
// PAINTED pixels of a screenshot (not layout geometry, which reports 0px difference even on the
// unfixed CSS), and asserts the heading's and the body's divider columns are the same device
// pixels at device scale factors 1, 1.25, 1.5 and 2, both with and without a real space-reserving
// scrollbar.
//
// **WHY A FORCED `scrollbar-gutter: stable` STANDS IN FOR TOM'S SCROLLBAR.** Measured separately:
// Linux headless Chromium's own scrollbar never reserves layout width, on this build, under any
// launch flag tried (`--disable-features=OverlayScrollbar`, `--headless=old`, and others) --
// unlike Windows' out-of-the-box classic scrollbar, which does. `scrollbar-gutter: stable` makes
// Chromium reserve exactly the width a classic scrollbar would, which is the one layout effect a
// real scrollbar has that this environment's own scrollbar does not; it is not needed to
// reproduce the defect (both settings fail identically on the unfixed CSS) but is kept as an axis
// because that is the condition Tom actually reported and the one a future regression must
// survive too.
//
// **RUN WITH `node dev/lpn-spike/table-divider-align-harness.js` -- DO NOT PREFIX IT WITH `flock`
// YOURSELF.** It launches a real Chromium, so it locks `/tmp/engcalcs-browser.lock` internally,
// exactly once, by re-executing itself under `flock` the first time it runs unlocked. That makes
// it safe to call directly, from `run_harnesses.sh`, or from a session that already holds no lock
// of its own; nesting an external `flock` around it would deadlock (the outer flock would wait for
// this process to exit, and this process would wait for the same lock), which is why it must not
// be added on the command line.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_TABLE_ALIGN_LOCKED';

// ---- self-locking re-exec ---------------------------------------------------------------------
if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock binary */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit',
			env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error('table-divider-align-harness: flock re-exec failed: ' + r.error.message); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
	// No flock binary at all (unusual): proceed unlocked rather than skip the check entirely.
	console.error('table-divider-align-harness: no `flock` binary found -- running WITHOUT the browser lock.');
}

// ---- minimal PNG decoder (8-bit RGBA/RGB, non-interlaced) --------------------------------------
// No new dependency: Playwright's screenshot is exactly this shape, and this harness needs to read
// PAINTED pixels, not layout geometry -- see the file header on why geometry cannot see this bug.
const zlib = require('zlib');
function paeth(a, b, c) {
	const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
	if (pa <= pb && pa <= pc) return a;
	if (pb <= pc) return b;
	return c;
}
function decodePNG(buf) {
	if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('not a PNG');
	let off = 8, width, height, colorType;
	const idat = [];
	while (off < buf.length) {
		const len = buf.readUInt32BE(off);
		const type = buf.toString('ascii', off + 4, off + 8);
		const data = buf.slice(off + 8, off + 8 + len);
		if (type === 'IHDR') {
			width = data.readUInt32BE(0); height = data.readUInt32BE(4);
			if (data.readUInt8(8) !== 8) throw new Error('only 8-bit PNG supported');
			if (data.readUInt8(12) !== 0) throw new Error('interlaced PNG not supported');
			colorType = data.readUInt8(9);
		} else if (type === 'IDAT') { idat.push(data); }
		else if (type === 'IEND') { break; }
		off += 12 + len;
	}
	const channels = colorType === 6 ? 4 : colorType === 2 ? 3 : 1;
	const raw = zlib.inflateSync(Buffer.concat(idat));
	const stride = width * channels;
	const out = new Uint8Array(width * height * 4);
	let prevRow = new Uint8Array(stride), pos = 0;
	for (let y = 0; y < height; y++) {
		const filter = raw[pos]; pos++;
		const row = raw.slice(pos, pos + stride); pos += stride;
		const cur = new Uint8Array(stride);
		for (let x = 0; x < stride; x++) {
			const rb = row[x];
			const a = x >= channels ? cur[x - channels] : 0, b = prevRow[x], c = x >= channels ? prevRow[x - channels] : 0;
			let val;
			if (filter === 0) val = rb;
			else if (filter === 1) val = (rb + a) & 0xff;
			else if (filter === 2) val = (rb + b) & 0xff;
			else if (filter === 3) val = (rb + Math.floor((a + b) / 2)) & 0xff;
			else if (filter === 4) val = (rb + paeth(a, b, c)) & 0xff;
			else throw new Error('bad PNG filter ' + filter);
			cur[x] = val;
		}
		for (let px = 0; px < width; px++) {
			const si = px * channels, di = (y * width + px) * 4;
			if (channels === 4) { out[di] = cur[si]; out[di + 1] = cur[si + 1]; out[di + 2] = cur[si + 2]; out[di + 3] = cur[si + 3]; }
			else if (channels === 3) { out[di] = cur[si]; out[di + 1] = cur[si + 1]; out[di + 2] = cur[si + 2]; out[di + 3] = 255; }
			else { out[di] = out[di + 1] = out[di + 2] = cur[si]; out[di + 3] = 255; }
		}
		prevRow = cur;
	}
	return { width, height, data: out };
}

// A GREY divider pixel: roughly equal R/G/B, lighter than text, darker than the white background.
function isGreyDivider(r, g, b) {
	return Math.abs(r - g) < 8 && Math.abs(g - b) < 8 && r > 140 && r < 245;
}
function greyColumns(img, yDev) {
	if (yDev < 0 || yDev >= img.height) return [];
	const cols = [];
	for (let x = 0; x < img.width; x++) {
		const i = (yDev * img.width + x) * 4;
		if (isGreyDivider(img.data[i], img.data[i + 1], img.data[i + 2])) cols.push(x);
	}
	return cols;
}
// The leading (outer left) edge of the table appears only in the heading's own sample row (the
// heading draws it via `thead th:first-child`'s extra leading box-shadow at a slightly different
// height than the body samples); it is the table's OUTER FRAME, not a column-to-column divider,
// so it is dropped before comparing the two lists. Concretely: any run of columns within 3px of
// the table's own left edge.
function dropLeadingFrame(cols, tableLeftDev) {
	return cols.filter((x) => x > tableLeftDev + 3);
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));

	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error('table-divider-align-harness: no Chromium found (set CHROME_PATH, or `npx playwright install chromium`). SKIPPING rather than failing the build on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });

	const DSFS = [1, 1.25, 1.5, 2];
	const results = [];
	try {
		for (const dsf of DSFS) {
			for (const forceScrollbarGutter of [false, true]) {
				const a = await Session.open(browser, 'A', { deviceScaleFactor: dsf });
				const page = a.page;
				await a.goto('Looped-Network.php');
				await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
				await a.settle(1500);
				await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) c.remove(); });
				await page.click('#lpn_pane_btn');
				await page.click('#lpn_pane_tab_junctions');
				await page.waitForTimeout(300);

				if (forceScrollbarGutter) {
					await page.evaluate(() => {
						const host = document.getElementById('lpn_pane_junctions');
						let scroller = host;
						while (scroller && getComputedStyle(scroller).overflowY === 'visible') scroller = scroller.parentElement;
						if (scroller) scroller.style.scrollbarGutter = 'stable';
					});
					await page.waitForTimeout(50);
				}

				const box = await page.evaluate(() => {
					const table = document.querySelector('#lpn_pane_junctions table');
					const thead = table.querySelector('thead');
					const rows = Array.from(table.querySelectorAll('tbody tr')).slice(0, 4);
					const tRect = table.getBoundingClientRect(), hRect = thead.getBoundingClientRect();
					const lastRow = rows[rows.length - 1].getBoundingClientRect();
					return {
						x: Math.max(0, tRect.left - 4), y: Math.max(0, hRect.top - 4),
						width: Math.min(900, tRect.width + 8), height: (lastRow.bottom - hRect.top) + 8,
						tableLeft: tRect.left
					};
				});
				const clip = { x: Math.round(box.x), y: Math.round(box.y), width: Math.round(box.width), height: Math.round(box.height) };
				const png = await page.screenshot({ clip });
				const img = decodePNG(png);

				const tableLeftDev = (box.tableLeft - box.x) * dsf;
				const headCols = dropLeadingFrame(greyColumns(img, Math.round(6 * dsf)), tableLeftDev);
				const bodyCols = dropLeadingFrame(greyColumns(img, Math.round((box.height - 6) * dsf)), tableLeftDev);
				const match = JSON.stringify(headCols) === JSON.stringify(bodyCols);
				results.push({ dsf, forceScrollbarGutter, match, headCols, bodyCols });
				await a.close();
			}
		}
	} finally {
		await browser.close();
		env.stopServer();
	}

	let ok = 0, bad = 0;
	for (const r of results) {
		const label = `dsf=${r.dsf} scrollbar-gutter=${r.forceScrollbarGutter}`;
		if (r.match) {
			ok++;
			console.log(`PASS ${label}: heading and body column dividers paint at the same device pixels (${r.headCols.length} dividers)`);
		} else {
			bad++;
			console.log(`FAIL ${label}: heading and body column dividers paint at DIFFERENT device pixels`);
			console.log('  heading: ' + JSON.stringify(r.headCols));
			console.log('  body:    ' + JSON.stringify(r.bodyCols));
		}
	}
	console.log(`table-divider-align-harness: ${ok}/${results.length} combinations aligned`);
	if (bad > 0) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
