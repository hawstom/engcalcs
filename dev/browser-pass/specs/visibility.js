// §16 — the Visibility panel at the right of the map (ROADMAP Tasks 427 and 434).
//
// Tom, 2026-08-18: "(b) Labels becomes Visibility (tentative name) and serves our label settings
// plus color ramping and scaling range by value ... Labels/Visibility and Settings have two-pane
// index and scroll/jump access paradigm or headings collapse paradigm depending on how long they
// are. Two-pane for very long lists and collapse for shorter lists."
//
// What can be quietly wrong about a docked panel is never arithmetic; it is a layout the user has
// to fight. Three ways, and all three are measured here:
//   1. it must not push the page into scrolling — the root is overflow:hidden (Task 432) and this
//      panel lies over the map rather than beside it, so a wrong height or width shows up as the
//      page growing;
//   2. it must be reachable from every door Tom already knows — the toolbar button, View > Labels,
//      the toolbar's own Labels button, and the legend;
//   3. its width must survive a reload, because a panel that forgets is a panel you re-drag every
//      time you open a project.

const { Session } = require('../lib/session');

exports.title = '16. The Visibility panel';

const box = (a) => a.page.evaluate(() => {
	const p = document.getElementById('lpn_rpane').getBoundingClientRect();
	const c = document.getElementById('lpn_canvas').getBoundingClientRect();
	return {
		p: { top: p.top, right: p.right, width: p.width, height: p.height },
		c: { top: c.top, right: c.right, width: c.width, height: c.height },
		scroll: document.documentElement.scrollHeight - document.documentElement.clientHeight
	};
});

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		await a.dismissGallery();
		await a.makeEdit();

		await a.toolbarClick('Visibility');
		await a.settle(400);
		const g = await box(a);
		report.ok(Math.abs(g.p.top - g.c.top) <= 2, 'the panel starts where the map starts',
			`${g.p.top} vs ${g.c.top}`);
		report.ok(Math.abs(g.p.right - g.c.right) <= 2, '...and ends where the map ends',
			`${g.p.right} vs ${g.c.right}`);
		report.ok(g.p.height <= g.c.height + 2, '...and is no taller than the map it lies over',
			`${g.p.height} vs ${g.c.height}`);
		report.ok(g.p.width >= 200 && g.p.width < g.c.width - 200,
			'it leaves a map worth looking at', String(g.p.width));
		report.ok(g.scroll <= 1, 'and the page still does not scroll', String(g.scroll));

		// The sections collapse, which is the paradigm Tom picked for a short list.
		const secs = await a.page.evaluate(() =>
			[...document.querySelectorAll('#lpn_rpane details')].map(d => ({
				id: d.id, open: d.open, head: d.querySelector('summary').textContent.trim()
			})));
		report.eq(secs.length, 2, 'two sections', secs.map(s => s.head).join(' | '));
		report.ok(secs.every(s => s.open), 'both open to begin with');
		await a.page.evaluate(() => { document.querySelector('#lpn_rp_labels_sec > summary').click(); });
		await a.settle(200);
		report.ok(await a.page.evaluate(() => !document.getElementById('lpn_rp_labels_sec').open),
			'a heading collapses its section');

		// EVERY DOOR. The toolbar's Labels button and View > Labels both open this panel now, and
		// both must also OPEN the section they name — a collapsed section would answer the request
		// with nothing.
		await a.page.evaluate(() => { document.getElementById('lpn_rpane_close').click(); });
		await a.settle(200);
		await a.toolbarClick('Labels');
		await a.settle(300);
		report.ok(await a.page.evaluate(() => document.getElementById('lpn_rpane').style.display === 'flex'),
			'the toolbar Labels button opens the panel');
		report.ok(await a.page.evaluate(() => document.getElementById('lpn_rp_labels_sec').open),
			'...on the Labels section, even after it was collapsed');
		await a.page.evaluate(() => { document.getElementById('lpn_rpane_close').click(); });
		await a.settle(200);
		await a.page.evaluate(() => {
			document.getElementById('lpn_menu_view').click();
			const row = [...document.querySelectorAll('#lpn_menu_list button')].find(b => /label/i.test(b.textContent));
			if (row) { row.click(); }
		});
		await a.settle(300);
		report.ok(await a.page.evaluate(() => document.getElementById('lpn_rpane').style.display === 'flex'),
			'View > Labels opens it too — the nod in the right direction still works');

		// The width is the user's, and it is a fact about this window rather than about the network,
		// so it is stored per browser and never in the project file.
		await a.page.evaluate(() => {
			const grip = document.getElementById('lpn_rpane_grip');
			const r = grip.getBoundingClientRect();
			const opts = (x) => ({ bubbles: true, clientX: x, clientY: r.top + 20, pointerId: 1 });
			grip.dispatchEvent(new PointerEvent('pointerdown', opts(r.left + 4)));
			grip.dispatchEvent(new PointerEvent('pointermove', opts(r.left - 90)));
			grip.dispatchEvent(new PointerEvent('pointerup', opts(r.left - 90)));
		});
		await a.settle(300);
		const wider = (await box(a)).p.width;
		report.ok(wider > g.p.width + 50, 'dragging the left edge widens it', `${g.p.width} -> ${wider}`);
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
		const after = await box(a);
		report.ok(Math.abs(after.p.width - wider) <= 2, 'and the width survives a reload',
			`${wider} -> ${after.p.width}`);
		report.ok(after.scroll <= 1, 'still no page scroll after the reload', String(after.scroll));

		report.eq(a.errors.length, 0, 'no uncaught JavaScript');
	} finally {
		await a.close();
	}
};
