// §18 — Go to latitude, longitude (ROADMAP Task 145; Task 437 is the place-name search that is NOT
// built).
//
// The command reads what people PASTE, so what it accepts is the whole feature and there is nothing
// headless about it: it lives on a window.prompt(), reads the map's own view, and answers in the
// notice box over the map. Two ways in — the View menu of a GeoMap project, and the Go to… button on
// the placement bar while a model is being carried — and they are the same function, so the flow is
// checked once and the second entry point is checked for being there and reaching it.
//
// **THE DECIMAL-COMMA TRAP, AND HOW IT WAS ANSWERED** (dev/english-friction/438-wave0.json,
// `lpn_goto_tip`). The tip once taught `38.106, -122.569`, and a careful translator into any of this
// suite's many decimal-comma locales localises the numbers in an example -- producing
// `38,106, -122,569`, where the decimal comma collides with the separator the example teaches.
// The first parser took the first two integers out of that and travelled to 38 N 106 E, Inner
// Mongolia, saying nothing: a silent wrong answer, the worst of the three possible behaviours.
//
// The parser now matches numbers GREEDILY and counts them, so a comma inside a number binds tighter
// than a comma between two: all four spellings yield exactly two numbers and all four read
// correctly. Three numbers -- which is what a thousands separator makes -- is refused rather than
// half-read. The example strings separate with a SPACE anyway, because that is unambiguous in every
// locale and needs no explaining.

const { Session } = require('../lib/session');

// The row's own label, in ONE place. It moved once already ("Go to latitude, longitude…" ->
// "Go to a latitude and longitude…") when Wave 0's decimal-comma finding was answered, and a spec
// that spells a label inline fails as a missing row rather than as a wording change.
const GOTO_ROW = 'Go to a latitude and longitude…';

exports.title = '18. Go to a latitude and longitude';

const TARGET = { lat: 38.106, lon: -122.569 };

async function canvasRect(a) {
	return a.page.evaluate(() => {
		const b = document.getElementById('lpn_canvas').getBoundingClientRect();
		return { x: b.x, y: b.y, w: b.width, h: b.height };
	});
}
// Where the MIDDLE of the map is, read the way a user reads it: hover the centre of the canvas and
// look at the coordinate tracker.
async function centre(a) {
	const r = await canvasRect(a);
	await a.page.mouse.move(r.x + r.w / 2, r.y + r.h / 2);
	await a.settle(150);
	const text = await a.page.evaluate(() => document.getElementById('lpn_coords').textContent);
	const m = text.match(/Longitude:\s*(-?[\d.]+)\s+Latitude:\s*(-?[\d.]+)/);
	return m ? { lon: +m[1], lat: +m[2], text } : { text };
}
// Type something into the Go to… prompt from the View menu and settle.
async function goTo(a, typed) {
	a.answerPromptWith(typed);
	await a.menuClick(GOTO_ROW, 'view');
	await a.settle(400);
}

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.page.route(/tile\.openstreetmap\.org/, (route) => route.abort());
		await a.goto();
		await a.dismissGallery();

		// ---- where the row is, and is not -------------------------------------------------------
		let rows = (await a.menuRows('view')).map(r => r.label);
		report.ok(!rows.includes(GOTO_ROW),
			'an XY project has no Go to… row — its x and y have no place on the Earth',
			'hidden here rather than greyed, because there is no street map a grid could go to');

		await a.newGeoProject();
		await a.settle(500);
		rows = (await a.menuRows('view')).map(r => r.label);
		report.ok(rows.includes(GOTO_ROW), 'a GeoMap project offers it on the View menu');

		// ---- it goes there ----------------------------------------------------------------------
		await goTo(a, '38.106, -122.569');
		let at = await centre(a);
		report.ok(at.lon !== undefined && Math.abs(at.lat - TARGET.lat) < 0.002 && Math.abs(at.lon - TARGET.lon) < 0.002,
			'a pasted "38.106, -122.569" centres the map on it — LATITUDE FIRST, as every map hands it out',
			at.text);

		// ---- a space alone, from somewhere else entirely -----------------------------------------
		await goTo(a, '51.5 -0.12');
		at = await centre(a);
		report.ok(at.lon !== undefined && Math.abs(at.lat - 51.5) < 0.002 && Math.abs(at.lon + 0.12) < 0.002,
			'a space alone separates them', at.text);
		report.eq(await a.notice(), '', '...and nothing is complained about');

		// ---- the decimal-comma trap, now the right answer -------------------------------------
		// The exact string a decimal-comma locale makes of the tip's own example. It must land where
		// it names -- not in Inner Mongolia, and not on a refusal either, because it is a perfectly
		// well-formed European coordinate.
		await goTo(a, '38,106, -122,569');
		const trap = await centre(a);
		report.eq(await a.notice(), '',
			'a decimal-comma rendering of the tip\'s own example is accepted, not refused');
		report.ok(trap.lon !== undefined && Math.abs(trap.lat - 38.106) < 0.01 && Math.abs(trap.lon + 122.569) < 0.01,
			'...and it lands where it names, not at 38 N 106 E half a world away',
			trap.text);
		// A thousands separator makes THREE numbers, and three cannot be read two ways either.
		await goTo(a, '1,234.5 -122.5');
		report.has(await a.notice(), 'one latitude and one longitude',
			'a thousands separator is refused rather than half-read');

		// ---- refusals say so --------------------------------------------------------------------
		// AFTER the trap above, deliberately: the notice box stands for eight seconds, so a refusal
		// raised first would still be on screen when the trap's "nothing was said" is read.
		const before = await centre(a);
		await goTo(a, 'Petaluma, California');
		report.has(await a.notice(), 'one latitude and one longitude', 'prose is refused, in words');
		let now = await centre(a);
		report.ok(now.lat === before.lat && now.lon === before.lon,
			'...and the map did not move', now.text);

		await goTo(a, '91, 0');
		report.has(await a.notice(), 'one latitude and one longitude',
			'a latitude past the pole is refused — 91 north does not exist');
		now = await centre(a);
		report.ok(now.lat === before.lat && now.lon === before.lon, '...and the map did not move');

		await goTo(a, '38.106, -190');
		report.has(await a.notice(), 'one latitude and one longitude', 'a longitude past 180 is refused');

		// ---- the second door: the placement bar --------------------------------------------------
		// Same function, reached while a model is being carried onto the map — which is the moment a
		// user most needs it, because the carry stage is "pan and zoom to your site".
		await a.newProject();
		await a.dismissGallery();
		await a.makeEdit();
		await a.menuClick('Convert XY project to GeoMap…');
		await a.settle(700);
		report.ok(await a.page.evaluate(() => {
			const b = document.getElementById('lpn_georef_goto');
			return !!b && getComputedStyle(b).display !== 'none';
		}), 'the carry stage carries its own Go to… button');
		a.answerPromptWith('38.106, -122.569');
		await a.page.click('#lpn_georef_goto');
		await a.settle(500);
		at = await centre(a);
		report.ok(at.lon !== undefined && Math.abs(at.lat - TARGET.lat) < 0.002 && Math.abs(at.lon - TARGET.lon) < 0.002,
			'...and it takes the model being carried with it', at.text);
		report.ok(await a.page.evaluate(() => {
			const b = document.querySelector('.lpn-georef-body');
			if (!b) { return false; }
			const r = b.getBoundingClientRect(), c = document.getElementById('lpn_canvas').getBoundingClientRect();
			return r.x + r.width / 2 > c.x && r.x + r.width / 2 < c.right &&
				r.y + r.height / 2 > c.y && r.y + r.height / 2 < c.bottom;
		}), '...with the ghost box still in the middle of the map, where the carry stage keeps it');

		report.eq(a.errors.length, 0, 'no uncaught JavaScript', a.errors[0] || '');
	} finally {
		await a.close();
	}
};
