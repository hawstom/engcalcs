// §3 — the File menu, and the absence of autosave.
//
// Tom read a missing row as a missing feature ("Save all is not present"), which is why this spec
// asserts the whole row LIST and each row's greyed state rather than just clicking things: present
// but disabled and absent are different facts, and only one of them is a defect.

const { Session } = require('../lib/session');

exports.title = '3. The File menu';

// The list as it stands after Task 264 (New project… became a fly-out of templates), Task 314
// (Open example… joined it, under Open rather than under New) and Task 145 (the placement tool sits
// beside Import, because both are conversions). Recent files are absent because there are none yet;
// that row group appears only when a file has been opened.
const EXPECTED = ['New project…', 'Open…', 'Open example…', 'Import EPANET file…',
	'Convert to lat/lon…', 'Export EPANET file…',
	'Save', 'Save as…', 'Save all', 'Revert', 'Close'];

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
		report.ok(!by('New project…').disabled && !by('Open…').disabled && !by('Close').disabled,
			'New, Open and Close are always live');
		report.ok(by('New project…').submenu, 'New project… leads to a fly-out of templates, not straight to a blank one',
			'Task 264: the row that used to make a project on the spot now offers the ways of starting one');

		// **HELP > "WHAT THE TOOLBAR ICONS MEAN" ACTUALLY OPENS SOMETHING** (Tom, 2026-08-18: it
		// "does nothing"). It called openMenu() at level 0 on the Help button — the anchor the menu
		// it was clicked in was already open on — so the same-anchor toggle branch fired and closed
		// the menu instead of listing anything. A browser check because the bug was invisible to
		// every static one: the row existed, its handler existed, and the handler ran.
		const help = await a.menuRows('help');
		const iconsRow = help.find(r => /icon/i.test(r.label));
		report.ok(!!iconsRow, 'Help carries the toolbar-icon guide', help.map(r => r.label).join(' | '));
		report.ok(iconsRow && iconsRow.submenu, '...as a fly-out row, which is what makes it openable');
		await a.openMenu('help');
		await a.page.evaluate(() => {
			const row = [...document.querySelectorAll('#lpn_menu_list button.lpn-menu-row')]
				.find(b => /icon/i.test(b.textContent));
			if (row) { row.click(); }
		});
		await a.settle(400);
		const guide = await a.page.evaluate(() => ({
			open: document.getElementById('lpn_menu_popup2').style.display === 'block',
			rows: document.querySelectorAll('#lpn_menu_list2 button.lpn-menu-row').length,
			parentStillOpen: document.getElementById('lpn_menu_popup').style.display === 'block'
		}));
		report.ok(guide.open, 'clicking it opens the guide instead of closing the menu');
		report.ok(guide.rows >= 8, '...with one row per toolbar button, derived from the strip itself',
			String(guide.rows));
		report.ok(guide.parentStillOpen, '...beside the Help menu, which stays up as a fly-out should');
		await a.closeMenu();

		// Nothing is written behind your back. The punch list asks for a two-minute wait; the same
		// fact is provable in a second by checking that no file exists at all after an edit.
		await a.makeEdit();
		report.eq((await a.listFiles()).length, 0, 'drawing does not create a file — nothing is written unasked');
		// **NOT "the tab wears its asterisk"**, which is what this line used to say and could not fail:
		// a first visit's project arrives dirty before anything is edited (see specs/boot.js), so an
		// asterisk after an edit proves nothing here. What IS falsifiable is WHICH asterisk: faint
		// means "this lives only in the browser", full strength means "changes the file does not have",
		// and this project is in no file at all.
		const star = await a.currentTabStar();
		report.ok(star && star.faded, 'and the asterisk it wears is the faint, browser-only one',
			JSON.stringify(star));
		report.eq(a.errors.length, 0, 'no uncaught JavaScript');
	} finally {
		await a.close();
	}
};
