// §0 — does the page come up clean, on a profile that has never seen it?
//
// This spec exists because of what it found the first time it was run: `pageCalculatorInitialize`
// was missing, so `readCookieAndCalc()` threw on any profile with no cookie — every first-time
// visitor — and took `loadFromUrl()` and the first `pageCalculator()` down with it. Tom's own
// browser has had that cookie for weeks, which is precisely why no amount of manual testing would
// ever have found it. A fresh context every run is the whole point.

const { Session } = require('../lib/session');

exports.title = '0. A first visit, with no cookie and no stored projects';

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();

		report.eq(a.errors.length, 0, 'no uncaught JavaScript on first load');
		if (a.errors.length) { console.log(a.errors.join('\n')); }

		const env = await a.page.evaluate(() => ({
			secure: window.isSecureContext,
			api: typeof window.showSaveFilePicker,
			idb: !!window.indexedDB
		}));
		report.ok(env.secure, 'the page is in a secure context', 'without this every file feature degrades to the download fallback');
		report.eq(env.api, 'function', 'the File System Access API is present');
		report.ok(env.idb, 'IndexedDB is available for Task 212 handles');

		const tabs = await a.tabs();
		report.eq(tabs.length, 1, 'a first visit opens exactly one project');
		report.ok(tabs[0].current, 'and it is the current tab');
		report.has(tabs[0].title, 'Not saved to a file', 'a project with no file says so');

		// **THE FIRST PROJECT ARRIVES CLEAN** (Task 418). It did not: `lpn_index` was written at
		// boot with a `savedSig`, and with no user action at all the first autosave found a
		// different signature and set `dirty: true` for good.
		//
		// **THIS ASSERTION HAS NEVER BEEN RUN IN A BROWSER.** It was written alongside a first fix
		// — the baseline was stamped before seedDefaultInputs() filled settings.defaults, and moved
		// after it — and Tom still saw the asterisk afterwards. The second cause was the CANVAS
		// SIZE: docSignature() includes `view`, currentView() answers null until applyMapHeight()
		// gives the canvas a height on `window load`, so the baseline described a viewless document
		// and the next autosave called the arriving view an edit. Fixed in noteMapSized() and
		// saveToStorage(); covered headlessly by dev/lpn-spike/boot-clean-harness.js, which fails
		// 4 of 13 checks without it. What this spec adds over that harness is a REAL layout, which
		// is the quantity the harness has to model rather than measure.
		//
		// **ASSERTED AFTER A SETTLE, because the defect needed one.** At the moment of the first
		// paint the tab was clean either way; it was the autosave a fifth of a second later that
		// put the asterisk on. A check made before that would have gone green over the bug.
		await a.settle();
		const first = (await a.tabs())[0];
		report.ok(!first.star,
			'the first project of a first visit wears no asterisk',
			'a star here means the page dirtied a document nobody has touched (Task 418)');
		report.ok(await a.banner() === null, 'no banner on a clean first load',
			'a page that greets a first-time visitor with a warning is worse than one that greets them with a worked example');

		// A reload of a project that was never a file must be just as quiet: the needs-reopen banner
		// is for FILE projects, and firing it here would be the Task 212 banner crying wolf.
		await a.reload();
		report.eq(a.errors.length, 0, 'no uncaught JavaScript on reload either');
		report.ok(await a.banner() === null, 'a browser-only project reloads with nothing said');
		report.eq((await a.tabs()).length, 1, 'and the project is still there after the reload');
	} finally {
		await a.close();
	}
};
