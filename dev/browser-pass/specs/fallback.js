// §11 — Firefox, Safari, and any `http://` URL: the browser cannot connect to a file at all.
//
// **Reproduced by deleting `showSaveFilePicker`, which is exactly what those browsers do**: the page
// asks `typeof window.showSaveFilePicker === 'function'` and nothing else, so a Chromium with that
// one property removed takes precisely the same branch. What this does NOT reproduce is those
// browsers' own rendering, which is the lower risk and stays on the human list.

const { Session } = require('../lib/session');
const { pageUrl } = require('../lib/env');

exports.title = '11. The fallback path — a browser with no File System Access API';

exports.run = async function ({ browser, report }) {
	// Same window size as Session.open() gives every other profile, and for the same reason: the
	// consent banner is fixed to the bottom of the window and a short one puts it over the map.
	const context = await browser.newContext({ acceptDownloads: true, viewport: Session.VIEWPORT });
	// Before any page script runs, so the page has never seen the API. Deleting it later would leave
	// whatever the page had already decided about itself.
	await context.addInitScript(() => {
		delete window.showSaveFilePicker;
		delete window.showOpenFilePicker;
	});
	const page = await context.newPage();
	const a = new Session(context, page, 'F');
	page.on('pageerror', (e) => a.errors.push(String(e.stack || e)));
	page.on('dialog', async (d) => { a.dialogs.push({ type: d.type(), message: d.message() }); await d.accept(); });

	try {
		await page.goto(pageUrl(), { waitUntil: 'load' });
		await a.settle();
		report.eq(await page.evaluate(() => typeof window.showSaveFilePicker), 'undefined',
			'set up: this browser has no File System Access API');

		const rows = await a.menuRows('file');
		const by = (l) => rows.find(r => r.label === l) || {};
		report.ok(by('Save').disabled, 'Save is DISABLED — there is no file for it to write to',
			'a Save that quietly produced a download would be the command doing something other than its name');
		report.ok(!by('Save as…').disabled, 'Save as… is enabled — it is the only way out, so it must be');

		await a.makeEdit();
		// The faint asterisk, not merely "an" asterisk: a first visit's project arrives dirty before
		// anything is edited (see specs/boot.js), so "it wears one after an edit" cannot fail here.
		// Which one it wears can: faint means the work lives only in the browser.
		const star = await a.currentTabStar();
		report.ok(star && star.faded, 'an edited project wears the faint, browser-only asterisk', JSON.stringify(star));

		// Save as here is a download. The page cannot write back to it, and says so — but the work IS
		// in a file the user now has, and that is the fact the asterisk was refusing to admit
		// (punch-list finding 13, reported twice).
		const dl = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
		await a.menuClick('Save as…');
		const download = await dl;
		report.ok(!!download, 'Save as… downloads a file',
			download ? download.suggestedFilename() : 'no download fired');
		report.ok(!(await a.currentTabDirty()),
			'and the asterisk CLEARS — the work is in a copy the user has',
			'finding 13: it used to stay lit forever, because a fallback project can never be a "file project"');

		await a.makeEdit();
		report.ok(await a.currentTabDirty(), 'a further edit lights it again — it tracks changes, it is not just switched off');

		report.ok(await a.banner() === null, 'no lock banner ever appears on this path');
		report.eq(a.errors.length, 0, 'no uncaught JavaScript');
		if (a.errors.length) { console.log(a.errors.join('\n')); }
	} finally {
		await context.close();
	}
};
