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
// Ctrl+click, Shift+click and Ctrl+Space only; there is no drag-to-select any more.
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
async function dragHeading(a, from, to, steps) {
	const p0 = await headCentre(a, from), p1 = await headCentre(a, to);
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

	// ---- (9) NO TEXT LINE OF ANY JUNCTIONS HEADING RUNS UNDER THE "..." GLYPH OR ITS ARROW
	// (pre-review, 2026-09-25, second pass: "Part of this network" and "Required fire flow (gpm)"
	// overlapped by ~3px and ~8px) -- and the table's total width is unchanged, since the fix
	// reserves space only on columns narrow enough to wrap, never by widening a <col>. ------------
	{
		const a = await openJunctions(browser, 'G');
		const widthBefore = 1221.921875;
		const result = await a.page.evaluate(() => {
			const t = document.querySelector('#lpn_pane_junctions table');
			const ths = [...t.querySelectorAll('thead th')];
			const bad = [];
			ths.forEach((th) => {
				const b = th.querySelector('.lpn-pane-sort');
				const glyph = th.querySelector('.lpn-pane-colmenu');
				const arrow = th.querySelector('.lpn-pane-sortarrow');
				const gRect = glyph ? glyph.getBoundingClientRect() : null;
				const aRect = arrow ? arrow.getBoundingClientRect() : null;
				const intersects = (q, r) => r && !(q.right <= r.left || q.left >= r.right || q.bottom <= r.top || q.top >= r.bottom);
				const range = document.createRange();
				const walker = document.createTreeWalker(b, NodeFilter.SHOW_TEXT);
				let tn;
				while ((tn = walker.nextNode())) {
					if (!tn.textContent.trim()) { continue; }
					range.selectNodeContents(tn);
					[...range.getClientRects()].forEach((q) => {
						if (intersects(q, gRect) || intersects(q, aRect)) {
							bad.push((th.className.match(/lpn-pane-col-(\S+)/) || [])[1]);
						}
					});
				}
			});
			return { bad, tableWidth: t.getBoundingClientRect().width };
		});
		report.ok(result.bad.length === 0, 'no heading text line intersects the "..." glyph or the sort arrow',
			JSON.stringify(result.bad));
		report.ok(Math.abs(result.tableWidth - widthBefore) < 0.5,
			'the Junctions table total width is unchanged by the gutter reservation',
			result.tableWidth + ' vs ' + widthBefore);
		report.ok(a.errors.length === 0, 'no page error', a.errors.slice(0, 1).join(''));
		await a.close();
	}
};
