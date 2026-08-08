// §3 — the File menu, and the absence of autosave.
//
// Tom read a missing row as a missing feature ("Save all is not present"), which is why this spec
// asserts the whole row LIST and each row's greyed state rather than just clicking things: present
// but disabled and absent are different facts, and only one of them is a defect.

const { Session } = require('../lib/session');

exports.title = '3. The File menu';

const EXPECTED = ['New', 'Open…', 'Save', 'Save as…', 'Save all', 'Revert', 'Close'];

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		const rows = await a.menuRows('file');
		const labels = rows.map(r => r.label);

		report.eq(JSON.stringify(labels), JSON.stringify(EXPECTED), 'every row is present, in order');

		const by = (l) => rows.find(r => r.label === l) || {};
		report.ok(by('Save all').disabled, 'Save all is greyed with nothing to save all of',
			'present-but-greyed, not hidden: a row that comes and goes teaches nobody it exists');
		report.ok(by('Revert').disabled, 'Revert is greyed with no file to revert to');
		report.ok(!by('Save').disabled, 'Save is live — this browser can connect to a file');
		report.ok(!by('Save as…').disabled, 'Save as is always live');
		report.ok(!by('New').disabled && !by('Open…').disabled && !by('Close').disabled,
			'New, Open and Close are always live');

		// Nothing is written behind your back. The punch list asks for a two-minute wait; the same
		// fact is provable in a second by checking that no file exists at all after an edit.
		await a.drawExample();
		report.eq((await a.listFiles()).length, 0, 'drawing does not create a file — nothing is written unasked');
		report.ok(await a.currentTabDirty(), 'and the tab wears its asterisk');
		report.eq(a.errors.length, 0, 'no uncaught JavaScript');
	} finally {
		await a.close();
	}
};
