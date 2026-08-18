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

		// **THE FIRST PROJECT ARRIVES WEARING AN ASTERISK, AND SHOULD NOT.** Not asserted here,
		// because it is a defect in the page rather than in this spec and a knowingly-red check
		// trains people to ignore red — but it is written down here because it makes every
		// "the tab is dirty after an edit" check in this suite unfalsifiable on a first-visit
		// project, and two of them were exactly that until Task 414.
		//
		// Measured: `lpn_index` is written at boot with a `savedSig` and no `dirty`, and within
		// ~200ms, with no user action at all, the first autosave finds a different signature and
		// sets `dirty: true` for good. boot() stamps the baseline inline (js/looped-network.js,
		// "AND IT IS BORN CLEAN") and THEN runs seedDefaultInputs(), which fills settings.defaults —
		// which docSignature() covers. It is Tom's 2026-08-15 "the initial project gets an
		// unwarranted asterisk" with the stamp moved but still too early.
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
