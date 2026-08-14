// Every calculator in the suite, opened on its own defaults, in both unit presets (Task 292).
//
//   node dev/calc-spike/all-calcs-smoke-harness.js
//
// WHAT THIS IS AND IS NOT. It is NOT a check that any calculator's math is right -- that costs a
// worked example per page and is deliberately being spent only where the value is (mpf_ and mtc_
// have theirs; see mpf-harness.js and mtc-harness.js). It IS a check that every page still RUNS,
// which is a different and much cheaper question with a much worse failure mode:
//
//   * a calculator that THROWS is dead on every keystroke -- the results table simply never
//     updates, and because nothing on the page is red, a visitor reads yesterday's numbers;
//   * a calculator that writes NaN, Infinity or "undefined" into a results cell is worse still,
//     because it produces an answer-shaped thing;
//   * a calculator writing to an id the page no longer has fails the same silent way (calc-page.js
//     throws by name rather than inventing the element).
//
// None of that needs a worked example, a reference or a judgement call -- so it is worth applying
// to ALL of them, and the page list is DERIVED (every page that renders a calculator form) rather
// than typed, so a new calculator is covered the day it ships without anyone remembering to add it.
//
// It also enforces one suite-wide rule from CLAUDE.md that could previously only be checked by
// opening pages by hand: a page's factory defaults must open on a PASSING design -- "a page that
// greets a first-time visitor with a warning is worse than one that greets them with a worked
// example" -- verified by running the page's own pageCalculator against its rendered HTML.
//
// Both presets are exercised because a page's `default` numbers are per-preset ('us' => '18',
// 'si' => '450') and a scalar left on a unit-bearing field is silent: it reads as 6 in under `us`
// and 6 mm under `si`. Rendering in 'es' is how the SI defaults are reached at all -- see the
// units note in calc-page.js.

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { loadCalculator, makeReporter, ROOT } = require('./calc-page.js');

const r = makeReporter('every calculator, on its own defaults');

// Pages with no calculator of their own: the suite's chrome, its endpoints, its reference pages,
// and Looped-Network, which has fifteen harnesses of its own in dev/lpn-spike/.
const NOT_CALCULATORS = new Set([
	'About.php', 'Compare-Languages.php', 'Install.php', 'consent.php', 'contact.php',
	'formmail.php', 'formmailsuccess.php', 'index.php', 'log-calc-event.php',
	'log-human-view.php', 'log-title-event.php', 'log-signal-event.php',
	'lpn-lock.php', 'privacy.php', 'terms.php',
	'Looped-Network.php',
	// A reference table, not a calculator: it has a form but defines no pageCalculator.
	'Orifice-Drain-Time-Ref.php',
	// Not a page at all: it emits the service worker as JavaScript (Task 318). Its own syntax is
	// checked by dev/scripts/sw_manifest_check.php, which parses what it generates.
	'sw.php'
]);

// A page whose results live in DYNAMIC ROWS writes nothing until those rows exist, and building
// them needs a far richer DOM than this file has (createElement into real tables, setAttribute,
// row insertion). That is a real and STATED gap, not an oversight: the four pages below are run
// and checked for throwing and for poison like everyone else, but "it wrote something" is not
// asserted of them. Derived from the JS, not typed, so a new row-table page classifies itself.
const rowTableJs = new Set(
	fs.readdirSync(path.join(ROOT, 'js'))
		// Calculators.lib.js DEFINES addCalcRow and is loaded by every page, so leaving it in
		// classifies all fifteen as row-table pages and quietly turns the assertion off everywhere.
		.filter(f => f.endsWith('.js') && f !== 'Calculators.lib.js')
		.filter(f => /addCalcRow|numCalcRows/.test(fs.readFileSync(path.join(ROOT, 'js', f), 'utf8')))
		.map(f => 'js/' + f)
);

// Pages allowed to open on a caution, per cell, WITH THE REASON -- so an exception is visible and
// revisitable rather than quietly assumed. Anything not listed still fails, a listed page that
// starts warning somewhere ELSE still fails, and a listed cell that STOPS warning fails too, so an
// entry cannot rot here describing something that is no longer true.
//
// EMPTY, and that is the point. It had one entry for a day: Manning Trap Channel opened on a
// ⚠ because its default rock was 6 in = 0.5 ft and the Pemberton & Irons roughness relation is
// calibrated over 0.28-0.36 ft. Tom's answer was to move the default to 4 in (0.333 ft), which is
// mid-window -- so the exception was never needed and is not kept "just in case". Add an entry
// only when a caution is genuinely correct to show a first-time visitor, and say why.
const KNOWN_DEFAULT_WARNINGS = {};

const pages = fs.readdirSync(ROOT)
	.filter(f => f.endsWith('.php') && !NOT_CALCULATORS.has(f))
	.sort();

r.ok(pages.length >= 13, `found ${pages.length} calculator pages to run`, pages.join(' '));

// A results cell may legitimately hold a non-number (a verdict string, a "----" placeholder, the
// name of a chosen method, an SVG sketch). What it may never hold is one of these.
const POISON = /\b(NaN|Infinity|undefined|null)\b/;

for (const page of pages) {
	r.section(page);

	for (const [preset, lang] of [['us', 'en'], ['si', 'es']]) {
		let calc = null;
		try {
			calc = loadCalculator(page, { lang: lang });
			calc.run();
			r.ok(true, `${preset}: pageCalculator runs on the factory defaults`);
		} catch (e) {
			r.ok(false, `${preset}: pageCalculator runs on the factory defaults`, String(e.message).split('\n')[0]);
			continue;
		}

		const outputs = calc.outputs();
		const names = Object.keys(outputs);
		const isRowTable = calc.scripts.some(s => rowTableJs.has(s));
		if (isRowTable) {
			console.log(`  --    ${preset}: row-table page; results live in rows this harness does not build (${names.length} cells written)`);
		} else {
			r.ok(names.length > 0, `${preset}: it writes at least one result`, `${names.length} cells written`);
		}

		const poisoned = names.filter(n => POISON.test(String(outputs[n])));
		r.ok(poisoned.length === 0,
			`${preset}: no result cell holds NaN, Infinity, undefined or null`,
			poisoned.length ? poisoned.map(n => `${n}="${outputs[n]}"`).join('; ') : '');

		// The suite's verdict convention is a leading glyph: ✓ passes, ⚠ cautions. A factory
		// default that opens on ⚠ is the defect CLAUDE.md names.
		const allowed = KNOWN_DEFAULT_WARNINGS[page] || [];
		const warned = names.filter(n => /⚠/.test(String(outputs[n])));
		const unexpected = warned.filter(n => !allowed.includes(n));
		r.ok(unexpected.length === 0,
			`${preset}: the defaults open on a passing design (no unexplained ⚠ verdict)`,
			unexpected.length ? unexpected.map(n => `${n}: ${String(outputs[n]).replace(/<[^>]*>/g, '')}`).join('; ') : '');
		// The exception has to stay earned: if the listed cell stops warning, the entry is stale
		// and should come out rather than sit here forever describing something that is no longer
		// true. That is the failure mode of every allow-list that is only ever added to.
		for (const n of allowed) {
			r.ok(warned.includes(n),
				`${preset}: the known ⚠ on '${n}' is still there (else drop it from the list)`,
				String(outputs[n] || '').replace(/<[^>]*>/g, ''));
		}
	}
}

r.finish();
