// RUNS SEVERAL BROWSER HARNESS MODULES IN ONE PROCESS, ON ONE PHP SERVER AND ONE CHROMIUM
// (test-trim pass 2, dev/test-trim-2.md). Not a harness itself (run_harnesses.sh globs *harness*.js).
//
// A member is an ordinary browser harness file, unedited: it starts the server, launches Chromium,
// runs its checks and calls process.exit(). The group file requires each member in turn with
//   - env.stopServer() held back, so the server the first member started serves the rest;
//   - chromium.launch() answering with one shared browser whose close() is held back;
//   - process.exit() caught, so the member's exit code is its result and the next member runs;
//   - the flock re-exec skipped (the group took the lock once) by setting the member's own
//     EC_..._LOCKED variable, which every member checks first;
//   - the member's module state (and chapter-lib's check counters) discarded between members.
// Every assertion of every member runs exactly as before. The group fails if any member does, and
// prints each member's own PASS/FAIL line, so a failure names the member. A member that was left
// out of the group still runs by itself: `node dev/lpn-spike/<member>.js`.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const fs = require('fs');
const U = require('./scenario-ui-helper.js');
const REPO = U.REPO;

async function runGroup(name, lockEnv, members) {
	U.takeBrowserLock(name, lockEnv);
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const pw = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(name + ': no Chromium found. SKIPPING.'); process.exit(0); }

	// Hold back what a member does to the world it shares.
	const realStop = env.stopServer;
	env.stopServer = () => {};
	const realLaunch = pw.chromium.launch.bind(pw.chromium);
	let shared = null, realClose = null;
	pw.chromium.launch = async (opts) => {
		if (!shared) {
			shared = await realLaunch(opts);
			realClose = shared.close.bind(shared);
			shared.close = async () => {};
		}
		return shared;
	};
	const realExit = process.exit;
	let onExit = null;
	process.exit = (code) => { if (onExit) { const f = onExit; onExit = null; f(code === undefined ? 0 : code); } };
	let crash = null;
	const onReject = (e) => { crash = e; if (onExit) { const f = onExit; onExit = null; f(1); } };
	process.on('unhandledRejection', onReject);
	process.on('uncaughtException', onReject);

	let okLines = 0, failLines = 0;
	const realLog = console.log;
	console.log = (...a) => {
		const s = a.length ? String(a[0]) : '';
		if (/^ {2}ok {3}/.test(s)) { okLines++; } else if (/^ {2}FAIL /.test(s)) { failLines++; }
		realLog(...a);
	};

	const rows = [];
	let hung = false;
	try {
		for (const m of members) {
			const file = path.join(__dirname, m);
			const src = fs.readFileSync(file, 'utf8');
			const lk = src.match(/EC_[A-Z0-9_]+_LOCKED/);
			if (!lk) { throw new Error(m + ': no EC_..._LOCKED variable to set'); }
			process.env[lk[0]] = '1';
			// A fresh module: its own counters, and chapter-lib's.
			Object.keys(require.cache).forEach((k) => { if (k === file || /user-guide-chapter-lib\.js$/.test(k)) { delete require.cache[k]; } });
			const ok0 = okLines, fail0 = failLines;
			const t0 = Date.now();
			realLog('\n######## ' + m + ' ########');
			crash = null;
			let timer = null;
			const code = await Promise.race([
				new Promise((resolve) => {
					onExit = resolve;
					try { require(file); } catch (e) { crash = e; onExit = null; resolve(1); }
				}),
				// A member that never exits is a failure, as a lone harness is at 300 s; the shared
				// browser is then in an unknown state, so the group stops here.
				new Promise((resolve) => { timer = setTimeout(() => { hung = true; resolve(1); }, 290000); })
			]);
			clearTimeout(timer);
			if (hung) { realLog('  FAIL ' + m + ' did not exit in 290 s'); failLines++; rows.push({ m, code: 1, ok: okLines - ok0, fail: failLines - fail0, sec: '290+' }); break; }
			if (crash) { realLog('  FAIL ' + m + ' crashed: ' + (crash && crash.stack || crash)); failLines++; }
			rows.push({ m, code: crash ? 1 : code, ok: okLines - ok0, fail: failLines - fail0, sec: ((Date.now() - t0) / 1000).toFixed(1) });
		}
	} finally {
		console.log = realLog;
		process.exit = realExit;
		if (realClose) { await realClose().catch(() => {}); }
		realStop();
	}
	realLog('\n' + name + ' members:');
	rows.forEach((r) => realLog('  ' + (r.code === 0 && r.fail === 0 ? 'ok   ' : 'FAIL ') + r.m + '  ' + r.ok + ' checks, ' + r.fail + ' failed, exit ' + r.code + ', ' + r.sec + ' s'));
	const bad = rows.filter((r) => r.code !== 0 || r.fail > 0);
	realLog(bad.length ? '\n' + name + ': ' + bad.length + ' MEMBER(S) FAILED of ' + rows.length : '\n' + name + ': ALL PASS (' + okLines + ' checks in ' + rows.length + ' members)');
	realExit(bad.length ? 1 : 0);
}

module.exports = { runGroup };
