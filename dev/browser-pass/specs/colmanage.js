// §Tables heading menu additions (2026-09-25), after Tom's browser pass on feat/table-editing:
//   "Add 'Show all' to the heading right-click menu. Or maybe what we really need is a Manage
//    columns command/box that has checkboxes for Show." ... "Maybe a three dots menu for sorting
//    and hiding."
//
// colselect.js already covers, with real page.mouse events: dragging across headings to select,
// Ctrl/Shift+click, Hide (this)/(these) column(s), and a SELECTED heading dragged onto another
// moving the column (the missing preventDefault() fix). This spec covers what is NEW: the "..."
// menu glyph opening the same menu, Sort ascending/descending on it, "Show all columns", the
// "Manage columns..." dialog (Show checkboxes and reorder, applying live and surviving a table
// rebuild), and Ctrl+Space toggling the current column into the selection.

const { Session } = require('../lib/session');

exports.title = 'Tables: the "..." column menu, Manage columns, Ctrl+Space';

async function openJunctions(browser, name) {
	const a = await Session.open(browser, name);
	await a.goto('Looped-Network.php');
	await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
	await a.settle(1000);
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.page.evaluate(() => { document.getElementById('lpn_pane_btn').click(); });
	await a.settle(300);
	await a.page.evaluate(() => { document.getElementById('lpn_pane_tab_junctions').click(); });
	await a.settle(500);
	return a;
}

const T = '#lpn_pane_junctions table';

async function keys(a) {
	return a.page.evaluate((T) => [...document.querySelectorAll(T + ' thead th')]
		.map((th) => (th.className.match(/lpn-pane-col-(\S+)/) || [])[1]), T);
}
async function menuItems(a) {
	return a.page.evaluate(() => [...document.querySelectorAll('.lpn-pane-ctxmenu button')].map((b) => b.textContent));
}
async function clickMenu(a, text) {
	return a.page.evaluate((text) => {
		const b = [...document.querySelectorAll('.lpn-pane-ctxmenu button')].find((x) => x.textContent === text);
		if (b) { b.click(); }
		return !!b;
	}, text);
}
// The "..." glyph is hover-revealed (CSS) but is a real button the whole time -- .click() reaches
// it exactly as a hover-then-click would, so this exercises the same code path a mouse user does
// without fighting Playwright over a CSS-only opacity gate that a screenshot, not a script, would
// need to see through.
async function clickColMenuGlyph(a, key) {
	return a.page.evaluate((key) => {
		const th = document.querySelector('#lpn_pane_junctions table thead th.lpn-pane-col-' + key);
		const b = th && th.querySelector('.lpn-pane-colmenu');
		if (b) { b.click(); }
		return !!b;
	}, key);
}

exports.run = async function ({ browser, report }) {
	// ---- the "..." glyph opens the same menu, with Sort ascending/descending on it --------------
	{
		const a = await openJunctions(browser, 'A');
		const before = await keys(a);
		const opened = await clickColMenuGlyph(a, before[1]);
		await a.settle(150);
		report.ok(opened, 'the "..." button exists on a heading and is clickable');
		const items = await menuItems(a);
		const sortAsc = await a.lang('lpn_pane_sort_asc');
		const sortDesc = await a.lang('lpn_pane_sort_desc');
		const manage = await a.lang('lpn_pane_manage_cols');
		report.ok(items.indexOf(sortAsc) !== -1 && items.indexOf(sortDesc) !== -1,
			'...and the menu it opens offers Sort ascending and Sort descending', JSON.stringify(items));
		report.ok(items.indexOf(manage) !== -1, '...and Manage columns…', JSON.stringify(items));
		await clickMenu(a, sortAsc);
		await a.settle(200);
		let s = await a.page.evaluate((T) => {
			const th = document.querySelector(T + ' thead th[aria-sort]');
			return th ? { col: (th.className.match(/lpn-pane-col-(\S+)/) || [])[1], dir: th.getAttribute('aria-sort') } : null;
		}, T);
		report.ok(s && s.col === before[1] && s.dir === 'ascending', 'Sort ascending sorts that column ascending', JSON.stringify(s));
		await clickColMenuGlyph(a, before[1]);
		await a.settle(150);
		await clickMenu(a, sortDesc);
		await a.settle(200);
		s = await a.page.evaluate((T) => {
			const th = document.querySelector(T + ' thead th[aria-sort]');
			return th ? { col: (th.className.match(/lpn-pane-col-(\S+)/) || [])[1], dir: th.getAttribute('aria-sort') } : null;
		}, T);
		report.ok(s && s.col === before[1] && s.dir === 'descending', '...and Sort descending reverses it', JSON.stringify(s));
		report.ok(a.errors.length === 0, 'no page error', a.errors.slice(0, 1).join(''));
		await a.close();
	}

	// ---- "Show all columns": hidden only while something is hidden, and it shows everything -----
	{
		const a = await openJunctions(browser, 'B');
		const hideCol = await a.lang('lpn_pane_hide_col');
		const showAll = await a.lang('lpn_pane_show_all_cols');
		const before = await keys(a);
		const target = before[2];
		await a.page.evaluate(({ T, key }) => {
			document.querySelector(T + ' thead th.lpn-pane-col-' + key + ' .lpn-pane-sort')
				.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, clientX: 100, clientY: 100 }));
		}, { T, key: target });
		await a.settle(150);
		report.ok((await menuItems(a)).indexOf(showAll) === -1, 'nothing hidden yet: no "Show all columns" entry', JSON.stringify(await menuItems(a)));
		report.ok(await clickMenu(a, hideCol), 'Hide this column is offered and hides it');
		await a.settle(300);
		let after = await keys(a);
		report.ok(after.indexOf(target) === -1, '...the column is gone from the table', JSON.stringify(after));
		await clickColMenuGlyph(a, after[1]);
		await a.settle(150);
		const items = await menuItems(a);
		report.ok(items.indexOf(showAll) !== -1, 'with one hidden, "Show all columns" is offered', JSON.stringify(items));
		report.ok(await clickMenu(a, showAll), 'clicking it runs');
		await a.settle(300);
		after = await keys(a);
		report.ok(after.indexOf(target) !== -1 && after.length === before.length, '...and every column is back', JSON.stringify(after));
		report.ok(a.errors.length === 0, 'no page error', a.errors.slice(0, 1).join(''));
		await a.close();
	}

	// ---- Manage columns…: Show checkboxes and reorder, live, and it survives a table rebuild ----
	{
		const a = await openJunctions(browser, 'C');
		const manage = await a.lang('lpn_pane_manage_cols');
		const before = await keys(a);
		await clickColMenuGlyph(a, before[0]);
		await a.settle(150);
		report.ok(await clickMenu(a, manage), 'Manage columns… is offered and opens');
		const d = await a.waitDialog(2000);
		report.ok(!!d, 'the dialog opens', JSON.stringify(d));
		// One row per column of the CURRENT table, in its current order -- checkbox first.
		const rows = await a.page.evaluate(() => [...document.querySelectorAll('.lpn-managecols-table tbody tr')].map((tr) => ({
			label: tr.children[1].textContent,
			checked: tr.children[0].querySelector('input').checked,
			disabled: tr.children[0].querySelector('input').disabled
		})));
		report.ok(rows.length === before.length, 'one dialog row per column', rows.length + ' vs ' + before.length);
		report.ok(rows.every((r) => r.checked), 'every column starts checked (Show)', JSON.stringify(rows));
		report.ok(rows[0].disabled, 'ID cannot be unchecked', JSON.stringify(rows[0]));
		// Uncheck the third row -- applies live, to the table BEHIND the dialog.
		await a.page.evaluate(() => document.querySelectorAll('.lpn-managecols-table tbody tr')[2].querySelector('input').click());
		await a.settle(250);
		let live = await keys(a);
		report.ok(live.length === before.length - 1 && live.indexOf(before[2]) === -1,
			'unchecking Show in the dialog hides that column in the live table right away', JSON.stringify(live));
		// The dialog redrew itself too: the row for that column is now unchecked, in place.
		let rowsNow = await a.page.evaluate(() => [...document.querySelectorAll('.lpn-managecols-table tbody tr')].map((tr) => tr.children[0].querySelector('input').checked));
		report.ok(rowsNow[2] === false, '...and the dialog itself shows it unchecked', JSON.stringify(rowsNow));
		// Move the second row down one with the ▼ button.
		const movedLabel = await a.page.evaluate(() => document.querySelectorAll('.lpn-managecols-table tbody tr')[1].children[1].textContent);
		await a.page.evaluate(() => {
			const tr = document.querySelectorAll('.lpn-managecols-table tbody tr')[1];
			[...tr.children[2].querySelectorAll('button')].find((b) => b.textContent === '▼').click();
		});
		await a.settle(250);
		let liveOrder = await keys(a);
		const movedKey = before.filter((k) => k !== before[2])[1];
		report.ok(liveOrder[2] === movedKey, 'moving a row down in the dialog reorders the live table', JSON.stringify(liveOrder));
		await a.dialogClick(await a.lang('lpn_dialog_ok') || 'OK');
		await a.settle(200);
		// **PERSISTS ACROSS A REBUILD**: switch tabs away and back, which throws the table's DOM away
		// and rebuilds it from lpn_panecols (paneColPrefs) -- the same key the drag-reorder and the
		// old hide-menu already wrote to, so this dialog adds no storage of its own.
		await a.page.evaluate(() => { document.getElementById('lpn_pane_tab_pipes').click(); });
		await a.settle(300);
		await a.page.evaluate(() => { document.getElementById('lpn_pane_tab_junctions').click(); });
		await a.settle(300);
		const afterRebuild = await keys(a);
		report.ok(JSON.stringify(afterRebuild) === JSON.stringify(liveOrder),
			'the hide and the reorder both survive a tab-away-and-back table rebuild', JSON.stringify(afterRebuild));
		report.ok(a.errors.length === 0, 'no page error', a.errors.slice(0, 1).join(''));
		await a.close();
	}

	// ---- Ctrl+Space toggles the current column into the selection --------------------------------
	{
		const a = await openJunctions(browser, 'D');
		const before = await keys(a);
		// Land the caret in a cell of the third column, exactly as Tab or a click would.
		await a.page.evaluate(({ T, key }) => {
			const td = document.querySelector(T + ' tbody tr:first-child td.lpn-pane-col-' + key);
			const focusable = td && (td.querySelector('input,select,button') || td);
			if (focusable && focusable.focus) { focusable.focus(); }
		}, { T, key: before[2] });
		await a.settle(150);
		await a.page.keyboard.down('Control');
		await a.page.keyboard.press('Space');
		await a.page.keyboard.up('Control');
		await a.settle(200);
		let sel = await a.page.evaluate((T) => [...document.querySelectorAll(T + ' thead th')]
			.filter((th) => th.classList.contains('lpn-pane-head-sel'))
			.map((th) => (th.className.match(/lpn-pane-col-(\S+)/) || [])[1]), T);
		report.ok(JSON.stringify(sel) === JSON.stringify([before[2]]), 'Ctrl+Space with a cell focused selects that whole column', JSON.stringify(sel));
		// Pressed again, it comes back OUT of the selection (a toggle, not a one-way add).
		await a.page.keyboard.down('Control');
		await a.page.keyboard.press('Space');
		await a.page.keyboard.up('Control');
		await a.settle(200);
		sel = await a.page.evaluate((T) => [...document.querySelectorAll(T + ' thead th')]
			.filter((th) => th.classList.contains('lpn-pane-head-sel'))
			.map((th) => (th.className.match(/lpn-pane-col-(\S+)/) || [])[1]), T);
		report.ok(sel.length === 0, '...pressed again, it toggles back out', JSON.stringify(sel));
		report.ok(a.errors.length === 0, 'no page error', a.errors.slice(0, 1).join(''));
		await a.close();
	}
};
