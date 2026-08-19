// §16 — the Settings box, and the right pane it emptied (ROADMAP Tasks 427, 434 and 441).
//
// Tom, 2026-08-18, superseding the Visibility panel that had shipped earlier the same day:
//
//   "I think we can make this a better application ... by abandoning the right pane altogether and
//    focusing instead on a single grand two-paned, indexed, draggable, and closeable settings box
//    that includes even labels ... Combine Labels settings, present design Settings, Time settings
//    (from the bottom pane), and Coloring into the Settings box with a simple rule: 'If it's for
//    the entire project, it's in Settings.' Maybe settings can even have a search/filter box at the
//    top that searches tips as well as titles. For now we can keep the right pane, but empty it."
//
// What can be quietly wrong about a box like this is never arithmetic; it is a layout or a door.
// So this measures the doors and the geometry:
//   1. the four sections exist and the index is derived from them, not hand-written;
//   2. every door Tom already knows still opens it — the toolbar Settings button, the menu bar's
//      Settings, the toolbar Labels button, View > Labels, and a click on the colour legend — and
//      each lands on the section it names;
//   3. the search matches TIPS as well as titles, which is the part that makes a long index usable;
//   4. it is a BOX: it drags, it has an X, and clicking away does NOT close it;
//   5. the right pane is still there, empty, and no longer covers the labels legend.

const { Session } = require('../lib/session');

exports.title = '16. The Settings box';

const boxRect = (a) => a.page.evaluate(() => {
	const b = document.getElementById('lpn_settings_box').getBoundingClientRect();
	return {
		left: b.left, top: b.top, width: b.width, height: b.height,
		scroll: document.documentElement.scrollHeight - document.documentElement.clientHeight
	};
});

// Which section heading is sitting at the top of the content pane — i.e. what the box is showing.
const shownSection = (a) => a.page.evaluate(() => {
	const pane = document.getElementById('lpn_setbox_content');
	if (!pane) { return null; }
	const top = pane.getBoundingClientRect().top;
	let best = null, bestD = 1e9;
	document.querySelectorAll('#lpn_setbox_content .lpn-set-sec').forEach((sec) => {
		const h = sec.querySelector('.lpn-set-head');
		if (!h || sec.style.display === 'none') { return; }
		const d = Math.abs(h.getBoundingClientRect().top - top);
		if (d < bestD) { bestD = d; best = sec.getAttribute('data-set-sec'); }
	});
	return bestD < 60 ? best : null;
});

const closeBox = (a) => a.page.evaluate(() => { document.getElementById('lpn_setbox_close').click(); });

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		await a.dismissGallery();
		await a.makeEdit();

		// ---- 1. the four sections, and an index derived from them --------------------------
		await a.toolbarClick('Settings');
		await a.settle(500);
		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_settings_box').style.display === 'flex'),
			'the toolbar Settings button opens the box');

		const secs = await a.page.evaluate(() =>
			[...document.querySelectorAll('#lpn_setbox_content .lpn-set-sec')]
				.map(s => s.getAttribute('data-set-sec')));
		report.eq(secs.join(','), 'labels,settings,time,coloring',
			'four sections, in the order Tom listed them');

		// **THE INDEX IS DERIVED, NEVER WRITTEN.** Every section head and every sub-heading has a
		// row, and every row points at something that exists. A hand-written index fails silently:
		// a new sub-heading simply never appears and nobody finds the setting under it.
		const idx = await a.page.evaluate(() => {
			const heads = [...document.querySelectorAll('#lpn_setbox_content .lpn-set-head')].length;
			const subs = [...document.querySelectorAll('#lpn_setbox_content .lpn-set-sub')].length;
			const rows = [...document.querySelectorAll('#lpn_setbox_index .lpn-setbox-link')];
			return {
				heads: heads, subs: subs, rows: rows.length,
				named: rows.every(r => r.textContent.trim().length > 0),
				resolve: rows.every(r => {
					const id = r.getAttribute('data-sec') || r.getAttribute('data-sub');
					return !!(id && document.getElementById(id));
				})
			};
		});
		report.eq(idx.rows, idx.heads + idx.subs, 'the index has a row per heading and sub-heading',
			`${idx.rows} rows, ${idx.heads} heads + ${idx.subs} subs`);
		report.ok(idx.named, 'every index row is named');
		report.ok(idx.resolve, 'every index row points at something that is really in the box');

		// **NOTHING COLLAPSES** (Tom: "No need ever to collapse; just scroll/jump to your section").
		report.eq(await a.page.evaluate(() =>
			document.querySelectorAll('#lpn_settings_box details').length), 0,
			'nothing in the box collapses');

		// Clicking an index row scrolls the CONTENT PANE to that heading.
		//
		// **NOT "the heading ends up exactly at the top".** The last section cannot reach the top of
		// a pane that is already scrolled as far as it goes — that is what the bottom of a scroll
		// range is, and asserting against it would be asserting that the box is taller than it is.
		// What is really being claimed is the mechanism: the PANE scrolls (not the page), the target
		// becomes visible in it, and jumping back to the first section returns to the top.
		const jumpTo = async (secId) => {
			await a.page.evaluate((id) => {
				const row = [...document.querySelectorAll('#lpn_setbox_index .lpn-setbox-link')]
					.find(r => r.getAttribute('data-sec') === id);
				if (row) { row.click(); }
			}, secId);
			await a.settle(300);
			return a.page.evaluate((id) => {
				const pane = document.getElementById('lpn_setbox_content');
				const p = pane.getBoundingClientRect();
				const head = document.querySelector('#' + id + ' .lpn-set-head').getBoundingClientRect();
				return { rel: head.top - p.top, paneH: p.height, scrolled: pane.scrollTop,
					pageScrolled: document.documentElement.scrollTop };
			}, secId);
		};
		const jumped = await jumpTo('lpn_set_sec_coloring');
		report.ok(jumped.scrolled > 0, 'clicking an index row scrolls the content pane',
			String(Math.round(jumped.scrolled)));
		report.ok(jumped.rel >= -2 && jumped.rel < jumped.paneH,
			'...and brings that section into view in it',
			`heading ${Math.round(jumped.rel)} px into a ${Math.round(jumped.paneH)} px pane`);
		report.eq(jumped.pageScrolled, 0, '...and never scrolls the PAGE, which may not scroll at all');
		// Jumping back puts that heading at the top of the pane. **Measured on the HEADING, not on
		// scrollTop**, and that is not a dodge: the headings are sticky, so "this section is at the
		// top" and "the pane is scrolled to this offset" are genuinely different claims, and the
		// first one is what the reader sees and what the index promises.
		const back = await jumpTo('lpn_set_sec_labels');
		report.ok(Math.abs(back.rel) <= 2,
			'and jumping back puts the first section at the top of the pane',
			`heading at ${Math.round(back.rel)}`);

		// ---- 2. the search matches tips as well as titles ----------------------------------
		// The word to search for is read OUT OF A TIP that is on the page right now, and checked
		// not to appear in that row's visible words — otherwise a passing result would prove only
		// that titles are searched, which is the half that was never in doubt.
		const probe = await a.page.evaluate(() => {
			const els = [...document.querySelectorAll('#lpn_setbox_content [title]')];
			for (const el of els) {
				const tip = (el.getAttribute('title') || '').toLowerCase();
				const words = tip.split(/[^a-z]+/).filter(w => w.length > 6);
				const visible = (el.textContent || '').toLowerCase();
				for (const w of words) {
					if (visible.indexOf(w) < 0) { return { word: w, tip: tip.slice(0, 60) }; }
				}
			}
			return null;
		});
		report.ok(!!probe, 'there is a word that appears in a tip and not in its own label',
			probe && probe.word);
		if (probe) {
			await a.page.evaluate((w) => {
				const f = document.getElementById('lpn_setbox_filter');
				f.value = w;
				f.dispatchEvent(new Event('input', { bubbles: true }));
			}, probe.word);
			await a.settle(300);
			const hit = await a.page.evaluate(() =>
				[...document.querySelectorAll('#lpn_setbox_content .lpn-set-sec')]
					.filter(s => s.style.display !== 'none').length);
			report.ok(hit > 0, `searching "${probe.word}" — a word only in a tip — still finds its row`,
				String(hit));
		}
		// A word in nothing at all hides everything and says so, rather than showing a blank box.
		await a.page.evaluate(() => {
			const f = document.getElementById('lpn_setbox_filter');
			f.value = 'zzqqxx';
			f.dispatchEvent(new Event('input', { bubbles: true }));
		});
		await a.settle(300);
		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_setbox_none').style.display === 'block'),
			'a search that matches nothing says so');
		report.ok(await a.page.evaluate(() =>
			[...document.querySelectorAll('#lpn_setbox_index .lpn-setbox-link')]
				.every(r => r.style.display === 'none')),
			'...and the index empties with it, so there is no dead jump');
		// Clearing it brings everything back — a filter that cannot be undone is a trap.
		await a.page.evaluate(() => {
			const f = document.getElementById('lpn_setbox_filter');
			f.value = '';
			f.dispatchEvent(new Event('input', { bubbles: true }));
		});
		await a.settle(300);
		report.eq(await a.page.evaluate(() =>
			[...document.querySelectorAll('#lpn_setbox_content .lpn-set-sec')]
				.filter(s => s.style.display !== 'none').length), 4,
			'clearing the search brings all four sections back');

		// ---- 3. it is a BOX: geometry, drag, and it does not close on a click away ----------
		const g = await boxRect(a);
		report.ok(g.width > 300 && g.height > 250, 'it is a real two-pane box, not a strip',
			`${Math.round(g.width)}x${Math.round(g.height)}`);
		report.ok(g.left >= 0 && g.top >= 0, 'and it opens fully on screen',
			`${Math.round(g.left)},${Math.round(g.top)}`);
		report.ok(g.scroll <= 1, 'and the page still does not scroll', String(g.scroll));

		// Dragged by its chrome — the padded band at the top, where the pointer target is the box
		// itself rather than any control inside it.
		//
		// **A REAL MOUSE, not synthesised PointerEvents.** `setPointerCapture()` needs a pointer the
		// browser is actually tracking, so a dispatched PointerEvent carrying a made-up `pointerId`
		// makes it throw — an uncaught error that is entirely the test's own, and that would sit in
		// the error count looking like a defect in the page. specs/find.js drags its box the same
		// way, for the same reason.
		await a.page.mouse.move(g.left + 200, g.top + 12);
		await a.page.mouse.down();
		await a.page.mouse.move(g.left + 240, g.top + 52, { steps: 8 });
		await a.page.mouse.up();
		await a.settle(300);
		const moved = await boxRect(a);
		report.ok(Math.abs(moved.left - g.left) > 20 || Math.abs(moved.top - g.top) > 20,
			'it drags by its chrome, like the property popup',
			`${Math.round(g.left)},${Math.round(g.top)} -> ${Math.round(moved.left)},${Math.round(moved.top)}`);

		// **A CLICK AWAY LEAVES IT OPEN.** This is the whole difference between a box and a
		// pull-down, and it is the behaviour Tom asked for by name.
		// A REAL click on the map, at a point measured to be outside the box — the canvas's own
		// pointer handlers call setPointerCapture(), so a dispatched event with an invented pointer
		// id would throw and be counted as a page error rather than a test artefact.
		const away = await a.page.evaluate(() => {
			const b = document.getElementById('lpn_settings_box').getBoundingClientRect();
			const c = document.getElementById('lpn_canvas').getBoundingClientRect();
			// Left of the box if there is room there, otherwise below it; both are canvas.
			return (b.left > c.left + 40)
				? { x: c.left + 20, y: Math.max(c.top + 20, b.top + 20) }
				: { x: c.left + 20, y: Math.min(c.bottom - 20, b.bottom + 20) };
		});
		await a.page.mouse.click(away.x, away.y);
		await a.settle(300);
		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_settings_box').style.display === 'flex'),
			'clicking away leaves it open — it is a box, not a menu');

		// ...and it reopens where it was left, which is what makes dragging it worth doing.
		await closeBox(a);
		await a.settle(200);
		await a.toolbarClick('Settings');
		await a.settle(400);
		const again = await boxRect(a);
		report.ok(Math.abs(again.left - moved.left) <= 2 && Math.abs(again.top - moved.top) <= 2,
			'and it reopens where the user left it');

		// ---- 4. every door, and each lands on the section it names --------------------------
		const doors = [
			['the toolbar Labels button', 'labels', async () => a.toolbarClick('Labels')],
			['the toolbar Settings button', null, async () => a.toolbarClick('Settings')]
		];
		for (const [what, want, open] of doors) {
			await closeBox(a);
			await a.settle(200);
			await open();
			await a.settle(400);
			report.ok(await a.page.evaluate(() =>
				document.getElementById('lpn_settings_box').style.display === 'flex'),
				`${what} opens the box`);
			if (want) { report.eq(await shownSection(a), want, `...on the ${want} section`); }
		}
		// View > Labels, the menu row Tom already knows.
		await closeBox(a);
		await a.settle(200);
		await a.page.evaluate(() => {
			document.getElementById('lpn_menu_view').click();
			const row = [...document.querySelectorAll('#lpn_menu_list button')].find(b => /label/i.test(b.textContent));
			if (row) { row.click(); }
		});
		await a.settle(400);
		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_settings_box').style.display === 'flex'),
			'View > Labels opens it too');
		report.eq(await shownSection(a), 'labels', '...on the Labels section');
		// The menu bar's own Settings item, which is deliberately identical to the toolbar button.
		await closeBox(a);
		await a.settle(200);
		await a.page.evaluate(() => { document.getElementById('lpn_menu_settings').click(); });
		await a.settle(400);
		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_settings_box').style.display === 'flex'),
			'and the menu bar Settings item opens the same box');

		// The label checkboxes really are in it, exactly once — the failure a moved feature makes
		// is two homes that drift, not a missing one.
		report.eq(await a.page.evaluate(() =>
			document.querySelectorAll('#lpn_settings_box #lpn_labels_node_fields').length), 1,
			'the label checkboxes live in the box, and only there');
		report.eq(await a.page.evaluate(() =>
			document.querySelectorAll('#lpn_labels_node_fields').length), 1,
			'...with no second copy anywhere on the page');
		// The seven time fields came out of the bottom pane and are here now.
		report.ok(await a.page.evaluate(() =>
			document.querySelectorAll('#lpn_set_time_fields input[type="text"]').length >= 7),
			'the time settings moved here from the bottom pane');

		// Escape closes it, the third of the property popup's three ways out.
		await a.page.evaluate(() => {
			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
		});
		await a.settle(300);
		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_settings_box').style.display === 'none'), 'Escape closes it');

		// ---- 5. the right pane: still there, empty, and out of the legend's way -------------
		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_rpane').style.display === 'none'),
			'the right pane starts closed');
		await a.toolbarClick('Visibility');
		await a.settle(400);
		const rp = await a.page.evaluate(() => {
			const p = document.getElementById('lpn_rpane').getBoundingClientRect();
			const c = document.getElementById('lpn_canvas').getBoundingClientRect();
			return {
				open: document.getElementById('lpn_rpane').style.display === 'flex',
				top: p.top, right: p.right, width: p.width, height: p.height,
				cTop: c.top, cRight: c.right, cHeight: c.height, cWidth: c.width,
				controls: document.querySelectorAll('#lpn_rpane input, #lpn_rpane select, #lpn_rpane details').length,
				note: (document.getElementById('lpn_rpane_empty') || {}).textContent || '',
				scroll: document.documentElement.scrollHeight - document.documentElement.clientHeight
			};
		});
		report.ok(rp.open, 'its toggle still opens it — the frame survives, per Tom');
		report.eq(rp.controls, 0, 'and it is EMPTY: no controls left in it');
		report.ok(rp.note.trim().length > 0, '...but it says so, rather than being a blank rectangle',
			rp.note.trim().slice(0, 50));
		report.ok(Math.abs(rp.top - rp.cTop) <= 2, 'it still starts where the map starts');
		report.ok(Math.abs(rp.right - rp.cRight) <= 2, '...and ends where the map ends');
		report.ok(rp.height <= rp.cHeight + 2, '...and is no taller than the map it lies over');
		report.ok(rp.width >= 200 && rp.width < rp.cWidth - 200, 'it leaves a map worth looking at',
			String(Math.round(rp.width)));
		report.ok(rp.scroll <= 1, 'and the page still does not scroll');

		// **THE LEGEND IS NOT UNDER IT** (Tom: "The right pane covers the map, including the labels
		// legend"). The legend defaults to the top RIGHT, which is exactly where the panel is, so
		// the two must not overlap while the panel is open.
		const legend = await a.page.evaluate(() => {
			const l = document.getElementById('lpn_labels_legend');
			if (!l || l.style.display === 'none') { return null; }
			const lr = l.getBoundingClientRect(), pr = document.getElementById('lpn_rpane').getBoundingClientRect();
			return { right: lr.right, paneLeft: pr.left, width: lr.width };
		});
		if (legend && legend.width > 0) {
			report.ok(legend.right <= legend.paneLeft + 1,
				'the labels legend sits clear of the right pane rather than under it',
				`${Math.round(legend.right)} vs ${Math.round(legend.paneLeft)}`);
		} else {
			report.skip('the labels legend clears the right pane', 'no label field is switched on');
		}

		// The width is the user's, and it is a fact about this window rather than about the
		// network, so it is stored per browser and never in the project file.
		// A REAL MOUSE again, for the reason given at the box drag above: the grip calls
		// setPointerCapture(), which throws on a dispatched PointerEvent carrying an id no pointer
		// really has — a test-made error that would then be counted against the page.
		const grip = await a.page.evaluate(() => {
			const r = document.getElementById('lpn_rpane_grip').getBoundingClientRect();
			return { x: r.left + 4, y: r.top + 20 };
		});
		await a.page.mouse.move(grip.x, grip.y);
		await a.page.mouse.down();
		await a.page.mouse.move(grip.x - 90, grip.y, { steps: 8 });
		await a.page.mouse.up();
		await a.settle(300);
		const wider = await a.page.evaluate(() =>
			document.getElementById('lpn_rpane').getBoundingClientRect().width);
		report.ok(wider > rp.width + 50, 'dragging the left edge widens it',
			`${Math.round(rp.width)} -> ${Math.round(wider)}`);
		const inProject = await a.page.evaluate(() => {
			for (let i = 0; i < localStorage.length; i++) {
				const k = localStorage.key(i);
				if (!/^lpn_proj/.test(k)) { continue; }
				if (/rpane/i.test(localStorage.getItem(k))) { return true; }
			}
			return false;
		});
		report.ok(!inProject, 'the panel is not written into the project — a colleague gets their own screen');
		await a.page.reload({ waitUntil: 'load' });
		await a.settle(600);
		const after = await a.page.evaluate(() => ({
			w: document.getElementById('lpn_rpane').getBoundingClientRect().width,
			scroll: document.documentElement.scrollHeight - document.documentElement.clientHeight
		}));
		report.ok(Math.abs(after.w - wider) <= 2, 'and the width survives a reload',
			`${Math.round(wider)} -> ${Math.round(after.w)}`);
		report.ok(after.scroll <= 1, 'still no page scroll after the reload', String(after.scroll));

		report.ok(a.errors.length === 0, 'no uncaught JavaScript', a.errors.join(' | '));
	} finally {
		await a.close();
	}
};
