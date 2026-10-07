// Behavioural test of the two 2026-10-07 counting changes, over real HTTP against the real PHP.
//
//   node dev/calc-spike/visit-dedupe-harness.js
//
// Tom, 2026-10-07: "(1) I would rather dedupe where we can. So if we are collecting consent anyway,
// let's collect it for remembering for a year that they've been here. (2) ... if ?ec_nolog=1 could
// be an 'invoke once to be ignored in reports forever', then that would be very useful, and I would
// be very interested to see a side count of 'tester browsers'."
//
// So this holds:
//   1. ec_seen is written with a one-year lifetime, only for a browser that said yes, and a second
//      sighting of the same page writes no second row (the said-yes bucket counts browsers);
//   2. ?ec_nolog=1 sets a one-year tester cookie stamped with the UTC day, writes 'on' and 'day'
//      rows to the tester log, and from then on every writer sends that browser's rows to the tester
//      log instead of the main logs; one 'day' row per browser per day; ?ec_nolog=0 clears it.
//
// The server is PHP's own `php -S` serving this checkout, with EC_TEST_LOG_DIR pointing every log at
// a temporary directory (lib/config.inc.php honours that variable under cli-server only), so the
// rows a request wrote can be read back without touching the checkout's log/. The daily email's
// rendering of the new columns is dev/scripts/daily_report_selftest.php's job.

const { spawn } = require('child_process');
const fs = require('fs');
const net = require('net');
const os = require('os');
const path = require('path');
const { makeReporter, ROOT } = require('./calc-page.js');

const r = makeReporter('visit dedupe and tester browsers (2026-10-07)');
const YEAR = 365 * 86400;
const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const logDir = fs.mkdtempSync(path.join(os.tmpdir(), 'visit-dedupe-'));
const consent = '1.' + Math.floor(Date.now() / 1000) + '.1';

function freePort() {
	return new Promise((resolve, reject) => {
		const srv = net.createServer();
		srv.on('error', reject);
		srv.listen(0, '127.0.0.1', () => { const p = srv.address().port; srv.close(() => resolve(p)); });
	});
}

function rows(name) {
	const f = path.join(logDir, name);
	if (!fs.existsSync(f)) { return []; }
	return fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => l.split('\t'));
}
function clearLogs() {
	for (const f of fs.readdirSync(logDir)) { fs.unlinkSync(path.join(logDir, f)); }
}

/** One request. cookies: {name: value}. Returns {status, body, set: {name: {value, maxAge, httponly}}}. */
async function req(base, rel, { cookies = {}, post = null } = {}) {
	const headers = { 'Accept-Language': 'en-US' };
	const jar = Object.entries(cookies).map(([k, v]) => `${k}=${v}`).join('; ');
	if (jar) { headers.Cookie = jar; }
	const opt = { method: post ? 'POST' : 'GET', headers, redirect: 'manual' };
	if (post) {
		opt.body = new URLSearchParams(post).toString();
		headers['Content-Type'] = 'application/x-www-form-urlencoded';
	}
	const res = await fetch(base + rel, opt);
	const body = await res.text();
	const set = {};
	for (const line of res.headers.getSetCookie()) {
		const parts = line.split(';').map((s) => s.trim());
		const [name, ...rest] = parts[0].split('=');
		const attr = {};
		for (const p of parts.slice(1)) { const [k, v] = p.split('='); attr[k.toLowerCase()] = v === undefined ? true : v; }
		set[name] = {
			value: decodeURIComponent(rest.join('=')),
			maxAge: attr['max-age'] === undefined ? null : Number(attr['max-age']),
			httponly: !!attr.httponly,
		};
	}
	return { status: res.status, body, set };
}

function aboutAYear(c) { return c && c.maxAge !== null && Math.abs(c.maxAge - YEAR) <= 60; }

(async () => {
	const port = await freePort();
	const php = spawn('php', ['-d', 'display_errors=0', '-d', 'pcre.jit=0', '-S', `127.0.0.1:${port}`, '-t', ROOT],
		{ env: Object.assign({}, process.env, { EC_TEST_LOG_DIR: logDir }), stdio: 'ignore' });
	const base = `http://127.0.0.1:${port}/`;
	try {
		let up = false;
		for (let i = 0; i < 100 && !up; i++) {
			try { await fetch(base + 'log-human-view.php'); up = true; } catch (e) { await new Promise((ok) => setTimeout(ok, 100)); }
		}
		if (!up) { r.ok(false, 'php -S came up'); return; }

		r.section('1. ec_seen: one year, consent-gated, first sighting only');
		clearLogs();
		let a = await req(base, 'log-human-view.php', { cookies: { ec_consent: consent }, post: { page: 'Manning-Pipe-Flow', lang: 'en' } });
		r.eq(a.status, 204, 'a said-yes human view is accepted');
		r.ok(a.set.ec_seen && a.set.ec_seen.value === 'Manning-Pipe-Flow:2', 'ec_seen records bit 2 for the page', JSON.stringify(a.set.ec_seen));
		r.ok(aboutAYear(a.set.ec_seen), 'ec_seen lasts one year (Max-Age 31536000), not the browser session', JSON.stringify(a.set.ec_seen));
		r.ok(a.set.ec_seen && a.set.ec_seen.httponly, 'ec_seen stays HttpOnly');
		let hv = rows('engcalcs-human-view.log');
		r.ok(hv.length === 1 && hv[0][hv[0].length - 1] === 'visitor', 'one row, in the said-yes (visitor) bucket', JSON.stringify(hv));

		a = await req(base, 'log-human-view.php', { cookies: { ec_consent: consent, ec_seen: 'Manning-Pipe-Flow:2' }, post: { page: 'Manning-Pipe-Flow', lang: 'en' } });
		r.eq(rows('engcalcs-human-view.log').length, 1, 'the same browser on the same page again writes no second row');

		a = await req(base, 'log-human-view.php', { cookies: { ec_consent: consent, ec_seen: 'Manning-Pipe-Flow:2' }, post: { page: 'Darcy-Weisbach', lang: 'en' } });
		r.eq(rows('engcalcs-human-view.log').length, 2, 'the same browser on a different page is a first sighting there');
		r.ok(a.set.ec_seen && /Manning-Pipe-Flow:2/.test(a.set.ec_seen.value) && /Darcy-Weisbach:2/.test(a.set.ec_seen.value) && aboutAYear(a.set.ec_seen),
			'the rewrite keeps both pages and renews the year', JSON.stringify(a.set.ec_seen));

		a = await req(base, 'log-human-view.php', { post: { page: 'Manning-Pipe-Flow', lang: 'en' } });
		hv = rows('engcalcs-human-view.log');
		r.ok(!a.set.ec_seen, 'a browser that has not answered gets no ec_seen');
		r.eq(hv[hv.length - 1][hv[hv.length - 1].length - 1], 'visit', 'and its row is in the page-load (visit) bucket');

		a = await req(base, 'log-human-view.php', { cookies: { ec_consent: '0.1.1', ec_seen: 'Manning-Pipe-Flow:2' } });
		r.ok(a.set.ec_seen && a.set.ec_seen.value === 'deleted', 'a refused browser still carrying ec_seen has it deleted', JSON.stringify(a.set.ec_seen));

		r.section('2. ?ec_nolog=1 marks a tester browser for a year');
		clearLogs();
		a = await req(base, 'log-human-view.php?ec_nolog=1');
		r.ok(a.set.ec_nolog && a.set.ec_nolog.value === '1.' + today, 'the cookie is set, stamped with the UTC day', JSON.stringify(a.set.ec_nolog));
		r.ok(aboutAYear(a.set.ec_nolog), 'it lasts one year', JSON.stringify(a.set.ec_nolog));
		r.ok(a.set.ec_nolog && a.set.ec_nolog.httponly, 'it is HttpOnly');
		r.ok(/^tester:/.test(a.body), 'the hand-opened endpoint says "tester"', a.body.trim());
		let t = rows('engcalcs-tester.log').map((x) => x[1]);
		r.eq(t.join(','), 'on,day', 'the tester log records the mark and the day');

		const tester = { ec_nolog: '1.' + today };
		a = await req(base, 'log-human-view.php', { cookies: tester, post: { page: 'Manning-Pipe-Flow', lang: 'en' } });
		r.eq(rows('engcalcs-human-view.log').length, 0, 'a tester human view writes nothing to the main log');
		a = await req(base, 'log-calc-event.php', { cookies: tester, post: { page: 'Manning-Pipe-Flow', lang: 'en' } });
		r.eq(rows('engcalcs-calc-usage.log').length, 0, 'a tester calculation writes nothing to the main log');
		a = await req(base, 'log-signal-event.php', { cookies: tester, post: { page: 'Manning-Pipe-Flow', lang: 'en', event: 'touch' } });
		r.eq(rows('engcalcs-signal.log').length, 0, 'a tester signal writes nothing to the main log');
		a = await req(base, 'log-title-event.php', { cookies: tester, post: { page: 'Manning-Pipe-Flow', lang: 'en', field: 'title' } });
		r.eq(rows('engcalcs-title.log').length, 0, 'a tester title writes nothing to the main log');
		a = await req(base, 'Manning-Pipe-Flow.php', { cookies: tester });
		r.eq(a.status, 200, 'a real calculator page renders for a tester');
		r.eq(rows('engcalcs-lang.log').length, 0, 'a tester page load writes nothing to the reach log');
		t = rows('engcalcs-tester.log');
		r.eq(t.map((x) => x[1]).join(','), 'on,day,shopping,using,behaviour,naming,reach',
			'every one of them went to the tester log instead, and no second day row');
		r.ok(t.every((x) => x[2] === 'Manning-Pipe-Flow' || x[1] === 'on' || x[1] === 'day'), 'each tester row names its page');
		r.ok(t.every((x) => x[x.length - 1] === 'visit'), 'each tester row carries the bucket token last');
		r.ok(!a.set.ec_nolog, 'a tester already stamped today is not re-stamped');

		a = await req(base, 'Manning-Pipe-Flow.php');
		r.eq(rows('engcalcs-lang.log').length, 1, 'control: the same page load from a non-tester IS in the reach log');

		r.section('3. one day row per browser per day; old marks are honoured and upgraded');
		clearLogs();
		a = await req(base, 'log-human-view.php', { cookies: { ec_nolog: '1.20200101' } });
		r.ok(a.set.ec_nolog && a.set.ec_nolog.value === '1.' + today && aboutAYear(a.set.ec_nolog), 'a stamp from an earlier day is renewed for a year', JSON.stringify(a.set.ec_nolog));
		a = await req(base, 'log-human-view.php', { cookies: { ec_nolog: '1' } });
		r.ok(a.set.ec_nolog && a.set.ec_nolog.value === '1.' + today, 'a legacy plain "1" mark is honoured and upgraded', JSON.stringify(a.set.ec_nolog));
		r.ok(/^tester:/.test(a.body), 'and that browser reads as a tester');
		r.eq(rows('engcalcs-tester.log').map((x) => x[1]).join(','), 'day,day', 'two browsers, two day rows, no "on" rows (both were already marked)');
		a = await req(base, 'log-human-view.php', { cookies: { ec_nolog: 'junk' } });
		r.ok(/^counted:/.test(a.body), 'a malformed value is not a tester mark');

		r.section('4. a tester who said yes, and ?ec_nolog=0');
		clearLogs();
		a = await req(base, 'log-human-view.php', { cookies: { ec_nolog: '1.' + today, ec_consent: consent }, post: { page: 'Orifice-Flow', lang: 'en' } });
		t = rows('engcalcs-tester.log');
		r.ok(t.length === 1 && t[0][1] === 'shopping' && t[0][3] === 'visitor', 'a said-yes tester row is tallied with the visitor bucket token', JSON.stringify(t));
		r.ok(!a.set.ec_seen, 'and no ec_seen is written for it: a tester is not counted in the main logs at all');

		clearLogs();
		a = await req(base, 'log-human-view.php?ec_nolog=0', { cookies: { ec_nolog: '1.' + today } });
		r.ok(a.set.ec_nolog && (a.set.ec_nolog.value === 'deleted' || a.set.ec_nolog.value === '') , '?ec_nolog=0 deletes the cookie', JSON.stringify(a.set.ec_nolog));
		r.ok(/^counted:/.test(a.body), 'and that same request already reads as counted');
		r.eq(rows('engcalcs-tester.log').map((x) => x[1]).join(','), 'off', 'the tester log records the mark cleared');
		a = await req(base, 'log-human-view.php?ec_nolog=0');
		r.eq(rows('engcalcs-tester.log').length, 1, '?ec_nolog=0 on an unmarked browser records nothing');
		a = await req(base, 'log-human-view.php', { post: { page: 'Orifice-Flow', lang: 'en' } });
		r.eq(rows('engcalcs-human-view.log').length, 1, 'once cleared, the browser is in the main counts again');
	} catch (e) {
		r.ok(false, 'harness ran to the end', String(e && e.stack || e));
	} finally {
		php.kill();
		fs.rmSync(logDir, { recursive: true, force: true });
		r.finish();
	}
})();
