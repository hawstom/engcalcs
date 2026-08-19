// The automated half of dev/lpn-file-lock-test-punchlist.md.
//
//   node dev/browser-pass/run.js                 # everything
//   node dev/browser-pass/run.js boot files      # named specs only
//
// Written 2026-08-06 because Tom asked whether we could proceed without him working the list by
// hand. Most of it, yes: everything below drives the REAL page in a real Chromium against a real PHP
// lock broker, with only the two native file pickers replaced (see lib/pickers.js for exactly how
// small that lie is, and what it costs).
//
// What is NOT here, and stays on the human list:
//   §1  the native picker's user-activation handshake — the riskiest single guess in the build
//   §6  a permission that is genuinely 'prompt' or 'denied' — OPFS is always granted
//   §11 Firefox and Safari
//   anything visual: banner colours, the Save-all flicker, print layout
// (The stray scrollbar was on that list and has come off it: specs/noscroll.js measures the geometry
//  under it, which is a number rather than a picture.)

const path = require('path');
const { REPO, startServer, stopServer, launchBrowser, clearLockRecords } = require('./lib/env');

const SPECS = ['boot', 'menu', 'files', 'reload', 'locking', 'missing', 'fallback', 'degrade', 'saveas', 'find', 'boxes', 'geo', 'basemap', 'units', 'color', 'profile', 'place', 'goto', 'gallery', 'cleanmap', 'noscroll', 'labelcols', 'share', 'geohit', 'toolbar', 'visibility', 'perf'];

let checks = 0, failures = 0, skipped = 0, current = '';
const report = {
	section(name) { current = name; console.log(`\n--- ${name} ---`); },
	// **Not every check this runner reaches is one it can answer**, and saying FAIL when the answer
	// is "this environment cannot produce that condition" is worse than saying nothing: it trains
	// the reader to ignore failures. A skip prints its reason and stays on the human list.
	skip(label, why) { skipped++; console.log(`  --   ${label}   (${why})`); },
	ok(cond, label, detail) {
		checks++;
		if (!cond) { failures++; }
		console.log(`${cond ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
	},
	eq(actual, expected, label) {
		this.ok(actual === expected, label, actual === expected ? '' : `got ${JSON.stringify(actual)}, wanted ${JSON.stringify(expected)}`);
	},
	has(haystack, needle, label) {
		const hit = String(haystack || '').indexOf(needle) >= 0;
		this.ok(hit, label, hit ? '' : `"${needle}" not in ${JSON.stringify(String(haystack).slice(0, 160))}`);
	}
};

(async function main() {
	let playwright;
	try { playwright = require('playwright-core'); }
	catch (err) {
		console.error('playwright-core is not installed. From dev/browser-pass:  npm install');
		process.exit(2);
	}
	const wanted = process.argv.slice(2).filter(a => !a.startsWith('-'));
	const specs = wanted.length ? wanted : SPECS;

	clearLockRecords();
	// If this throws, nothing below it runs — which is the point. A server that is not provably
	// ours makes every check below a statement about somebody else's tree (ROADMAP Task 387).
	const server = await startServer();
	const browser = await launchBrowser(playwright);
	console.log(`=== lpn_ browser pass === ${server.origin}  (${REPO})`);

	try {
		for (const name of specs) {
			if (!SPECS.includes(name)) { console.log(`(no spec "${name}")`); continue; }
			const spec = require(path.join(__dirname, 'specs', name + '.js'));
			report.section(spec.title || name);
			await spec.run({ browser, report });
		}
	} catch (err) {
		failures++;
		console.log(`\n FAIL  ${current}: threw\n${err && err.stack ? err.stack : err}`);
	} finally {
		await browser.close();
		stopServer();
	}

	console.log(`\n${checks - failures}/${checks} checks passed${skipped ? `, ${skipped} left to the human list` : ''}.\n`);
	process.exit(failures ? 1 : 0);
}());
