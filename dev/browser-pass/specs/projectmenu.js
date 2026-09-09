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

// The menu opened with three rows and now has seven -- Profile, Tables, Scenarios and Calculate
// moved in as the Project menu became the one place every command lives (2026-08-24). The list is
// asserted in ORDER rather than as a set: a menu is read top to bottom, and the report row staying
// last is what keeps the four everyday commands above the one that reports on a run.
//
// **'Fire flow at a hydrant…' was here between 2026-08-25 and 2026-08-26 and is now on the
// `fire-flow` branch** — Tom held the whole feature back for research (ROADMAP Task 530). It sat
// between Calculate and the report, for the reason that outlives the removal: it is an ANALYSIS of
// this project, not an Insert, because nothing it builds enters the document. When it returns it
// returns to that slot, and this list is where that is recorded.
// **INSERT IS FIRST, SINCE TASK 543 (2026-08-27).** The Insert MENU was deleted and its seven asset
// rows became a fly-out at the head of Water — Tom's own decision, and his reasoning was that
// everything below it reads, configures or reports on what those rows put on the map. This list had
// not followed, so the section failed on its second check for two days.
//
// **AND TWO MORE ROWS ARRIVED BEFORE 2026-09-09.** Fire flow analysis… came back off the
// `fire-flow` branch, into the slot this comment reserved for it; and the single EPANET-run-report
// row became a **Reports fly-out** holding the run report beside the pump-energy and
// scenario-comparison reports, so the word "report" is said once over all three instead of once per
// row. Both are the menu doing what this file already said it would.
//
// **NAMED BY KEY, NOT BY TOM'S ENGLISH** (dev/session-handoff.md §4). What this list is about is
// which rows exist and in what order, and it broke on wording twice.
const EXPECTED_KEYS = ['lpn_menu_insert', 'lpn_tool_settings', 'lpn_library_menu',
	'lpn_profile_menu', 'lpn_tables_menu', 'lpn_scenario_menu', 'lpn_time_run',
	'lpn_ff_menu', 'lpn_reports_menu'];

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		await a.dismissGallery();

		report.ok(await a.page.$('#lpn_menu_project'), 'the menu bar carries the Water item');
		const EXPECTED = [];
		for (const k of EXPECTED_KEYS) { EXPECTED.push(await a.lang(k)); }
		const rows = await a.menuRows('project');
		report.eq(JSON.stringify(rows.map(r => r.label)), JSON.stringify(EXPECTED),
			'every row is present, in order');
		report.ok(rows.every(r => !r.disabled),
			'and none of them is greyed — the report row explains itself rather than going dead',
			JSON.stringify(rows));

		// ---- the two doors that already had buttons ----------------------------------------------
		await a.menuClick(await a.lang('lpn_tool_settings'), 'project');
		await a.settle(300);
		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_settings_box').style.display === 'flex'),
			'Settings opens the same box the toolbar gear opens');
		// ---- **THE CHROME OUTRANKS THE BOX** (Tom, 2026-08-24) -----------------------------------
		// "The menus and toolbars (level 1 menus) need a higher z-index than the boxes (Settings,
		// Libraries, ...)." The three strips were in normal flow with no z-index, so a box dragged
		// up the window painted over the menu bar that opened it. Asked as the user would find out:
		// put the box over the menu bar, then ask the DOCUMENT what is on top at that point.
		const stack = await a.page.evaluate(() => {
			const box = document.getElementById('lpn_settings_box');
			const bar = document.getElementById('lpn_menubar');
			const r = bar.getBoundingClientRect();
			const was = { top: box.style.top, left: box.style.left };
			box.style.top = '0px';
			box.style.left = '0px';
			const x = Math.round(r.left + r.width / 2), y = Math.round(r.top + r.height / 2);
			const hit = document.elementFromPoint(x, y);
			const out = {
				overBar: !!(hit && (hit.id === 'lpn_menubar' || hit.closest('#lpn_menubar'))),
				what: hit ? (hit.id || hit.className || hit.tagName) : null,
				boxCovers: box.getBoundingClientRect().top <= y && box.getBoundingClientRect().bottom >= y
			};
			box.style.top = was.top; box.style.left = was.left;
			return out;
		});
		report.ok(stack.boxCovers, 'the Settings box can be moved over the menu bar', String(stack.boxCovers));
		report.ok(stack.overBar, '...and the menu bar still paints on top of it',
			'topmost element there is ' + stack.what);

		await a.menuClick(await a.lang('lpn_tool_settings'), 'project');
		await a.settle(300);

		await a.menuClick(await a.lang('lpn_library_menu'), 'project');
		await a.settle(300);
		report.ok(await a.page.evaluate(() => {
			const b = document.getElementById('lpn_library_box');
			return !!b && b.style.display !== 'none';
		}), 'Libraries opens the same box the toolbar book opens');
		await a.menuClick(await a.lang('lpn_library_menu'), 'project');
		await a.settle(300);

		// ---- the report, with nothing to report --------------------------------------------------
		//
		// A fresh project has never been near the EPANET solver, so this is the state most first-time
		// users will press it in. It must say why, and it must not put an empty box on screen.
		//
		// **IT IS A FLY-OUT ROW NOW**: Reports ▸ EPANET run. The row that used to say the whole
		// sentence became one of three under a heading that says "report" once, so the click is two
		// deep. The property under test — pressing it with no run behind you explains itself rather
		// than opening an empty box — is untouched.
		await a.menuClickSub(await a.lang('lpn_reports_menu'), await a.lang('lpn_reports_epanet'),
			'project');
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
