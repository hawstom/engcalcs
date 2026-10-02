// **DOES A HEADING BREAK ONLY WHERE THE INITIAL-WIDTH RULE SPLIT IT, IN A REAL CHROME?** (Perry's
// real-Chrome pass, reported by Tom, 2026-09-27: Net3's Pipes and Junctions headings broke
// mid-word at arbitrary points, in every language -- "Dia/met/er (in)", "Lengt/h", "Roug/hness",
// even the 3-letter "Ta/g" and the 6-letter "Close/d" -- because (1) the width estimate that
// decided the column's INITIAL width used a guessed font, underestimating it, so even short
// headings no longer fit on one line, and (2) `overflow-wrap: anywhere` was on for every heading,
// letting the browser break wherever it liked rather than at the rule's own split.)
//
//   node dev/lpn-spike/pane-heading-wrap-harness.js
//
// What this asserts, on Net3's Pipes and Junctions tables, in English and German (?lang=de):
//   1. no heading word under 8 characters breaks across more than one line at all;
//   2. a heading word of 8+ characters breaks, if it breaks, at exactly the soft hyphen
//      paneHeadingDisplayText() wrote in -- never anywhere else;
//   3. no heading or cell clips (scrollWidth <= clientWidth, with a hair of antialiasing slack).
// Screenshots of English Pipes and German Junctions go to $PANE_WRAP_SHOTS (default: a folder
// under the system temp directory), printed at the end -- a green run is not a picture; look at
// them too.
//
// **DO NOT PREFIX THIS WITH `flock`.** It launches Chromium itself and takes
// /tmp/engcalcs-browser.lock by re-executing under flock, exactly as convert-as-browser-harness.js
// does; an outer flock on the same file would deadlock.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PANE_WRAP_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error('pane-heading-wrap-harness: flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error('pane-heading-wrap-harness: NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a wrap failure; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error('pane-heading-wrap-harness: no `flock` binary found -- running WITHOUT the browser lock.');
}

const SHOTS = process.env.PANE_WRAP_SHOTS || path.join(os.tmpdir(), 'pane-wrap-shots');

let fails = 0, checks = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { fails++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}

// Runs INSIDE the page. For the given table's headings and cells: which heading words broke
// across more than one line, whether any break landed off the soft hyphen, and whether anything
// clips. Built from the real DOM the way a reader would look at it -- Range.getClientRects() per
// word, never a computed style alone, because a computed `overflow-wrap` says what the browser is
// ALLOWED to do, not what it actually drew.
const CHECK_TABLE = ([panelId]) => {
	const host = document.getElementById(panelId);
	if (!host) { return { error: 'no panel #' + panelId }; }
	const table = host.querySelector('table.lpn-pane-table');
	if (!table) { return { error: 'no table in #' + panelId }; }
	const SHY = String.fromCharCode(173);   // U+00AD, spelled rather than typed literally
	const headings = [];
	table.querySelectorAll('thead th').forEach((th) => {
		const btn = th.querySelector('.lpn-pane-sort');
		if (!btn) { return; }
		const textNode = [...btn.childNodes].find((n) => n.nodeType === 3);
		const text = textNode ? textNode.nodeValue : btn.textContent;
		const words = [];
		let idx = 0;
		text.split(/(\s+)/).forEach((tok) => {
			if (!/\s/.test(tok) && tok.length) {
				const shyAt = tok.indexOf(SHY);
				// **LINES, NOT RECTS.** A soft hyphen that DOES break can render its own hyphen
				// glyph as a distinct box from the letters beside it, so a genuinely two-line word
				// can report three (or more) `getClientRects()` entries for one Range -- counting
				// boxes would fail a correct break. What actually matters is how many DISTINCT
				// LINES (rounded `top`) the word's own glyphs land on, and whether every glyph
				// before the soft hyphen is on the first of those lines and every glyph from it on
				// is on the last -- which is "broke here and nowhere else", stated the way the
				// screen actually draws it.
				let lines = 1, splitAtRight = true;
				if (textNode) {
					const rectsOf = (a, b) => {
						const r = document.createRange();
						r.setStart(textNode, idx + a); r.setEnd(textNode, idx + b);
						return [...r.getClientRects()].filter((rc) => rc.width > 0 || rc.height > 0);
					};
					const tops = (rs) => [...new Set(rs.map((rc) => Math.round(rc.top)))].sort((a, b) => a - b);
					const wholeTops = tops(rectsOf(0, tok.length));
					lines = wholeTops.length || 1;
					if (lines > 1 && shyAt >= 0) {
						// **A SINGLE CHARACTER AT EACH END, NOT A RANGE STARTING AT THE HYPHEN.**
						// A range that starts exactly at the soft hyphen's own text offset picks up
						// the RENDERED HYPHEN MARK'S box too -- Chromium attributes that glyph to
						// whichever range begins at that boundary, even though the mark itself sits
						// at the visual END of the first line, which made a perfectly correct break
						// look like a second, false one. The first and last LETTER of the word carry
						// no such ambiguity (they are nowhere near that boundary once the word is
						// 8+ characters), so they are what proves "head stayed on the first line,
						// tail landed on the last one" -- and since a bare word under `overflow-wrap:
						// normal` with no other space or hyphen has NO OTHER candidate break point
						// at all, two lines with the head on the first and the tail on the last can
						// only mean it broke at this soft hyphen.
						const headTop = tops(rectsOf(0, 1))[0], tailTop = tops(rectsOf(tok.length - 1, tok.length))[0];
						splitAtRight = headTop === wholeTops[0] && tailTop === wholeTops[wholeTops.length - 1];
					}
				}
				words.push({
					word: tok.replace(new RegExp(SHY, 'g'), '·'), len: tok.length,
					hasShy: shyAt >= 0, lines: lines, split: lines > 1, splitAtRight: splitAtRight
				});
			}
			idx += tok.length;
		});
		headings.push({
			key: th.className.split(/\s+/).filter((c) => c.indexOf('lpn-pane-col-') === 0)[0] || '?',
			words: words,
			clipped: th.scrollWidth > th.clientWidth + 1 || btn.scrollWidth > btn.clientWidth + 1
		});
	});
	const clippedCells = [];
	table.querySelectorAll('tbody tr:first-child td, tbody tr:nth-child(2) td').forEach((td) => {
		if (td.scrollWidth > td.clientWidth + 1) {
			clippedCells.push(td.className.split(/\s+/).filter((c) => c.indexOf('lpn-pane-col-') === 0)[0] || '?');
		}
	});
	return { headings, clippedCells };
};

function assertTable(label, report) {
	if (report.error) { ok(label + ': readable', false, report.error); return; }
	let shortBroke = [], longWrong = [], anyLongSplit = false;
	report.headings.forEach((h) => {
		h.words.forEach((w) => {
			if (w.len < 8 && w.split) { shortBroke.push(h.key + ':' + w.word); }
			if (w.len >= 8 && w.split) {
				anyLongSplit = true;
				if (w.lines > 2 || !w.hasShy || !w.splitAtRight) { longWrong.push(h.key + ':' + w.word + ' lines=' + w.lines); }
			}
		});
	});
	ok(label + ': no word under 8 characters breaks across a line', shortBroke.length === 0, shortBroke.join(', '));
	ok(label + ': every 8+ character word that breaks does so exactly at its soft hyphen',
		longWrong.length === 0, longWrong.join(', '));
	const clippedHeads = report.headings.filter((h) => h.clipped).map((h) => h.key);
	ok(label + ': no heading clips', clippedHeads.length === 0, clippedHeads.join(', '));
	ok(label + ': no cell in the first two rows clips', report.clippedCells.length === 0, report.clippedCells.join(', '));
	console.log('       (' + report.headings.length + ' headings; a long word actually broke: ' + anyLongSplit + ')');
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	let chromium;
	try { chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium; }
	catch (err) { console.error('pane-heading-wrap-harness: playwright-core is not installed (cd dev/browser-pass && npm install).'); process.exit(1); }
	fs.mkdirSync(SHOTS, { recursive: true });
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error('pane-heading-wrap-harness: no Chromium found (set CHROME_PATH). SKIPPING rather than failing on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		for (const lang of [null, 'de']) {
			const a = await Session.open(browser, lang || 'en');
			await a.goto('Looped-Network.php' + (lang ? ('?lang=' + lang) : ''));
			await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
			const title = await a.lang('lpn_ex_net3_title');
			await a.openExampleCard(title);
			await a.settle(500);
			await a.page.evaluate(() => { document.getElementById('lpn_pane_btn').click(); });
			await a.settle(300);
			for (const tab of ['junctions', 'pipes']) {
				await a.page.evaluate((t) => { document.getElementById('lpn_pane_tab_' + t).click(); }, tab);
				await a.settle(600);
				const label = (lang || 'en') + ' ' + tab;
				const report = await a.page.evaluate(CHECK_TABLE, ['lpn_pane_' + tab]);
				assertTable(label, report);
				if ((lang === null && tab === 'pipes') || (lang === 'de' && tab === 'junctions')) {
					await a.page.screenshot({ path: path.join(SHOTS, label.replace(' ', '-') + '.png') });
				}
			}
			await a.context.close();
		}
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + (checks - fails) + '/' + checks + ' checks passed. Screenshots: ' + SHOTS);
	process.exit(fails ? 1 : 0);
}

main().catch((err) => { console.error('pane-heading-wrap-harness: ' + (err && err.stack || err)); process.exit(1); });
