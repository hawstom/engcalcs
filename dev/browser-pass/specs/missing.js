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

		// **This turned out NOT to be a sandbox artefact.** The first version of this spec skipped
		// here, on the reasoning that OPFS recreates a deleted file through its old handle while a
		// real folder throws. Tom's §H4 retest proved otherwise — *"It saves silently"* — because
		// Chrome does the same thing with a real file: `createWritable()` on a handle whose file has
		// been moved RECREATES it at the old path. The write succeeds, the read-back matches, and the
		// user is left editing a file they did not choose while their moved copy goes stale.
		//
		// So the check that catches it is the BASELINE, not the write: we have read this file before,
		// and now it cannot be read, so it is gone.
		const banner = await a.waitBanner(2000);
		report.ok(!!banner, 'Save on a file that has gone says so rather than silently recreating it');
		report.ok(banner && /moved, renamed, or deleted|Could not write/.test(banner.text || ''),
			'and names what probably happened', banner ? (banner.text || '').slice(0, 80) : '');
		report.ok(banner && (banner.buttons || []).includes('Choose the file again'),
			'and offers the way back', banner ? banner.buttons.join(' / ') : '');
		report.ok(await a.currentTabDirty(), 'the tab keeps its asterisk — the work is NOT in a file');
		report.eq(await a.readFile(FILE), null,
			'and it did NOT quietly recreate the file the user moved away');
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

		// The way back out, which is the half of §10 that was never testable before: the banner's
		// button is a picker, and choosing a file must make saving work again.
		await a.sabotageWrites(false);
		await a.queuePick('Relinked-lpn-hawsedc-engcalcs.json');
		await a.bannerClick('Choose the file again');
		await a.settle(500);
		report.ok(!!(await a.readFile('Relinked-lpn-hawsedc-engcalcs.json')),
			'"Choose the file again" picks a file and the save lands there');
		report.ok(await a.banner() === null, 'and the banner clears');
		report.ok(!(await a.currentTabDirty()), 'and the asterisk goes out, honestly this time');

		report.eq(a.errors.length, 0, 'no uncaught JavaScript');
	} finally {
		await a.close();
	}
};
