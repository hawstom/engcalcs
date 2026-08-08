// §10 — the file goes missing.
//
// Tom's finding: *"No. There's an asterisk, but no complaints. Saving is silent and recreates the
// original name."* Recreating a file somebody moved is not a save, it is a second copy in a place
// they did not choose, and the page said nothing about it.
//
// **This spec asserts what the page DOES, and prints it either way**, because the honest answer here
// depends on the filesystem: a handle to a deleted file may throw on write (which the page reports)
// or silently recreate it (which it cannot detect). Knowing which is which is the point — a check
// that just says FAIL without saying what happened would send the next person back to the browser.

const { Session } = require('../lib/session');

exports.title = '10. The file goes missing under us';

const FILE = 'Missing-lpn-hawsedc-engcalcs.json';

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		await a.drawExample();
		await a.queuePick(FILE);
		await a.menuClick('Save');
		await a.answerTrainingPanel('TGH');
		await a.settle(500);
		report.ok(!!(await a.readFile(FILE)), 'set up: the project is in a file');

		// Somebody moves or deletes it in Explorer.
		await a.removeFile(FILE);
		report.eq(await a.readFile(FILE), null, 'the file is gone');

		await a.drawExample();
		await a.menuClick('Save');
		await a.settle(400);

		const banner = await a.banner();
		const recreated = await a.readFile(FILE) !== null;
		if (recreated) {
			// **OPFS recreates the file through the old handle**, so the write SUCCEEDS and the page
			// has nothing to report — correctly. A real folder does not behave this way: Chrome's
			// handle to a deleted file throws NotFoundError, which is the branch that raises the
			// banner. This environment therefore cannot produce §10's condition at all, and saying
			// FAIL here would be blaming the page for the sandbox.
			report.skip('Save on a missing file warns and offers "Choose the file again"',
				'OPFS silently recreates a deleted file, so the failure this tests cannot happen here — stays a human check');
			report.ok(!(await a.currentTabDirty()),
				'the write really did land, so the asterisk clearing is honest here');
		} else {
			report.ok(!!banner, 'Save on a missing file says something rather than nothing');
			report.ok(banner && (banner.buttons || []).includes('Choose the file again'),
				'and offers the way back', banner ? banner.buttons.join(' / ') : '');
			report.ok(await a.currentTabDirty(), 'the tab still wears its asterisk — the work is NOT in a file');
		}
		// --- the write that goes nowhere ---------------------------------------
		// The real §10 failure, reproduced the only way OPFS allows: a handle whose writes are
		// discarded. This is Tom's 2026-08-06 report — "It neither complains nor creates a new file.
		// It silently fails to save." — and the page must now catch it by READING THE FILE BACK,
		// because everything up to and including close() can resolve without a byte landing.
		await a.sabotageWrites(true);
		await a.queuePick('Sabotaged-lpn-hawsedc-engcalcs.json');
		await a.menuClick('Save as…');
		await a.settle(400);

		const b2 = await a.waitBanner(2000);
		report.ok(!!b2, 'a write that goes nowhere is NOT reported as a save');
		report.ok(b2 && /moved, renamed, or deleted|Could not write/.test(b2.text || ''),
			'and says the file could not be written', b2 ? (b2.text || '').slice(0, 90) : '');
		report.ok(b2 && (b2.buttons || []).includes('Choose the file again'), 'and offers the way back');
		report.ok(await a.currentTabDirty(), 'the tab keeps its asterisk — the work is NOT in a file');
		await a.sabotageWrites(false);

		report.eq(a.errors.length, 0, 'no uncaught JavaScript');
	} finally {
		await a.close();
	}
};
