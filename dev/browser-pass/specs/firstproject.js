// §50 — R-208: Project1 opens geographic, at Downtown Novato Center, map off.
//
// Tom, dev/tom-review-queue.md R-208: "The default Project1 tab has a path of frustration. If a
// user tries to attach the world map, it tells him that can't be done without any network. ... Or
// we start the Project1 on WGS84 zoomed to our favorite place ... possibly the exact view we get
// when we send a search to Mapbox for Downtown Novato Center, Novato, CA."
//
// Two things only a real browser, on a fresh profile, can answer:
//   1. The examples gallery still covers the canvas, unchanged, because it asks "any nodes?" and
//      not "what coordinate system?".
//   2. Nothing is fetched from tile.openstreetmap.org until the visitor's own action -- Project1's
//      basemap defaults OFF even though every other door into "geographic" defaults it on, because
//      a first visit is not an action and privacy.php promises the tile fetch "asks you first".

const { Session } = require('../lib/session');

exports.title = '50. Project1: geographic, Novato, map off until Attach';

async function galleryShowing(a) {
	return a.page.evaluate(() => {
		const h = document.getElementById('lpn_empty_hint');
		if (!h || h.style.display === 'none') { return false; }
		const r = h.getBoundingClientRect();
		return r.width > 0 && r.height > 0;
	});
}
async function tileCount(offSite) {
	return offSite.filter((u) => /tile\.openstreetmap\.org/.test(u)).length;
}

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	const offSite = [];
	try {
		await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		a.page.on('request', (req) => { offSite.push(req.url()); });

		await a.goto();

		// ---- the gallery is untouched by any of this -------------------------------------------
		report.ok(await galleryShowing(a), 'a first visit still meets the examples gallery',
			'R-208 must not trade one first-visit defect for another');

		// ---- nothing left this page before the visitor did anything at all ----------------------
		await a.settle(500);
		report.eq(await tileCount(offSite), 0,
			'no OpenStreetMap tile request fires on a first visit with no action taken',
			offSite.filter((u) => !u.startsWith(a.page.url().split('/Looped')[0])).join(', ') || '(none off-site)');

		// ---- the coordinate readout says Novato, not the Atlantic and not X/Y -------------------
		// The gallery has to come down first: it is a wrapper that takes pointer events back from
		// the canvas underneath it (session.js's own note on dismissGallery()), so a hover over it
		// reads no coordinate at all -- not evidence about the project's coordinate frame.
		await a.dismissGallery();
		const box = await a.page.evaluate(() => {
			const r = document.getElementById('lpn_canvas').getBoundingClientRect();
			return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
		});
		await a.page.mouse.move(box.x, box.y);
		await a.settle(150);
		const read = await a.page.evaluate(() => document.getElementById('lpn_coords').textContent);
		report.ok(/Longitude/.test(read) && /Latitude/.test(read),
			'Project1 reads in degrees -- it is geographic, not schematic', read);
		const m = read.match(/Latitude:\s*(-?[\d.]+)\s+Longitude:\s*(-?[\d.]+)/);
		report.ok(!!m, '...with two numbers in it', read);
		if (m) {
			report.ok(Math.abs(+m[1] - 38.108195) < 0.01 && Math.abs(+m[2] - (-122.579669)) < 0.01,
				'...and it opens on Downtown Novato Center, not LPN_GEO_HOME (0,0)', m[1] + ', ' + m[2]);
		}

		// ---- R-208's headline complaint: attaching the world map from Project1 now works --------
		const WORLD = await a.lang('lpn_map_attach_menu');
		const ATTACH = await a.lang('lpn_map_attach_add');
		const rowsBefore = await a.menuRows('map');
		const worldRowBefore = rowsBefore.find((r) => r.label === WORLD);
		report.ok(!!worldRowBefore && !worldRowBefore.disabled,
			'World map row is enabled on Project1, unlike the reported schematic-default error',
			JSON.stringify(worldRowBefore));

		await a.menuClickSub(WORLD, ATTACH, 'map');
		await a.settle(900);
		const tiles = await a.page.$$eval('.lpn-basemap image', (els) => els.length);
		report.ok(tiles > 0, 'Attach, from Project1, now paints the world map', tiles + ' tiles');
		report.ok(await tileCount(offSite) > 0,
			'...and the tile request happened only now, after the visitor pressed Attach');

		// ---- Zoom to fit on an empty project must not throw --------------------------------------
		const fitLabel = await a.lang('lpn_tool_zoom_extent');
		const fitOk = await a.page.evaluate((l) => {
			try {
				const b = Array.from(document.querySelectorAll('button')).find((x) => x.offsetParent &&
					((x.getAttribute('aria-label') || '') === l || (x.textContent || '').trim() === l));
				if (b) { b.click(); }
				return { clicked: !!b, threw: null };
			} catch (e) { return { clicked: false, threw: String(e) }; }
		}, fitLabel);
		await a.settle(300);
		report.ok(fitOk.clicked && !fitOk.threw, 'Zoom to fit on the (still empty) project does not throw',
			JSON.stringify(fitOk));

		// ---- File > New project behaviour is unchanged --------------------------------------------
		await a.newProject();
		await a.settle(400);
		await a.page.mouse.move(box.x + 5, box.y + 5);
		await a.settle(150);
		const grid = await a.page.evaluate(() => document.getElementById('lpn_coords').textContent);
		report.ok(/^X:/.test(grid.trim()), 'File > New project still opens a plain grid project by default', grid);

		report.eq(a.errors.length, 0, 'no uncaught JavaScript', a.errors[0] || '');
	} finally {
		await a.close();
	}
};
