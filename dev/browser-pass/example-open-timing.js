// MEASURES queue R-130: "The delay in opening the Net3 lat/lon example when Net3 was already open
// was over 25 seconds." Not part of run.js -- a probe, not a spec. Prints numbers; asserts nothing.
//
//   flock /tmp/engcalcs-browser.lock node dev/browser-pass/example-open-timing.js
//
// Serves the WORKTREE directly (not lib/env.js's usual symlinked docroot) so this can be run inside
// a git worktree with `php -S 127.0.0.1:8191 -t <worktree root>` exactly as the task named it, and
// stops the server when done.
//
// Uses the page's own `?debug=perf` instrument (js/looped-network.js, perfDebugOn()) for the phase
// breakdown -- fetch, parse, buildDom, basemap, libraries, fontSizes, viewOrFit, lblRestore
// (label layout), scheduleSolve, tabs, and the SWITCH total -- read off the console line it already
// prints, plus a Node-side wall-clock bracket (click to settle) for the end-to-end number a phase
// breakdown alone cannot give: time the browser was doing anything at all, paint included.

const path = require('path');
const { execFileSync } = require('child_process');
const { spawn } = require('child_process');
const net = require('net');

const WORKTREE_ROOT = path.resolve(__dirname, '..', '..', '..'); // .../worktrees/fix-example-open
const PORT = 8191;
const ORIGIN = `http://127.0.0.1:${PORT}`;
const PAGE_URL = `${ORIGIN}/engcalcs/Looped-Network.php?ec_nolog=1&debug=perf`;

const playwright = require(path.join(__dirname, 'node_modules', 'playwright-core'));
const { Session } = require('./lib/session');
// lib/session.js's pageUrl() reads lib/env.js's own server state, which we are not using here
// (we run our own php -S per the task's exact command) -- so Session is used for its menu/gallery
// vocabulary only, and this file calls page.goto() itself.

function findChromium() {
	const os = require('os'), fs = require('fs');
	const cache = path.join(os.homedir(), '.cache', 'ms-playwright');
	for (const dir of fs.readdirSync(cache)) {
		if (!/^chromium-/.test(dir)) { continue; }
		for (const rel of ['chrome-linux64/chrome', 'chrome-linux/chrome']) {
			const exe = path.join(cache, dir, rel);
			if (fs.existsSync(exe)) { return exe; }
		}
	}
	throw new Error('no chromium found under ~/.cache/ms-playwright');
}

function waitForPort(port, deadlineMs) {
	const deadline = Date.now() + deadlineMs;
	return new Promise((resolve, reject) => {
		(function attempt() {
			const sock = net.connect(port, '127.0.0.1');
			sock.on('connect', () => { sock.end(); resolve(); });
			sock.on('error', () => {
				sock.destroy();
				if (Date.now() > deadline) { reject(new Error('php -S never answered on ' + port)); return; }
				setTimeout(attempt, 100);
			});
		}());
	});
}

async function main() {
	console.log('Starting php -S 127.0.0.1:' + PORT + ' -t ' + WORKTREE_ROOT);
	const php = spawn('php', ['-d', 'pcre.jit=0', '-d', 'display_errors=0',
		'-S', `127.0.0.1:${PORT}`, '-t', WORKTREE_ROOT], { stdio: ['ignore', 'ignore', 'pipe'] });
	let phpErr = '';
	php.stderr.on('data', (d) => { phpErr += String(d); });
	try {
		await waitForPort(PORT, 10000);
	} catch (e) {
		php.kill();
		throw new Error(e.message + '\n' + phpErr);
	}

	const chromePath = findChromium();
	const browser = await playwright.chromium.launch({ executablePath: chromePath, headless: true });
	const results = [];
	try {
		const context = await browser.newContext({ viewport: Session.VIEWPORT });
		const page = await context.newPage();
		const perfLines = [];
		page.on('console', (msg) => {
			const t = msg.text();
			if (t.indexOf('[lpn perf]') === 0) { perfLines.push(t); }
		});
		const s = new Session(context, page, 'M');

		async function freshLoad() {
			perfLines.length = 0;
			await page.goto(PAGE_URL, { waitUntil: 'load' });
			await s.settle(300);
		}
		// A geographic project can go on solving/tiling in the background; "settled" here means
		// "no perf line has been printed for a while", which is the honest proxy this instrument
		// gives us for "the browser has stopped doing example-open work".
		async function settleOnPerf(maxMs) {
			const start = Date.now();
			let lastCount = -1, lastChangeAt = Date.now();
			while (Date.now() - start < maxMs) {
				await page.waitForTimeout(150);
				if (perfLines.length !== lastCount) { lastCount = perfLines.length; lastChangeAt = Date.now(); }
				else if (Date.now() - lastChangeAt > 600) { break; }
			}
			await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r())));
		}
		// **BY KEY, NEVER BY LITERAL** (harness_wording_check.php): a card is matched against
		// `pageConfig`'s own current English, read through the DOM stub's real language file, so a
		// future rewording of these two titles does not turn this probe red for no reason.
		const GRID_KEY = 'lpn_ex_net3_title', WORLD_KEY = 'lpn_ex_net3_world_title';
		async function openViaGallery(titleKey) {
			const title = await s.lang(titleKey);
			await s.menuClick(await s.lang('lpn_examples_menu'), 'file');
			await page.waitForSelector('#lpn_examples_pane .lpn-example-card', { state: 'visible' });
			const cards = await page.$$('#lpn_examples_pane .lpn-example-card');
			let clicked = false;
			for (const c of cards) {
				const t = ((await c.$eval('.lpn-example-title', (e) => e.textContent)) || '').trim();
				if (t === title) { await c.click(); clicked = true; break; }
			}
			if (!clicked) { throw new Error('no gallery card titled "' + title + '"'); }
		}
		async function timedOpen(titleKey, label) {
			perfLines.length = 0;
			const t0 = Date.now();
			await openViaGallery(titleKey);
			await settleOnPerf(40000);
			const t1 = Date.now();
			const wallMs = t1 - t0;
			console.log(`\n[${label}] wall clock: ${wallMs} ms`);
			perfLines.forEach((l) => console.log('    ' + l));
			results.push({ label, wallMs, perfLines: perfLines.slice() });
			return wallMs;
		}

		console.log('\n=== run 1 of 3 ===');
		await freshLoad();
		await openViaGallery(GRID_KEY); // grid, untimed warm-up
		await settleOnPerf(20000);
		await timedOpen(WORLD_KEY, 'Net3 lat/lon, with Net3 (grid) already open — run 1');

		await freshLoad();
		await openViaGallery(WORLD_KEY); // lat/lon, untimed warm-up
		await settleOnPerf(40000);
		await timedOpen(GRID_KEY, 'Net3 (grid), with Net3 lat/lon already open — run 1 (comparison)');

		console.log('\n=== run 2 of 3 ===');
		await freshLoad();
		await openViaGallery(GRID_KEY);
		await settleOnPerf(20000);
		await timedOpen(WORLD_KEY, 'Net3 lat/lon, with Net3 (grid) already open — run 2');

		await freshLoad();
		await openViaGallery(WORLD_KEY);
		await settleOnPerf(40000);
		await timedOpen(GRID_KEY, 'Net3 (grid), with Net3 lat/lon already open — run 2 (comparison)');

		console.log('\n=== run 3 of 3 ===');
		await freshLoad();
		await openViaGallery(GRID_KEY);
		await settleOnPerf(20000);
		await timedOpen(WORLD_KEY, 'Net3 lat/lon, with Net3 (grid) already open — run 3');

		await freshLoad();
		await openViaGallery(WORLD_KEY);
		await settleOnPerf(40000);
		await timedOpen(GRID_KEY, 'Net3 (grid), with Net3 lat/lon already open — run 3 (comparison)');

		console.log('\n\n==== SUMMARY ====');
		results.forEach((r) => console.log(`${r.wallMs} ms  ${r.label}`));
	} finally {
		await browser.close();
		php.kill();
	}
}

main().catch((e) => { console.error(e); process.exit(1); });
