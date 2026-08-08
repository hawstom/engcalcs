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
