// §12 — a geographic project (ROADMAP Task 145, slice 1).
//
// Two facts a harness cannot reach, because both are about what the page DOES on opening:
//
//   1. **It opens somewhere.** An empty project has no extent to fit, so a geographic project with
//      no home view inherits whatever transform the last grid project left — which on a lon/lat
//      document is the middle of an ocean at an arbitrary scale.
//   2. **The zoom bounds are in the document's own units.** MIN/MAX_SCALE are pixels per world
//      unit, and a world unit here is a DEGREE. Clamped to the grid ceiling, the home view opened
//      130 km across and the feature looked broken while every number in it was right.
//
// There is deliberately no basemap yet; tiles are the next slice.

const { Session } = require('../lib/session');

exports.title = '12. Geographic projects';

// **A NEW LAT/LON PROJECT OPENS ON THE WHOLE WORLD**, centred on 0,0 -- LPN_GEO_HOME. It used to
// open on the ground under EPA's Net3, which is a fine place for an example and a strange place to be
// dropped when your site is in Kenya; this spec still said Net3 for a while after that changed.
const HOME = { lon: 0, lat: 0 };

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		await a.dismissGallery();
		await a.newGeoProject();
		await a.settle(600);

		// The readout is where a geographic project announces itself — no badge, no banner.
		const box = await a.page.evaluate(() => {
			const r = document.getElementById('lpn_canvas').getBoundingClientRect();
			return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
		});
		await a.page.mouse.move(box.x, box.y);
		await a.settle(150);
		const read = await a.page.evaluate(() => document.getElementById('lpn_coords').textContent);

		report.ok(/Longitude/.test(read) && /Latitude/.test(read),
			'the coordinate readout speaks in degrees', read);

		const m = read.match(/Longitude:\s*(-?[\d.]+)\s+Latitude:\s*(-?[\d.]+)/);
		report.ok(!!m, '...with two numbers in it', read);
		if (m) {
			// Within a few hundred metres of the centre: the pointer is at the middle of the canvas,
			// which is what the home view centres on.
			report.ok(Math.abs(+m[1] - HOME.lon) < 1 && Math.abs(+m[2] - HOME.lat) < 1,
				'and the map opens on the whole world, centred on 0,0', m[1] + ', ' + m[2]);
			// Six decimals is ~0.11 m. Two would put a whole site at one coordinate.
			report.ok(/\.\d{6}\b/.test(m[1]), '...to a precision a pipe can be placed at', m[1]);
		}

		// A grid project in the same browser must be untouched by any of it.
		await a.newProject();
		await a.settle(400);
		await a.page.mouse.move(box.x + 5, box.y + 5);
		await a.settle(150);
		const grid = await a.page.evaluate(() => document.getElementById('lpn_coords').textContent);
		report.ok(/^X:/.test(grid.trim()), 'a grid project still reads X and Y', grid);

		report.eq(a.errors.length, 0, 'no uncaught JavaScript');
	} finally {
		await a.close();
	}
};
