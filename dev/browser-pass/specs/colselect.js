// §Column selection and drag-to-move in the tables (R-221, then the pre-reviewer's 2026-09-25
// finding). History, because both halves of it matter to what this file asserts:
//
// Tom, 2026-09-24, on "Hide these columns": "Does not work, only one column hides, and I only like
// this solution if it's spreadsheet-like. This would mean that entire heading cells or columns
// highlight and that I can use the mouse to drag through multiple columns in usual Select manner."
// That shipped as: drag an UNSELECTED heading to select a range across it; drag an already-SELECTED
// one to move it.
//
// Tom, 2026-09-25, on the very next pass: he could not get a column to drag at all. The
// pre-reviewer traced it to the split itself, not to the missing `preventDefault()` this branch had
// also just fixed -- on a column nobody has selected yet (which is every column, the first time
// anyone reaches for one), a press-and-drag now SELECTS instead of moving, and the one-motion drag
// Tom tried is exactly what master already gave him (approved 2026-09-18) before R-221 split it in
// two. So: press-and-drag ANY heading, selected or not, now MOVES it (the whole selection together,
// if the pressed heading is part of one) -- one gesture, one job. Whole-column SELECTION is
// Ctrl+click and Shift+click only; there is no drag-to-select any more, and no Ctrl+Space
// either (removed 2026-09-26, fourth pass: "more trouble to debug than the feature is worth").
//
// Tom, 2026-09-25, second pass: sorting by clicking a heading is gone entirely -- "(1)(a) No
// selectable text; there is only one selection possible and one cursor for a heading... A click
// anywhere on the cell selects the column." A plain click now selects that column alone rather
// than sorting; sorting moved behind the "..." menu and the arrow it puts under itself once a
// column IS sorted (see colmanage.js).
//
// Driven with REAL mouse events (page.mouse) throughout, because every earlier check of the drag
// gesture called the handlers directly and passed while Tom could not make it work with his own
// hand. What this file holds:
//   (1) pressing on an UNSELECTED heading's own TEXT and dragging it onto another moves that
//       column there, in one motion -- and leaves no native text selection behind;
//   (2) pressing on a heading that IS part of a standing multi-column selection and dragging it
//       moves the whole selection together, as a block, in its original relative order;
//   (3) Ctrl+click and Shift+click build a selection (never a drag); a plain click selects the
//       column alone and never sorts; Shift+click after a plain click extends from where the
//       click landed (the cause of R-221's "only one column hides" -- a plain click used to leave
//       no anchor);
//   (4) right-click a selection offers "Hide these columns", and hides all of it;
//   (5) Ctrl+click toggles columns that need not be side by side, and they hide together;
//   (6) one selection, not two: a click on a cell ends a column selection, and Ctrl+C on a column
//       selection (built with Ctrl+click, not a drag) copies those columns;
//   (7) R-222, the Help > Notes entry "Table keyboard shortcuts": one shortcut a line, the key
//       first, the actions lined up in a column.

const { Session } = require('../lib/session');
const { REPO } = require('../lib/env');

exports.title = 'Tables: column drag-to-move and Ctrl/Shift-click selection';

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

async function state(a) {
	return a.page.evaluate((T) => {
		const t = document.querySelector(T);
		const ths = [...t.querySelectorAll('thead th')];
		const keys = ths.map((th) => (th.className.match(/lpn-pane-col-(\S+)/) || [])[1]);
		const rows = [...t.querySelectorAll('tbody tr')];
		// A column counts as washed when every one of its body cells carries the selection class.
		const washed = keys.filter((k, i) => rows.length && rows.every((tr) => tr.children[i] && tr.children[i].classList.contains('lpn-pane-sel')));
		const anyWash = rows.some((tr) => [...tr.children].some((td) => td.classList.contains('lpn-pane-sel')));
		return {
			keys,
			headSel: keys.filter((k, i) => ths[i].classList.contains('lpn-pane-head-sel')),
			washed, anyWash,
			sorted: (((ths.find((th) => th.getAttribute('aria-sort')) || { className: '' }).className.match(/lpn-pane-col-(\S+)/)) || [])[1] || null,
			sortDir: (ths.find((th) => th.getAttribute('aria-sort')) || { getAttribute: () => '' }).getAttribute('aria-sort'),
			selection: (window.getSelection ? window.getSelection().toString() : '')
		};
	}, T);
}

async function headCentre(a, key) {
	return a.page.evaluate(({ T, key }) => {
		const th = document.querySelector(T + ' thead th.lpn-pane-col-' + key);
		th.scrollIntoView({ block: 'nearest', inline: 'nearest' });
		const r = th.querySelector('.lpn-pane-sort').getBoundingClientRect();
		return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
	}, { T, key });
}

// A small-steps drag, matching a real hand rather than a single teleport -- the pre-reviewer's own
// probe used this shape to reproduce what a single large `mousemove` can paper over.
// It ends a few pixels PAST the destination's middle: since the fifth pass the drop is decided by
// the ghost's middle crossing a neighbour's middle, and a hand landing exactly on it is a tie.
async function dragHeading(a, from, to, steps) {
	const p0 = await headCentre(a, from), p1 = await headCentre(a, to);
	p1.x += (p1.x > p0.x ? 6 : -6);
	await a.page.mouse.move(p0.x, p0.y);
	await a.page.mouse.down();
	for (let i = 1; i <= (steps || 15); i++) {
		await a.page.mouse.move(p0.x + (p1.x - p0.x) * i / (steps || 15), p0.y + (p1.y - p0.y) * i / (steps || 15));
	}
	await a.page.mouse.up();
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

exports.run = async function ({ browser, report }) {
	// ---- (1): drag an UNSELECTED heading's TEXT -- one motion, moves it, no text selection ------
	{
		const a = await openJunctions(browser, 'A');
		const before = await state(a);
		const from = before.keys[2], to = before.keys[5];
		report.ok(before.headSel.length === 0, 'nothing is selected to begin with', JSON.stringify(before.headSel));
		await dragHeading(a, from, to);
		await a.settle(300);
		const s = await state(a);
		report.ok(s.keys.indexOf(from) === before.keys.indexOf(to),
			'dragging an UNSELECTED heading moves it there in one motion -- no selecting step first',
			before.keys.indexOf(from) + ' -> ' + s.keys.indexOf(from));
		report.ok(s.keys.length === before.keys.length && s.keys.slice().sort().join() === before.keys.slice().sort().join(),
			'...and it is still the same set of columns, only reordered');
		report.ok(s.headSel.length === 0, '...and the drag selected nothing', JSON.stringify(s.headSel));
		report.ok(s.sorted === before.sorted && s.sortDir === before.sortDir, '...and did not sort anything', s.sorted + ' ' + s.sortDir);
		report.ok(!s.selection, 'and the drag left no native text selection behind (the missing preventDefault, fixed)',
			JSON.stringify(s.selection));
		report.ok(a.errors.length === 0, 'no page error', a.errors.slice(0, 1).join(''));
		await a.close();
	}

	// ---- (2): dragging a heading that IS part of a multi-column selection moves the group -------
	{
		const a = await openJunctions(browser, 'B');
		const before = await state(a);
		const a1 = before.keys[1], a2 = before.keys[2], dest = before.keys[before.keys.length - 1];
		for (const k of [a1, a2]) {
			const p = await headCentre(a, k);
			await a.page.keyboard.down('Control');
			await a.page.mouse.click(p.x, p.y);
			await a.page.keyboard.up('Control');
		}
		let s = await state(a);
		report.ok(JSON.stringify(s.headSel) === JSON.stringify([a1, a2]), 'Ctrl+click selects two adjacent columns', JSON.stringify(s.headSel));
		await dragHeading(a, a1, dest);
		await a.settle(300);
		s = await state(a);
		report.ok(s.keys.indexOf(a2) === s.keys.indexOf(a1) + 1,
			'dragging a column that is part of the selection moves the WHOLE selection -- they land beside each other still',
			s.keys.indexOf(a1) + ',' + s.keys.indexOf(a2));
		report.ok(s.keys.indexOf(a2) === before.keys.indexOf(dest), '...as a block, at the destination',
			before.keys.indexOf(dest) + ' vs ' + s.keys.indexOf(a2));
		report.ok(s.keys.length === before.keys.length && s.keys.slice().sort().join() === before.keys.slice().sort().join(),
			'...and it is still the same set of columns');
		report.ok(a.errors.length === 0, 'no page error', a.errors.slice(0, 1).join(''));
		await a.close();
	}

	// ---- (3): a plain click SELECTS the column alone and never sorts (Tom, 2026-09-25, second
	// pass: "there is only one selection possible and one cursor for a heading... A click anywhere
	// on the cell selects the column"); Shift+click after it extends the range from there ---------
	{
		const a = await openJunctions(browser, 'C');
		const hideCols = await a.lang('lpn_pane_hide_cols');
		const before = await state(a);
		const k0 = before.keys[6], k1 = before.keys[8];
		const p0 = await headCentre(a, k0);
		await a.page.mouse.click(p0.x, p0.y);
		await a.settle(300);
		let s = await state(a);
		report.ok(s.sorted === before.sorted && s.sortDir === before.sortDir, 'a plain click on a heading no longer sorts', s.sorted);
		report.ok(JSON.stringify(s.headSel) === JSON.stringify([k0]), '...it selects that column alone', JSON.stringify(s.headSel));
		const p1 = await headCentre(a, k1);
		await a.page.keyboard.down('Shift');
		await a.page.mouse.click(p1.x, p1.y);
		await a.page.keyboard.up('Shift');
		await a.settle(150);
		s = await state(a);
		const want = before.keys.slice(6, 9);
		report.ok(JSON.stringify(s.headSel) === JSON.stringify(want),
			'Shift+click after that click selects the whole range, not only the Shift-clicked column (why only one column hid, R-221)',
			JSON.stringify(s.headSel));
		report.ok(s.sorted === before.sorted && s.sortDir === before.sortDir, '...and still does not sort', s.sorted);
		// ---- (4): right-click that selection offers "Hide these columns", and hides it -----------
		await a.page.mouse.click(p1.x, p1.y, { button: 'right' });
		await a.settle(150);
		report.ok(await clickMenu(a, hideCols), 'the menu says "' + hideCols + '"', JSON.stringify(await menuItems(a)));
		await a.settle(300);
		s = await state(a);
		report.ok(want.every((k) => s.keys.indexOf(k) === -1), '...and all three hide', JSON.stringify(s.keys));
		report.ok(a.errors.length === 0, 'no page error', a.errors.slice(0, 1).join(''));
		await a.close();
	}

	// ---- (5) + (6): Ctrl+click two apart; a cell click ends it; Ctrl+C copies columns ------------
	{
		const a = await openJunctions(browser, 'D');
		const hideCols = await a.lang('lpn_pane_hide_cols');
		await a.page.evaluate(() => {
			window.__copied = null;
			navigator.clipboard.writeText = (t) => { window.__copied = t; return Promise.resolve(); };
		});
		const before = await state(a);
		const kA = before.keys[1], kB = before.keys[6];
		for (const k of [kA, kB]) {
			const p = await headCentre(a, k);
			await a.page.keyboard.down('Control');
			await a.page.mouse.click(p.x, p.y);
			await a.page.keyboard.up('Control');
		}
		await a.settle(150);
		let s = await state(a);
		report.ok(JSON.stringify(s.headSel) === JSON.stringify([kA, kB]) && JSON.stringify(s.washed) === JSON.stringify([kA, kB]),
			'Ctrl+click selects two columns that are not side by side, headings and cells', JSON.stringify(s));
		// A click in a body cell replaces the column selection: one selection, not two. Targets the
		// ID column by class rather than a fixed `nth-child`, and is measured FRESH each time it is
		// used rather than a coordinate captured once and reused -- the several `headCentre()`
		// calls around it each `scrollIntoView()` their own heading, which can shift the table's
		// horizontal scroll and land a once-captured pixel somewhere else by the second click.
		const cellCentre = () => a.page.evaluate((T) => {
			const r = document.querySelector(T + ' tbody tr:nth-child(3) td.lpn-pane-col-id').getBoundingClientRect();
			return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
		}, T);
		const cell = await cellCentre();
		await a.page.mouse.click(cell.x, cell.y);
		await a.settle(150);
		s = await state(a);
		report.ok(s.headSel.length === 0 && s.washed.length === 0, 'a click on a cell ends the column selection', JSON.stringify(s.headSel));
		// Ctrl+click X and Y (adjacent, not a drag -- there is no drag-to-select any more) and copy.
		const kX = before.keys[1], kY = before.keys[2];
		for (const k of [kX, kY]) {
			const p = await headCentre(a, k);
			await a.page.keyboard.down('Control');
			await a.page.mouse.click(p.x, p.y);
			await a.page.keyboard.up('Control');
		}
		await a.page.keyboard.press('Control+c');
		await a.settle(100);
		const copied = await a.page.evaluate(() => window.__copied);
		const nRows = await a.page.evaluate((T) => document.querySelectorAll(T + ' tbody tr').length, T);
		const lines = String(copied || '').replace(/\n$/, '').split('\n');
		report.ok(!!copied && lines.every((l) => l.split('\t').length === 2) && lines.length >= nRows,
			'Ctrl+C on a two-column selection (built with Ctrl+click) copies two columns of every row',
			(copied ? lines.length + ' lines, first ' + JSON.stringify(lines[0]) : 'nothing copied'));
		// Re-select the two apart (kA, kB) and hide them together. A plain click on another heading
		// no longer clears the selection to nothing since 2026-09-25's second pass -- it REPLACES
		// the selection with that one column instead -- so the deterministic way to land on exactly
		// [kA, kB] is: plain-click a third heading (selects it alone), Ctrl+click kA and kB onto it
		// (three selected), then Ctrl+click the third heading again to toggle it back out.
		const kThird = before.keys.find((k) => k !== kA && k !== kB && k !== kX && k !== kY);
		const pt = await headCentre(a, kThird);
		await a.page.mouse.click(pt.x, pt.y);
		await a.settle(100);
		for (const k of [kA, kB, kThird]) {
			const p = await headCentre(a, k);
			await a.page.keyboard.down('Control');
			await a.page.mouse.click(p.x, p.y);
			await a.page.keyboard.up('Control');
		}
		await a.settle(150);
		s = await state(a);
		report.ok(JSON.stringify(s.headSel.slice().sort()) === JSON.stringify([kA, kB].sort()),
			'plain-click one heading then Ctrl+click two more and toggle the first back out leaves exactly those two selected',
			JSON.stringify(s.headSel));
		const pb = await headCentre(a, kB);
		await a.page.mouse.click(pb.x, pb.y, { button: 'right' });
		await a.settle(150);
		report.ok(await clickMenu(a, hideCols), 'right-click offers "' + hideCols + '" for columns that are not side by side');
		await a.settle(300);
		s = await state(a);
		report.ok(s.keys.indexOf(kA) === -1 && s.keys.indexOf(kB) === -1, '...and both hide', JSON.stringify(s.keys));
		report.ok(a.errors.length === 0, 'no page error', a.errors.slice(0, 1).join(''));
		await a.close();
	}

	// ---- (7) R-222: Help > Notes on this page > Table keyboard shortcuts is a list -------------
	{
		const a = await Session.open(browser, 'E');
		await a.goto('Looped-Network.php');
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.menuClick(await a.lang('lpn_help_notes'), 'help');
		await a.settle(200);
		// Not bridged into pageConfig (the notes are page HTML), so read from the language file.
		const term = (/\$ec_lang\['lpn_notes_6_term'\]='([^']*)'/.exec(require('fs').readFileSync(require('path').join(REPO, 'lib', 'lang.ec.en.php'), 'utf8')) || [])[1];
		const got = await a.page.evaluate((term) => {
			const pop = document.getElementById('lpn_notes_popup');
			const dt = [...pop.querySelectorAll('dt')].find((d) => d.textContent.trim() === term);
			const dd = dt && dt.nextElementSibling;
			const lis = dd ? [...dd.querySelectorAll('li')] : [];
			return {
				shown: getComputedStyle(pop).display !== 'none',
				n: lis.length,
				keyFirst: lis.every((li) => li.firstElementChild && li.firstElementChild.tagName === 'STRONG' && li.firstChild === li.firstElementChild),
				tops: lis.map((li) => Math.round(li.getBoundingClientRect().top)),
				actionLeft: lis.map((li) => { const r = document.createRange(); r.setStartAfter(li.firstElementChild); r.setEnd(li, li.childNodes.length); return Math.round(r.getBoundingClientRect().left); }),
				bullets: lis.map((li) => getComputedStyle(li.parentNode).listStyleType)
			};
		}, term);
		report.ok(got.shown, 'Help > Notes on this page opens the notes');
		report.ok(got.n >= 10, 'the shortcuts note is a list', got.n + ' items');
		report.ok(got.keyFirst, '...each item leads with its key or gesture');
		report.ok(new Set(got.tops).size === got.tops.length && got.tops.every((t, i) => i === 0 || t > got.tops[i - 1]),
			'...one shortcut a line', JSON.stringify(got.tops));
		report.ok(new Set(got.actionLeft).size === 1, '...and what each one does starts in the same column', JSON.stringify([...new Set(got.actionLeft)]));
		report.ok(a.errors.length === 0, 'no page error', a.errors.slice(0, 1).join(''));
		await a.close();
	}

	// ---- (8) THE WHOLE CELL IS THE TARGET, DOWN TO THE PIXEL (pre-review, 2026-09-25, second
	// pass: Tom's "one cursor for a heading... that is the entire cell" -- a single-line heading's
	// button used to sit ~22px tall, centred in a cell as tall as the tallest WRAPPED heading
	// beside it, so a press near the top/bottom padding or the left inset landed on nothing). A
	// click 2px inside every edge of a SINGLE-LINE heading (never the "..." corner or the resize
	// grip, both excepted by construction) must select that column. -----------------------------
	{
		const a = await openJunctions(browser, 'F');
		const before = await state(a);
		// A single-line heading in Net3's Junctions: short enough that it never wraps, so its
		// text does not fill the row height the way a wrapped neighbour's does -- exactly the
		// shape the dead zone was reported against.
		const key = before.keys.find((k) => k !== 'id') || before.keys[1];
		const rect = await a.page.evaluate((k) => {
			const th = document.querySelector('#lpn_pane_junctions table thead th.lpn-pane-col-' + k);
			const r = th.getBoundingClientRect();
			return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
		}, key);
		const edges = [
			['top edge', rect.left + (rect.right - rect.left) / 2, rect.top + 2],
			['bottom edge', rect.left + (rect.right - rect.left) / 2, rect.bottom - 2],
			['left inset', rect.left + 2, rect.top + (rect.bottom - rect.top) / 2]
		];
		for (const [label, x, y] of edges) {
			await a.page.mouse.click(x, y);
			await a.settle(100);
			const s = await state(a);
			report.ok(JSON.stringify(s.headSel) === JSON.stringify([key]),
				'a click 2px from the ' + label + ' of a single-line heading selects it', JSON.stringify(s.headSel));
			// Clear the selection (a body cell click) before the next edge, same idiom as (5)+(6).
			await a.page.evaluate(() => {
				const td = document.querySelector('#lpn_pane_junctions table tbody tr:nth-child(3) td.lpn-pane-col-id');
				const focusable = td && (td.querySelector('input,select,button') || td);
				if (focusable && focusable.focus) { focusable.focus(); }
			});
			await a.settle(100);
		}
		report.ok(a.errors.length === 0, 'no page error', a.errors.slice(0, 1).join(''));
		await a.close();
	}

	// ---- (9) THE "..." GLYPH AND THE ARROW TAKE ZERO LAYOUT SPACE, ON EVERY HEADING, AND THE
	// TABLE'S TOTAL WIDTH IS UNCHANGED (Tom, 2026-09-26, third pass, REVERSING the prior round's
	// gutter reservation: "Possibly the arrow and the menu can take up zero space and appear with
	// 100% opacity over any heading text on hover. Try that." Overlapping the text on hover is now
	// the INTENDED behaviour, not a defect -- so this no longer asserts "never overlaps"; it asserts
	// the two things Tom actually asked for: no space reserved (so nothing widens), and both glyphs
	// invisible until hovered or focused. -----------------------------------------------------------
	{
		const a = await openJunctions(browser, 'G');
		const widthBefore = 1221.921875;
		const result = await a.page.evaluate(() => {
			const t = document.querySelector('#lpn_pane_junctions table');
			const ths = [...t.querySelectorAll('thead th')];
			const notInvisible = [];
			ths.forEach((th) => {
				const glyph = th.querySelector('.lpn-pane-colmenu');
				const arrow = th.querySelector('.lpn-pane-sortarrow');
				const key = (th.className.match(/lpn-pane-col-(\S+)/) || [])[1];
				// The currently sorted column's own arrow is a deliberate exception (stays visible);
				// every other heading's glyph and arrow must both be at opacity 0 with no hover.
				if (!arrow.classList.contains('lpn-pane-sortarrow-active') && getComputedStyle(arrow).opacity !== '0') {
					notInvisible.push(key + ':arrow');
				}
				if (getComputedStyle(glyph).opacity !== '0') { notInvisible.push(key + ':menu'); }
			});
			return { notInvisible, tableWidth: t.getBoundingClientRect().width };
		});
		report.ok(result.notInvisible.length === 0,
			'with no hover or focus anywhere, every heading\'s "..." glyph and (unsorted) arrow are invisible',
			JSON.stringify(result.notInvisible));
		report.ok(Math.abs(result.tableWidth - widthBefore) < 0.5,
			'the Junctions table total width is unchanged -- no space is reserved for either glyph',
			result.tableWidth + ' vs ' + widthBefore);
		report.ok(a.errors.length === 0, 'no page error', a.errors.slice(0, 1).join(''));
		await a.close();
	}

	// ---- (10) THE KEYBOARD FOCUS RING BELONGS TO THE WHOLE HEADING, NEVER TO THE TEXT (Tom,
	// 2026-09-26, fourth pass: "I still see special highlighting on the text" -- a screenshot of a
	// dark rectangle drawn tight around the word "Longitude", the button's own `:focus-visible`
	// outline). Tab to the heading button and the ring must appear on the `<th>`, never on the
	// button itself. ------------------------------------------------------------------------------
	{
		const a = await openJunctions(browser, 'H');
		const key = await a.page.evaluate(() => (document.querySelector('#lpn_pane_junctions table thead th:nth-child(2)').className.match(/lpn-pane-col-(\S+)/) || [])[1]);
		// A REAL keyboard-caused focus move, not `element.focus()`: Chromium's own `:focus-visible`
		// heuristic does not treat a script-driven `.focus()` call as "visible" focus, only focus
		// that followed keyboard interaction -- an earlier cut of this check called `.focus()`
		// directly and both outlines read 'none', which proved nothing about the CSS rule either
		// way. A mouse click lands the caret on the button (not "visible" focus either) with a
		// KNOWN tab position; Shift+Tab then Tab is a two-step keyboard round trip that lands back
		// on the SAME button by a keyboard action, which IS what earns `:focus-visible` -- and it
		// does not depend on knowing how many other controls the page has before this one.
		const box = await a.page.evaluate((key) => {
			const r = document.querySelector('#lpn_pane_junctions table thead th.lpn-pane-col-' + key + ' .lpn-pane-sort').getBoundingClientRect();
			return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		}, key);
		await a.page.mouse.click(box.x, box.y);
		await a.page.keyboard.press('Shift+Tab');
		await a.page.keyboard.press('Tab');
		const reached = await a.page.evaluate((key) => {
			const b = document.querySelector('#lpn_pane_junctions table thead th.lpn-pane-col-' + key + ' .lpn-pane-sort');
			return document.activeElement === b;
		}, key);
		report.ok(reached, 'a keyboard round trip (Shift+Tab, Tab) lands back on the heading button');
		const result = await a.page.evaluate((key) => {
			const th = document.querySelector('#lpn_pane_junctions table thead th.lpn-pane-col-' + key);
			const b = th.querySelector('.lpn-pane-sort');
			return { thOutline: getComputedStyle(th).outlineStyle, thBg: getComputedStyle(th).backgroundColor, sel: th.classList.contains('lpn-pane-head-sel'), sortOutline: getComputedStyle(b).outlineStyle };
		}, key);
		// FIFTH PASS: no ring at all (Tom: "The blue outline for a selected (tabbed) heading isn't
		// great"); a keyboard-focused heading wears the light wash instead.
		// The click that put the caret there also SELECTED the column, so it is solid blue; an
		// unselected focused heading would wear the light wash. Either way, never a ring.
		report.ok(result.thOutline === 'none' && result.thBg === (result.sel ? 'rgb(11, 87, 208)' : 'rgb(232, 240, 254)'),
			'Tab-focusing the heading draws no ring, only its fill (solid if selected, the wash if not)', JSON.stringify(result));
		report.ok(result.sortOutline === 'none', '...and nothing is drawn round the text button itself', JSON.stringify(result));
		report.ok(a.errors.length === 0, 'no page error', a.errors.slice(0, 1).join(''));
		await a.close();
	}

	// ---- (11) THE TAB TIP NAMES HELP > NOTES (Tom, 2026-09-26, fourth pass: "it would be nice to
	// have it referenced in a tip... at the end of the tables tabs. 'See Help, Notes for keyboard
	// shortcuts.'") -- one shared key, read on every table tab, not a copy per tab. ----------------
	{
		const a = await openJunctions(browser, 'I');
		// **`title` READS EMPTY ONCE BOOTSTRAP HAS TAKEN IT OVER** (js/looped-network.js's own
		// comment: initTips() hands every `.ec-help[title]` to Bootstrap, which MOVES `title` into
		// `data-bs-original-title` and blanks the real attribute) -- read that instead, the same way
		// this page's own tip-reading code already does.
		const tip = await a.page.evaluate(() => {
			const b = document.getElementById('lpn_pane_tab_junctions');
			return b ? (b.getAttribute('data-bs-original-title') || b.title) : '(no #lpn_pane_tab_junctions found)';
		});
		const wanted = await a.lang('lpn_pane_tab_tip');
		report.ok(!!tip && tip === wanted && / See Help, Notes for keyboard shortcuts\.$/.test(tip),
			'the Junctions tab tip ends with the Help, Notes sentence', JSON.stringify({ tip, wanted }));
		const tip2 = await a.page.evaluate(() => {
			const b = document.getElementById('lpn_pane_tab_pipes');
			return b && (b.getAttribute('data-bs-original-title') || b.title);
		});
		report.ok(tip2 === tip, '...and Pipes\' tab shares the exact same tip -- one key, not a copy per tab', tip2);
		report.ok(a.errors.length === 0, 'no page error', a.errors.slice(0, 1).join(''));
		await a.close();
	}

	// ---- (12) CTRL+SPACE DOES NOTHING NOW (Tom, 2026-09-26, fourth pass: "The Ctrl+Space note is
	// wrong... Let's remove it. More trouble to debug than the feature is worth.") ----------------
	{
		const a = await openJunctions(browser, 'J');
		await a.page.evaluate(() => {
			const td = document.querySelector('#lpn_pane_junctions table tbody tr:first-child td.lpn-pane-col-id');
			const focusable = td && (td.querySelector('input,select,button') || td);
			if (focusable && focusable.focus) { focusable.focus(); }
		});
		await a.settle(100);
		await a.page.keyboard.down('Control');
		await a.page.keyboard.press('Space');
		await a.page.keyboard.up('Control');
		await a.settle(150);
		const sel = await a.page.evaluate((T) => [...document.querySelectorAll(T + ' thead th')]
			.filter((th) => th.classList.contains('lpn-pane-head-sel')).length, T);
		report.ok(sel === 0, 'Ctrl+Space selects no column any more', sel);
		report.ok(a.errors.length === 0, 'no page error', a.errors.slice(0, 1).join(''));
		await a.close();
	}

	// ---- (13) THE DRAG SHOWS A GHOST AND AN INSERTION MARKER, AND THE CURSOR STAYS "grabbing"
	// ACROSS THE WHOLE PAGE FOR THE WHOLE DRAG (Tom, 2026-09-26, fourth pass: "(2) I lose the grab
	// cursor instead of pulling the column or the heading with me when I leave the column, so drag
	// is blind. I don't know where the column will end up. (3) The grab cursor is a pointer on the
	// heading text.") -- and nothing about the TABLE re-renders until drop (the row count and DOM
	// node identity are unchanged mid-drag). ------------------------------------------------------
	{
		const a = await openJunctions(browser, 'K');
		const key = 'axis1';
		// (3) the selected heading's own TEXT shows the same "grab" cursor as the cell.
		const box = await a.page.evaluate((k) => {
			const r = document.querySelector('#lpn_pane_junctions table thead th.lpn-pane-col-' + k).getBoundingClientRect();
			return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		}, key);
		await a.page.mouse.click(box.x, box.y);
		await a.settle(100);
		const cursors = await a.page.evaluate((k) => {
			const th = document.querySelector('#lpn_pane_junctions table thead th.lpn-pane-col-' + k);
			return { th: getComputedStyle(th).cursor, text: getComputedStyle(th.querySelector('.lpn-pane-sort')).cursor };
		}, key);
		report.ok(cursors.th === 'grab' && cursors.text === 'grab', 'the selected heading and its own text both show "grab"', JSON.stringify(cursors));
		// (2) mid-drag, the ghost and marker appear, and the cursor is "grabbing" even far from the
		// heading. A marker attribute on the first row proves the table BODY is not rebuilt mid-drag
		// (a rebuild throws every <tr> away and makes fresh ones with no attribute of their own).
		await a.page.evaluate((T) => document.querySelector(T + ' tbody tr').setAttribute('data-lpn-probe', '1'), T);
		await a.page.mouse.move(box.x, box.y);
		await a.page.mouse.down();
		await a.page.mouse.move(box.x + 300, box.y + 250, { steps: 8 });
		await a.settle(80);
		const mid = await a.page.evaluate((T) => {
			const ghost = document.querySelector('.lpn-pane-col-ghost');
			const marker = document.querySelector('.lpn-pane-col-marker');
			const row = document.querySelector(T + ' tbody tr');
			return {
				bodyDragging: document.body.classList.contains('lpn-pane-col-dragging'),
				bodyCursor: getComputedStyle(document.body).cursor,
				ghostShown: !!ghost, ghostText: ghost && ghost.textContent,
				markerShown: !!marker && getComputedStyle(marker).display !== 'none',
				rowUnrebuilt: row && row.getAttribute('data-lpn-probe') === '1'
			};
		}, T);
		report.ok(mid.bodyDragging && mid.bodyCursor === 'grabbing',
			'far from the heading, mid-drag, the WHOLE PAGE still shows "grabbing"', JSON.stringify(mid));
		report.ok(mid.ghostShown, 'a ghost follows the pointer', JSON.stringify(mid));
		report.ok(mid.markerShown, '...and an insertion marker shows where the column will land', JSON.stringify(mid));
		report.ok(mid.rowUnrebuilt, '...and the table body is NOT rebuilt mid-drag (the probe attribute survives)', JSON.stringify(mid));
		await a.page.mouse.up();
		await a.settle(150);
		const cleanup = await a.page.evaluate(() => ({
			bodyDragging: document.body.classList.contains('lpn-pane-col-dragging'),
			ghostGone: !document.querySelector('.lpn-pane-col-ghost'),
			markerGone: !document.querySelector('.lpn-pane-col-marker')
		}));
		report.ok(!cleanup.bodyDragging && cleanup.ghostGone && cleanup.markerGone, 'the ghost, marker and body class are all cleaned up on drop', JSON.stringify(cleanup));
		report.ok(a.errors.length === 0, 'no page error', a.errors.slice(0, 1).join(''));
		await a.close();
	}
	// ---- (14) THE FIFTH PASS, IN REAL CHROMIUM (Tom, 2026-09-26): "(1) Suppress the menu and sort
	// arrow during dragging. (2) Sometimes mere clicking (tiny drag?) drags a column... wait for a
	// 'long click' for a drag or a move of at least 1/2 column width"; "you can't drag a column to
	// its own left or right edge; that is a do-nothing case"; "a wide black or dark gray destination
	// line on entire column (not heading) divider when middle of drag rectangle (not cursor) is
	// between middle of two columns"; "Turn an entire heading solid blue on select"; "When I tab from
	// cell to cell, the only indicator I should see is cell outline." ------------------------------
	{
		const a = await openJunctions(browser, 'L');
		const geo = (k) => a.page.evaluate(({ T, k }) => {
			const th = document.querySelector(T + ' thead th.lpn-pane-col-' + k);
			const r = th.getBoundingClientRect();
			return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, mid: r.left + r.width / 2, y: r.top + r.height / 2 };
		}, { T, k });
		const dragUi = () => a.page.evaluate(() => {
			const g = document.querySelector('.lpn-pane-col-ghost'), m = document.querySelector('.lpn-pane-col-marker');
			const gr = g && g.getBoundingClientRect(), mr = m && m.getBoundingClientRect();
			return {
				ghost: !!g, marker: !!m && getComputedStyle(m).display !== 'none',
				gTop: gr && gr.top, gH: gr && gr.height, gW: gr && gr.width, gBg: g && getComputedStyle(g).backgroundColor,
				mLeft: mr && mr.left, mW: mr && mr.width, mTop: mr && mr.top, mH: mr && mr.height, mBg: m && getComputedStyle(m).backgroundColor,
				glyphs: [...document.querySelectorAll('.lpn-pane-colmenu, .lpn-pane-sortarrow')].filter((e) => getComputedStyle(e).visibility !== 'hidden').length
			};
		});
		// Sort one column first, so its standing arrow is visible and has to be suppressed too.
		await a.page.evaluate((T) => document.querySelector(T + ' thead th.lpn-pane-col-elev .lpn-pane-sortarrow').click(), T);
		await a.settle(200);
		let s0 = await state(a);
		const i = 3, k = s0.keys[i], right = s0.keys[i + 1];
		const g = await geo(k), gr = await geo(right);
		// (a) a press that travels less than half the column is a click: it selects, it never moves.
		await a.page.mouse.move(g.mid, g.y);
		await a.page.mouse.down();
		await a.page.mouse.move(g.mid + g.width * 0.4, g.y, { steps: 5 });
		let ui = await dragUi();
		report.ok(!ui.ghost, 'a press that travels 40% of the column draws no ghost', JSON.stringify(ui));
		await a.page.mouse.move(g.mid, g.y, { steps: 3 });
		await a.page.mouse.up();
		await a.settle(150);
		let s1 = await state(a);
		report.ok(s1.keys.join() === s0.keys.join(), '...and moves nothing', s1.keys.indexOf(k) + '');
		report.ok(JSON.stringify(s1.headSel) === JSON.stringify([k]), '...it was a click, and selected the column', JSON.stringify(s1.headSel));
		// (g) that selected heading is SOLID blue, its text white.
		const col = await a.page.evaluate(({ T, k }) => {
			const th = document.querySelector(T + ' thead th.lpn-pane-col-' + k);
			return { bg: getComputedStyle(th).backgroundColor, fg: getComputedStyle(th.querySelector('.lpn-pane-sort')).color };
		}, { T, k });
		report.ok(col.bg === 'rgb(11, 87, 208)' && col.fg === 'rgb(255, 255, 255)', 'the selected heading is solid blue with white text', JSON.stringify(col));
		// (b)+(c) half the width makes it a drag; the ghost is over its own slot, so no marker.
		// Picked up near the RIGHT edge (clear of the resize grip and the ⋮/arrow badges there), so the ghost's middle
		// trails the pointer by nearly half a column.
		const grabX = g.right - 22, trail = grabX - g.mid;
		await a.page.mouse.move(grabX, g.y);
		await a.page.mouse.down();
		await a.page.mouse.move(grabX + g.width / 2 + 2, g.y, { steps: 6 });
		ui = await dragUi();
		report.ok(ui.ghost, 'half the column\'s width makes it a drag: the ghost is drawn', JSON.stringify(ui));
		report.ok(ui.glyphs === 0, '...and every ⋮ and sort arrow is hidden while dragging, the sorted column\'s too', ui.glyphs + ' visible');
		report.ok(!ui.marker, '...and over its own slot (its own right edge) there is no marker', JSON.stringify(ui));
		report.ok(Math.abs(ui.gW - g.width) < 1 && ui.gH > g.bottom - g.top + 40 && Math.abs(ui.gTop - g.top) < 1,
			'the ghost is the whole column: its width, from the heading down the table', JSON.stringify(ui));
		// (d) the POINTER past the neighbour's middle is not enough; the GHOST's middle has to be.
		const ptrPast = gr.mid + 4;
		await a.page.mouse.move(ptrPast, g.y, { steps: 4 });
		ui = await dragUi();
		report.ok(ptrPast - trail < gr.mid && !ui.marker, 'with the pointer past the neighbour\'s middle but the ghost\'s middle short of it, still no marker',
			JSON.stringify({ ghostMid: ptrPast - trail, neighbourMid: gr.mid, marker: ui.marker }));
		await a.page.mouse.move(gr.mid + trail + 3, g.y, { steps: 4 });
		ui = await dragUi();
		report.ok(ui.marker, 'once the ghost\'s middle passes the neighbour\'s middle, the destination marker appears', JSON.stringify(ui));
		report.ok(ui.marker && Math.abs(ui.mLeft + ui.mW / 2 - gr.right) < 1.5, '...on the divider after that neighbour', ui.mLeft + ' vs ' + gr.right);
		report.ok(ui.marker && Math.abs(ui.mTop - g.top) < 1 && Math.abs(ui.mH - ui.gH) < 1 && ui.mW >= 3,
			'...a wide line down the WHOLE column divider, not only the heading', JSON.stringify({ top: ui.mTop, h: ui.mH, w: ui.mW }));
		report.ok(ui.mBg === 'rgb(60, 64, 67)', '...in dark grey, not the selection blue', ui.mBg);
		await a.page.mouse.up();
		await a.settle(200);
		const s2 = await state(a);
		report.ok(s2.keys.indexOf(k) === i + 1 && s2.keys[i] === right, '...and the drop lands it after that neighbour', s0.keys.indexOf(k) + ' -> ' + s2.keys.indexOf(k));
		ui = await dragUi();
		report.ok(!ui.ghost && !ui.marker && ui.glyphs > 0, 'the ghost and marker are gone and the glyphs are back after the drop', JSON.stringify(ui));
		// (e) a long press, with no travel at all, is a drag too.
		const g2 = await geo(s2.keys[5]);
		await a.page.mouse.move(g2.mid, g2.y);
		await a.page.mouse.down();
		await a.page.waitForTimeout(250);
		const early = await dragUi();
		await a.page.waitForTimeout(350);
		const late = await dragUi();
		await a.page.mouse.up();
		await a.settle(150);
		report.ok(!early.ghost && late.ghost, 'a hold (450 ms) with no travel becomes a drag; 250 ms does not', JSON.stringify({ early: early.ghost, late: late.ghost }));
		report.ok((await state(a)).keys.join() === s2.keys.join(), '...and released in place, it moved nothing');
		// (f) Navigation (Ready) mode: Tab into a cell shows the outline and no highlighted text.
		const cell = await a.page.evaluate((T) => {
			const r = document.querySelector(T + ' tbody tr:nth-child(2) td.lpn-pane-col-id').getBoundingClientRect();
			return { x: r.left + 4, y: r.top + r.height / 2 };
		}, T);
		await a.page.mouse.click(cell.x, cell.y);
		const tabbed = [];
		for (let n = 0; n < 3; n++) {
			await a.page.keyboard.press('Tab');
			await a.settle(60);
			tabbed.push(await a.page.evaluate(() => {
				const e = document.activeElement;
				return { tag: e.tagName, val: e.value, ro: e.readOnly, s: e.selectionStart, e: e.selectionEnd, cur: e.parentNode.classList.contains('lpn-pane-cur') };
			}));
		}
		const texty = tabbed.filter((t) => t.tag === 'INPUT' && t.val);
		report.ok(texty.length > 0 && texty.every((t) => t.ro && t.s === t.e && t.cur),
			'Tab through Ready cells: each has the outline and none has its text selected', JSON.stringify(tabbed));
		report.ok(a.errors.length === 0, 'no page error', a.errors.slice(0, 1).join(''));
		await a.close();
	}
};
