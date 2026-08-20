// §13 — the OpenStreetMap basemap (ROADMAP Task 145, second slice).
//
// dev/lpn-spike/basemap-harness.js already checks the tile mathematics against an independent
// slippy-tile reference. What only a real browser can answer is whether the numbers it produces end
// up ON THE MAP in the right place — the SVG transform, the layer order, the pointer mapping and
// the attribution are all things the stub does not have.
//
// **THE TILE SERVER IS NEVER CALLED.** Every request to it is aborted at the route level, for two
// reasons: this pass must not depend on the network, and hammering somebody else's free tile
// service from a test loop is exactly what the OSM tile usage policy is about. A blocked tile still
// produces an <image> element at its full geometry, which is the whole of what is checked here —
// and it doubles as a proof that a geographic project with no network still draws its network.

const { Session } = require('../lib/session');

exports.title = '13. OpenStreetMap basemap';

const TILE_HOST = 'tile.openstreetmap.org';

// The slippy-tile scheme, written here from its definition rather than read out of the page.
function tileLon(x, z) { return x / Math.pow(2, z) * 360 - 180; }
function tileLat(y, z) {
	const t = Math.PI * (1 - 2 * y / Math.pow(2, z));
	return (2 * Math.atan(Math.exp(t)) - Math.PI / 2) * 180 / Math.PI;
}

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	const offSite = [];
	try {
		await a.page.route(/tile\.openstreetmap\.org/, (route) => route.abort());
		// Every request that leaves the page's own origin, whatever it is for. The check is not
		// "did we ask for tiles" but "is the tile server the ONLY place this page talks to" — the
		// suite ships its own assets and uses no runtime CDN, and the basemap must not be the hole
		// in that.
		a.page.on('request', (req) => { offSite.push(req.url()); });

		await a.goto();
		await a.dismissGallery();
		await a.newGeoProject();
		await a.settle(900);

		// ---- the tiles are there, and they are the right ones -------------------------------
		const tiles = await a.page.$$eval('.lpn-basemap image', (els) => els.map(e => ({
			href: e.getAttribute('href'),
			x: +e.getAttribute('x'), y: +e.getAttribute('y'),
			w: +e.getAttribute('width'), h: +e.getAttribute('height'),
			par: e.getAttribute('preserveAspectRatio')
		})));
		report.ok(tiles.length > 0, 'a new geographic project draws tiles', tiles.length + ' <image>');
		report.ok(tiles.every(t => /^https:\/\/tile\.openstreetmap\.org\/\d+\/\d+\/\d+\.png$/.test(t.href)),
			'...from the OSM tile server over https, and nowhere else', tiles[0] && tiles[0].href);
		const own = new URL(a.page.url()).origin;
		const away = [...new Set(offSite.filter(u => !u.startsWith(own) && !u.startsWith('data:') && !u.startsWith('blob:'))
			.map(u => new URL(u).host))];
		report.ok(away.length > 0 && away.every(h => h === TILE_HOST),
			'...and the tile server is the ONLY host this page talks to', away.join(', ') || '(none)');
		report.ok(tiles.every(t => t.par === 'none'),
			'...stretched into their boxes, because a box here is not square');
		report.ok(tiles.every(t => Math.abs(t.h / t.w - 1) > 0.05),
			'...which is visible: the boxes really are taller-than-wide by 1/cos(lat)',
			tiles[0] && (tiles[0].h / tiles[0].w).toFixed(4));

		// ---- REGISTRATION, end to end through the page's own transform ------------------------
		// A tile's top-left corner on SCREEN, fed back through the page's own pointer readout,
		// must name the longitude and latitude the tile's own URL claims. This is the check the
		// whole slice exists for, and it goes the long way round on purpose: SVG transform, canvas
		// offset, coordinate readout, all of it.
		// A tile whose NORTH-WEST CORNER is comfortably inside the canvas: a corner off the edge of
		// the drawing surface cannot be pointed at, and the readout would simply stay blank.
		const box = await a.page.evaluate(() => {
			const c = document.getElementById('lpn_canvas').getBoundingClientRect();
			for (const el of document.querySelectorAll('.lpn-basemap image')) {
				const r = el.getBoundingClientRect();
				if (r.x > c.x + 8 && r.y > c.y + 8 && r.x < c.right - 8 && r.y < c.bottom - 8) {
					return { href: el.getAttribute('href'), x: r.x, y: r.y, w: r.width, h: r.height };
				}
			}
			return null;
		});
		report.ok(!!box, 'at least one tile corner is inside the canvas to point at');
		const m = box && box.href.match(/\/(\d+)\/(\d+)\/(\d+)\.png$/);
		const z = m && +m[1], tx = m && +m[2], ty = m && +m[3];
		// A couple of pixels in, so the reading is unambiguously inside the tile.
		if (box) { await a.page.mouse.move(box.x + 2, box.y + 2); }
		await a.settle(200);
		const read = await a.page.evaluate(() => document.getElementById('lpn_coords').textContent);
		const got = read.match(/Longitude:\s*(-?[\d.]+)\s+Latitude:\s*(-?[\d.]+)/);
		report.ok(!!got, 'the pointer reads a longitude and a latitude over a tile', read);
		if (got) {
			// Reported in PIXELS, which is the unit the answer matters in — and the pointer was put
			// 2 px inside the corner, so that offset is part of what is expected. A tolerance of a
			// few pixels: a tile drawn as a square, or with x and y swapped, is out by tens to
			// hundreds.
			const degPerPxX = (tileLon(tx + 1, z) - tileLon(tx, z)) / box.w;
			const degPerPxY = (tileLat(ty, z) - tileLat(ty + 1, z)) / box.h;
			const offX = (+got[1] - (tileLon(tx, z) + 2 * degPerPxX)) / degPerPxX;
			const offY = ((tileLat(ty, z) - 2 * degPerPxY) - +got[2]) / degPerPxY;
			report.ok(Math.abs(offX) < 4,
				"a tile's west edge is at the longitude its own URL claims",
				`${got[1]} vs ${tileLon(tx, z).toFixed(6)}  (${offX.toFixed(2)} px)`);
			report.ok(Math.abs(offY) < 4,
				"...and its north edge at that URL's latitude",
				`${got[2]} vs ${tileLat(ty, z).toFixed(6)}  (${offY.toFixed(2)} px)`);
		}

		// THE OPPOSITE CORNER, and it is not a duplicate: the north-west corner alone is still right
		// on a tile drawn as a square, because only the height is wrong. The south edge is where
		// that shows.
		if (box) { await a.page.mouse.move(box.x + box.w - 2, box.y + box.h - 2); }
		await a.settle(200);
		const read2 = await a.page.evaluate(() => document.getElementById('lpn_coords').textContent);
		const got2 = read2.match(/Longitude:\s*(-?[\d.]+)\s+Latitude:\s*(-?[\d.]+)/);
		if (got2) {
			const degPerPxY = (tileLat(ty, z) - tileLat(ty + 1, z)) / box.h;
			const offS = (+got2[2] - (tileLat(ty + 1, z) + 2 * degPerPxY)) / degPerPxY;
			report.ok(Math.abs(offS) < 4, "...and its SOUTH edge at the latitude one tile further on",
				`${got2[2]} vs ${tileLat(ty + 1, z).toFixed(6)}  (${offS.toFixed(2)} px)`);
		}

		// ---- the attribution ------------------------------------------------------------------
		// **READ THE VISIBLE CREDIT, NOT THE ELEMENT'S textContent.** Task 452 put a second
		// attribution set inside this box for the Mapbox satellite source, hidden while the street
		// map is showing, and textContent returns hidden text as happily as shown text -- so the
		// naive read asserted that the user sees both licences at once. What the licences require
		// is about what is ON SCREEN, so that is what this reads.
		const credit = await a.page.evaluate(() => {
			const el = document.getElementById('lpn_basemap_credit');
			if (!el) { return null; }
			const r = el.getBoundingClientRect();
			const vis = [...el.querySelectorAll('[data-basemap-credit]')]
				.filter((s2) => getComputedStyle(s2).display !== 'none');
			const scope = vis.length ? vis[0] : el;
			const link = scope.querySelector('a');
			return {
				shown: el.style.display !== 'none' && r.width > 0 && r.height > 0,
				text: scope.textContent.trim(),
				href: link && link.getAttribute('href')
			};
		});
		report.ok(credit && credit.shown, 'the attribution is on the map, unprompted');
		report.eq(credit && credit.text, '© OpenStreetMap contributors', '...and says exactly what the licence asks');
		report.eq(credit && credit.href, 'https://www.openstreetmap.org/copyright', '...linking to the copyright page');
		const dismissible = await a.page.$$('#lpn_basemap_credit button, #lpn_basemap_credit [aria-label*="lose"]');
		report.eq(dismissible.length, 0, '...with nothing on it that closes it');

		// ---- the toggle, and what it leaves behind ---------------------------------------------
		const viewRows = (await a.menuRows('view')).map(r => r.label);
		report.ok(viewRows.includes('Hide street map'), 'View offers to hide the street map', viewRows.join(' | '));
		await a.menuClick('Hide street map', 'view');
		await a.settle(400);
		const afterHide = await a.page.evaluate(() => ({
			tiles: document.querySelectorAll('.lpn-basemap image').length,
			credit: document.getElementById('lpn_basemap_credit').style.display
		}));
		report.eq(afterHide.tiles, 0, 'hiding it removes every tile');
		report.eq(afterHide.credit, 'none', '...and the attribution goes with them');

		// ---- a grid project is untouched by all of it -------------------------------------------
		await a.newProject();
		await a.settle(500);
		const gridRows = (await a.menuRows('view')).map(r => r.label);
		report.ok(!gridRows.some(l => /street map/i.test(l)),
			'a grid project is offered no street map at all', gridRows.join(' | '));
		const gridState = await a.page.evaluate(() => ({
			tiles: document.querySelectorAll('.lpn-basemap image').length,
			credit: document.getElementById('lpn_basemap_credit').style.display
		}));
		report.eq(gridState.tiles, 0, '...and draws none');
		report.eq(gridState.credit, 'none', '...and shows no attribution');

		report.eq(a.errors.length, 0, 'no uncaught JavaScript');
	} finally {
		await a.close();
	}
};
