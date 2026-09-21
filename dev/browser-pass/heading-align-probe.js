// QUIRK 3 -- Tom: "There are still some headings vertical borders that are misaligned by 1px
// from their columns below." Run with:
//
//   node dev/browser-pass/heading-align-probe.js
//
// **THIS IS A PROBE, NOT A SPEC: it asserts nothing and prints what the page did**, the same shape
// as measure-probe.js beside it. A committed script that nobody can re-run is not a result -- the
// first version of this sweep lived only in a scratch directory and Perry could not find it, so it
// could not be checked, disagreed with, or re-run after the next change. This one can be.
//
// WHAT IT VARIES, and why each axis is here:
//   * font size (14/20px on the root) -- the axis the earlier missing-separator defect (R-058)
//     was measured against, so it is the first thing to re-check for the new symptom.
//   * device scale factor, Chromium only (1/1.5/2) -- a HiDPI display rounds sub-pixel widths
//     differently than a 1x one, which is exactly the mechanism R-058's own fix (thead tr sticky,
//     one composited layer instead of one per cell) was written against. Firefox is run at 1 only
//     -- Playwright's `deviceScaleFactor` context option is Chromium/WebKit-only.
//   * CSS zoom (100%/125%, via `documentElement.style.zoom`) -- a real layout rescale, and
//     DELIBERATELY NOT THE SAME THING as device scale factor: zoom changes a column's computed
//     width in px, where DSF only changes how many device pixels one CSS pixel covers. Perry
//     named this as an axis the first (uncommitted, since-deleted) sweep never varied.
//   * a column FORCED WIDE by its own content -- typing a long value into one cell so
//     `table-layout: auto` (this table declares no `table-layout` at all) has to grow that column
//     past its declared `--lpn-pane-col-w`, which is the one case where the heading and the body
//     might legitimately disagree about how wide the column's CONTENT wants to be, even though
//     they still must agree about where its BORDER falls.
//   * a NARROWED PANE PANEL (not the browser viewport -- see the comment in measureOnce() on why
//     that draft broke), so the table's own horizontal scrollbar is showing and the table's
//     available width is less than its natural one -- the other axis Perry named.
//
// WHAT IT DOES NOT VARY, and why:
//   * WebKit/Safari -- not installed in this sandbox (`~/.cache/ms-playwright` has chromium and
//     firefox only). If Tom's own browser is Safari, this probe says nothing about it and that
//     gap is real, not an oversight glossed over.
//   * Tom's own BROWSER zoom (Ctrl+/-) as opposed to CSS zoom -- Playwright has no API for it
//     because it is a browser-chrome feature and not a page one; CSS zoom is the closest a script
//     can drive, and the two are not guaranteed identical. If his own report names a zoom level,
//     that is the number to ask him to also try as CSS zoom here, but the two are not the same
//     experiment.
//
// RESULT: not yet run to completion in this session. A first attempt at the wider sweep (with the
// browser-viewport version of the narrow-scrollbar case) crossed this page's own 640px
// small-screen breakpoint by accident and hung retrying a button that stops being visible there;
// fixed below (narrow the PANE PANEL's CSS width instead, leaving the viewport at desktop size)
// but not re-run before this had to be committed rather than left as more uncommitted work in the
// worktree. An EARLIER, narrower sweep (2 tables x 5 font sizes x 5 device-scale factors, Chromium
// only, no zoom/wide-column/scrollbar axes, ~50 combinations) found 0 misaligned boundaries but
// was never committed and cannot be re-verified -- treat that number as unconfirmed. Run this file
// and replace this paragraph with what it actually finds.

const path = require('path');
const env = require('./lib/env.js');
const { chromium, firefox } = require('./node_modules/playwright-core');

const SIZES = [14, 20];
const DSFS = [1, 1.5, 2];
const ZOOMS = [1, 1.25];
const TABLES = [['junctions', 'lpn_pane_tab_junctions'], ['pipes', 'lpn_pane_tab_pipes']];

async function launchEngine(name) {
	if (name === 'chromium') { return env.launchBrowser({ chromium }); }
	if (name === 'firefox') { return firefox.launch(); }
	throw new Error('unknown engine ' + name);
}

async function measureOnce(browser, opts) {
	// **THE VIEWPORT STAYS DESKTOP-SIZED THROUGHOUT.** The first draft of this probe shrank the
	// whole browser viewport to force a scrollbar, and it crossed this page's own 640px
	// small-screen breakpoint (CLAUDE.md's `lpn_` section, Task 486) without meaning to -- the
	// toolbar collapses there, `#lpn_pane_btn` stops being visible, and every narrow-viewport case
	// timed out waiting 30s for a button that was never going to appear, on Chromium AND Firefox
	// alike. The FIX is to force the scrollbar a different way: narrow the PANE PANEL's own CSS
	// width after it opens, leaving the surrounding page (and its toolbar) at full desktop size,
	// which is what "the table has a scrollbar" actually means and the small-screen mode does not.
	const ctx = await browser.newContext(
		opts.engine === 'chromium' ? { deviceScaleFactor: opts.dsf, viewport: opts.viewport } : { viewport: opts.viewport });
	const page = await ctx.newPage();
	await page.addInitScript((px) => {
		document.addEventListener('DOMContentLoaded', () => { document.documentElement.style.fontSize = px + 'px'; });
	}, opts.size);
	await page.goto(env.pageUrl('Looped-Network.php'));
	await page.waitForSelector('.lpn-example-card');
	await page.click('.lpn-example-card >> nth=2');
	await page.waitForSelector('#lpn_canvas .lpn-node', { timeout: 15000 });
	if (opts.zoom !== 1) {
		await page.evaluate((z) => { document.documentElement.style.zoom = String(z); }, opts.zoom);
	}
	await page.click('#lpn_pane_btn');
	await page.click('#' + opts.tabBtn);
	await page.waitForTimeout(150);
	if (opts.narrowPane) {
		await page.evaluate((id) => {
			var panel = document.getElementById('lpn_pane_' + id);
			if (panel) { panel.style.maxWidth = '260px'; panel.style.overflowX = 'auto'; }
		}, opts.tabId);
		await page.waitForTimeout(100);
	}
	if (opts.wideCol) {
		// Type a long value into the first text cell of row 1 so table-layout: auto has real
		// content to grow that column past its declared width.
		await page.evaluate((id) => {
			var table = document.querySelector('#lpn_pane_' + id + ' table');
			var input = table && table.querySelector('tbody tr td input[type="text"]');
			if (input) { input.value = 'a very long value nobody declared a width for, on purpose'; input.dispatchEvent(new Event('change')); }
		}, opts.tabId);
		await page.waitForTimeout(100);
	}
	const report = await page.evaluate((id) => {
		var table = document.querySelector('#lpn_pane_' + id + ' table');
		if (!table) { return null; }
		var ths = Array.from(table.querySelectorAll('thead th'));
		var firstTr = table.querySelector('tbody tr');
		if (!firstTr) { return null; }
		var tds = Array.from(firstTr.children);
		return ths.map(function (th, i) {
			var td = tds[i];
			if (!td) { return null; }
			var tr = th.getBoundingClientRect(), dr = td.getBoundingClientRect();
			return { key: th.className, diffL: +(tr.left - dr.left).toFixed(3), diffR: +(tr.right - dr.right).toFixed(3) };
		});
	}, opts.tabId);
	await page.close();
	await ctx.close();
	return report;
}

(async () => {
	const server = await env.startServer();
	let total = 0, bad = 0;
	try {
		for (const engineName of ['chromium', 'firefox']) {
			const browser = await launchEngine(engineName);
			try {
				for (const [tabId, tabBtn] of TABLES) {
					for (const size of SIZES) {
						for (const dsf of (engineName === 'chromium' ? DSFS : [1])) {
							for (const zoom of ZOOMS) {
								for (const wideCol of [false, true]) {
									for (const narrowPane of [false, true]) {
										total++;
										let report;
										try {
											report = await measureOnce(browser, { engine: engineName, tabId, tabBtn, size, dsf, zoom, wideCol, narrowPane, viewport: { width: 1400, height: 900 } });
										} catch (e) {
											console.log(`ERROR ${engineName} ${tabId} font=${size} dsf=${dsf} zoom=${zoom} wide=${wideCol} narrow=${narrowPane}: ${e.message}`);
											continue;
										}
										const rows = (report || []).filter((r) => r && (Math.abs(r.diffL) >= 0.5 || Math.abs(r.diffR) >= 0.5));
										if (rows.length) {
											bad++;
											console.log(`--- ${engineName} ${tabId} font=${size} dsf=${dsf} zoom=${zoom} wide=${wideCol} narrow=${narrowPane} ---`);
											rows.forEach((r) => console.log('  ' + r.key + ' diffL=' + r.diffL + ' diffR=' + r.diffR));
										}
									}
								}
							}
						}
					}
				}
			} finally { await browser.close(); }
		}
	} finally { env.stopServer(); }
	console.log(`scan complete: ${total} combinations, ${bad} with a misaligned boundary`);
})().catch((e) => { console.error(e); process.exit(1); });
