// §1 and §5 — the first save, and what "open" means.
//
// The one thing here that is NOT the real thing is the picker itself: the training panel exists
// because `showSaveFilePicker()` needs a live user activation, and a stub needs none. So this spec
// proves the panel appears, that it gates the picker, and that the picker is reached — but whether
// Chrome's transient activation survives the panel is still a human check. Everything after the
// picker returns is production code over a real file handle.

const { Session } = require('../lib/session');

exports.title = '1 & 5. First save, save again, save as, and opening';

// The suffix is `-lpn`, four characters, since Task 315 — the 30-character `-lpn-hawsedc-engcalcs`
// it used to be is still READ (projectNameFromFileName) but is never written again. FILE1 is spelt
// the way the page itself would suggest it, because the check below is that it does.
const FILE1 = 'Project1-lpn.json';
const FILE2 = 'Second-lpn.json';

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		await a.makeEdit();

		// --- the training panel ---------------------------------------------
		await a.menuClick('Save');
		const panel = await a.dialog();
		report.ok(!!panel, 'File → Save on a fresh profile shows the training panel first');
		report.eq((await a.pickerCalls()).length, 0, 'and NO file dialog until Continue is pressed');
		report.has(panel && panel.text, 'initials', 'the panel asks for initials colleagues will know');
		report.ok((panel.buttons || []).includes('Continue'), 'and offers Continue');

		// **ENTER IN THE INITIALS BOX IS CONTINUE** (Tom, 2026-08-19: "After entering initials, can
		// the [Enter] key close the box?"). Answered with the KEY rather than the button, so the
		// whole save that follows is proof the key reaches the same handler -- a check that only
		// asserted the panel closed would pass on a key that closed it and did nothing else.
		await a.queuePick(FILE1);
		await a.page.focus('#lpn_dialog input[type="text"]');
		await a.page.keyboard.type('TGH');
		await a.page.keyboard.press('Enter');
		await a.settle(400);
		report.ok(!(await a.dialog()), 'Enter in the initials box is Continue — the panel closes');
		report.ok((await a.pickerCalls()).length > 0, '...and goes on to the picker, not just away');
		await a.settle(500);

		const calls = await a.pickerCalls();
		report.eq(calls.length, 1, 'Continue reaches the file dialog');
		report.eq(calls[0] && calls[0].suggestedName, FILE1, 'suggested name is <project>-lpn.json');

		const text1 = await a.readFile(FILE1);
		report.ok(!!text1, 'the file exists on disk');
		let doc = JSON.parse(text1 || '{}');
		report.ok(/^d[A-Za-z0-9]{8,48}$/.test((doc.project || {}).docId || ''),
			'docId exists on the VERY FIRST save and starts with d', (doc.project || {}).docId);
		report.has(text1, '\n\t', 'the file is indented, so it can be read in an editor');
		report.ok(!(await a.currentTabDirty()), 'the asterisk clears once the file holds the work');

		// --- save again ------------------------------------------------------
		const before = await a.statFile(FILE1);
		await a.page.waitForTimeout(1100);   // filesystem timestamps are second-grained
		await a.makeEdit();               // something new to save
		await a.menuClick('Save');
		report.eq((await a.pickerCalls()).length, 1, 'Save again asks nothing — no panel, no dialog, no second file');
		const after = await a.statFile(FILE1);
		report.ok(after.lastModified > before.lastModified, 'and the file on disk actually advanced');
		report.eq((await a.listFiles()).length, 1, 'still exactly one file');

		// --- save as ---------------------------------------------------------
		const contentBefore = await a.readFile(FILE1);
		await a.queuePick(FILE2);
		await a.menuClick('Save as…');
		report.eq((await a.listFiles()).length, 2, 'Save as makes a second file');
		report.eq(await a.readFile(FILE1), contentBefore, 'and leaves the original exactly as it was');
		const doc2 = JSON.parse(await a.readFile(FILE2));
		report.ok(doc2.project.docId !== doc.project.docId,
			'the copy gets its own docId — a copy must not inherit the original\'s lock identity');
		report.has((await a.tabs()).find(t => t.current).title, FILE2, 'the tab now follows the new file');

		// --- opening a file this browser already has open ---------------------
		const tabsBefore = (await a.tabs()).length;
		await a.queuePick(FILE2);
		await a.menuClick('Open…');
		report.eq((await a.tabs()).length, tabsBefore, 'opening a file already open adds NO second tab');
		// **THE NOTICE BOX, NOT THE STATUS LINE.** This read `status()` and failed for years, and
		// ROADMAP Task 421 was written up from that failure as "a notice the user needs is overwritten
		// by the next solve diagnostic". It is not overwritten: `openFileAlreadyOpen()` calls
		// setNotice(), which writes #lpn_map_notice — the transient box over the map — and the solve
		// diagnostic in #lpn_status never touched it. The spec was reading the wrong element, which
		// is the confusion the helper comment above notice() warns about.
		report.has(await a.notice(), 'already open', 'and says why');

		// --- opening a genuinely different file --------------------------------
		await a.queuePick(FILE1);
		await a.menuClick('Open…');
		report.eq((await a.tabs()).length, tabsBefore + 1, 'a different file DOES open as its own tab');
		report.ok((await a.tabs()).find(t => t.current).title.indexOf(FILE1) >= 0, 'and it is the tab you land on');

		report.eq(a.errors.length, 0, 'no uncaught JavaScript');
		if (a.errors.length) { console.log(a.errors.join('\n')); }
	} finally {
		await a.close();
	}
};
