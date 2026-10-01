// points_data Copy -> Paste round trip, on every calculator that has the buttons (ROADMAP,
// Tom 2026-09-30: "If I use Copy on the defaults... But if I immediately use Paste, all n values
// are blanked out.").
//
//   node dev/browser-pass/points-data-roundtrip.js
//
// WHY A REAL BROWSER, NOT dev/calc-spike/. Copy and Paste are entirely a COOKIE-LAYER defect --
// EngCalcs.pointsDataCopy/pointsDataPaste (js/Calculators.lib.js) call cookieValueToDataString /
// dataStringToCookieValue (js/Cookies.lib.js), which round-trip through document.cookie and then
// EngCalcs.cookieToForm(), which walks a real <form> element IN DOCUMENT ORDER. dev/calc-spike's
// scaffolding (calc-page.js) is explicit that its `form` is "a bag of named controls" with no real
// getElementsByTagName/document-order semantics -- that is why mi-harness.js cannot call initRows()
// either and dev/browser-pass/mi-defaults.js exists as the real-DOM alternative for that page. This
// file is that same alternative for the Copy/Paste mechanism, and it runs on every points_data page
// (Manning-Irregular, Weir-Flow-Irregular, Branched-Network, Irrigation-Pressure), not just mi.
//
// THE ROOT CAUSE, so the assertions below make sense. dataStringToCookieValue() used to leave the
// cookie it wrote with NO leading "v<N>" format-version token. Manning-Irregular is the one
// points_data page with its own cookieFormatVersion (2) and migrateCookie() (the "n"/"is_bank"
// columns were reordered, ROADMAP). The very next readCookie() found no version token, treated the
// freshly-pasted cookie as legacy v1, and silently ran migrateCookie() on a cookie that was never
// in the old layout -- swapping "is_bank" and "n" on every row. A number input assigned a "true"/
// "false" string discards it and renders blank, which is exactly the symptom reported. Two
// Copy->Paste round trips in a row "survived" because the false migration ran twice and swapped the
// pair back -- a fix that merely makes the swap involutive (symmetric) would still pass a
// double-trip-only check, which is why this file asserts the SINGLE trip is the identity, not just
// the double one.
//
// wi/bpn/ip have no cookieFormatVersion override and no migrateCookie(), so nothing here should ever
// be able to reorder their rows -- they are included to prove that and to guard against the same
// defect being reintroduced there.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later

const { REPO, startServer, stopServer, launchBrowser } = require('./lib/env');

// needsPrime: mi's own pageCalculatorInitialize() seeds the cookie itself (js/manning-irregular.js),
// so a fresh visitor's very first Copy already has one to read -- which is exactly the sequence
// Tom's report was about, and priming it here would paper over a stamp that only the REAL first
// Copy sees. wi/bpn/ip build their sample rows directly (pageAddCalcRow()) with no cookie at all
// until some edit writes one, so priming them models the state Copy is actually used from.
const PAGES = [
	{ file: 'Manning-Irregular.php', label: 'mi', blankCheckField: 'n', needsPrime: false },
	{ file: 'Weir-Flow-Irregular.php', label: 'wi', blankCheckField: null, needsPrime: true },
	{ file: 'Branched-Network.php', label: 'bpn', blankCheckField: 'bpn_l', needsPrime: true },
	{ file: 'Irrigation-Pressure.php', label: 'ip', blankCheckField: 'l', needsPrime: true },
];

let checks = 0, failures = 0;
function ok(cond, label, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log(`${cond ? '  ok  ' : ' FAIL '} ${label}${detail ? '   ' + detail : ''}`);
}

// Mutates exactly one numeric-looking field in the second data line (the first "other" row), so
// the "edited data set" case exercises the same mechanism against real, non-default numbers without
// this file having to restate any page's column layout (station/elevation/is_bank/n here,
// station/elevation there, seven bpn_ columns on another page, and so on -- exactly the
// dev/calc-spike/README rule about not building a second copy of the form that can drift).
function mutateOneField(text) {
	const lines = text.split('\n');
	if (lines.length < 2) { return text; }
	const fields = lines[1].split(',');
	for (let i = 0; i < fields.length; i += 1) {
		const trimmed = fields[i].trim();
		const n = parseFloat(trimmed);
		if (isFinite(n) && String(n) === trimmed) {
			fields[i] = String(n + 1);
			break;
		}
	}
	lines[1] = fields.join(',');
	return lines.join('\n');
}

async function pointsDataValue(page) {
	return page.$eval('#points_data', (el) => el.value);
}
async function setPointsDataValue(page, text) {
	await page.$eval('#points_data', (el, v) => { el.value = v; }, text);
}
async function clickCopy(page) {
	await page.click('#points_data_copy');
}
async function clickPaste(page) {
	await page.click('#points_data_paste');
	// pointsDataPaste() -> readCookieAndCalc() is synchronous JS; the only asynchrony is Chromium's
	// own event dispatch, which a zero-length wait settles without inventing a fixed sleep budget.
	await page.waitForTimeout(0);
}
async function blankFieldCount(page, name) {
	return page.$$eval('[name]', (els, n) => {
		return Array.from(document.getElementsByName(n)).filter((el) => el.value === '').length;
	}, name);
}

async function probe(browser, origin, spec) {
	const context = await browser.newContext();
	const errors = [];
	const page = await context.newPage();
	page.on('pageerror', (e) => errors.push(String(e)));
	await page.goto(`${origin}/engcalcs/${spec.file}?ec_nolog=1`, { waitUntil: 'load' });
	await page.waitForSelector('#points_data_copy');
	// The seed's own rows are built by pageCalculatorInitialize() off the DOMContentLoaded
	// listener, which can still be pending the instant the button exists; Copy before it has run
	// reads an empty this.cookieValue and returns "".
	await page.waitForFunction(() => window.EngCalcs && EngCalcs.numCalcRows > 0, null, { timeout: 5000 });

	console.log(`\n--- ${spec.label} (${spec.file}) ---`);
	ok(errors.length === 0, `${spec.label}: no uncaught JavaScript on load`, errors.join(' | '));

	// wi/bpn/ip build their seed rows directly (pageAddCalcRow()) rather than through the cookie
	// the way mi's pageCalculatorInitialize() does, so a brand-new visitor who has never triggered
	// an edit has no cookie yet and Copy legitimately has nothing to read -- a separate, real
	// quirk this file is not about. EngCalcs.submitForm() is what any edit's onchange/onkeyup
	// already calls (js/Calculators.lib.js calcAndSave -> formToCookie), so this puts the page in
	// the state Copy is actually used from, without this file inventing its own click/keystroke.
	if (spec.needsPrime) { await page.evaluate(() => EngCalcs.submitForm()); }

	// 1. Copy the shipped defaults.
	await clickCopy(page);
	const text0 = await pointsDataValue(page);
	ok(!!text0, `${spec.label}: Copy on the defaults produced text`, JSON.stringify(text0).slice(0, 80));

	// 2. A SINGLE Copy -> Paste round trip must be the identity.
	await clickPaste(page);
	if (spec.blankCheckField) {
		const blanks = await blankFieldCount(page, spec.blankCheckField);
		ok(blanks === 0, `${spec.label}: single Paste leaves no '${spec.blankCheckField}' cell blank`, `${blanks} blank`);
	}
	await clickCopy(page);
	const text1 = await pointsDataValue(page);
	ok(text1 === text0, `${spec.label}: single Copy->Paste round trip is the identity`,
		text1 === text0 ? '' : `before ${JSON.stringify(text0)}\n         after  ${JSON.stringify(text1)}`);

	// 3. A SECOND round trip must ALSO be the identity -- not just equal to the first trip's
	// (possibly already-wrong) result, which is the "symmetric but not fixed" failure mode Tom's
	// report described (two trips "survived" because a false migration undid itself).
	await clickPaste(page);
	await clickCopy(page);
	const text2 = await pointsDataValue(page);
	ok(text2 === text0, `${spec.label}: double Copy->Paste round trip is also the identity`,
		text2 === text0 ? '' : `want ${JSON.stringify(text0)}\n         got  ${JSON.stringify(text2)}`);

	// 4. The same two checks again, against an edited data set rather than the shipped defaults.
	const edited = mutateOneField(text0);
	ok(edited !== text0, `${spec.label}: the edited data set actually differs from the defaults`, edited);
	await setPointsDataValue(page, edited);
	await clickPaste(page);
	await clickCopy(page);
	const edited1 = await pointsDataValue(page);
	ok(edited1 === edited, `${spec.label}: single round trip of an edited data set is the identity`,
		edited1 === edited ? '' : `before ${JSON.stringify(edited)}\n         after  ${JSON.stringify(edited1)}`);

	await clickPaste(page);
	await clickCopy(page);
	const edited2 = await pointsDataValue(page);
	ok(edited2 === edited, `${spec.label}: double round trip of an edited data set is also the identity`,
		edited2 === edited ? '' : `want ${JSON.stringify(edited)}\n         got  ${JSON.stringify(edited2)}`);

	await context.close();
}

(async function main() {
	let playwright;
	try { playwright = require('playwright-core'); }
	catch (err) {
		console.error('playwright-core is not installed. From dev/browser-pass:  npm install');
		process.exit(2);
	}
	const server = await startServer();
	const origin = server.origin;
	const browser = await launchBrowser(playwright, { secureContext: false });
	console.log(`=== points_data Copy->Paste round trip (${REPO}) === ${origin}`);
	try {
		for (const spec of PAGES) {
			await probe(browser, origin, spec);
		}
	} catch (err) {
		failures++;
		console.log(`\n FAIL  threw\n${err && err.stack ? err.stack : err}`);
	} finally {
		await browser.close();
		stopServer();
	}
	console.log(`\n${checks - failures}/${checks} checks passed.\n`);
	process.exit(failures ? 1 : 0);
}());
