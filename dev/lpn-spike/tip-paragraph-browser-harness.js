// TIPS HAVE PARAGRAPHS (Tom, 2026-10-05: "It would be really good for tips to have paragraphs,
// possibly with poor-boy headings ... Could \\n\\n provide that?"). The marker is a LITERAL
// backslash-n twice in a language value. Real headless Chromium, on Manning Pipe Flow:
//   1. a `?` whose tip holds the marker opens as 2+ paragraphs, and shows no raw marker;
//   2. an ALL-CAPS first paragraph renders as a small heading (a "Heading. rest" run-in does not);
//   3. markup in a tip is escaped, never allowed through (no <b>, no <img>);
//   4. the native title (no-JS) holds real blank lines, not the raw marker (PHP ecTipPlain()).
//
//   node dev/lpn-spike/tip-paragraph-browser-harness.js        (takes the browser lock itself)
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_TIPPARA_BROWSER_LOCKED';
const NAME = 'tip-paragraph-browser-harness';

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
const DESKTOP = { viewport: { width: 1400, height: 900 } };
const PHONE = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true };


async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING rather than failing the build on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 900 } });
		const page = a.page;
		await a.goto('Manning-Pipe-Flow.php?ec_nolog=1');
		await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.settle(300);
		// Three labels built the way ecTipLabel() builds one, the marker written as a language value has it.
		await page.evaluate(() => {
			const M = '\\n\\n';
			const texts = {
				p1: 'First paragraph.' + M + 'Second paragraph.',
				p2: 'THE HEADING' + M + 'Body under it. Run-in heading. Rest of it.',
				p3: 'Say <b>bold</b> <img src=x onerror="window.__pwn=1">' + M + 'Next & last.'
			};
			Object.keys(texts).forEach((k) => {
				const s = document.createElement('span');
				s.className = 'ec-help'; s.id = 'tp_' + k; s.title = texts[k];
				s.innerHTML = 'Label ' + k + ' <span class="ec-tip">?</span>';
				document.body.insertBefore(s, document.body.firstChild);
			});
			EngCalcs.initTips(document.body);
		});
		const open = async (k) => {
			await page.evaluate((id) => { const g = document.querySelector('#' + id + ' .ec-tip'); g.click(); }, 'tp_' + k);
			await a.settle(300);
			return page.evaluate((id) => {
				const h = document.getElementById(id), t = document.getElementById(h.getAttribute('aria-describedby') || '');
				if (!t) { return null; }
				const inner = t.querySelector('.tooltip-inner');
				return { text: inner.textContent, ps: inner.querySelectorAll('p').length,
					heads: Array.from(inner.querySelectorAll('p.ec-tip-head')).map((e) => e.textContent),
					bold: inner.querySelectorAll('b, img').length };
			}, 'tp_' + k);
		};
		let s = await open('p1');
		ok('a tip with the marker opens as 2 paragraphs', !!s && s.ps === 2, JSON.stringify(s));
		ok('...and shows no raw marker, and no sentence-case heading', !!s && s.text.indexOf('\\n') < 0 && s.heads.length === 0);
		await page.mouse.click(5, 5); await a.settle(200);
		s = await open('p2');
		ok('an ALL-CAPS first paragraph is a heading', !!s && s.heads.length === 1 && s.heads[0] === 'THE HEADING' && s.ps === 2, JSON.stringify(s));
		ok('...and "Heading. rest" on one line is left alone', !!s && s.text.indexOf('Run-in heading. Rest of it.') > 0 && s.heads.length === 1);
		await page.mouse.click(5, 5); await a.settle(200);
		s = await open('p3');
		ok('markup in a tip is escaped, never rendered', !!s && s.bold === 0 && s.text.indexOf('<b>bold</b>') >= 0 && s.text.indexOf('Next & last.') >= 0, JSON.stringify(s));
		ok('...and nothing in it ran', !(await page.evaluate(() => window.__pwn)));
		await page.mouse.click(5, 5); await a.settle(200);
		// The PHP side: ecTipLabel() puts real blank lines, not the raw marker, in the native title.
		const php = spawnSync('php', ['-r', "require_once 'lib/base.inc.php'; echo ecTipLabel('X', 'One.' . '\\\\n\\\\n' . 'Two.');"], { cwd: REPO, encoding: 'utf8' });
		ok('ecTipLabel() turns the marker into real blank lines in the title', /title="One\.\n\nTwo\."/.test(php.stdout) && php.stdout.indexOf('\\n') < 0, JSON.stringify(php.stdout.slice(0, 120)) + ' ' + String(php.stderr).slice(0, 100));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
		await a.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
