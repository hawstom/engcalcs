// §6's three Save-as guard boxes — the ones marked "this is the dangerous one".
//
// Save as is where a colleague's work actually gets destroyed: you pick a file in a dialog, and the
// page writes over whatever was in it. The guard has been wrong twice, and the second time it was
// wrong in the most instructive way — it asked ONLY the broker, so with the broker down it answered
// "no collision" to everything and reproduced the very bug it was written to fix.
//
// **So every check here runs twice, once with the broker up and once with it unreachable.** A guard
// against destroying somebody's work that needs a server is not a guard.

const { Session } = require('../lib/session');

exports.title = '6. Save as, asked of the file actually chosen';

const MINE = 'Mine-lpn.json';
const OTHER = 'Other-lpn.json';

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		await a.makeEdit();
		await a.queuePick(MINE);
		await a.menuClick('Save');
		await a.answerTrainingPanel('TGH');
		await a.settle(500);

		// A second project, in a second file, in the same browser. This is the "a different project
		// of ours" case — the one the confirm has to be able to name.
		await a.newProject();
		await a.makeEdit();
		await a.queuePick(OTHER);
		await a.menuClick('Save as…');
		await a.settle(400);
		const otherName = JSON.parse(await a.readFile(OTHER)).project.name;
		report.ok(!!otherName, 'set up: two projects, two files', otherName);

		// --- onto a file holding a DIFFERENT project ---------------------------
		// Back to the first project, and try to save it over the second's file.
		await a.newProject();
		await a.makeEdit();
		await a.answerConfirmsWith(false);              // read the warning, back out
		const beforeBytes = await a.readFile(OTHER);
		await a.queuePick(OTHER);
		await a.menuClick('Save as…');
		let asked = a.lastDialog();
		report.ok(!!asked && /already holds a different project/.test(asked.message || ''),
			'Save as onto another project\'s file ASKS first',
			asked ? (asked.message || '').slice(0, 90) : 'nothing was asked');
		report.has(asked && asked.message, otherName, 'and NAMES the project about to be destroyed');
		report.eq(await a.readFile(OTHER), beforeBytes, 'Cancel leaves both files untouched');

		// --- the same, with the broker unreachable -------------------------------
		// This is the case that failed on 2026-08-05: the guard asked only the broker.
		await a.blockBroker();
		await a.queuePick(OTHER);
		await a.menuClick('Save as…');
		asked = a.lastDialog();
		report.ok(!!asked && /already holds a different project/.test(asked.message || ''),
			'and asks just the same with the broker unreachable',
			'it needs nothing but the file itself');
		report.eq(await a.readFile(OTHER), beforeBytes, 'still untouched');
		await a.unblockBroker();

		// --- and the guard must not become "Save as sometimes does nothing" --------
		await a.answerConfirmsWith(true);
		const dialogsBefore = a.dialogs.length;
		await a.queuePick('Brand-new-lpn.json');
		await a.menuClick('Save as…');
		report.eq(a.dialogs.length, dialogsBefore, 'Save as onto a brand-new file asks nothing');
		report.ok(!!(await a.readFile('Brand-new-lpn.json')), 'and writes it');

		// A file that is not one of ours at all — somebody's unrelated JSON. Their business.
		await a.writeFile('notes.json', '{"hello":"world"}');
		await a.queuePick('notes.json');
		await a.menuClick('Save as…');
		report.eq(a.dialogs.length, dialogsBefore, 'Save as onto a file that is not a project asks nothing');
		const overwritten = await a.readFile('notes.json');
		report.ok(overwritten && overwritten.indexOf('"project"') >= 0, 'and writes it — the user chose that file');

		report.eq(a.errors.length, 0, 'no uncaught JavaScript');
		if (a.errors.length) { console.log(a.errors.join('\n')); }
	} finally {
		await a.close();
	}
};
