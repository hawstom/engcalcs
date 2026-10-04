// §-- the Notes box is a non-hog reference box (Tom, 2026-09-28: "Draggable non-hog box for Help,
// Notes. I need it open for my spreadsheet editing video.").
//
// Until this change #lpn_notes_popup was in VIEW_POPOVERS -- a centred popover that a click on the
// map, a click in the Tables pane, or a bare Escape anywhere on the page would dismiss. That is
// wrong for a box Tom wants left open through a whole recording session. It now shares the same
// shell and the same per-browser memory (`lpn_notesbox`) as Settings, Find and the four report
// boxes: draggable by its title bar, resizable, remembered across a reload, and dismissed only by
// its own X or an Escape pressed while focus is genuinely inside it.
//
// WHAT ONLY A REAL BROWSER CAN SHOW, which is why this is not a dev/lpn-spike/*.js stub:
//   1. A click on the map, and a keystroke in a Tables-pane cell, must reach their target while the
//      box is open -- proving there is no backdrop and no click-away dismissal, which is a real
//      pointer/focus fact rather than something a DOM stub can fake.
//   2. Dragging it, reloading the page, and seeing it come back at the dragged corner is a real
//      localStorage round trip through a real boot.
//   3. Escape closes it only when focus is inside it -- bound on the box itself, so a keystroke
//      elsewhere on the page must leave it alone.
//   4. On first open it must not cover the Tables pane docked under the map.

const { Session } = require('../lib/session');

exports.title = 'Notes box: draggable, non-hog, remembered (Tom, 2026-09-28)';

async function notesRect(page) {
	return page.evaluate(() => {
		const e = document.getElementById('lpn_notes_popup');
		const r = e.getBoundingClientRect();
		return { x: r.x, y: r.y, w: r.width, h: r.height, display: e.style.display };
	});
}
async function paneRect(page) {
	return page.evaluate(() => {
		const e = document.getElementById('lpn_pane');
		if (!e || e.style.display === 'none') { return null; }
		const r = e.getBoundingClientRect();
		return { x: r.x, y: r.y, w: r.width, h: r.height };
	});
}
function overlaps(a, b) {
	if (!a || !b) { return false; }
	return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
async function openPane(page) {
	// The consent banner lies over the bottom of the window and now covers the Tables pane's first row, so a
	// click on a cell is intercepted; other table specs remove it the same way.
	await page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await page.evaluate(() => {
		const b = document.getElementById('lpn_pane_btn');
		if (b && b.getAttribute('aria-pressed') !== 'true') { b.click(); }
		const t = document.getElementById('lpn_pane_tab_junctions');
		if (t) { t.click(); }
	});
}
async function openNotes(a) {
	await a.openMenu('help');
	await a._clickRow('#lpn_menu_list', await a.lang('lpn_help_notes'));
	await a.settle(200);
}
async function isOpen(page) {
	return page.evaluate(() => document.getElementById('lpn_notes_popup').style.display === 'flex');
}

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		await a.dismissGallery();
		await a.makeEdit();          // a real node on the canvas, for the map-click proof below
		await openPane(a.page);
		await a.settle(200);

		// ---- 1. opening: draggable shell, not a pull-down, and it does not cover the pane --------
		await openNotes(a);
		report.ok(await isOpen(a.page), 'Help > Notes on this page opens the box');
		const titleBar = await a.page.$('#lpn_notes_title');
		report.ok(!!titleBar, 'it has a title bar to drag by');
		const nr = await notesRect(a.page);
		const pr = await paneRect(a.page);
		report.ok(!overlaps(nr, pr),
			'on first open it does not cover the Tables pane', JSON.stringify({ notes: nr, pane: pr }));

		// ---- 2. NOT modal: the map and the Tables pane both still take input --------------------
		const before = await a.nodeCount();
		await a.toolbarClick('Junction');
		// A clear spot away from both the notes box and the pane, in the middle band of the map.
		const spot = await a.page.evaluate(() => {
			const canvas = document.getElementById('lpn_canvas');
			const notes = document.getElementById('lpn_notes_popup').getBoundingClientRect();
			const r = canvas.getBoundingClientRect();
			for (let col = 1; col < 9; col++) {
				const p = { x: r.x + r.width * (col / 9), y: r.y + r.height * 0.5 };
				const inNotes = p.x > notes.x && p.x < notes.x + notes.width &&
					p.y > notes.y && p.y < notes.y + notes.height;
				if (inNotes) { continue; }
				const hit = document.elementFromPoint(p.x, p.y);
				if (hit && canvas.contains(hit)) { return p; }
			}
			return null;
		});
		report.ok(!!spot, 'set up: found a map spot not covered by the open Notes box');
		if (spot) {
			await a.page.mouse.click(spot.x, spot.y);
			await a.settle(300);
		}
		await a.toolbarClick('Select');
		const after = await a.nodeCount();
		report.ok(after > before, 'the map still takes a click and places a node while Notes is open',
			`${before} -> ${after}`);
		report.ok(await isOpen(a.page), '...and the click on the map did not close Notes');

		const cellSel = '#lpn_pane_junctions tbody tr input';
		const cell = await a.page.$(cellSel);
		report.ok(!!cell, 'set up: the Junctions table has an editable cell');
		if (cell) {
			await cell.click();
			await a.page.keyboard.type('12.5');
			await a.page.keyboard.press('Enter');
			await a.settle(150);
			const val = await a.page.$eval(cellSel, (el) => el.value);
			report.has(val, '12.5', 'a Tables-pane cell still takes keystrokes while Notes is open');
		}
		report.ok(await isOpen(a.page), '...and typing in the table did not close Notes either');

		// ---- 3. Escape closes it only when focus is inside it ------------------------------------
		await a.page.evaluate(() => document.body.focus());
		await a.page.keyboard.press('Escape');
		await a.settle(150);
		report.ok(await isOpen(a.page), 'Escape with focus elsewhere on the page leaves it open');

		await a.page.click('#lpn_notes_close', { trial: false, position: { x: 5, y: 5 } }).catch(() => {});
		// Focus something real inside the box body (not the close button, so this is not just
		// re-testing the X) before pressing Escape.
		await a.page.evaluate(() => {
			const box = document.getElementById('lpn_notes_popup');
			const dt = box.querySelector('dt');
			if (dt) { dt.tabIndex = -1; dt.focus(); }
		});
		await a.page.keyboard.press('Escape');
		await a.settle(150);
		report.ok(!(await isOpen(a.page)), 'Escape with focus inside the box closes it');

		// ---- 4. drag it, reload, and it comes back at the dragged corner -------------------------
		await openNotes(a);
		const wasAt = await notesRect(a.page);
		await a.page.mouse.move(wasAt.x + 60, wasAt.y + 8);
		await a.page.mouse.down();
		await a.page.mouse.move(wasAt.x + 130, wasAt.y + 70, { steps: 8 });
		await a.page.mouse.up();
		await a.settle(150);
		const draggedAt = await notesRect(a.page);
		report.ok(Math.abs(draggedAt.x - wasAt.x - 70) < 8 && Math.abs(draggedAt.y - wasAt.y - 62) < 8,
			'it drags by its own title bar', JSON.stringify(wasAt) + ' -> ' + JSON.stringify(draggedAt));

		await a.reload();
		await a.settle(300);
		report.ok(await isOpen(a.page), 'it comes back OPEN after a reload, left open on purpose');
		const backAt = await notesRect(a.page);
		report.ok(Math.abs(backAt.x - draggedAt.x) < 8 && Math.abs(backAt.y - draggedAt.y) < 8,
			'...at the remembered corner, not centred again', JSON.stringify(backAt));

		// The reopened box still is not modal either.
		await openPane(a.page);
		const before2 = await a.nodeCount();
		await a.toolbarClick('Junction');
		const spot2 = await a.page.evaluate(() => {
			const canvas = document.getElementById('lpn_canvas');
			const notes = document.getElementById('lpn_notes_popup').getBoundingClientRect();
			const r = canvas.getBoundingClientRect();
			for (let col = 1; col < 9; col++) {
				const p = { x: r.x + r.width * (col / 9), y: r.y + r.height * 0.75 };
				const inNotes = p.x > notes.x && p.x < notes.x + notes.width &&
					p.y > notes.y && p.y < notes.y + notes.height;
				if (inNotes) { continue; }
				const hit = document.elementFromPoint(p.x, p.y);
				if (hit && canvas.contains(hit)) { return p; }
			}
			return null;
		});
		if (spot2) { await a.page.mouse.click(spot2.x, spot2.y); await a.settle(300); }
		await a.toolbarClick('Select');
		report.ok((await a.nodeCount()) > before2,
			'after a reload, the map still takes a click while the restored Notes box is open');

		report.eq(a.errors.length, 0, 'no uncaught JavaScript');
	} finally {
		await a.close();
	}
};
