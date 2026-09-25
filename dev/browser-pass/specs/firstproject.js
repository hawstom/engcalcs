// §50 — R-208: Project1 opens geographic, at Downtown Novato Center, with the street map on.
//
// Tom, dev/tom-review-queue.md R-208: "The default Project1 tab has a path of frustration. If a
// user tries to attach the world map, it tells him that can't be done without any network. ... Or
// we start the Project1 on WGS84 zoomed to our favorite place ..."
//
// Tom, 2026-09-25, on the first build of it: "I hit escape on the gallery, add some nodes, and
// click Zoom to fit. Nothing appears. There are nodes, but they are not visible, even when I zoom
// to fit." / "choose Map, World map, Attach ... Nothing appears." / "we need to have this visible
// on first load behind the gallery." / "The status bar says WGS 84 / Pseudo-Mercator (EPSG:3857),
// but the coordinates are lat/lon."
//
// **THE FIRST BUILD OF THIS SPEC PASSED OVER BOTH DEFECTS**, and why is the reason for every
// measurement below. It counted `<image>` and node elements, and they all existed: they were laid
// out 20 to 135 MILLION pixels off the canvas, because an empty geographic document kept origin
// {0, 0} while the camera sat over Novato at street zoom (followViewWhileEmpty() in
// looped-network.js). So this counts only what is ON THE CANVAS, at a drawn size a person can see.
//
// Tiles are answered locally with a real PNG, so the count does not depend on the network and no
// request reaches tile.openstreetmap.org from a test run.

const { Session } = require('../lib/session');

exports.title = '50. Project1: geographic, Novato, street map on; nodes and tiles on screen';

// One 1x1 PNG, served for every tile.
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

async function galleryShowing(a) {
	return a.page.evaluate(() => {
		const h = document.getElementById('lpn_empty_hint');
		if (!h || h.style.display === 'none') { return false; }
		const r = h.getBoundingClientRect();
		return r.width > 0 && r.height > 0;
	});
}
// Things drawn INSIDE the canvas's own rectangle, at least `minPx` across. A symbol millions of
// pixels away, or one scaled to nothing, is not "drawn" to anybody looking.
async function onCanvas(a, selector, minPx) {
	return a.page.evaluate(([sel, min]) => {
		const c = document.getElementById('lpn_canvas'), cr = c.getBoundingClientRect();
		return Array.from(c.querySelectorAll(sel)).filter((e) => {
			const b = e.getBoundingClientRect();
			return b.width >= min && b.height >= min && b.right > cr.left && b.left < cr.right &&
				b.bottom > cr.top && b.top < cr.bottom;
		}).length;
	}, [selector, minPx]);
}
// Junctions are circles; the node grab band is an invisible circle too and is not drawn ink.
const NODES = '.lpn-symbols > circle:not(.lpn-node-hit)';
const TILES = '.lpn-basemap image';
async function canvasBox(a) {
	return a.page.evaluate(() => {
		const r = document.getElementById('lpn_canvas').getBoundingClientRect();
		return { x: r.x, y: r.y, w: r.width, h: r.height };
	});
}
async function pressFit(a) {
	await a.toolbarClick(await a.lang('lpn_tool_zoom_extent'));
	await a.settle(600);
}
// Longitude under a screen point, from the page's own readout.
async function lonAt(a, x, y) {
	await a.page.mouse.move(x, y);
	await a.settle(120);
	const t = await a.page.evaluate(() => document.getElementById('lpn_coords').textContent);
	const m = t.match(/Longitude:\s*(-?[\d.]+)/);
	return m ? +m[1] : NaN;
}
async function freshFirstVisit(browser, name, tiles) {
	const a = await Session.open(browser, name);
	await a.page.route(/tile\.openstreetmap\.org/, (route) => {
		tiles.push(route.request().url());
		route.fulfill({ status: 200, contentType: 'image/png', body: PNG });
	});
	await a.page.route(/api\.mapbox\.com|nominatim/, (route) => route.abort());
	await a.goto();
	await a.settle(900);
	return a;
}

exports.run = async function ({ browser, report }) {
	const tiles = [];
	const a = await freshFirstVisit(browser, 'A', tiles);
	try {
		// ---- first load: the gallery on top, the street map behind it -------------------------
		report.ok(await galleryShowing(a), 'a first visit still meets the examples gallery');
		const bootTiles = await onCanvas(a, TILES, 20);
		report.ok(bootTiles > 0, 'the street map is drawn behind the gallery on first load, no action taken',
			bootTiles + ' tiles on the canvas, ' + tiles.length + ' requested');
		report.ok(!(await a.currentTabStar()), 'and Project1 is still born clean with its map on');

		// ---- the status strip names what the numbers ARE -----------------------------------------
		const crs = await a.page.evaluate(() => (document.getElementById('lpn_crs') || {}).textContent || '');
		report.ok(/WGS 84 \(EPSG:4326\)/.test(crs) && !/3857|Pseudo-Mercator/.test(crs),
			'the status strip says WGS 84 (EPSG:4326), never the metres of EPSG:3857', JSON.stringify(crs));

		// ---- the coordinate readout says Novato ---------------------------------------------------
		// Tom's own gesture: Escape, not the "blank map" link.
		await a.page.keyboard.press('Escape');
		await a.settle(300);
		report.ok(!(await galleryShowing(a)), 'Escape waves the gallery away');
		const box = await canvasBox(a);
		await a.page.mouse.move(box.x + box.w / 2, box.y + box.h / 2);
		await a.settle(150);
		const read = await a.page.evaluate(() => document.getElementById('lpn_coords').textContent);
		const m = read.match(/Latitude:\s*(-?[\d.]+)\s+Longitude:\s*(-?[\d.]+)/);
		report.ok(!!m && Math.abs(+m[1] - 38.108195) < 0.01 && Math.abs(+m[2] - (-122.579669)) < 0.01,
			'Project1 opens in degrees, on Downtown Novato Center', read);

		// ---- Tom's sequence: add some nodes and a pipe, press Zoom to fit ------------------------
		await a.toolbarClick(await a.lang('lpn_tool_add_junction'));
		const spots = [[0.30, 0.40], [0.42, 0.46], [0.55, 0.52], [0.68, 0.58]]
			.map(([fx, fy]) => ({ x: box.x + box.w * fx, y: box.y + box.h * fy }));
		for (const p of spots) { await a.page.mouse.click(p.x, p.y); await a.settle(250); }
		report.eq(await a.nodeCount(), 4, 'four junctions were placed');
		await a.toolbarClick(await a.lang('lpn_tool_add_pipe'));
		await a.page.mouse.click(spots[0].x, spots[0].y); await a.settle(150);
		await a.page.mouse.click(spots[1].x, spots[1].y); await a.settle(300);
		await a.toolbarClick('Select');
		const placed = await onCanvas(a, NODES, 3);
		report.ok(placed >= 4, 'the junctions are ON the canvas as they are placed', placed + ' drawn on the canvas');
		const pipes = await onCanvas(a, '.lpn-symbols > path, .lpn-symbols > line, .lpn-symbols > polyline', 1);
		report.ok(pipes > 0, '...and so is the pipe', pipes + ' link shapes on the canvas');
		await pressFit(a);
		const fitted = await onCanvas(a, NODES, 3);
		report.ok(fitted >= 4, 'after Zoom to fit every junction is still on the canvas at a visible size',
			fitted + ' drawn on the canvas');
		const tilesAfterFit = await onCanvas(a, TILES, 20);
		report.ok(tilesAfterFit > 0, '...with the street map still under them', tilesAfterFit + ' tiles');

		// ---- World map: Detach, then Attach, and the tiles are there without any zoom ------------
		const WORLD = await a.lang('lpn_map_attach_menu');
		await a.menuClickSub(WORLD, await a.lang('lpn_map_attach_remove'), 'map');
		await a.settle(500);
		report.eq(await onCanvas(a, TILES, 20), 0, 'Map, World map, Detach hides the street map');
		await a.menuClickSub(WORLD, await a.lang('lpn_map_attach_add'), 'map');
		await a.settle(900);
		const reTiles = await onCanvas(a, TILES, 20);
		report.ok(reTiles > 0, 'Map, World map, Attach draws tiles at once, with no zoom in between',
			reTiles + ' tiles on the canvas');

		report.eq(a.errors.length, 0, 'no uncaught JavaScript', a.errors[0] || '');
	} finally {
		await a.close();
	}

	// ---- a single junction has no extent; Zoom to fit frames it at street scale --------------
	const b = await freshFirstVisit(browser, 'B', []);
	try {
		await b.page.keyboard.press('Escape');
		await b.settle(300);
		const box = await canvasBox(b);
		// Tom's second sequence, on the EMPTY project: Detach, then Attach, and no zoom at all.
		const WORLD = await b.lang('lpn_map_attach_menu');
		await b.menuClickSub(WORLD, await b.lang('lpn_map_attach_remove'), 'map');
		await b.settle(500);
		await b.menuClickSub(WORLD, await b.lang('lpn_map_attach_add'), 'map');
		await b.settle(900);
		const emptyTiles = await onCanvas(b, TILES, 20);
		report.ok(emptyTiles > 0, 'on the still-empty Project1, Attach draws tiles at once with no zoom',
			emptyTiles + ' tiles on the canvas');
		await b.toolbarClick(await b.lang('lpn_tool_add_junction'));
		await b.page.mouse.click(box.x + box.w * 0.2, box.y + box.h * 0.3);
		await b.settle(300);
		await b.toolbarClick('Select');
		await pressFit(b);
		report.eq(await onCanvas(b, NODES, 3), 1, 'one junction, Zoom to fit: it is on the canvas at a visible size');
		const span = Math.abs(await lonAt(b, box.x + box.w - 30, box.y + box.h / 2) -
			await lonAt(b, box.x + 30, box.y + box.h / 2));
		report.ok(span > 0.0005 && span < 0.02,
			'...framed at street scale, not a continent and not a doorstep', span.toFixed(5) + ' degrees across');
		report.eq(b.errors.length, 0, 'no uncaught JavaScript (single junction)', b.errors[0] || '');
	} finally {
		await b.close();
	}

	// ---- File > New project is unchanged -------------------------------------------------------
	const c = await Session.open(browser, 'C');
	try {
		await c.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
		await c.goto();
		await c.newProject();
		await c.settle(400);
		const box = await canvasBox(c);
		await c.page.mouse.move(box.x + box.w / 2, box.y + box.h / 2);
		await c.settle(150);
		const grid = await c.page.evaluate(() => document.getElementById('lpn_coords').textContent);
		report.ok(/^X:/.test(grid.trim()), 'File > New project still opens a plain grid project by default', grid);
	} finally {
		await c.close();
	}
};
