// §Column selection in the tables (R-221). Tom, 2026-09-24, on "Hide these columns":
//   "Does not work, only one column hides, and I only like this solution if it's spreadsheet-like.
//    This would mean that entire heading cells or columns highlight and that I can use the mouse to
//    drag through multiple columns in usual Select manner."
//
// Driven with REAL mouse events (page.mouse), because every earlier check of this feature called
// the click handler directly and passed while he could not make it work. What it holds:
//   (1) pressing on a heading and dragging across others selects the range: the headings light,
//       and so does every cell in those columns;
//   (2) a right-click on a selected heading offers "Hide these columns", and it hides ALL of them;
//   (3) the cause of "only one column hides": click a heading (which sorts), then Shift+click
//       another. The plain click left no anchor, so Shift+click selected only the second column
//       and the menu offered to hide that one. Now it selects the range;
//   (4) Ctrl+click toggles columns that need not be side by side, and they hide together;
//   (5) a plain click still sorts and selects nothing;
//   (6) one selection, not two: a click on a cell ends a column selection, and Ctrl+C on a column
//       selection copies those columns;
//   (7) a SELECTED heading dragged onto another moves the column (Tom's earlier point (e)).

const { Session } = require('../lib/session');

exports.title = 'Tables: spreadsheet column selection and Hide these columns';

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
			sortDir: (ths.find((th) => th.getAttribute('aria-sort')) || { getAttribute: () => '' }).getAttribute('aria-sort')
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
	// ---- (1) + (2): drag through four headings, right-click one, hide them all -----------------
	{
		const a = await openJunctions(browser, 'A');
		const hideCols = await a.lang('lpn_pane_hide_cols');
		const before = await state(a);
		const want = before.keys.slice(1, 5);   // X, Y, Description, Tag
		const p0 = await headCentre(a, want[0]), p1 = await headCentre(a, want[3]);
		await a.page.mouse.move(p0.x, p0.y);
		await a.page.mouse.down();
		for (let i = 1; i <= 8; i++) { await a.page.mouse.move(p0.x + (p1.x - p0.x) * i / 8, p0.y); }
		await a.page.mouse.up();
		await a.settle(150);
		let s = await state(a);
		report.ok(JSON.stringify(s.headSel) === JSON.stringify(want), 'dragging from one heading across three more lights all four headings',
			JSON.stringify(s.headSel));
		report.ok(JSON.stringify(s.washed) === JSON.stringify(want), '...and every cell in those four columns',
			JSON.stringify(s.washed));
		report.ok(s.sorted === before.sorted && s.sortDir === before.sortDir, '...and the drag did not sort anything', s.sorted + ' ' + s.sortDir);
		report.ok(JSON.stringify(s.keys) === JSON.stringify(before.keys), '...or move a column');
		const pm = await headCentre(a, want[1]);
		await a.page.mouse.click(pm.x, pm.y, { button: 'right' });
		await a.settle(150);
		const items = await menuItems(a);
		report.ok(items.indexOf(hideCols) !== -1, 'right-clicking a selected heading offers "' + hideCols + '"', JSON.stringify(items));
		await clickMenu(a, hideCols);
		await a.settle(300);
		s = await state(a);
		const left = want.filter((k) => s.keys.indexOf(k) !== -1);
		report.ok(left.length === 0 && s.keys.length === before.keys.length - 4, '...and it hides ALL four', 'still showing: ' + JSON.stringify(left));
		report.ok(a.errors.length === 0, 'no page error', a.errors.slice(0, 1).join(''));
		await a.close();
	}

	// ---- (3) + (5): a plain click sorts; Shift+click then extends from it --------------------
	{
		const a = await openJunctions(browser, 'B');
		const hideCols = await a.lang('lpn_pane_hide_cols');
		const before = await state(a);
		const k0 = before.keys[6], k1 = before.keys[8];
		const p0 = await headCentre(a, k0);
		await a.page.mouse.click(p0.x, p0.y);
		await a.settle(300);
		let s = await state(a);
		report.ok(s.sorted === k0, 'a plain click on a heading still sorts by it', s.sorted);
		report.ok(s.headSel.length === 0 && !s.anyWash, '...and selects nothing', JSON.stringify(s.headSel));
		const p1 = await headCentre(a, k1);
		await a.page.keyboard.down('Shift');
		await a.page.mouse.click(p1.x, p1.y);
		await a.page.keyboard.up('Shift');
		await a.settle(150);
		s = await state(a);
		const want = before.keys.slice(6, 9);
		report.ok(JSON.stringify(s.headSel) === JSON.stringify(want),
			'Shift+click after that click selects the whole range, not only the Shift-clicked column (why only one column hid)',
			JSON.stringify(s.headSel));
		report.ok(s.sorted === k0, '...and does not sort', s.sorted);
		await a.page.mouse.click(p1.x, p1.y, { button: 'right' });
		await a.settle(150);
		report.ok(await clickMenu(a, hideCols), 'the menu says "' + hideCols + '"', JSON.stringify(await menuItems(a)));
		await a.settle(300);
		s = await state(a);
		report.ok(want.every((k) => s.keys.indexOf(k) === -1), '...and all three hide', JSON.stringify(s.keys));
		report.ok(a.errors.length === 0, 'no page error', a.errors.slice(0, 1).join(''));
		await a.close();
	}

	// ---- (4) + (6): Ctrl+click two apart; a cell click ends it; Ctrl+C copies columns --------
	{
		const a = await openJunctions(browser, 'C');
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
		// A click in a body cell replaces the column selection: one selection, not two.
		const cell = await a.page.evaluate((T) => { const r = document.querySelector(T + ' tbody tr:nth-child(3) td:nth-child(3)').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; }, T);
		await a.page.mouse.click(cell.x, cell.y);
		await a.settle(150);
		s = await state(a);
		report.ok(s.headSel.length === 0 && s.washed.length === 0, 'a click on a cell ends the column selection', JSON.stringify(s.headSel));
		// Drag X..Y and copy: the clipboard holds those two columns, every row.
		const px = await headCentre(a, before.keys[1]), py = await headCentre(a, before.keys[2]);
		await a.page.mouse.move(px.x, px.y); await a.page.mouse.down();
		await a.page.mouse.move((px.x + py.x) / 2, px.y); await a.page.mouse.move(py.x, py.y); await a.page.mouse.up();
		await a.page.keyboard.press('Control+c');
		await a.settle(100);
		const copied = await a.page.evaluate(() => window.__copied);
		const nRows = await a.page.evaluate((T) => document.querySelectorAll(T + ' tbody tr').length, T);
		const lines = String(copied || '').replace(/\n$/, '').split('\n');
		report.ok(!!copied && lines.every((l) => l.split('\t').length === 2) && lines.length >= nRows,
			'Ctrl+C on a two-column selection copies two columns of every row', (copied ? lines.length + ' lines, first ' + JSON.stringify(lines[0]) : 'nothing copied'));
		// Re-select the two apart and hide them together.
		await a.page.mouse.click(cell.x, cell.y);
		for (const k of [kA, kB]) {
			const p = await headCentre(a, k);
			await a.page.keyboard.down('Control');
			await a.page.mouse.click(p.x, p.y);
			await a.page.keyboard.up('Control');
		}
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

	// ---- (7): a SELECTED heading dragged onto another moves the column -------------------------
	{
		const a = await openJunctions(browser, 'D');
		const before = await state(a);
		const k = before.keys[2], dest = before.keys[5];
		const p = await headCentre(a, k);
		await a.page.keyboard.down('Control');
		await a.page.mouse.click(p.x, p.y);
		await a.page.keyboard.up('Control');
		const q = await headCentre(a, dest);
		await a.page.mouse.move(p.x, p.y); await a.page.mouse.down();
		for (let i = 1; i <= 8; i++) { await a.page.mouse.move(p.x + (q.x - p.x) * i / 8, p.y); }
		await a.page.mouse.up();
		await a.settle(300);
		const s = await state(a);
		report.ok(s.keys.indexOf(k) === before.keys.indexOf(dest), 'a selected heading dragged onto another moves its column there',
			JSON.stringify(s.keys));
		report.ok(a.errors.length === 0, 'no page error', a.errors.slice(0, 1).join(''));
		await a.close();
	}
};
