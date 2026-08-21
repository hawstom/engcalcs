// §35 — the Project menu (ROADMAP Task 467).
//
// Tom, 2026-08-20: *"Maybe we can have a Project menu with Settings, Library, and Report under it?"*
//
// Two of its three rows are second doors to boxes that already have toolbar buttons, and those are
// cheap to check. **The third is the reason the menu exists**, and it is the one that can rot
// silently: EPANET's own run report is written into the run box, and the run box appears only for a
// run somebody pressed Calculate for — so on a network that re-runs itself after a quiet moment the
// report was produced and then unreachable. js/lpn-time.js keeps the last one either way now, and
// this row is its door.
//
// The report row is asserted to be PRESENT AND ENABLED even with nothing to show, and to explain
// itself instead of opening an empty box. A row that disappears when there is nothing to report
// teaches nobody that the report exists.

const { Session } = require('../lib/session');

exports.title = '35. The Project menu';

const EXPECTED = ['Settings', 'Libraries', 'EPANET run report'];

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		await a.dismissGallery();

		report.ok(await a.page.$('#lpn_menu_project'), 'the menu bar carries a Project item');
		const rows = await a.menuRows('project');
		report.eq(JSON.stringify(rows.map(r => r.label)), JSON.stringify(EXPECTED),
			'every row is present, in order');
		report.ok(rows.every(r => !r.disabled),
			'and none of them is greyed — the report row explains itself rather than going dead',
			JSON.stringify(rows));

		// ---- the two doors that already had buttons ----------------------------------------------
		await a.menuClick('Settings', 'project');
		await a.settle(300);
		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_settings_box').style.display === 'flex'),
			'Settings opens the same box the toolbar gear opens');
		await a.menuClick('Settings', 'project');
		await a.settle(300);

		await a.menuClick('Libraries', 'project');
		await a.settle(300);
		report.ok(await a.page.evaluate(() => {
			const b = document.getElementById('lpn_library_box');
			return !!b && b.style.display !== 'none';
		}), 'Libraries opens the same box the toolbar book opens');
		await a.menuClick('Libraries', 'project');
		await a.settle(300);

		// ---- the report, with nothing to report --------------------------------------------------
		//
		// A fresh project has never been near the EPANET solver, so this is the state most first-time
		// users will press it in. It must say why, and it must not put an empty box on screen.
		await a.menuClick('EPANET run report', 'project');
		await a.settle(300);
		const box = await a.page.evaluate(() => !!document.getElementById('lpn_runbox'));
		const after = { box: box, notice: await a.notice() };
		report.ok(!after.box, 'with no run yet, the row opens no box at all', JSON.stringify(after));
		report.has(after.notice.toLowerCase(), 'no run report',
			'...and says why there is nothing to show', after.notice.slice(0, 80));

		report.eq(a.errors.length, 0, 'no uncaught JavaScript', a.errors[0] || '');
	} finally {
		await a.close();
	}
};
