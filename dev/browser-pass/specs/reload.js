// §8 — a reload should cost you nothing, and must not cost somebody else their work.
//
// Two things are being checked here and they are easy to confuse. The CONNECTION coming back is
// Task 212 (the handle in IndexedDB). What the connection KNEW coming back is Task 223's fix: the
// freshness stamp used to die with the page, and the reconnect then re-read the file and adopted
// whatever a colleague had written since as our own baseline — so the next Save wrote our older copy
// straight over their work, silently. That second one needs no second profile to prove: a file that
// changed while we were away is a file that changed, whoever changed it.
//
// Caveat, and it is the honest limit of this spec: an OPFS handle always answers `granted`, so this
// exercises the SILENT reconnect, not the dormant-grant revival on first gesture. Whether Chrome
// really returns `prompt` and really revives without a dialog stays on the human list.

const { Session } = require('../lib/session');

exports.title = '8. Reload keeps the file, and keeps what it knew about the file';

const FILE = 'Reload-lpn.json';

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		await a.makeEdit();
		await a.queuePick(FILE);
		await a.menuClick('Save');
		await a.answerTrainingPanel('TGH');
		await a.settle(500);
		report.ok(!!(await a.readFile(FILE)), 'set up: the project is in a file');

		// --- the reload itself ------------------------------------------------
		await a.reload();
		report.ok(await a.banner() === null, 'the reload is silent — no banner at all');
		report.eq(a.errors.length, 0, 'and no uncaught JavaScript');
		const tab = (await a.tabs()).find(t => t.current);
		report.has(tab.title, FILE, 'the tab still knows which file it came from');

		// Save must go back to the ORIGINAL file. The symptom of a dropped handle was Save quietly
		// behaving as Save as, offering a name with "(copy)" in it.
		const callsBefore = (await a.pickerCalls()).length;
		await a.makeEdit();
		await a.menuClick('Save');
		report.eq((await a.pickerCalls()).length, callsBefore, 'Save after a reload opens no picker');
		report.eq((await a.listFiles()).length, 1, 'and writes the original file rather than making a copy');
		const saved = JSON.parse(await a.readFile(FILE));
		report.ok(!!saved.project.docId, 'the file still holds its docId');

		// --- the stamp survived too --------------------------------------------
		// Somebody else saves to the file while we are away, and we come back. Written straight to
		// disk because that is exactly what it looks like from here: bytes that are not the bytes we
		// last saw.
		await a.reload();
		const theirs = JSON.parse(await a.readFile(FILE));
		theirs.project.name = 'Theirs';
		await a.writeFile(FILE, JSON.stringify(theirs, null, '\t'));

		await a.makeEdit();
		await a.menuClick('Save');
		const banner = await a.banner();
		report.ok(!!banner, 'Save refuses when the file moved on while we were away');
		report.has(banner && banner.text, 'saved to this file', 'and the banner says somebody else saved to it');
		report.ok((banner.buttons || []).includes('Save as…'), 'Save as is offered as the way out');
		report.ok((banner.buttons || []).includes('Revert'), 'and so is Revert — the "fine, theirs wins" answer');
		const onDisk = JSON.parse(await a.readFile(FILE));
		report.eq(onDisk.project.name, 'Theirs', 'their file is untouched: the refusal is real, not cosmetic');

		// The same must hold with the broker unreachable. This is the check Tom reported failing
		// three times, and the reason it is the guarantee rather than the lock.
		await a.blockBroker();
		await a.bannerClick('Hide this message');
		await a.makeEdit();
		await a.menuClick('Save');
		const offline = await a.banner();
		report.ok(!!offline && offline.text.indexOf('saved to this file') >= 0,
			'and refuses the same way with the lock broker unreachable');
		report.eq(JSON.parse(await a.readFile(FILE)).project.name, 'Theirs', 'their file is STILL untouched');
		await a.unblockBroker();
	} finally {
		await a.close();
	}
};
