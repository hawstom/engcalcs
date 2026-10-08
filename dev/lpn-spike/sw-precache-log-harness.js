// A SERVICE WORKER PRECACHE FETCH IS NOT A PAGE VIEW. Run with:
//   node dev/lpn-spike/sw-precache-log-harness.js
//
// Defect (pre-reviewer, 2026-10-08): on first install the worker fetches every calculator page in
// the background with the visitor's cookies, and each fetch was logged as a page view -- 23 rows
// for one visit to Manning-Pipe-Flow. sw.php now sends `X-EC-Precache: 1` on those fetches and
// ecIsPrecacheRequest() / ecLoggingOptedOut() in lib/config.inc.php make every log writer skip them.
//
// Part A (HTTP, against our own php -S): a request carrying the marker writes no row from the page
//   load (LANG_LOG) nor from any of the four beacon writers; the same request without it does.
// Part B (real Chromium, fresh profile): load one calculator, wait for the worker to finish
//   installing and precaching, and exactly one LANG_LOG row results.
// The server serves THIS checkout, so the rows land in this checkout's log/ ; the harness moves any
// existing log files aside and puts them back.
'use strict';
const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');
const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SW_PRECACHE_LOCKED';
if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename].concat(process.argv.slice(2)), {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.status === 75) { console.error('sw-precache-log-harness: NOT RUN, browser lock held 280 s.'); process.exit(1); }
		process.exit(r.status === null ? 1 : r.status);
	}
}

const LOGDIR = path.join(REPO, 'log');
const LOGS = {
	lang: 'engcalcs-lang.log', human: 'engcalcs-human-view.log', calc: 'engcalcs-calc-usage.log',
	title: 'engcalcs-title.log', signal: 'engcalcs-signal.log'
};
let fails = 0;
function ok(what, cond, detail) {
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + what + (detail !== undefined ? '   ' + detail : ''));
}
function rows(key) {
	const f = path.join(LOGDIR, LOGS[key]);
	return fs.existsSync(f) ? fs.readFileSync(f, 'utf8').split('\n').filter(Boolean) : [];
}
const aside = [];
function moveAside() {
	fs.mkdirSync(LOGDIR, { recursive: true });
	for (const k of Object.keys(LOGS)) {
		const f = path.join(LOGDIR, LOGS[k]);
		if (fs.existsSync(f)) { fs.renameSync(f, f + '.harness-aside'); aside.push(f); }
	}
}
function putBack() {
	for (const k of Object.keys(LOGS)) { try { fs.unlinkSync(path.join(LOGDIR, LOGS[k])); } catch (e) { /* none */ } }
	for (const f of aside) { try { fs.renameSync(f + '.harness-aside', f); } catch (e) { /* none */ } }
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	moveAside();
	let browser;
	try {
		// ---- Part A: the marker, writer by writer ------------------------------------------
		const url = (p) => env.pageUrl(p);
		const post = (p, body, marked) => fetch(url(p), {
			method: 'POST', headers: Object.assign({ 'Content-Type': 'application/x-www-form-urlencoded' }, marked ? { 'X-EC-Precache': '1' } : {}),
			body
		});
		const writers = [
			['human', 'log-human-view.php', 'page=Manning-Pipe-Flow&lang=en'],
			['calc', 'log-calc-event.php', 'page=Manning-Pipe-Flow&lang=en'],
			['title', 'log-title-event.php', 'page=Manning-Pipe-Flow&lang=en&field=title'],
			['signal', 'log-signal-event.php', 'page=Manning-Pipe-Flow&lang=en&event=units&detail=a:b']
		];
		for (const [key, file, body] of writers) {
			await post(file, body, true);
			ok(file + ' with the marker writes no row', rows(key).length === 0, 'rows=' + rows(key).length);
			await post(file, body, false);
			ok(file + ' without it still writes one (control)', rows(key).length === 1, 'rows=' + rows(key).length);
		}
		const hdr = { 'Accept-Language': 'en-US,en;q=0.9' };
		const marked = await fetch(url('Manning-Pipe-Flow.php'), { headers: Object.assign({ 'X-EC-Precache': '1' }, hdr) });
		await marked.text();
		ok('a marked page load writes no LANG_LOG row', rows('lang').length === 0, 'rows=' + rows('lang').length);
		ok('a marked page load sets no ec_blang cookie', !/ec_blang/.test(marked.headers.get('set-cookie') || ''));
		const plain = await fetch(url('Manning-Pipe-Flow.php'), { headers: hdr });
		await plain.text();
		ok('an unmarked page load writes one LANG_LOG row (control)', rows('lang').length === 1, 'rows=' + rows('lang').length);
		moveAside(); putBack(); // clear for part B

		// ---- Part B: a real fresh browser ---------------------------------------------------
		moveAside();
		const executablePath = env.findChromium();
		if (!executablePath) { console.error('sw-precache-log-harness: no Chromium; part B SKIPPED.'); return; }
		browser = await chromium.launch({ executablePath });
		const ctx = await browser.newContext({ locale: 'en-US' });
		const page = await ctx.newPage();
		await page.goto(url('Manning-Pipe-Flow.php'), { waitUntil: 'load' });
		const state = await page.evaluate(async () => {
			if (!('serviceWorker' in navigator)) { return 'unsupported'; }
			await navigator.serviceWorker.ready;
			return 'ready';
		});
		ok('the service worker registered', state === 'ready', state);
		// Ready means active; the precache runs inside install, which precedes active. Cache
		// contents prove it finished, then a settle for the server to flush its last write.
		const cached = await page.evaluate(async () => {
			const c = await caches.open('engcalcs-pages');
			return (await c.keys()).length;
		});
		ok('the pages were precached (' + cached + ')', cached >= 10, 'cached=' + cached);
		await page.waitForTimeout(3000);
		const n = rows('lang').length;
		ok('one visit leaves exactly one LANG_LOG row', n === 1, 'rows=' + n);
	} finally {
		if (browser) { await browser.close(); }
		env.stopServer();
		putBack();
	}
	console.log(fails ? 'FAILED: ' + fails : 'ALL PASS');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); putBack(); process.exit(1); });
