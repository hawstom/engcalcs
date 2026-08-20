// §17 — the placement tool (ROADMAP Task 145's third slice, dev/georeferencing.md).
//
// `dev/lpn-spike/georef-place-harness.js` owns the ARITHMETIC — the transform, the exactness of
// Cancel, the fact that nothing but the coordinates moves. None of that is repeated here. What is
// left is the half a harness has no eyes for, and it is most of what the tool IS.
//
// **THE TOOL HAS TWO NAMED STEPS, and every check below is about which one you are in.** Tom used
// it for the first time on 2026-08-18 and the report was that the boundary was invisible: *"there
// is an uncomfortable gray area between the described modes… I need the map either to come along or
// to stay behind when I pan. And I need to be able to control that."*
//
//   step 1, DETACHED   the project is held STILL ON THE SCREEN while the map pans and zooms beneath
//                      it. No handles, and nothing the user does to the map moves the model — the
//                      defect that cost him a long placement was that every pan re-pinned the model
//                      to the middle of the view and Drop discarded the lot.
//   step 2, ATTACHED   the model is on the ground: it moves with the map and the handles are live.
//
// The other three things pinned here, all of them Tom's own findings:
//
//   * **A GRAB DOES NOT JUMP.** Dragging the body moves the model by the pointer's delta from where
//     it was grabbed, not by putting its centre under the cursor.
//   * **A HANDLE IS NEVER OFF THE MAP.** Zoomed in close, the corners belong far outside the canvas;
//     they are clamped to its edge instead, so the user cannot be locked out of their own placement.
//   * **NOTHING GENERATED IS DRAWN AND NOTHING IS SOLVED** while placing. He dragged a label by
//     accident; and every label is work done on a gesture whose whole point is to be smooth.
//
// **THE HANDLES ARE A CONSTANT SIZE ON SCREEN, and that is checked below.** georefDrawFrame() sizes
// them `GEOREF_HANDLE_PX / state.s`, which is a screen size only for as long as the frame is redrawn
// when the scale changes. onZoomChanged() redraws it.

const { Session } = require('../lib/session');

exports.title = '17. The placement tool';

// An L, never a rectangle: a symmetric model cannot reveal a missing north-south flip, which is the
// same reason dev/lpn-spike/georef-harness.js uses one.
//
// **IT IS ALSO HUNDREDS OF UNITS ACROSS, WHICH MATTERS SINCE Task 447.** Coordinates that could be
// read as degrees arm the wizard ATTACHED, on the numbers as they stand; this drawing runs past 180
// and therefore takes the place-it-on-the-world path every section below is written for. §14 checks
// the other path on purpose.
const L = [[0.25, 0.20], [0.65, 0.20], [0.65, 0.55]];

async function canvasRect(a) {
	return a.page.evaluate(() => {
		const b = document.getElementById('lpn_canvas').getBoundingClientRect();
		return { x: b.x, y: b.y, w: b.width, h: b.height };
	});
}
// Three junctions at chosen points, rather than Session.makeEdit() three times: that helper picks
// the first clear spot it finds, which lands all three in one row — a model with no height at all,
// whose corner handles sit on top of each other.
async function drawL(a) {
	await a.dismissGallery();
	await a.toolbarClick('Junction');
	const r = await canvasRect(a);
	for (const [fx, fy] of L) {
		await a.page.mouse.click(r.x + r.w * fx, r.y + r.h * fy);
		await a.page.waitForTimeout(120);
	}
	await a.toolbarClick('Select');
	await a.settle(400);
	if (await a.nodeCount() < 3) { throw new Error(`${a.name}: the L network did not land`); }
}
// Where each node is DRAWN, as the exact attribute text. Cancel's promise is `===`, so the check
// has to be a string comparison and not a tolerance.
async function nodePos(a) {
	return a.page.evaluate(() => [...document.querySelectorAll('#lpn_canvas .lpn-symbols > *')]
		.map(e => e.getAttribute('cx') + ',' + e.getAttribute('cy')));
}
// Where the drawn model IS, in screen pixels — the only measurement that can answer "did it stay
// still while the map moved", because its coordinates are re-derived under it every settle.
async function modelBox(a) {
	return a.page.evaluate(() => {
		const els = [...document.querySelectorAll('#lpn_canvas .lpn-symbols > *')];
		if (!els.length) { return null; }
		let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
		for (const e of els) {
			const r = e.getBoundingClientRect();
			x0 = Math.min(x0, r.x); y0 = Math.min(y0, r.y);
			x1 = Math.max(x1, r.x + r.width); y1 = Math.max(y1, r.y + r.height);
		}
		return { x: x0, y: y0, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
	});
}
// The latitude the model is drawn at. In a lat/lon project a node's `cy` attribute IS its latitude,
// negated by the document's own y-down frame — so this reads the map's own numbers rather than
// asking the page for a variable inside a closure.
async function modelLat(a) {
	return a.page.evaluate(() => {
		const ys = [...document.querySelectorAll('#lpn_canvas .lpn-symbols > *')].map(e => +e.getAttribute('cy'));
		return -(Math.min(...ys) + Math.max(...ys)) / 2;
	});
}
// The map's own transform, as the page wrote it. `s` is pixels per degree in a lat/lon project.
async function viewTransform(a) {
	return a.page.evaluate(() => {
		const t = document.querySelector('#lpn_canvas > g').getAttribute('transform') || '';
		const m = t.match(/translate\(([-\d.e]+),([-\d.e]+)\)\s*scale\(([-\d.e]+)\)/);
		return m ? { tx: +m[1], ty: +m[2], s: +m[3] } : null;
	});
}
async function body(a) {
	return a.page.evaluate(() => {
		const b = document.querySelector('.lpn-georef-body');
		if (!b) { return null; }
		const r = b.getBoundingClientRect();
		return {
			x: r.x, y: r.y, w: r.width, h: r.height,
			cx: r.x + r.width / 2, cy: r.y + r.height / 2,
			dashed: !!b.getAttribute('stroke-dasharray')
		};
	});
}
async function corners(a) {
	return a.page.evaluate(() => [...document.querySelectorAll('.lpn-georef-handle')]
		.filter(h => h.dataset.georef === 'scale')
		.map(h => {
			const r = h.getBoundingClientRect();
			return { i: +h.dataset.georefCorner, x: r.x + r.width / 2, y: r.y + r.height / 2 };
		})
		.sort((p, q) => p.i - q.i));
}
async function bar(a) {
	return a.page.evaluate(() => {
		const b = document.getElementById('lpn_georef_bar');
		const shown = (id) => {
			const e = document.getElementById(id);
			return !!e && getComputedStyle(e).display !== 'none';
		};
		return {
			visible: b.style.display !== 'none',
			step: document.getElementById('lpn_georef_step').textContent,
			hint: document.getElementById('lpn_georef_hint').textContent,
			drop: shown('lpn_georef_drop'), goto: shown('lpn_georef_goto'),
			detach: shown('lpn_georef_detach'),
			finish: shown('lpn_georef_finish'), numbers: shown('lpn_georef_numbers')
		};
	});
}
async function handleCount(a) {
	return a.page.evaluate(() => document.querySelectorAll('.lpn-georef-handle').length);
}
// The map is zoomed the way the hint tells the user to zoom it, and the settle is waited out.
async function wheel(a, notches, dir) {
	const r = await canvasRect(a);
	await a.page.mouse.move(r.x + r.w / 2, r.y + r.h / 2);
	for (let i = 0; i < notches; i++) { await a.page.mouse.wheel(0, dir * 100); await a.page.waitForTimeout(30); }
	await a.settle(500);
}
async function wheelIn(a, n) { return wheel(a, n, -1); }
async function wheelOut(a, n) { return wheel(a, n, 1); }
// **THE CONSENT BANNER IS ANSWERED FIRST, as a user answers it.** It is `position: fixed; bottom: 0`
// over the bottom of the window, and a fresh profile has never answered it — so a handle clamped to
// the bottom edge of the map lies underneath it and reads as unreachable, which is a fact about the
// banner and not about the placement tool. Declining is the answer with no side effects.
async function answerConsent(a) {
	const btn = await a.page.$('#ec-consent button[value="0"]');
	if (!btn) { return; }
	// The form's own submit handler answers in place and hides the banner; no navigation.
	await btn.click();
	await a.waitFor(() => a.page.evaluate(() => {
		const e = document.getElementById('ec-consent');
		return !e || e.hidden;
	}), 'the consent banner to go away');
	await a.settle(300);
}
// **A PAN HAS TO START ON BARE MAP, and the page has furniture on top of it.** A point chosen by
// arithmetic lands on the consent banner along the bottom of a fresh profile's window (which reads
// exactly like "panning is disabled"), or on the model itself, or on the placement frame — where a
// drag means something else entirely. So the point is chosen by asking the document what is at it,
// the same way Session.makeEdit() picks its spot.
async function panBy(a, dx, dy) {
	const spot = await a.page.evaluate(([dx, dy]) => {
		const canvas = document.getElementById('lpn_canvas');
		const r = canvas.getBoundingClientRect();
		for (const fy of [0.2, 0.35, 0.5, 0.65]) {
			for (const fx of [0.1, 0.25, 0.5, 0.75, 0.9]) {
				const p = { x: r.x + r.width * fx, y: r.y + r.height * fy };
				if (p.x + dx < r.x + 8 || p.x + dx > r.x + r.width - 8) { continue; }
				if (p.y + dy < r.y + 8 || p.y + dy > r.y + r.height - 8) { continue; }
				const hit = document.elementFromPoint(p.x, p.y);
				// Anywhere on the map that is not part of the placement frame: a drag on a node or a
				// pipe pans too while the tool is running, because editing is locked, but a drag on
				// the frame's body means "move the model" and would prove nothing about panning.
				if (!hit || !canvas.contains(hit)) { continue; }
				if (hit.dataset && hit.dataset.georef) { continue; }
				return p;
			}
		}
		return null;
	}, [dx, dy]);
	if (!spot) { throw new Error(`${a.name}: nowhere on the canvas is bare enough to pan from`); }
	await a.page.mouse.move(spot.x, spot.y);
	await a.page.mouse.down();
	await a.page.mouse.move(spot.x + dx, spot.y + dy, { steps: 8 });
	await a.page.mouse.up();
	await a.settle(500);
}
async function fileRow(a, label) {
	return (await a.menuRows('file')).find(r => r.label === label) || null;
}
async function readout(a) {
	const r = await canvasRect(a);
	await a.page.mouse.move(r.x + r.w / 2, r.y + r.h / 2 + 20);
	await a.settle(150);
	return a.page.evaluate(() => document.getElementById('lpn_coords').textContent);
}
async function labelsHidden(a) {
	return a.page.evaluate(() =>
		document.getElementById('lpn_canvas').classList.contains('lpn-labels-hidden'));
}

const ROW = 'Import xy to lat/lon…';

// **THE TOOL STARTS FROM A FILE NOW (Task 447), never from the open project.** So a placement is:
// take what is on screen as a project file, and open THAT as lat/lon -- which lands a new tab with
// the same network and the wizard armed. The document is read straight out of localStorage rather
// than saved through the picker, because that string IS serializeProject()'s own output and a spec
// writing its own project JSON would be a second opinion about our format.
async function projectJson(a) {
	return a.page.evaluate(() => {
		const idx = JSON.parse(localStorage.getItem('lpn_index') || '{}');
		return localStorage.getItem('lpn_project_' + idx.openId);
	});
}
// The row opens the page's own hidden <input type=file>, so the file arrives through Chromium's real
// file chooser -- production code the whole way down, with only the OS dialog replaced.
async function openAsLatLon(a, name, text) {
	const [chooser] = await Promise.all([
		a.page.waitForEvent('filechooser'),
		a.menuClick(ROW)
	]);
	await chooser.setFiles({ name: name, mimeType: 'application/json', buffer: Buffer.from(text, 'utf8') });
	await a.settle(900);
}
// Draw the L, then open it as lat/lon: the whole placement entry, in one line at each call site.
async function placeCurrent(a, name) {
	const text = await projectJson(a);
	await openAsLatLon(a, name || 'placed.json', text);
}

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		// The tile server is never called — see the note at the top of specs/basemap.js.
		await a.page.route(/tile\.openstreetmap\.org/, (route) => route.abort());
		await a.goto();
		await answerConsent(a);
		await a.dismissGallery();

		// ---- 1. the command is findable ------------------------------------------------------
		const row = await fileRow(a, ROW);
		report.ok(!!row, 'the File menu carries the placement command', row && row.label);
		report.ok(row && !row.disabled, '...and it is never greyed — it opens a file into a new tab');

		// ---- 2. it refuses a file with nothing in it, by name ----------------------------------
		// The empty project on screen, written out and handed straight back: a real file, and the one
		// case the wizard cannot serve.
		await openAsLatLon(a, 'empty.json', await projectJson(a));
		report.has(await a.notice(), 'nothing to place',
			'a file with no network in it is refused, in words');
		report.ok((await handleCount(a)) === 0, '...and no placement was started');
		await a.dismissGallery();   // the refused open still left an empty tab, and an empty tab offers the gallery

		// ---- 3. step 1: detached ---------------------------------------------------------------
		await drawL(a);
		const original = await nodePos(a);
		await placeCurrent(a, 'the-L.json');
		report.eq(await a.nodeCount(), 3, 'the file opened, with its network in it');
		// **NOTHING ASKS ANY MORE** (Task 447). The confirm used to say "Convert this XY project to a
		// geographic project?" -- a question already answered by choosing this row, and the only door
		// into the tool. Its instructions were the useful half, so they are a notice you can read
		// while you work, and it still names the button that commits.
		report.ok(!(a.lastDialog() && a.lastDialog().type === 'confirm'),
			'no modal stands in front of the placement — the row WAS the answer');
		// **THE INTRO NAMES ITS OWN STEP'S BUTTON, not the one two steps away** (Tom, 2026-08-20:
		// "Is this the intro to a two-step process? If so, it should mention that there are two
		// steps, quick and fine"). It used to name Keep this placement, which is what ends step 2 —
		// so the first thing a user read told them to press a button that is not on screen yet.
		report.has(await a.notice(), 'Put the model here',
			'...and the intro names the button that ENDS STEP 1, so the two cannot drift apart');
		report.has(await a.notice(), 'two steps',
			'...and says there are two of them before describing either');

		const b1 = await bar(a);
		report.ok(b1.visible, 'the placement bar appears');
		report.has(b1.step, 'Step 1 of 2', '...saying which of the two steps you are in');
		// "quick" and "fine", not "detached" and "attached" — the latter pair names our mechanism,
		// the former names the choice the user is making (Tom, 2026-08-20).
		report.has(b1.step, 'quick', '...and what that step is called');
		report.ok(b1.drop && b1.goto, '...offering Drop it here and Go to…');
		report.ok(!b1.finish && !b1.numbers && !b1.detach,
			'...and NOT Finish, Detach or the two numbers — nothing is attached to anything yet');
		report.eq(await handleCount(a), 0,
			'NO rectangular controls in step 1: nothing there can move the model');
		report.eq(await a.nodeCount(), 3, 'the model itself is on the screen, drawn as itself');
		report.ok(await labelsHidden(a),
			'generated labels are off for the duration — a label got dragged by accident');

		// **THE VIEW OPENS ON THE WHOLE EARTH.** Tom: "Change the default view to entire world…so
		// that they can zoom to their location." minScale() is width/360 in a lat/lon project.
		const canvas = await canvasRect(a);
		const v0 = await viewTransform(a);
		report.ok(v0 && Math.abs(v0.s / (canvas.w / 360) - 1) < 0.02,
			'the conversion opens on the whole Earth, not on somebody else\'s home town',
			v0 && `${v0.s.toFixed(2)} px/deg against a whole world of ${(canvas.w / 360).toFixed(2)}`);

		// **THE MODEL DOES NOT MOVE. AT ALL.** This is the fatal one: every pan used to re-pin it to
		// the middle of the view, so a placement perfected in step 1 was discarded by Drop.
		const m0 = await modelBox(a), lat0 = await modelLat(a);
		await wheelIn(a, 8);
		await panBy(a, 140, 90);
		const m1 = await modelBox(a), v1 = await viewTransform(a), lat1 = await modelLat(a);
		report.ok(Math.abs(m1.cx - m0.cx) < 2 && Math.abs(m1.cy - m0.cy) < 2,
			'the model stays exactly where it is on the screen while the map is panned and zoomed',
			`centre moved ${(m1.cx - m0.cx).toFixed(2)}, ${(m1.cy - m0.cy).toFixed(2)} px`);
		// **THE HEIGHT IS HELD EXACTLY, AND THE WIDTH FOLLOWS THE MAP'S OWN STRETCH.** A degree of
		// latitude is the honest axis and is what the settle preserves; east-west, this unprojected
		// display draws a metre 1/cos(lat) times as wide, and the model has just travelled in
		// latitude — so its width must change by exactly the ratio of that stretch at the two
		// latitudes, and by nothing else. The tiles carry the identical stretch, so the model still
		// matches the ground it is sitting on. This is Task 145's remaining projection seam.
		const stretch = await a.page.evaluate(([p, q]) => {
			const r = (lat) => {
				const m = EngCalcs.lpnGeorefMetersPerDegree(lat);
				return m.lat / m.lon;
			};
			return r(q) / r(p);
		}, [lat0, lat1]);
		report.ok(Math.abs(m1.h - m0.h) < 2,
			'...at exactly the same height on the screen, which is how its ground scale gets set',
			`${m0.h.toFixed(1)} -> ${m1.h.toFixed(1)} px`);
		report.ok(Math.abs((m1.w / m0.w) / stretch - 1) < 0.02,
			'...and its width follows the map\'s own east-west stretch, at the latitude it travelled to',
			`x${(m1.w / m0.w).toFixed(4)} for a predicted x${stretch.toFixed(4)} from ${lat0.toFixed(1)}° to ${lat1.toFixed(1)}°`);
		report.ok(v1 && v1.s > v0.s * 2 && (v1.tx !== v0.tx || v1.ty !== v0.ty),
			'...and the MAP really did move underneath it — that is the point of the step',
			v1 && `${v0.s.toFixed(2)} -> ${v1.s.toFixed(2)} px/deg`);
		report.eq(await handleCount(a), 0, '...still with no handles to confuse the two steps');

		// ---- 4. Go to… asks where AND how big --------------------------------------------------
		// **TWO PROMPTS IN A ROW, so window.prompt is answered from a queue for this one gesture.**
		// Session.answerPromptWith() holds a single answer and the second dialog would be dismissed
		// before a spec could set it; nothing else in the page is touched, and specs/goto.js drives
		// the real dialog for the single-prompt case.
		const SITE_LAT = 38.106067, SITE_SPAN_FT = 3000;
		await a.page.evaluate(([lat, span]) => {
			window.__realPrompt = window.prompt;
			const answers = [`${lat} -122.5686103`, String(span)];
			let i = 0;
			window.prompt = () => (i < answers.length ? answers[i++] : null);
		}, [SITE_LAT, SITE_SPAN_FT]);
		await a.page.click('#lpn_georef_goto');
		await a.settle(700);
		await a.page.evaluate(() => { window.prompt = window.__realPrompt; });

		const v2 = await viewTransform(a), m2 = await modelBox(a);
		// A degree of latitude at 38.1°, from the same WGS84 radii the transform uses. The model was
		// just told it is 3000 ft across, so it must now cover that many degrees on this map.
		// **AND IT IS THE LONGITUDE RADIUS THAT SETS THE WIDTH.** The L is wider than it is tall, so
		// the 3000 ft runs east-west, where a metre is 1/cos(lat) degrees — the same stretch the
		// tiles carry. Predicting from the latitude radius instead is 27% out at 38°, which is the
		// projection seam and not a fault in the placement.
		const mPerDegLon = await a.page.evaluate((lat) =>
			EngCalcs.lpnGeorefMetersPerDegree(lat).lon, SITE_LAT);
		const wantPx = (SITE_SPAN_FT * 0.3048 / mPerDegLon) * v2.s;
		report.ok(Math.abs(Math.max(m2.w, m2.h) / wantPx - 1) < 0.12,
			'Go to… asks how wide the site is, and the model comes out that wide on the map',
			`${Math.max(m2.w, m2.h).toFixed(0)} px for a predicted ${wantPx.toFixed(0)} px`);
		report.ok(Math.abs(m2.cx - (canvas.x + canvas.w / 2)) < 30 &&
			Math.abs(m2.cy - (canvas.y + canvas.h / 2)) < 30,
			'...and it is planted in the middle of the view the coordinate took us to',
			`centre ${m2.cx.toFixed(0)}, ${m2.cy.toFixed(0)} in a canvas centred ${(canvas.x + canvas.w / 2).toFixed(0)}, ${(canvas.y + canvas.h / 2).toFixed(0)}`);

		// ---- 5. step 2: attached ----------------------------------------------------------------
		const beforeAttach = await modelBox(a);
		await a.page.click('#lpn_georef_drop');
		await a.settle(600);
		const b2 = await bar(a), afterAttach = await modelBox(a);
		report.has(b2.step, 'Step 2 of 2', 'Drop it here moves to step 2');
		report.has(b2.step, 'fine', '...which is the fine one');
		report.ok(b2.numbers && b2.finish && b2.detach && !b2.drop,
			'...offering Finish, the two numbers and a way back to step 1, and no longer Drop');
		report.ok(Math.abs(afterAttach.cx - beforeAttach.cx) < 3 && Math.abs(afterAttach.cy - beforeAttach.cy) < 3,
			'...and attaching does not move the model a pixel: it is already where the user put it',
			`moved ${(afterAttach.cx - beforeAttach.cx).toFixed(2)}, ${(afterAttach.cy - beforeAttach.cy).toFixed(2)} px`);

		const hands = await a.page.evaluate(() => [...document.querySelectorAll('.lpn-georef-handle')].map(h => {
			const r = h.getBoundingClientRect();
			const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
			return { kind: h.dataset.georef, size: r.width, self: hit === h, at: hit && hit.getAttribute('class') };
		}));
		report.eq(hands.length, 5, 'four corner handles and a rotate handle');
		report.ok(hands.filter(h => h.kind === 'rotate').length === 1, '...one of which turns the model');
		report.ok(hands.every(h => Math.abs(h.size - 18) < 1.5),
			'...each drawn at its 9 px half-width, whatever the zoom', hands[0] && hands[0].size.toFixed(1) + ' px');
		report.ok(hands.every(h => h.self),
			'...and each is HIT-TESTABLE: what is at the handle\'s centre is the handle',
			hands.map(h => h.at).join(' | '));

		// ---- 6. editing is locked while placing --------------------------------------------------
		const n0 = await a.nodeCount();
		await a.toolbarClick('Junction');
		await a.page.mouse.click(canvas.x + canvas.w * 0.15, canvas.y + canvas.h * 0.82);
		await a.settle(350);
		report.eq(await a.nodeCount(), n0,
			'editing is locked while placing — the transform re-derives every point BY INDEX');
		await a.toolbarClick('Select');

		// ---- 7. the two gestures, and the grab does not jump -------------------------------------
		// **GRABBED OFF-CENTRE ON PURPOSE.** Tom: "When I click the project to move it, it jumps (to
		// bring its center to my mouse?) instead of moving from where I grabbed it."
		const g0 = await body(a);
		const grab = { x: g0.x + g0.w * 0.2, y: g0.y + g0.h * 0.75 };
		await a.page.mouse.move(grab.x, grab.y);
		await a.page.mouse.down();
		await a.page.mouse.move(grab.x + 60, grab.y + 40, { steps: 8 });
		await a.page.mouse.up();
		await a.settle(400);
		const g1 = await body(a);
		report.ok(Math.abs(g1.cx - g0.cx - 60) < 2 && Math.abs(g1.cy - g0.cy - 40) < 2,
			'a body drag grabbed well off-centre moves the model by the pointer, and does not jump',
			`moved ${(g1.cx - g0.cx).toFixed(1)}, ${(g1.cy - g0.cy).toFixed(1)} for a 60, 40 drag`);
		report.ok(Math.abs(g1.w - g0.w) < 1 && Math.abs(g1.h - g0.h) < 1,
			'...and does not resize it on the way');

		const c0 = await corners(a);
		await a.page.mouse.move(c0[0].x, c0[0].y);
		await a.page.mouse.down();
		await a.page.mouse.move(c0[0].x - 40, c0[0].y + 30, { steps: 8 });
		await a.page.mouse.up();
		await a.settle(400);
		const c1 = await corners(a);
		report.ok(Math.hypot(c1[0].x - c0[0].x, c1[0].y - c0[0].y) > 20,
			'dragging a corner resizes the model', `handle 0 moved ${Math.hypot(c1[0].x - c0[0].x, c1[0].y - c0[0].y).toFixed(1)} px`);
		report.ok(Math.abs(c1[2].x - c0[2].x) < 0.5 && Math.abs(c1[2].y - c0[2].y) < 0.5,
			'...about the OPPOSITE corner, which does not move at all',
			`corner 2 ${(c1[2].x - c0[2].x).toFixed(3)}, ${(c1[2].y - c0[2].y).toFixed(3)} px`);

		// ---- 8. the handles cannot be lost off the edge of the map -------------------------------
		// Tom: "When I zoom in close to check a spot on the model, I lose the rectangular controls
		// off the edge of the map… I am locked out."
		await wheelIn(a, 14);
		const far = await a.page.evaluate(() => {
			const c = document.getElementById('lpn_canvas').getBoundingClientRect();
			return [...document.querySelectorAll('.lpn-georef-handle')].map(h => {
				const r = h.getBoundingClientRect();
				const p = { x: r.x + r.width / 2, y: r.y + r.height / 2 };
				const on = document.elementFromPoint(p.x, p.y);
				return {
					kind: h.dataset.georef,
					inside: p.x > c.x && p.x < c.x + c.width && p.y > c.y && p.y < c.y + c.height,
					self: on === h,
					at: on && (on.dataset.georef || on.getAttribute('class') || on.tagName)
				};
			});
		});
		report.eq(far.length, 5, 'zoomed in fourteen notches, the handles are all still drawn');
		report.ok(far.every(h => h.inside), '...every one of them ON the map, clamped to its edge',
			far.filter(h => !h.inside).length + ' outside');
		report.ok(far.every(h => h.self), '...and every one still grabbable',
			far.filter(h => !h.self).map(h => `${h.kind} covered by ${h.at}`).join('; '));
		// A clamped handle is grabbed where the POINTER is, not where the corner nominally sits, so
		// the model must not jump when it is taken hold of.
		{
			const c2 = await corners(a), gb = await body(a);
			await a.page.mouse.move(c2[0].x, c2[0].y);
			await a.page.mouse.down();
			await a.page.mouse.move(c2[0].x + 2, c2[0].y + 2, { steps: 2 });
			const during = await body(a);
			await a.page.mouse.up();
			await a.settle(300);
			report.ok(Math.abs(during.w / gb.w - 1) < 0.05,
				'...and grabbing a clamped corner does not jump the model to the cursor',
				`width x${(during.w / gb.w).toFixed(3)} on the first two pixels of the drag`);
		}

		// ---- 9. step 2 -> step 1 and back ---------------------------------------------------------
		// Back out to a zoom where the model does not fill the whole canvas: with the frame's body
		// covering every pixel there is nowhere left to start a pan from, in the page as much as in
		// this spec.
		await wheelOut(a, 14);
		await a.page.click('#lpn_georef_detach');
		await a.settle(400);
		const b3 = await bar(a);
		report.has(b3.step, 'Step 1 of 2', 'the toggle goes back to step 1');
		report.eq(await handleCount(a), 0, '...and the handles go away with it');
		{
			const d0 = await modelBox(a);
			await panBy(a, -110, -70);
			const d1 = await modelBox(a);
			report.ok(Math.abs(d1.cx - d0.cx) < 2 && Math.abs(d1.cy - d0.cy) < 2,
				'...so the map moves under the model again, on demand',
				`centre moved ${(d1.cx - d0.cx).toFixed(2)}, ${(d1.cy - d0.cy).toFixed(2)} px`);
		}
		await a.page.click('#lpn_georef_drop');
		await a.settle(500);
		{
			const d0 = await modelBox(a);
			await panBy(a, 90, 60);
			const d1 = await modelBox(a);
			report.ok(Math.abs(d1.cx - d0.cx - 90) < 3 && Math.abs(d1.cy - d0.cy - 60) < 3,
				'attached again, the model travels WITH the map — the other half of the control',
				`centre moved ${(d1.cx - d0.cx).toFixed(1)}, ${(d1.cy - d0.cy).toFixed(1)} for a 90, 60 pan`);
		}

		// ---- 10. the two numbers -------------------------------------------------------------------
		const nb2 = await body(a);
		// Read what the box SAYS first: the corner drag above has already moved the scale, and the
		// box states the scale absolutely ("one drawing unit is ___ ft"), never a multiplier.
		const was = +(await a.page.inputValue('#lpn_georef_scale_in'));
		report.ok(was > 0, 'the scale box carries a real number of feet per drawing unit', String(was));
		await a.page.fill('#lpn_georef_scale_in', String(was * 2));
		await a.page.dispatchEvent('#lpn_georef_scale_in', 'change');
		await a.settle(400);
		const nb3 = await body(a);
		report.ok(Math.abs((nb3.w / nb2.w) / 2 - 1) < 0.02,
			'doubling "one drawing unit is ___ ft" doubles the model on the ground',
			`grew the box x${(nb3.w / nb2.w).toFixed(3)}`);
		report.ok(Math.abs(nb3.cx - nb2.cx) < 3 && Math.abs(nb3.cy - nb2.cy) < 3,
			'...about its own centre, which stays where it was');

		await a.page.fill('#lpn_georef_rot_in', '90');
		await a.page.dispatchEvent('#lpn_georef_rot_in', 'change');
		await a.settle(400);
		const nb4 = await body(a);
		// A quarter turn swaps the model's GROUND extents, and the screen does not simply swap with
		// them: the display is unprojected, so a degree of longitude and a degree of latitude are the
		// same number of pixels while a metre east-west is 1/cos(latitude) degrees. Turning therefore
		// takes the aspect w/h to cos²(lat) · h/w. The tiles carry the identical stretch, so this is
		// the picture the user is meant to see — it is Task 145's remaining projection seam, on screen.
		const cos2 = Math.pow(Math.cos(SITE_LAT * Math.PI / 180), 2);
		report.ok(nb4.h > nb4.w && Math.abs((nb4.h / nb4.w) / (cos2 * nb3.w / nb3.h) - 1) < 0.05,
			'turning 90 degrees stands the model on end, stretched east-west as everything on this map is',
			`${nb4.w.toFixed(0)} x ${nb4.h.toFixed(0)} px, aspect ${(nb4.h / nb4.w).toFixed(3)} for a predicted ${(cos2 * nb3.w / nb3.h).toFixed(3)}`);
		report.ok(Math.abs(nb4.cx - nb3.cx) < 3 && Math.abs(nb4.cy - nb3.cy) < 3,
			'...about its centre as well');

		// ---- 10b. A handle is the same size at every zoom -----------------------------------------
		{
			const handlePx = () => a.page.evaluate(() => {
				const h = document.querySelector('[data-georef="scale"]');
				return h ? h.getBoundingClientRect().width : null;
			});
			const wide = await handlePx();
			await wheelIn(a, 6);
			const zoomed = await handlePx();
			report.ok(wide && zoomed && Math.abs(zoomed - wide) <= 1.5,
				'a corner handle is the same size on screen after six zoom notches',
				`${wide && wide.toFixed(2)} px -> ${zoomed && zoomed.toFixed(2)} px`);
		}

		// ---- 11. Cancel is exact ---------------------------------------------------------------
		await a.page.click('#lpn_georef_cancel');
		await a.settle(900);
		report.eq(JSON.stringify(await nodePos(a)), JSON.stringify(original),
			'Cancel puts every coordinate back EXACTLY, after two steps, a drag, a resize, a scale and a turn');
		report.ok(await a.page.evaluate(() => document.getElementById('lpn_georef_bar').style.display === 'none'),
			'...and the bar goes away');
		report.ok(!(await labelsHidden(a)), '...and the labels come back');
		report.ok(/^X:/.test((await readout(a)).trim()), '...and it is an XY project again');
		report.ok(!(await fileRow(a, ROW)).disabled, '...so the command is live once more');

		// ---- 12. Finish commits ------------------------------------------------------------------
		// A second placement of the same drawing, which under Task 447 means opening it again: the
		// cancelled tab is an XY project once more, so its own file goes back through the same row.
		await placeCurrent(a, 'the-L-again.json');
		await wheelIn(a, 12);
		await a.page.click('#lpn_georef_drop');
		await a.settle(500);
		const before = await a.nodeCount();
		await a.page.click('#lpn_georef_finish');
		await a.settle(1000);
		report.ok(a.lastDialog() && a.lastDialog().type === 'confirm', 'Finish asks first — it is not undoable');
		report.ok(await a.page.evaluate(() => document.getElementById('lpn_georef_bar').style.display === 'none'),
			'...and the bar goes away when it is done');
		const read = await readout(a);
		report.ok(/Longitude/.test(read) && /Latitude/.test(read),
			'the project is geographic afterwards: the readout speaks in degrees', read);
		report.eq(await a.nodeCount(), before, '...with the same network still drawn');
		report.has(await a.notice(), 'lat/lon project now', '...and it says so');
		report.ok(!(await labelsHidden(a)), '...with the labels back on');
		const onMap = await fileRow(a, ROW);
		report.ok(!!onMap, 'a project already on the map still SHOWS the command',
			'hidden once, and Tom could not find it at all — absent says "there is no such command"');
		// **AND IT IS LIVE, which the old Convert row could not be** (Task 447): this one opens
		// another file into another tab, and what is on screen has no bearing on that.
		report.ok(onMap && !onMap.disabled,
			'...and it is still live, because it opens a file rather than converting this project');

		// **PANNING IS NOT DISABLED IN A LAT/LON PROJECT**, which is what the conversion left Tom
		// suspecting: in the old step 1 the model was re-pinned to the middle of the view on every
		// pan, so the map moved and nothing on it appeared to.
		{
			const p0 = await viewTransform(a), q0 = await modelBox(a);
			await panBy(a, 120, 80);
			const p1 = await viewTransform(a), q1 = await modelBox(a);
			report.ok(Math.abs(p1.tx - p0.tx - 120) < 2 && Math.abs(p1.ty - p0.ty - 80) < 2,
				'the finished lat/lon project pans', `translate moved ${(p1.tx - p0.tx).toFixed(1)}, ${(p1.ty - p0.ty).toFixed(1)}`);
			report.ok(Math.abs(q1.cx - q0.cx - 120) < 3 && Math.abs(q1.cy - q0.cy - 80) < 3,
				'...and the network pans with it, which is how you can tell');
		}

		// ---- 13. a new XY project does not inherit the lat/lon view (Task 145's last note) --------
		// A view is pixels per WORLD UNIT, and a world unit is a degree in one mode and a drawing
		// unit in the other. A blank XY tab made after this lat/lon one used to be drawn through a
		// geographic transform at ~14,000 px per unit: three junctions clicked right across the
		// canvas landed 0.04 apart, and the model was a dozen millimetres wide.
		await a.newProject('us');
		await a.settle(800);
		await a.dismissGallery();
		const nv = await viewTransform(a);
		report.ok(nv && Math.abs(nv.s - 1) < 1e-6,
			'a new XY project opens on an XY view, not on the lat/lon one before it',
			nv && `${nv.s} px per drawing unit`);
		await drawL(a);
		const spread = await a.page.evaluate(() => {
			const xs = [...document.querySelectorAll('#lpn_canvas .lpn-symbols > *')].map(e => +e.getAttribute('cx'));
			return Math.max(...xs) - Math.min(...xs);
		});
		report.ok(spread > 100, '...so junctions clicked across the canvas are hundreds of units apart',
			spread.toFixed(2) + ' units');

		// ---- 14. ONE ROW, BOTH KINDS OF FILE (Task 447) ------------------------------------------
		// The row exists for the cell no file can state, and an `.inp` is the commonest way to arrive
		// in it -- a network drawn in lon/lat whose file says `UNITS None`, which is what EPA's own
		// examples all say. Which reader a file goes to is decided from its first character, never
		// from its name, so the same row serves both.
		{
			const INP = [
				'[TITLE]', ' placed from an inp', '',
				'[JUNCTIONS]', ' J1  10  25', '',
				'[RESERVOIRS]', ' R1  100', '',
				'[PIPES]', ' P1  R1  J1  1000  8  130  0  Open', '',
				'[COORDINATES]', ' J1  -122.5686103  38.106067', ' R1  -122.5700  38.1070', '',
				'[OPTIONS]', ' Units  GPM', ' Headloss  H-W', '',
				'[BACKDROP]', ' UNITS  None', '',
				'[END]', ''
			].join('\n');
			await openAsLatLon(a, 'grid.inp', INP);
			await a.dialogClick('OK');   // the import report, which every .inp import shows
			await a.settle(600);
			// nodeCount() counts every drawn symbol, links included, so this is "the network is on the
			// screen" rather than a node tally: two nodes and a pipe cannot draw fewer than three.
			report.ok(await a.nodeCount() >= 3, 'an EPANET file opens through Import xy to lat/lon… too',
				(await a.nodeCount()) + ' symbols drawn');
			// **REINTERPRET, NOT PLACE.** These coordinates can be read as degrees, so the wizard opens
			// ATTACHED with the numbers taken as they are: the network appears on its own streets and
			// the user has only to agree. Dropping it at the centre of the world would ask them to drag
			// a correct network back to a precision no hand can reach.
			const b14 = await bar(a);
			report.ok(b14.visible, '...and the placement bar is up');
			report.has(b14.step, 'Step 2', '...at step 2, because the numbers were read as degrees');
			report.ok(await a.page.evaluate(() =>
				[...document.querySelectorAll('#lpn_canvas .lpn-symbols > *')]
					.some(e => e.getAttribute('cx') === '-122.5686103')),
				'...and not one coordinate was moved to get there');
			await a.page.click('#lpn_georef_cancel');
			await a.settle(700);

			// The other path, from the same row: coordinates that CANNOT be degrees have no question
			// to answer, so the model is carried out to the whole-world view exactly as before.
			await openAsLatLon(a, 'state-plane.inp', INP
				.replace(' J1  -122.5686103  38.106067', ' J1  579350  4218000')
				.replace(' R1  -122.5700  38.1070', ' R1  579900  4218600'));
			await a.dialogClick('OK');
			await a.settle(600);
			const b14b = await bar(a);
			report.has(b14b.step, 'Step 1',
				'a State Plane drawing cannot be degrees, so it opens detached, to be aimed');
			await a.page.click('#lpn_georef_cancel');
			await a.settle(700);

			await openAsLatLon(a, 'world.inp', INP.replace(' UNITS  None', ' UNITS  Degrees'));
			await a.dialogClick('OK');
			await a.settle(600);
			report.ok(await a.page.evaluate(() => document.getElementById('lpn_georef_bar').style.display === 'none'),
				'a file that DOES say DEGREES just opens — its coordinates already are lon/lat');
			report.has(await readout(a), 'Longitude', '...as a lat/lon project, read out of the file');
		}

		report.eq(a.errors.length, 0, 'no uncaught JavaScript', a.errors[0] || '');
	} finally {
		await a.close();
	}

	// ---- and again with the bottom pane open (Task 434) -----------------------------------------
	// The pane is in normal flow below the canvas, so opening it changes the canvas's height and its
	// position on the screen — and every number in this tool is a screen coordinate that has been
	// through `screenToWorld()`.
	const b = await Session.open(browser, 'B');
	try {
		await b.page.route(/tile\.openstreetmap\.org/, (route) => route.abort());
		await b.goto();
		await answerConsent(b);
		await b.dismissGallery();
		await b.toolbarClick('Bottom panel');
		await b.settle(600);
		const paneOpen = await b.page.evaluate(() =>
			document.getElementById('lpn_pane').style.display !== 'none');
		report.ok(paneOpen, 'set up: the bottom pane is open, so the canvas is shorter and lower');

		await drawL(b);
		await placeCurrent(b, 'pane.json');
		await wheelIn(b, 20);
		const mB = await modelBox(b), canvasB = await canvasRect(b);
		report.ok(mB && mB.cy > canvasB.y && mB.cy < canvasB.y + canvasB.h,
			'the model is held on the shortened canvas, not behind the pane',
			mB && `centre ${mB.cy.toFixed(0)} in a canvas of ${canvasB.y.toFixed(0)}..${(canvasB.y + canvasB.h).toFixed(0)}`);

		await b.page.click('#lpn_georef_drop');
		await b.settle(600);
		const handsB = await b.page.evaluate(() => [...document.querySelectorAll('.lpn-georef-handle')].map(h => {
			const r = h.getBoundingClientRect();
			const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
			return { self: hit === h, size: r.width };
		}));
		report.eq(handsB.length, 5, 'the handles are all there with the pane open');
		report.ok(handsB.every(h => h.self && Math.abs(h.size - 18) < 1.5),
			'...and still hit-testable at their own centres', handsB[0] && handsB[0].size.toFixed(1) + ' px');

		const gb0 = await body(b);
		await b.page.mouse.move(gb0.cx, gb0.cy);
		await b.page.mouse.down();
		await b.page.mouse.move(gb0.cx - 50, gb0.cy - 30, { steps: 8 });
		await b.page.mouse.up();
		await b.settle(400);
		const gb1 = await body(b);
		report.ok(Math.abs(gb1.cx - gb0.cx + 50) < 2 && Math.abs(gb1.cy - gb0.cy + 30) < 2,
			'...and a body drag still lands where the pointer went, with the canvas offset by the pane',
			`moved ${(gb1.cx - gb0.cx).toFixed(1)}, ${(gb1.cy - gb0.cy).toFixed(1)} for a -50, -30 drag`);

		await b.page.click('#lpn_georef_cancel');
		await b.settle(600);
		report.eq(b.errors.length, 0, 'no uncaught JavaScript with the pane open', b.errors[0] || '');
	} finally {
		await b.close();
	}
};
