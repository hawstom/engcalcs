// The world the pass runs in: a PHP server we own, serving THIS checkout, and a Chromium we can
// make believe it is secure.
//
// **The runner starts its own PHP server** rather than talking to Apache. Not a preference — the
// broker answers in JSON, and a PHP warning printed above that JSON makes `resp.json()` throw, which
// the page reads as "the server is unreachable". A sandbox that refuses PCRE JIT memory is enough to
// do it. `php -S` with `-d pcre.jit=0 -d display_errors=0` cannot surprise us that way, starts in a
// second, and serves the working tree, so the pass always tests the code that is checked out rather
// than whatever a vhost happens to point at.
//
// **THE SERVER MUST BE PROVED TO BE OURS BEFORE ANY ASSERTION RUNS** (ROADMAP Task 387). This file
// used to bind a constant port 8899 under a docroot derived as `REPO/..`, and both were wrong in a
// way that produced no error at all:
//   * another session's server already bound to 8899 answered instead, while our `php -S` failed to
//     bind IN SILENCE — so the whole pass ran green against somebody else's files, and once did;
//   * `REPO/..` is the repository's PARENT, which contains no `engcalcs/` when the checkout is a git
//     worktree under `.claude/worktrees/` — yet startup still "succeeded", because the other
//     session's server was answering the readiness probe.
// The three properties that close that class, and none of them may be dropped:
//   1. the port is asked of the OS (`listen(0)`), never assumed;
//   2. the docroot is a temp directory holding a symlink to the repo root as reported by
//      `git rev-parse --show-toplevel`, which is correct inside a worktree where a `../` hop is not;
//   3. a random SENTINEL written into that temp docroot is fetched back and compared before the
//      browser is launched. Only our own server can serve it. A mismatch throws, naming the port,
//      the docroot and what came back instead.
//
// **`--unsafely-treat-insecure-origin-as-secure` is load-bearing.** The File System Access API and
// OPFS both need a secure context; without it `showSaveFilePicker` is `undefined` and every file
// feature degrades to the download fallback, which is a different section of the punch list. This is
// the one flag that lets a plain `http://127.0.0.1:PORT` origin exercise the real path. It names the
// origin, so the browser can only be launched AFTER the server has told us its port.

const { spawn, execFileSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const net = require('net');
const os = require('os');
const path = require('path');

// The repo root of the file being tested. `git rev-parse --show-toplevel` answers correctly inside a
// worktree; the path hop is only the fallback for a tree that is not a git checkout at all.
const REPO = (function () {
	const guess = path.resolve(__dirname, '../../..');
	try {
		const top = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: __dirname, encoding: 'utf8' }).trim();
		if (top && fs.existsSync(path.join(top, 'dev', 'browser-pass'))) { return top; }
	} catch (err) { /* not a git checkout; fall through */ }
	return guess;
}());

const SENTINEL_NAME = '.browser-pass-sentinel';
const PROBE_PATH = 'js/lpn-geom.js';   // a real served asset, byte-compared against disk

// Everything about the running server. Populated by startServer(); read through origin()/pageUrl(),
// never captured at require time — the port does not exist until the server has been started.
const state = { proc: null, port: 0, origin: '', docroot: '', errors: [] };

function origin() {
	if (!state.origin) { throw new Error('env: the server has not been started yet — call startServer() first'); }
	return state.origin;
}
function pageUrl(rel) {
	return `${origin()}/engcalcs/${rel || 'Looped-Network.php?ec_nolog=1'}`;
}

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

/** A port nothing is listening on, asked of the OS rather than guessed. */
function freePort() {
	return new Promise((resolve, reject) => {
		const srv = net.createServer();
		srv.on('error', reject);
		srv.listen(0, '127.0.0.1', () => {
			const p = srv.address().port;
			srv.close(() => resolve(p));
		});
	});
}

// The pages ask for /engcalcs/js/... absolutely, so the docroot must have an `engcalcs` in it. A
// symlink into this checkout gives that without copying the tree and without assuming where the
// checkout sits — which is the part `REPO/..` got wrong for a worktree.
function makeDocroot() {
	const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'engcalcs-browser-pass-'));
	fs.symlinkSync(REPO, path.join(dir, 'engcalcs'), 'dir');
	return dir;
}

function removeDocroot() {
	if (!state.docroot) { return; }
	const dir = state.docroot;
	state.docroot = '';
	try { fs.rmSync(dir, { recursive: true, force: true }); } catch (err) { /* best effort */ }
}

/**
 * Prove the thing answering on our port is OUR server, serving OUR tree. Cheap, once, at startup —
 * and it is the whole point of this module. Throws with everything a reader needs to see what
 * answered instead.
 */
async function proveOurTree(token) {
	const at = `${state.origin} (docroot ${state.docroot}, repo ${REPO})`;
	let got;
	try {
		const res = await fetch(`${state.origin}/${SENTINEL_NAME}`);
		got = (await res.text()).trim();
	} catch (err) {
		throw new Error(`Browser pass: could not read the startup sentinel from ${at}\n${err.message}`);
	}
	if (got !== token) {
		throw new Error(
			`Browser pass: THE SERVER ON THIS PORT IS NOT OURS — it is serving a different tree.\n` +
			`  expected sentinel ${token}\n` +
			`  got              ${JSON.stringify(got.slice(0, 200))}\n` +
			`  at               ${at}\n` +
			`Another session almost certainly holds this port. Nothing was asserted; the run is void.`);
	}
	// Belt: /engcalcs/ really maps to this checkout, not merely to some checkout.
	const disk = fs.readFileSync(path.join(REPO, PROBE_PATH), 'utf8');
	const served = await (await fetch(`${state.origin}/engcalcs/${PROBE_PATH}`)).text();
	if (served !== disk) {
		throw new Error(
			`Browser pass: /engcalcs/${PROBE_PATH} served ${served.length} bytes but this checkout ` +
			`has ${disk.length}.\n  at ${at}\nThe server is not serving this tree; the run is void.`);
	}
}

/**
 * Start a PHP server on an OS-assigned port over a temp docroot symlinked to this checkout, wait
 * for it to answer, and prove it is ours. Every failure is LOUD.
 */
async function startServer() {
	if (state.proc) { return { proc: state.proc, errors: state.errors, origin: state.origin, port: state.port, stop: stopServer }; }

	// LPN_PORT still overrides, for attaching a debugger to a known port — but the sentinel check
	// below applies to it exactly as it does to an OS-assigned one, so a busy fixed port now fails
	// loudly instead of silently answering from somebody else's tree.
	state.port = process.env.LPN_PORT ? Number(process.env.LPN_PORT) : await freePort();
	state.origin = `http://127.0.0.1:${state.port}`;
	state.docroot = makeDocroot();

	const token = `browser-pass-${process.pid}-${crypto.randomBytes(8).toString('hex')}`;
	fs.writeFileSync(path.join(state.docroot, SENTINEL_NAME), token + '\n');

	state.errors = [];
	let exited = null;
	const proc = spawn('php', [
		'-d', 'pcre.jit=0',
		'-d', 'display_errors=0',
		'-S', `127.0.0.1:${state.port}`,
		'-t', state.docroot
	], { cwd: state.docroot, stdio: ['ignore', 'ignore', 'pipe'] });
	state.proc = proc;
	proc.stderr.on('data', (d) => state.errors.push(String(d)));
	proc.on('exit', (code, signal) => { exited = `php -S exited early (code ${code}, signal ${signal})`; });
	process.once('exit', removeDocroot);

	// Wait for OUR server to answer rather than sleeping a fixed amount: a cold PHP on a loaded
	// machine takes longer than any number worth hard-coding. The readiness probe is the sentinel,
	// not the page — a 200 for the page proves only that SOMETHING is listening, which is precisely
	// the mistake this file used to make.
	const deadline = Date.now() + 15000;
	let ready = false;
	while (Date.now() < deadline && !exited) {
		try {
			const r = await fetch(`${state.origin}/${SENTINEL_NAME}`);
			if (r.status === 200) { ready = true; break; }
		} catch (err) { /* not up yet */ }
		await new Promise(r => setTimeout(r, 150));
	}
	if (!ready) {
		stopServer();
		throw new Error(
			`Browser pass: PHP server never answered on ${state.origin}` +
			` (docroot ${state.docroot}, repo ${REPO}).\n` +
			(exited ? `  ${exited}\n` : '  it is still running but is not serving our docroot\n') +
			(state.errors.length ? state.errors.join('') : '  (php wrote nothing to stderr — the port is probably already in use)\n'));
	}

	try {
		await proveOurTree(token);
	} catch (err) {
		stopServer();
		throw err;
	}
	return { proc, errors: state.errors, origin: state.origin, port: state.port, stop: stopServer };
}

function stopServer() {
	if (state.proc) { try { state.proc.kill(); } catch (err) { /* already gone */ } }
	state.proc = null;
	state.origin = '';
	removeDocroot();
}

async function launchBrowser(playwright, opts) {
	const executablePath = findChromium();
	if (!executablePath) {
		throw new Error('No Chromium found. Set CHROME_PATH, or run: npx playwright install chromium');
	}
	// Not every runner in here needs a secure context; mi-defaults.js does not, and asking for the
	// flag it does not use would be one more thing to keep true.
	const args = (opts && opts.secureContext === false) ? [] : [
		`--unsafely-treat-insecure-origin-as-secure=${origin()}`,
		// The flag above only applies to origins in an "isolated" list when this is off; without it
		// Chromium ignores it for the OPFS/secure-context checks we actually need.
		'--disable-features=IsolateOrigins,site-per-process'
	];
	return playwright.chromium.launch({ executablePath, args });
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

module.exports = {
	REPO, origin, pageUrl,
	startServer, stopServer, launchBrowser, clearLockRecords, findChromium, freePort
};
