// §46 — the World map row on a GRID project, driven end to end in a real browser (feat/map-menu).
//
// Perry's re-review, 2026-09-22: undo restored the menu's idea of the map but not the canvas,
// because undo() repainted only when the coordinate KIND changed. The harness
// (dev/lpn-spike/projected-basemap-harness.js §13c) counts tiles in the stub; this counts them on
// the real page, after the real wizard, through the real keyboard. Every assertion about the map is
// a count of painted tiles, never the submenu's opinion -- the defect was exactly the two
// disagreeing.
//
// There is no redo command on this page, so there is no Ctrl+Y to drive.
//
// The tile server is never called: every request is aborted, and an aborted tile still produces an
// <image> at its full geometry, which is what is counted (the same arrangement as basemap.js).

const { Session } = require('../lib/session');

exports.title = '46. World map on a grid project: wizard, Detach, Ctrl+Z, Attach';

async function tiles(a) {
	return a.page.evaluate(() => document.querySelectorAll('.lpn-basemap image').length);
}
async function undoKey(a) {
	// Ctrl+Z is deliberately left to the browser inside a text field, so nothing may hold focus.
	await a.page.evaluate(() => { if (document.activeElement) { document.activeElement.blur(); } });
	await a.page.keyboard.press('Control+z');
	await a.settle(600);
}

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await a.goto();
		await a.dismissGallery();
		await a.newProject();
		await a.settle(500);
		await a.makeEdit();
		const WORLD = await a.lang('lpn_map_attach_menu');
		const ATTACH = await a.lang('lpn_map_attach_add');
		const DETACH = await a.lang('lpn_map_attach_remove');
		report.eq(await tiles(a), 0, 'set up: a grid project with no world map paints no tiles');

		// ---- the wizard, to completion -------------------------------------------------------------
		await a.menuClickSub(WORLD, ATTACH, 'map');
		await a.page.waitForSelector('#lpn_mapgeo_place', { state: 'visible' });
		await a.page.click('#lpn_mapgeo_place');
		await a.page.waitForSelector('#lpn_mapgeo_finish', { state: 'visible' });
		await a.page.click('#lpn_mapgeo_finish');
		await a.settle(900);
		const placed = await tiles(a);
		report.ok(placed > 0, 'the wizard, finished, paints the world map', placed + ' tiles');

		// ---- Detach, Ctrl+Z, Attach, Ctrl+Z, all counted on the canvas -----------------------------
		await a.menuClickSub(WORLD, DETACH, 'map');
		await a.settle(600);
		report.eq(await tiles(a), 0, 'Detach clears the canvas');

		await undoKey(a);
		const back = await tiles(a);
		report.ok(back > 0, '**Ctrl+Z after Detach paints the tiles again**', back + ' tiles');

		await a.menuClickSub(WORLD, DETACH, 'map');
		await a.settle(600);
		await a.menuClickSub(WORLD, ATTACH, 'map');
		await a.settle(900);
		const again = await tiles(a);
		const wizard = await a.page.evaluate(() => {
			const b = document.getElementById('lpn_mapgeo_bar');
			return !!b && b.style.display !== 'none';
		});
		report.ok(again > 0 && !wizard, 'Attach on the kept placement paints it again, with no wizard',
			again + ' tiles, wizard ' + (wizard ? 'open' : 'closed'));

		await undoKey(a);
		report.eq(await tiles(a), 0, '**Ctrl+Z after Attach clears the canvas again**');

		// The submenu agrees with the canvas, which is the other half of the defect.
		await a.openMenu('map');
		await a.page.click('#lpn_menu_list button.lpn-menu-row >> text=' + WORLD);
		await a.page.waitForSelector('#lpn_menu_popup2', { state: 'visible' });
		const sub = await a.page.$$eval('#lpn_menu_list2 button.lpn-menu-row',
			(els) => els.map(e => ({ label: e.textContent.trim(), disabled: e.disabled })));
		await a.closeMenu();
		const att = sub.find(r => r.label === ATTACH), det = sub.find(r => r.label === DETACH);
		report.ok(!!att && !att.disabled && !!det && det.disabled,
			'...and the submenu says detached too: Attach live, Detach greyed', JSON.stringify(sub));

		report.eq(a.errors.length, 0, 'no uncaught JavaScript', a.errors[0] || '');
	} finally {
		await a.close();
	}
};
