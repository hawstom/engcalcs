// **DOES A SINGLE-TOKEN VALUE THAT FITS ON SCREEN ALSO FIT ON PAPER -- AND DOES ONE THAT GENUINELY
// DOESN'T FIT FAIL SAFELY?** (R-366, Tom, 2026-09-27: *"Printing seems to always take a little more
// room than on-screen. Therefore a column whose values fit fine on-screen may wrap in the print.
// This happened to Latitude, Longitude, and Date installed (long value strings). Research how to
// avoid surprises like this and ensure that the width decisions account for this if it's an
// unavoidable fact of browser printing."*; the pre-reviewer's follow-up, 2026-09-28, on the first
// attempt at this fix: forcing a value to roughly twice its column's width made it paint 133px into
// the NEXT column, unbroken -- a silent overlap, worse than the mid-word wrap it replaced.)
//
// **TWO DEFENSES, CHECKED SEPARATELY.** A heading is built by paneHeadingDisplayText() with a soft
// hyphen at the ONE point paneWordSplitIndex() measured room for
// (dev/lpn-spike/pane-heading-wrap-harness.js already covers that). A coordinate, a date, or a
// typed number with real decimal precision behind it (paneColCoord()'s own X/Y columns included --
// they are plain numbers, not text, and print through paneNumText() up to six decimal places) has
// no such device and no space to wrap at either: it is a single, unbreakable token, sized on screen
// to the exact width of its own longest value. Printing is a SEPARATE Chromium rendering pass from
// the screen the width was measured on (see the CSS comment beside `.lpn-print-fixed th, td {
// overflow-wrap: anywhere }` in css/engcalcs.css for the citations and the measured numbers), so
// that width is not guaranteed to survive to the paper down to the sub-pixel.
//   1. panePrintWidths() prints a column at least as wide as each unbreakable value's measured
//      width times that shortfall (PANE_PRINT_HEADROOM) plus the print cell's own padding
//      (paneColPrintNeedEm(), js/looped-network.js), so an HONESTLY-SIZED value should never come
//      close to needing to wrap at all.
//   2. `overflow-wrap: anywhere` is restored on print `td` as the LAST RESORT, so a value that
//      genuinely does not fit -- a column dragged narrow and then typed or pasted into with
//      something longer than it was ever sized for -- wraps inside its own column instead of
//      overlapping its neighbour.
//
// This asserts, on a network whose junctions carry three long custom properties -- Latitude,
// Longitude, Date installed, exactly the ones Tom named -- plus one junction with a many-decimal X/Y
// (a plain NUMERIC column, not text) -- that EVERY row's value in those columns prints on ONE line,
// at both US Letter and A4, portrait, at Chromium's default margins (defense 1). It then forces one
// value to roughly twice its column's width and asserts it wraps INSIDE its own column rather than
// painting into the next one (defense 2, the pre-reviewer's own reproduction of the overlap).
// Ordinary multi-word text is not this harness's concern (it is free to wrap at its own spaces, on
// screen or on paper, as it always could).
//
// Also asserts R-367 (Tom, 2026-09-27: *"Mixing model prints a different value than appears on-
// screen"*): a choice column's printed word must be the label the on-screen <select> shows, not the
// stored EPANET token underneath it -- see paneCellDisplayText() in js/looped-network.js.
//
// Fixture: dev/lpn-spike/pane-print-long-values.lwn (Net1 plus three custom properties + values on
// every junction, none shorter than 15 characters, none containing a space; junction 10's x/y are
// also set to a many-decimal pair (-122.123456, 37.123456) for the numeric-column check; its one
// tank is set to FIFO mixing for the R-367 check).
//
// **DO NOT PREFIX THIS WITH `flock`.** It launches Chromium itself and takes
// /tmp/engcalcs-browser.lock by re-executing under flock, exactly as
// dev/lpn-spike/pane-heading-wrap-harness.js does; an outer flock on the same file would deadlock.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const fs = require('fs');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_PANE_CELL_WRAP_LOCKED';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error('pane-print-cell-wrap-harness: flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error('pane-print-cell-wrap-harness: NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a wrap failure; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error('pane-print-cell-wrap-harness: no `flock` binary found -- running WITHOUT the browser lock.');
}

const FIXTURE = path.join(__dirname, 'pane-print-long-values.lwn');
// Printable width in CSS px at 96/in, less Chromium's default ~0.4in margin each side -- the same
// two papers dev/browser-pass/specs/print.js measures against.
const PAPERS = [{ name: 'Letter', w: Math.round((8.5 - 0.8) * 96) }, { name: 'A4', w: Math.round((8.27 - 0.8) * 96) }];
// The three columns Tom named, by the custom-property keys the fixture defines them under, plus
// the built-in X/Y (a plain NUMERIC column, key `axis1`/`axis2`) for the "numbers are not exempt"
// case: junction 10's x/y are set to a many-decimal pair in the fixture.
const COLS = ['custom_latitude', 'custom_longitude', 'custom_installed', 'axis1', 'axis2'];

let checks = 0, failures = 0;
function ok(name, cond, extra) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
}

// Runs INSIDE the page, against the built print sheet (#lpn_print_area). For each named column:
// every row's value, and how many distinct LINES its text actually landed on -- by the same
// distinct-top-of-getClientRects() technique dev/lpn-spike/pane-heading-wrap-harness.js uses on
// headings, which is what tells a genuine two-line break from a shorter word beside a longer one.
const CHECK_PRINTED = (cols) => {
	const area = document.getElementById('lpn_print_area');
	const table = area && area.querySelector('table');
	if (!table) { return { error: 'no #lpn_print_area table' }; }
	const idxByClass = {};
	[...table.querySelectorAll('thead th')].forEach((th, i) => {
		cols.forEach((c) => { if (th.classList.contains('lpn-pane-col-' + c)) { idxByClass[c] = i; } });
	});
	const out = {};
	cols.forEach((c) => {
		const i = idxByClass[c];
		out[c] = { found: i !== undefined, rows: [] };
		if (i === undefined) { return; }
		[...table.querySelectorAll('tbody tr')].forEach((tr) => {
			const td = tr.children[i], text = td.textContent.trim();
			if (!text) { return; }
			const r = document.createRange();
			r.selectNodeContents(td);
			const tops = [...new Set([...r.getClientRects()].filter((q) => q.width > 0.5)
				.map((q) => Math.round(q.top)))].sort((a, b) => a - b);
			out[c].rows.push({ text: text, lines: tops.length || 1, clipped: td.scrollWidth > td.clientWidth + 1 });
		});
	});
	return out;
};

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	let chromium;
	try { chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium; }
	catch (err) { console.error('pane-print-cell-wrap-harness: playwright-core is not installed (cd dev/browser-pass && npm install).'); process.exit(1); }
	if (!fs.existsSync(FIXTURE)) { console.error('pane-print-cell-wrap-harness: fixture missing: ' + FIXTURE); process.exit(1); }
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error('pane-print-cell-wrap-harness: no Chromium found (set CHROME_PATH). SKIPPING rather than failing on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	try {
		const a = await Session.open(browser, 'A');
		await a.goto('Looped-Network.php');
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		// **A REAL FILE IMPORT, THE SAME DOOR A READER USES** -- File > Import project reads this
		// exact input (js/looped-network.js, importProjectFromFile()), so this exercises the real
		// path from a picked file to a switched, rendered document rather than poking internals.
		await a.page.setInputFiles('#lpn_project_file', FIXTURE);
		await a.settle(800);
		await a.page.evaluate(() => { const b = document.getElementById('lpn_pane_btn'); if (b) { b.click(); } });
		await a.settle(300);
		await a.page.evaluate(() => { const b = document.getElementById('lpn_pane_tab_junctions'); if (b) { b.click(); } });
		await a.settle(500);
		// **THE COLUMNS EXIST ON SCREEN AND NEVER WRAP THERE** -- the premise of R-366 is that they
		// fit fine on screen, so that premise is checked here rather than assumed.
		const screen = await a.page.evaluate((cols) => {
			const t = document.querySelector('#lpn_pane_junctions table');
			if (!t) { return { error: 'no on-screen junctions table' }; }
			const out = {};
			cols.forEach((c) => {
				const th = t.querySelector('thead th.lpn-pane-col-' + c);
				out[c] = !!th;
			});
			return out;
		}, COLS);
		if (screen.error) { ok('the on-screen Junctions table is present', false, screen.error); }
		else { COLS.forEach((c) => ok('the on-screen table has a ' + c + ' column', screen[c] === true)); }

		await a.page.evaluate(() => { window.print = function () {}; document.getElementById('lpn_pane_print').click(); });
		for (const paper of PAPERS) {
			await a.page.setViewportSize({ width: paper.w, height: 1400 });
			await a.page.emulateMedia({ media: 'print' });
			await a.settle(150);
			const printed = await a.page.evaluate(CHECK_PRINTED, COLS);
			await a.page.emulateMedia({ media: 'screen' });
			if (printed.error) { ok(paper.name + ': the print sheet is readable', false, printed.error); continue; }
			COLS.forEach((c) => {
				const col = printed[c];
				ok(paper.name + ': ' + c + ' column exists on the printed sheet', col.found);
				if (!col.found) { return; }
				ok(paper.name + ': ' + c + ' has values to check', col.rows.length > 0);
				const wrapped = col.rows.filter((r) => r.lines > 1).map((r) => r.text);
				ok(paper.name + ': every ' + c + ' value prints on one line', wrapped.length === 0, wrapped.join(', '));
			});
		}

		// **DEFENSE 2: A VALUE THAT GENUINELY DOES NOT FIT WRAPS, IT DOES NOT OVERLAP THE NEXT
		// COLUMN** -- the pre-reviewer's own reproduction, redone here so it cannot regress silently.
		// Headroom (defense 1, just checked above) covers an honestly-sized value; this forces one
		// roughly twice its column's own width -- past anything headroom is meant to absorb -- and
		// reads back the actual PAINTED extent of its glyphs (Range.getClientRects(), not the cell's
		// own box, which `overflow-wrap: anywhere` can legitimately make taller but never wider than)
		// against the very first pixel of the next real column's own text.
		await a.page.setViewportSize({ width: PAPERS[0].w, height: 1400 });
		await a.page.evaluate(() => { window.print = function () {}; document.getElementById('lpn_pane_print').click(); });
		await a.settle(250);
		await a.page.emulateMedia({ media: 'print' });
		await a.settle(150);
		const overlap = await a.page.evaluate(() => {
			const area = document.getElementById('lpn_print_area');
			const table = area && area.querySelector('table');
			if (!table) { return { error: 'no #lpn_print_area table' }; }
			const heads = [...table.querySelectorAll('thead th')];
			const lonIdx = heads.findIndex((h) => h.classList.contains('lpn-pane-col-custom_longitude'));
			const dateIdx = heads.findIndex((h) => h.classList.contains('lpn-pane-col-custom_installed'));
			if (lonIdx < 0 || dateIdx < 0) { return { error: 'columns not found' }; }
			const row = table.querySelector('tbody tr');
			const lonTd = row.children[lonIdx], dateTd = row.children[dateIdx];
			// Deliberately unbreakable and roughly twice as wide as the column was ever sized for.
			lonTd.textContent = '-122.41941591796987654321000999888777';
			const r = document.createRange();
			r.selectNodeContents(lonTd);
			const glyphRects = [...r.getClientRects()];
			const glyphRight = Math.max(...glyphRects.map((g) => g.right));
			const dateRect = dateTd.getBoundingClientRect();
			return {
				lines: new Set(glyphRects.filter((g) => g.width > 0.5).map((g) => Math.round(g.top))).size,
				overlapsNextColumn: glyphRight > dateRect.left,
				overlapAmountPx: +(glyphRight - dateRect.left).toFixed(1)
			};
		});
		await a.page.emulateMedia({ media: 'screen' });
		if (overlap.error) {
			ok('Letter: the overlong-value probe found its columns', false, overlap.error);
		} else {
			ok('Letter: an overlong value wraps rather than printing on one line', overlap.lines > 1, 'lines=' + overlap.lines);
			ok('Letter: an overlong value does not paint into the next column', !overlap.overlapsNextColumn,
				overlap.overlapAmountPx + 'px');
		}

		// **R-367, the same "print" button, a different disagreement**: a CHOICE column (the Tanks
		// table's Mixing model) used to print the raw stored EPANET word ("FIFO") instead of the
		// label the on-screen <select> actually shows ("FIFO plug flow") -- paneCellText() is
		// correct for a live control's `.value`, but the printed sheet has no `<select>` under it to
		// turn that word back into words a reader typed nothing to decode. The fixture's one tank is
		// set to FIFO for exactly this.
		await a.page.evaluate(() => { const b = document.getElementById('lpn_pane_tab_tanks'); if (b) { b.click(); } });
		await a.settle(500);
		const onScreenMixing = await a.page.evaluate(() => {
			const sel = document.querySelector('#lpn_pane_tanks table tbody select.lpn-pane-col-mixingModel, ' +
				'#lpn_pane_tanks table tbody tr:first-child select');
			return sel ? sel.options[sel.selectedIndex].textContent : null;
		});
		await a.page.evaluate(() => { window.print = function () {}; document.getElementById('lpn_pane_print').click(); });
		await a.page.emulateMedia({ media: 'print' });
		await a.settle(150);
		const printedMixing = await a.page.evaluate(() => {
			const area = document.getElementById('lpn_print_area');
			const t = area && area.querySelector('table');
			const th = t && [...t.querySelectorAll('thead th')].findIndex((h) => h.classList.contains('lpn-pane-col-mixingModel'));
			if (!t || th === undefined || th < 0) { return null; }
			const td = t.querySelector('tbody tr').children[th];
			return td ? td.textContent.trim() : null;
		});
		await a.page.emulateMedia({ media: 'screen' });
		ok('the Tanks table has a Mixing model column on screen', !!onScreenMixing, JSON.stringify(onScreenMixing));
		ok('the Tanks table has a Mixing model column on the printed sheet', !!printedMixing, JSON.stringify(printedMixing));
		ok('the printed Mixing model reads the same label the screen shows',
			!!onScreenMixing && !!printedMixing && onScreenMixing === printedMixing,
			'screen=' + JSON.stringify(onScreenMixing) + ' print=' + JSON.stringify(printedMixing));
		ok('the printed Mixing model is not the bare stored word', printedMixing !== 'FIFO', printedMixing);

		ok('no page error', a.errors.length === 0, a.errors.slice(0, 1).join(''));
		await a.context.close();
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + (checks - failures) + '/' + checks + ' checks passed.');
	process.exit(failures ? 1 : 0);
}

main().catch((err) => { console.error('pane-print-cell-wrap-harness: ' + (err && err.stack || err)); process.exit(1); });
