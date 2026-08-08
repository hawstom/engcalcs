// The world the pass runs in: a PHP server we own, and a Chromium we can make believe it is secure.
//
// **The runner starts its own PHP server** rather than talking to Apache. Not a preference — the
// broker answers in JSON, and a PHP warning printed above that JSON makes `resp.json()` throw, which
// the page reads as "the server is unreachable". A sandbox that refuses PCRE JIT memory is enough to
// do it. `php -S` with `-d pcre.jit=0 -d display_errors=0` cannot surprise us that way, starts in a
// second, and serves the working tree, so the pass always tests the code that is checked out rather
// than whatever a vhost happens to point at.
//
// **`--unsafely-treat-insecure-origin-as-secure` is load-bearing.** The File System Access API and
// OPFS both need a secure context; without it `showSaveFilePicker` is `undefined` and every file
// feature degrades to the download fallback, which is a different section of the punch list. This is
// the one flag that lets a plain `http://127.0.0.1:PORT` origin exercise the real path.

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const REPO = path.resolve(__dirname, '../../..');          // .../hawsedc/engcalcs
const DOCROOT = path.resolve(REPO, '..');                  // .../hawsedc  — so /engcalcs/... resolves
const PORT = Number(process.env.LPN_PORT || 8899);
const ORIGIN = `http://127.0.0.1:${PORT}`;
const PAGE = `${ORIGIN}/engcalcs/Looped-Network.php?ec_nolog=1`;

// Chromium: whatever Playwright downloaded, or CHROME_PATH. Searched rather than pinned so a
// browser update does not silently break the pass with a "file not found" a long way from the cause.
function findChromium() {
	if (process.env.CHROME_PATH) { return process.env.CHROME_PATH; }
	const cache = path.join(os.homedir(), '.cache', 'ms-playwright');
	if (!fs.existsSync(cache)) { return null; }
	for (const dir of fs.readdirSync(cache)) {
		if (!/^chromium-/.test(dir)) { continue; }
		for (const rel of ['chrome-linux64/chrome', 'chrome-linux/chrome']) {
			const exe = path.join(cache, dir, rel);
			if (fs.existsSync(exe)) { return exe; }
		}
	}
	return null;
}

async function startServer() {
	const proc = spawn('php', [
		'-d', 'pcre.jit=0',
		'-d', 'display_errors=0',
		'-S', `127.0.0.1:${PORT}`,
		'-t', DOCROOT
	], { cwd: DOCROOT, stdio: ['ignore', 'ignore', 'pipe'] });
	const errors = [];
	proc.stderr.on('data', (d) => errors.push(String(d)));
	// Wait for it to answer rather than sleeping a fixed amount: a cold PHP on a loaded machine takes
	// longer than any number worth hard-coding, and a pass that fails on startup timing teaches
	// nothing about the page.
	const deadline = Date.now() + 15000;
	while (Date.now() < deadline) {
		try {
			const r = await fetch(`${ORIGIN}/engcalcs/Looped-Network.php`, { method: 'HEAD' });
			if (r.status === 200) { return { proc, errors }; }
		} catch (err) { /* not up yet */ }
		await new Promise(r => setTimeout(r, 150));
	}
	proc.kill();
	throw new Error(`PHP server did not come up on ${ORIGIN}\n${errors.join('')}`);
}

async function launchBrowser(playwright) {
	const executablePath = findChromium();
	if (!executablePath) {
		throw new Error('No Chromium found. Set CHROME_PATH, or run: npx playwright install chromium');
	}
	return playwright.chromium.launch({
		executablePath,
		args: [
			`--unsafely-treat-insecure-origin-as-secure=${ORIGIN}`,
			// The flag above only applies to origins in an "isolated" list when this is off; without
			// it Chromium ignores it for the OPFS/secure-context checks we actually need.
			'--disable-features=IsolateOrigins,site-per-process'
		]
	});
}

// The lock records the broker writes. Cleared between runs so one pass cannot inherit another's
// locks — a stale record would make the very first "somebody else has this file" check pass for the
// wrong reason.
function clearLockRecords() {
	const dir = path.join(REPO, 'lpn-locks');
	if (!fs.existsSync(dir)) { return; }
	for (const f of fs.readdirSync(dir)) {
		if (/\.json$/.test(f)) { fs.unlinkSync(path.join(dir, f)); }
	}
}

module.exports = { REPO, DOCROOT, ORIGIN, PAGE, startServer, launchBrowser, clearLockRecords, findChromium };
