// §Tables heading menu additions (2026-09-25), after Tom's browser pass on feat/table-editing:
//   "Add 'Show all' to the heading right-click menu. Or maybe what we really need is a Manage
//    columns command/box that has checkboxes for Show." ... "Maybe a three dots menu for sorting
//    and hiding."
//
// Tom, 2026-09-25, SECOND pass, on that first build: (1) the heading should be one selectable
// target, no sort arrow inside its text; (2) the "..." glyph should not need a hover to be found;
// (3) the sort arrow, when there is one, belongs under the "..." glyph, not in the heading; (4) the
// Manage columns dialog should apply only on OK, and reorder by moving a SELECTION with buttons
// outside the list rather than one row's own up/down arrows.
//
// Tom, 2026-09-26, THIRD pass, reversing the second pass's "always visible": the "..." and the
// arrow take zero space and stay hidden until hover/focus/touch; sorting is the arrow's job alone
// (an arrow now lives on every heading, ascending first then toggling); the menu no longer sorts
// and no longer lists a hidden column by name (Manage columns already does).
//
// Tom, 2026-09-26, FOURTH pass: Ctrl+Space ("more trouble to debug than the feature is worth") is
// removed, not merely untested -- see the section that proves it gone, below.
//
// colselect.js already covers, with real page.mouse events: dragging across headings to select,
// Ctrl/Shift+click, Hide (this)/(these) column(s), and a SELECTED heading dragged onto another
// moving the column (the missing preventDefault() fix). This spec covers: the "..." glyph and the
// sort arrow (hover/focus/touch-revealed, zero layout space), "Show all columns", the "Manage
// columns..." dialog (Show checkboxes and a selection moved by buttons, applying only on OK and
// surviving a table rebuild), and confirms Ctrl+Space no longer does anything.

const { Session } = require('../lib/session');

exports.title = 'Tables: the "..." column menu, the sort arrow, Manage columns';

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

// Fires a real MouseEvent with the modifier flags the ROW's own click handler reads
// (`ev.ctrlKey`/`ev.metaKey`/`ev.shiftKey`) -- calling `.click()` on the element after a
// `page.keyboard.down('Control')` does NOT do this: a JS-level `.click()` synthesizes an event with
// every modifier false regardless of what real keys are physically held, so that combination
// silently behaves as an unmodified click. This is what a real Ctrl+click and Shift+click on the
// row need instead of coordinate-based `page.mouse.click()`, which the list's own scrolling makes
// awkward to aim reliably.
function clickRow(a, i, mods) {
	return a.page.evaluate(({ i, mods }) => {
		document.querySelectorAll('.lpn-managecols-row')[i]
			.dispatchEvent(new MouseEvent('click', { bubbles: true, ctrlKey: !!mods.ctrl, shiftKey: !!mods.shift }));
	}, { i, mods: mods || {} });
}

async function arrowState(a, key) {
	return a.page.evaluate((key) => {
		const th = document.querySelector('#lpn_pane_junctions table thead th.lpn-pane-col-' + key);
		const arrow = th && th.querySelector('.lpn-pane-sortarrow');
		return arrow ? { present: true, desc: arrow.classList.contains('lpn-pane-sortarrow-desc'),
			active: arrow.classList.contains('lpn-pane-sortarrow-active') } : { present: false };
	}, key);
}

// Real hover, not a synthetic mouseenter dispatch: CSS `:hover` only ever comes from the browser's
// own pointer tracking, so a `page.mouse.move()` onto the heading is the only way to see the
// opacity gate actually open (`.dispatchEvent(new MouseEvent('mouseover'))` does not set `:hover`).
async function hoverHeading(a, key) {
	const box = await a.page.evaluate((key) => {
		const r = document.querySelector('#lpn_pane_junctions table thead th.lpn-pane-col-' + key).getBoundingClientRect();
		return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
	}, key);
	await a.page.mouse.move(box.x, box.y);
}
async function hoverOwn(a, key, cls) {
	const box = await a.page.evaluate(({ key, cls }) => {
		const r = document.querySelector('#lpn_pane_junctions table thead th.lpn-pane-col-' + key + ' ' + cls).getBoundingClientRect();
		return { x: r.left + r.width / 2, y: r.bottom - 3 };
	}, { key, cls });
	await a.page.mouse.move(box.x, box.y);
}
async function opacityOf(a, key, cls) {
	return a.page.evaluate(({ key, cls }) => {
		const th = document.querySelector('#lpn_pane_junctions table thead th.lpn-pane-col-' + key);
		return getComputedStyle(th.querySelector(cls)).opacity;
	}, { key, cls });
}

exports.run = async function ({ browser, report }) {
	// ---- Tom, 2026-09-26, third pass, REVERSING the second pass: the "..." and the arrow take
	// zero space and stay INVISIBLE until the heading is hovered or focused (real Chromium
	// `:hover`, not a synthetic event) -- "Possibly the arrow and the menu can take up zero space
	// and appear with 100% opacity over any heading text on hover. Try that." An arrow now exists
	// on EVERY heading (sorting is the arrow's job alone, never the menu's), and clicking any of
	// them sorts ascending first, then toggles -- except the CURRENTLY SORTED column's own arrow,
	// which stays visible without hovering, so there is still something to look at from a glance. --
	{
		const a = await openJunctions(browser, 'A');
		const before = await keys(a);
		report.ok((await opacityOf(a, before[1], '.lpn-pane-colmenu')) === '0', 'the "..." glyph is invisible with no hover or focus');
		report.ok((await opacityOf(a, before[1], '.lpn-pane-sortarrow')) === '0', '...and so is the sort arrow');
		let arrow = await arrowState(a, before[1]);
		report.ok(arrow.present && !arrow.active, 'the arrow element exists on an unsorted column too, just not "active"', JSON.stringify(arrow));
		// **FIFTH PASS: ONLY THEIR OWN CORNER REVEALS THEM** (Tom, 2026-09-26: *"I think that the
		// menu and arrow are too eager to show. Can we make them show only when the cursor is
		// directly over their area of the cell?"*).
		await hoverHeading(a, before[1]);
		await a.settle(100);
		report.ok((await opacityOf(a, before[1], '.lpn-pane-colmenu')) === '0', 'hovering the middle of the heading no longer reveals the "..." glyph');
		report.ok((await opacityOf(a, before[1], '.lpn-pane-sortarrow')) === '0', '...nor the sort arrow');
		for (const cls of ['.lpn-pane-colmenu', '.lpn-pane-sortarrow']) {
			await hoverOwn(a, before[1], cls);
			await a.settle(100);
			report.ok((await opacityOf(a, before[1], '.lpn-pane-colmenu')) === '1' && (await opacityOf(a, before[1], '.lpn-pane-sortarrow')) === '1',
				'hovering the ' + (cls === '.lpn-pane-colmenu' ? '"..."' : 'arrow') + '\'s own box reveals the pair');
		}
		// Tom, fifth pass: "Put a little vertical space between the ellipsis menu and the sort arrow."
		const gap = await a.page.evaluate((key) => {
			const th = document.querySelector('#lpn_pane_junctions table thead th.lpn-pane-col-' + key);
			const m = th.querySelector('.lpn-pane-colmenu').getBoundingClientRect();
			const ar = th.querySelector('.lpn-pane-sortarrow');
			return ar.getBoundingClientRect().top + parseFloat(getComputedStyle(ar).paddingTop) - m.bottom;
		}, before[1]);
		report.ok(gap >= 4, 'there is visible air between the "..." badge and the arrow badge', gap + ' px');
		// Clicking an UNSORTED column's arrow sorts it ascending -- the menu no longer sorts at all.
		await a.page.evaluate((key) => {
			document.querySelector('#lpn_pane_junctions table thead th.lpn-pane-col-' + key + ' .lpn-pane-sortarrow').click();
		}, before[1]);
		await a.settle(200);
		let s = await a.page.evaluate((T) => {
			const th = document.querySelector(T + ' thead th[aria-sort]');
			return th ? { col: (th.className.match(/lpn-pane-col-(\S+)/) || [])[1], dir: th.getAttribute('aria-sort') } : null;
		}, T);
		report.ok(s && s.col === before[1] && s.dir === 'ascending', 'clicking an unsorted column\'s arrow sorts it ascending, first click', JSON.stringify(s));
		arrow = await arrowState(a, before[1]);
		report.ok(arrow.present && arrow.active && !arrow.desc, 'the sorted column\'s arrow is now "active" and points ascending', JSON.stringify(arrow));
		report.ok((await opacityOf(a, before[1], '.lpn-pane-sortarrow')) === '1',
			'...and stays visible even with the pointer moved elsewhere (a deliberate exception, not hover-gated)');
		// Clicking the SAME arrow again toggles the direction.
		await a.page.evaluate((key) => {
			document.querySelector('#lpn_pane_junctions table thead th.lpn-pane-col-' + key + ' .lpn-pane-sortarrow').click();
		}, before[1]);
		await a.settle(200);
		s = await a.page.evaluate((T) => {
			const th = document.querySelector(T + ' thead th[aria-sort]');
			return th ? { col: (th.className.match(/lpn-pane-col-(\S+)/) || [])[1], dir: th.getAttribute('aria-sort') } : null;
		}, T);
		report.ok(s && s.col === before[1] && s.dir === 'descending', 'clicking the same arrow again reverses the sort', JSON.stringify(s));
		arrow = await arrowState(a, before[1]);
		report.ok(arrow.present && arrow.active && arrow.desc, '...and the arrow itself now points the other way', JSON.stringify(arrow));
		// The menu itself no longer offers to sort at all.
		const opened = await clickColMenuGlyph(a, before[1]);
		await a.settle(150);
		report.ok(opened, 'the "..." button still exists and is clickable');
		const items = await menuItems(a);
		const sortAsc = await a.lang('lpn_pane_sort_asc');
		const manage = await a.lang('lpn_pane_manage_cols');
		report.ok(items.indexOf(sortAsc) === -1 && items.every((t) => t.toLowerCase().indexOf('descend') === -1),
			'Sort ascending/descending are gone from the menu -- sorting is the arrow\'s job alone', JSON.stringify(items));
		report.ok(items.indexOf(manage) !== -1, '...Manage columns… is still there', JSON.stringify(items));
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

	// ---- Manage columns…: a selectable list, buttons outside it move the block, and NOTHING
	// applies until OK (Tom, second pass, point (4)(a): "it could (should?) do nothing until OK";
	// point (4)(b)(i): "Highlight a group of columns honoring Ctrl and Shift, then use move up,
	// move down, move to beginning, and move to end buttons") ------------------------------------
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
		const rows = () => a.page.evaluate(() => [...document.querySelectorAll('.lpn-managecols-row')].map((row) => ({
			label: row.querySelector('span').textContent,
			checked: row.querySelector('input').checked,
			disabled: row.querySelector('input').disabled,
			selected: row.classList.contains('lpn-managecols-row-sel')
		})));
		let rowsNow = await rows();
		report.ok(rowsNow.length === before.length, 'one dialog row per column', rowsNow.length + ' vs ' + before.length);
		report.ok(rowsNow.every((r) => r.checked), 'every column starts checked (Show)', JSON.stringify(rowsNow));
		report.ok(rowsNow[0].disabled, 'ID cannot be unchecked', JSON.stringify(rowsNow[0]));
		// Uncheck the third row -- and confirm it does NOT touch the live table behind the dialog.
		await a.page.evaluate(() => document.querySelectorAll('.lpn-managecols-row')[2].querySelector('input').click());
		await a.settle(150);
		let live = await keys(a);
		report.ok(JSON.stringify(live) === JSON.stringify(before), 'unchecking Show in the dialog does NOT touch the live table yet', JSON.stringify(live));
		// Select rows 1 and 3 with Ctrl+click (not side by side), and move them to the beginning.
		const moveTop = await a.lang('lpn_pane_manage_cols_top');
		const moveBottom = await a.lang('lpn_pane_manage_cols_bottom');
		const moveDown = await a.lang('lpn_pane_manage_cols_down');
		const moveUp = await a.lang('lpn_pane_manage_cols_up');
		const rowLabels = (await rows()).map((r) => r.label);
		await clickRow(a, 1, {});
		await clickRow(a, 3, { ctrl: true });
		await a.settle(100);
		rowsNow = await rows();
		report.ok(rowsNow[1].selected && rowsNow[3].selected && rowsNow.filter((r) => r.selected).length === 2,
			'click then Ctrl+click selects two rows that are not side by side', JSON.stringify(rowsNow.map((r) => r.selected)));
		await a.page.evaluate((text) => {
			[...document.querySelectorAll('.lpn-managecols-btns button')].find((b) => b.textContent === text).click();
		}, moveTop);
		await a.settle(100);
		let labelsNow = (await rows()).map((r) => r.label);
		report.ok(labelsNow[0] === rowLabels[1] && labelsNow[1] === rowLabels[3],
			'"' + moveTop + '" moves the whole (non-contiguous) selection to the top, in its own relative order',
			JSON.stringify(labelsNow));
		report.ok(JSON.stringify(await keys(a)) === JSON.stringify(before), '...and STILL nothing has applied to the live table', JSON.stringify(await keys(a)));
		// Move that same selection (still selected, now rows 0 and 1) to the bottom, then back up
		// one with Move up, then down one with Move down -- exercising all four buttons.
		await a.page.evaluate((text) => {
			[...document.querySelectorAll('.lpn-managecols-btns button')].find((b) => b.textContent === text).click();
		}, moveBottom);
		await a.settle(100);
		labelsNow = (await rows()).map((r) => r.label);
		report.ok(labelsNow[labelsNow.length - 2] === rowLabels[1] && labelsNow[labelsNow.length - 1] === rowLabels[3],
			'"' + moveBottom + '" moves the selection to the end, in the same relative order', JSON.stringify(labelsNow));
		await a.page.evaluate((text) => {
			[...document.querySelectorAll('.lpn-managecols-btns button')].find((b) => b.textContent === text).click();
		}, moveUp);
		await a.settle(100);
		labelsNow = (await rows()).map((r) => r.label);
		report.ok(labelsNow[labelsNow.length - 3] === rowLabels[1], '"' + moveUp + '" moves the block up one step', JSON.stringify(labelsNow));
		await a.page.evaluate((text) => {
			[...document.querySelectorAll('.lpn-managecols-btns button')].find((b) => b.textContent === text).click();
		}, moveDown);
		await a.settle(100);
		labelsNow = (await rows()).map((r) => r.label);
		report.ok(labelsNow[labelsNow.length - 2] === rowLabels[1], '"' + moveDown + '" moves it back down one step', JSON.stringify(labelsNow));
		// **CANCEL DISCARDS EVERYTHING** -- close this dialog without OK and reopen: the live table
		// (and a fresh dialog) must show the ORIGINAL order and every column still checked.
		await a.dialogClick(await a.lang('lpn_cancel') || 'Cancel');
		await a.settle(150);
		report.ok(JSON.stringify(await keys(a)) === JSON.stringify(before), 'Cancel discards every change made in the dialog', JSON.stringify(await keys(a)));
		// Reopen and this time press OK: the move-to-top and the unchecked third row both land.
		await clickColMenuGlyph(a, before[0]);
		await a.settle(150);
		await clickMenu(a, manage);
		await a.waitDialog(2000);
		await a.page.evaluate(() => document.querySelectorAll('.lpn-managecols-row')[2].querySelector('input').click());
		await clickRow(a, 1, {});
		await clickRow(a, 3, { ctrl: true });
		const finalLabels = (await rows()).map((r) => r.label);
		await a.page.evaluate((text) => {
			[...document.querySelectorAll('.lpn-managecols-btns button')].find((b) => b.textContent === text).click();
		}, moveTop);
		await a.dialogClick(await a.lang('lpn_dialog_ok') || 'OK');
		await a.settle(250);
		const liveOrder = await keys(a);
		report.ok(liveOrder.length === before.length - 1, 'OK applies the hide', JSON.stringify(liveOrder));
		const liveNames = await a.page.evaluate((T) => [...document.querySelectorAll(T + ' thead .lpn-pane-sort')].map((b) => b.textContent), T);
		report.ok(liveNames[0] === finalLabels[1] && liveNames[1] === finalLabels[3],
			'...and OK applies the reorder to the live table, the pair in its own relative order', JSON.stringify({ liveNames, finalLabels }));
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

	// ---- Ctrl+Space is GONE, not merely untested (Tom, 2026-09-26, fourth pass: "The Ctrl+Space
	// note is wrong... Let's remove it and park it in our roadmap. More trouble to debug than the
	// feature is worth.") -- a real regression net, since a silently-reintroduced shortcut with no
	// visible affordance is exactly the kind of thing nothing else here would catch. -------------
	{
		const a = await openJunctions(browser, 'D');
		const before = await keys(a);
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
		const sel = await a.page.evaluate((T) => [...document.querySelectorAll(T + ' thead th')]
			.filter((th) => th.classList.contains('lpn-pane-head-sel'))
			.map((th) => (th.className.match(/lpn-pane-col-(\S+)/) || [])[1]), T);
		report.ok(sel.length === 0, 'Ctrl+Space with a cell focused selects nothing any more', JSON.stringify(sel));
		report.ok(a.errors.length === 0, 'no page error', a.errors.slice(0, 1).join(''));
		await a.close();
	}
};
