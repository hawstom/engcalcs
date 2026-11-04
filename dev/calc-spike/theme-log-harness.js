// The page-view log's theme column (Task 824), over real HTTP against the real PHP, and the real
// usage report reading it back.
//
//   node dev/calc-spike/theme-log-harness.js
//
// Holds: the beacon's theme field is written as the sixth column of a page-view row, in a closed
// set (a chosen theme's name, or 'day', else blank); a said-yes row keeps its browser code, its
// 'every' mark and its bucket after it; a row from before the column reads as theme unknown, never
// as day; the report splits chosen from day and the two consent buckets are never summed.
// Nothing is stored on the visitor's device by this: no cookie is set for the theme.

const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
const net = require('net');
const os = require('os');
const path = require('path');
const { makeReporter, ROOT } = require('./calc-page.js');

const r = makeReporter('theme column of the page-view log (Task 824)');
const logDir = fs.mkdtempSync(path.join(os.tmpdir(), 'theme-log-'));
const consent = '1.' + Math.floor(Date.now() / 1000) + '.2';
const A = '0123456789abcdef';

function freePort() {
	return new Promise((resolve, reject) => {
		const srv = net.createServer();
		srv.on('error', reject);
		srv.listen(0, '127.0.0.1', () => { const p = srv.address().port; srv.close(() => resolve(p)); });
	});
}
function rows() {
	const f = path.join(logDir, 'engcalcs-human-view.log');
	return fs.existsSync(f) ? fs.readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => l.split('\t')) : [];
}
async function beacon(base, post, cookies) {
	const headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept-Language': 'en-US' };
	const jar = Object.entries(cookies || {}).map(([k, v]) => `${k}=${v}`).join('; ');
	if (jar) { headers.Cookie = jar; }
	const res = await fetch(base + 'log-human-view.php', { method: 'POST', headers, body: new URLSearchParams(post).toString() });
	return { status: res.status, cookies: res.headers.getSetCookie() };
}

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

		r.section('1. the writer');
		let a = await beacon(base, { page: 'Looped-Network', lang: 'en', pointer: 'fine', theme: 'prairie' });
		r.eq(a.status, 204, 'a beacon carrying a theme is accepted');
		let v = rows();
		r.ok(v.length === 1 && v[0][5] === 'prairie' && v[0][4] === 'fine' && v[0][v[0].length - 1] === 'visit',
			'a chosen theme is the sixth column, after the pointer and before the bucket', JSON.stringify(v));
		await beacon(base, { page: 'Looped-Network', lang: 'en', pointer: 'fine', theme: 'day' });
		await beacon(base, { page: 'Looped-Network', lang: 'en', pointer: 'fine', theme: 'bogus<script>' });
		await beacon(base, { page: 'Manning-Pipe-Flow', lang: 'en', pointer: 'fine' });
		v = rows();
		r.eq(v[1][5], 'day', 'the theme of the day is written as day');
		r.eq(v[2][5], '', 'a theme outside the closed set is written blank, never as typed');
		r.eq(v[3][5], '', 'a page with no theme (an older client) is written blank');
		r.eq(v[3][4], 'fine', 'and its pointer stays in the fifth column');
		a = await beacon(base, { page: 'Looped-Network', lang: 'en', pointer: '', theme: 'space' }, { ec_consent: consent, ec_code: A });
		v = rows();
		const last = v[v.length - 1];
		r.ok(last[4] === '' && last[5] === 'space' && last.slice(-3).join(',') === ['every', A, 'visitor'].join(','),
			'a said-yes row keeps the every mark, the browser code and the bucket after the theme', JSON.stringify(last));
		r.ok(!a.cookies.some((c) => /theme/i.test(c)), 'no cookie carries the theme: nothing new is stored on the device', JSON.stringify(a.cookies));

		r.section('2. the report reads it back, buckets apart');
		const T = '\t';
		fs.appendFileSync(path.join(logDir, 'engcalcs-human-view.log'),
			`2026-09-01T00:00:01Z${T}Looped-Network${T}en${T}en-us${T}fine${T}visit\n` +        // before the column
			`2026-09-01T00:00:02Z${T}Looped-Network${T}en${T}en-us${T}fine${T}${T}visit\n`);    // column, blank
		const script = `<?php require ${JSON.stringify(ROOT + '/lib/UsageReport.lib.php')};
$rep = ecUsageReportBuild(array(${JSON.stringify(logDir)}), '', '');
echo json_encode($rep['series']['view']['countBy']);`;
		const f = path.join(logDir, 'rep.php');
		fs.writeFileSync(f, script);
		const out = JSON.parse(execFileSync('php', [f]).toString());
		const kind = out.themeKind, th = out.theme;
		r.eq(JSON.stringify(kind.visit), JSON.stringify({ chosen: 1, day: 1, '(none)': 4 }),
			'page loads: 1 chosen, 1 day, the rest unknown (older rows, blank, bogus, no theme)', JSON.stringify(kind.visit));
		r.eq(JSON.stringify(kind.visitor), JSON.stringify({ chosen: 1 }), 'said-yes: 1 chosen, in its own bucket', JSON.stringify(kind.visitor));
		r.ok(th.visit.prairie === 1 && th.visit.day === 1 && th.visitor.space === 1 && th.visitor.prairie === undefined,
			'by theme: prairie and day among page loads, space among said-yes', JSON.stringify(th));
		const html = execFileSync('php', ['-d', 'display_errors=0', '-r',
			`define('EC_USAGE_REPORT_DIRS', ${JSON.stringify(logDir)}); chdir(${JSON.stringify(ROOT)}); $_GET=array(); include 'spock.php';`], { maxBuffer: 1 << 26 }).toString();
		r.ok(/Theme, chosen or theme of the day/.test(html) && /Theme shown/.test(html), 'the report page shows both theme tables');
	} catch (e) {
		r.ok(false, 'harness ran to the end', String(e && e.stack || e));
	} finally {
		php.kill();
		fs.rmSync(logDir, { recursive: true, force: true });
		r.finish();
	}
})();
