// §18 — Go to latitude, longitude (ROADMAP Task 145; Task 437 is the place-name search that is NOT
// built).
//
// The command reads what people PASTE, so what it accepts is the whole feature and there is nothing
// headless about it: it lives on a window.prompt(), reads the map's own view, and answers in the
// notice box over the map. Two ways in — the View menu of a lat/lon project, and the Go to… button on
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
		report.ok(rows.includes(GOTO_ROW), 'a lat/lon project offers it on the View menu');

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
		// Same function, reached while a model is being placed — the moment a user most needs it,
		// because step 1 IS "pan and zoom the map to your site". Here it asks a SECOND question,
		// which is the half a schematic drawing cannot answer for itself: how wide is the site?
		// Tom, 2026-08-18: "In the Go to... box, ask for lat/lon and approximate size of project
		// area in project length units."
		await a.newProject();
		await a.dismissGallery();
		await a.makeEdit();
		// **THE WIZARD STARTS FROM A FILE (Task 447)**, so the drawing on screen is written out and
		// opened again through File > Import XY to lat/lon… -- which lands it in a new tab, in step 1.
		// The string read here is serializeProject()'s own output, not a spec's idea of our format.
		{
			const text = await a.page.evaluate(() => {
				const idx = JSON.parse(localStorage.getItem('lpn_index') || '{}');
				return localStorage.getItem('lpn_project_' + idx.openId);
			});
			const [chooser] = await Promise.all([
				a.page.waitForEvent('filechooser'),
				a.menuClick('Import XY to lat/lon…')
			]);
			await chooser.setFiles({ name: 'goto.json', mimeType: 'application/json', buffer: Buffer.from(text, 'utf8') });
		}
		await a.settle(900);
		report.ok(await a.page.evaluate(() => {
			const b = document.getElementById('lpn_georef_goto');
			return !!b && getComputedStyle(b).display !== 'none';
		}), 'step 1 carries its own Go to… button');
		// **TWO PROMPTS IN A ROW, so window.prompt is answered from a queue for this one gesture.**
		// Session.answerPromptWith() holds a single answer and the second dialog would be dismissed
		// before a spec could set it. Everything above this line uses the real dialog.
		const asked = await a.page.evaluate(() => {
			window.__realPrompt = window.prompt;
			window.__asked = [];
			const answers = ['38.106, -122.569', '3000'];
			let i = 0;
			window.prompt = (msg, dflt) => { window.__asked.push({ msg: msg, dflt: dflt }); return answers[i++]; };
			return true;
		});
		void asked;
		await a.page.click('#lpn_georef_goto');
		await a.settle(700);
		const prompts = await a.page.evaluate(() => {
			window.prompt = window.__realPrompt;
			return window.__asked;
		});
		report.eq(prompts.length, 2, 'it asks two questions: where, and how big');
		report.has(prompts[1] && prompts[1].msg, 'wide', '...the second being the width of the site');
		report.has(prompts[1] && prompts[1].msg, 'ft', '...in the project\'s own length unit');
		report.ok(prompts[1] && +prompts[1].dflt === 3000,
			'...offered with the default Tom named: 3000 ft, or 1000 m under SI',
			prompts[1] && prompts[1].dflt);
		at = await centre(a);
		report.ok(at.lon !== undefined && Math.abs(at.lat - TARGET.lat) < 0.002 && Math.abs(at.lon - TARGET.lon) < 0.002,
			'...and the map goes to the coordinate', at.text);
		report.ok(await a.page.evaluate(() => {
			const els = [...document.querySelectorAll('#lpn_canvas .lpn-symbols > *')];
			if (!els.length) { return false; }
			const c = document.getElementById('lpn_canvas').getBoundingClientRect();
			let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
			for (const e of els) {
				const r = e.getBoundingClientRect();
				x0 = Math.min(x0, r.x); y0 = Math.min(y0, r.y);
				x1 = Math.max(x1, r.x + r.width); y1 = Math.max(y1, r.y + r.height);
			}
			const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
			return Math.abs(cx - (c.x + c.width / 2)) < 30 && Math.abs(cy - (c.y + c.height / 2)) < 30;
		}), '...taking the model with it, planted in the middle of the view');

		report.eq(a.errors.length, 0, 'no uncaught JavaScript', a.errors[0] || '');
	} finally {
		await a.close();
	}
};
