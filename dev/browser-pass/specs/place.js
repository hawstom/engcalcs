// §17 — the placement tool (ROADMAP Task 145's third slice, dev/georeferencing.md).
//
// `dev/lpn-spike/georef-place-harness.js` owns the ARITHMETIC — the transform, the exactness of
// Cancel, the fact that nothing but the coordinates moves. None of that is repeated here. What is
// left is the half a harness has no eyes for, and it is most of what the tool IS:
//
//   1. **The command is findable.** It was HIDDEN once on a project already on the map and Tom could
//      not find it at all. Present-and-greyed and absent are different statements, and only one of
//      them is true. That is the regression this spec pins.
//   2. **The ghost box is on the screen**, with an area, inside the canvas — the Find defect (§10)
//      one more time: a fully-built frame 1,200 px off the drawing surface looks identical from
//      inside the page.
//   3. **The handles can be grabbed.** A 9-pixel handle is a claim about hit-testing, so it is
//      checked by asking the document what is actually at the handle's own centre.
//   4. **The pointer reaches the right gesture.** Drag the body and the model moves; drag a corner
//      and the OPPOSITE corner does not. Both go through the real pointer-capture path.
//   5. **Editing really is locked.** georefActive() gates the same seams regMode does; the proof is
//      that the Junction tool plus a click on the canvas adds nothing.
//
// **THE HANDLES ARE A CONSTANT SIZE ON SCREEN, and that is checked below.** georefDrawFrame() sizes
// them `GEOREF_HANDLE_PX / state.s`, which is a screen size only for as long as the frame is redrawn
// when the scale changes. It was not: in the place stage only georefCarryTick() redrew, and that is
// the carry stage, so six notches took an 18.31 px grab target to 32.44 px (a ratio of 1.772 against
// the zoom's own 1.1^6) and zooming out shrank it away. onZoomChanged() now redraws the frame.

const { Session } = require('../lib/session');

exports.title = '17. The placement tool';

// An L, never a rectangle: a symmetric model cannot reveal a missing north-south flip, which is the
// same reason dev/lpn-spike/georef-harness.js uses one.
const L = [[0.25, 0.20], [0.65, 0.20], [0.65, 0.55]];

async function canvasRect(a) {
	return a.page.evaluate(() => {
		const b = document.getElementById('lpn_canvas').getBoundingClientRect();
		return { x: b.x, y: b.y, w: b.width, h: b.height };
	});
}
// Three junctions at chosen points, rather than Session.makeEdit() three times: that helper picks
// the first clear spot it finds, which lands all three in one row — a model with no height at all,
// whose ghost box is a line and whose corner handles sit on top of each other.
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
// The map is zoomed the way the carry hint tells the user to zoom it.
async function wheelIn(a, notches) {
	const r = await canvasRect(a);
	await a.page.mouse.move(r.x + r.w / 2, r.y + r.h / 2);
	for (let i = 0; i < notches; i++) { await a.page.mouse.wheel(0, -100); await a.page.waitForTimeout(30); }
	await a.settle(400);
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

const ROW = 'Convert XY project to GeoMap…';

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		// The tile server is never called — see the note at the top of specs/basemap.js.
		await a.page.route(/tile\.openstreetmap\.org/, (route) => route.abort());
		await a.goto();
		await a.dismissGallery();

		// ---- 1. the command is findable ------------------------------------------------------
		// **THE WHOLE SPEC RUNS IN ONE PROJECT, and that is not tidiness.** A new project inherits
		// whatever view the last one left (the note at the top of specs/geo.js), so a blank XY tab
		// made after a GeoMap tab is drawn through a geographic transform: three junctions clicked
		// across the canvas land 0.04 apart, the model is 12 mm wide, and its ghost box is a point.
		// Everything below would then pass or fail for a reason that has nothing to do with the tool.
		// The project on a first visit is XY with a grid view, which is the honest starting state —
		// and the GeoMap half of the menu check is free at the end, once Finish has made it one.
		const row = await fileRow(a, ROW);
		report.ok(!!row, 'the File menu carries the placement command', row && row.label);
		report.ok(row && !row.disabled, '...and it is live on an XY project');

		// ---- 2. it refuses an empty project by name -------------------------------------------
		await a.menuClick(ROW);
		await a.settle(300);
		report.has(await a.notice(), 'Draw or open a network first',
			'an XY project with nothing in it is refused, in words');
		report.ok((await body(a)) === null, '...and no placement was started');

		// ---- 3. the carry stage ----------------------------------------------------------------
		await drawL(a);
		const original = await nodePos(a);
		await a.menuClick(ROW);
		await a.settle(700);
		const asked = a.lastDialog();
		report.ok(asked && asked.type === 'confirm', 'converting asks first', asked && asked.type);
		report.has(asked && asked.message, 'not touched',
			'...and the confirm says what does NOT change: lengths, diameters, elevations, demands');

		const bar = await a.page.evaluate(() => {
			const b = document.getElementById('lpn_georef_bar');
			const shown = (id) => getComputedStyle(document.getElementById(id)).display !== 'none';
			return {
				visible: b.style.display !== 'none',
				hint: document.getElementById('lpn_georef_hint').textContent,
				drop: shown('lpn_georef_drop'), goto: shown('lpn_georef_goto'),
				finish: shown('lpn_georef_finish'), numbers: shown('lpn_georef_numbers')
			};
		});
		report.ok(bar.visible, 'the placement bar appears');
		report.has(bar.hint, 'Pan and zoom', '...telling the user what the carry stage is for');
		report.ok(bar.drop && bar.goto, '...offering Drop it here and Go to…');
		report.ok(!bar.finish && !bar.numbers,
			'...and NOT Finish or the two numbers — there is nothing placed to adjust yet');

		const ghost = await body(a);
		const canvas = await canvasRect(a);
		report.ok(!!ghost && ghost.w > 0 && ghost.h > 0, 'a ghost box is drawn with an area',
			ghost && `${ghost.w.toFixed(1)} x ${ghost.h.toFixed(1)} px`);
		report.ok(ghost && ghost.dashed, '...dashed, so it reads as a preview and not as the model');
		report.ok(ghost && ghost.cx > canvas.x && ghost.cx < canvas.x + canvas.w &&
			ghost.cy > canvas.y && ghost.cy < canvas.y + canvas.h,
			'...and it is ON the drawing surface, not somewhere down the document',
			ghost && `centre ${ghost.cx.toFixed(0)}, ${ghost.cy.toFixed(0)}`);

		// The box rides the map. 24 notches of 1.1 is 9.85x, and the box is at its TRUE ground size,
		// so it has to grow by exactly that.
		await wheelIn(a, 24);
		const zoomed = await body(a);
		const grew = zoomed.w / ghost.w;
		report.ok(Math.abs(grew / Math.pow(1.1, 24) - 1) < 0.05,
			'the box rides the map: zooming in makes it bigger by the zoom, because it is at ground size',
			`x${grew.toFixed(2)} over 24 notches`);

		// ---- 4. Drop ----------------------------------------------------------------------------
		await a.page.click('#lpn_georef_drop');
		await a.settle(500);
		const placed = await a.page.evaluate(() => ({
			hint: document.getElementById('lpn_georef_hint').textContent,
			numbers: getComputedStyle(document.getElementById('lpn_georef_numbers')).display !== 'none',
			drop: getComputedStyle(document.getElementById('lpn_georef_drop')).display !== 'none',
			finish: getComputedStyle(document.getElementById('lpn_georef_finish')).display !== 'none',
			scale: document.getElementById('lpn_georef_scale_in').value,
			unit: document.getElementById('lpn_georef_unit').textContent,
			rot: document.getElementById('lpn_georef_rot_in').value
		}));
		report.has(placed.hint, 'Drag the model', 'Drop it here moves the bar on to the adjust stage');
		report.ok(placed.numbers && placed.finish && !placed.drop,
			'...which offers Finish and the two numbers, and no longer offers Drop');
		report.eq(placed.scale, '1', 'the scale is READ, not asked for: one drawing unit is one length unit');
		report.eq(placed.unit, 'ft', '...in the project\'s own length unit');
		report.eq(placed.rot, '0', '...and the model arrives unturned');

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

		// ---- 5. editing is locked while placing --------------------------------------------------
		const n0 = await a.nodeCount();
		await a.toolbarClick('Junction');
		await a.page.mouse.click(canvas.x + canvas.w * 0.15, canvas.y + canvas.h * 0.82);
		await a.settle(350);
		report.eq(await a.nodeCount(), n0,
			'editing is locked while placing — the transform re-derives every point BY INDEX');
		await a.toolbarClick('Select');

		// ---- 6. the two gestures -----------------------------------------------------------------
		const b0 = await body(a);
		await a.page.mouse.move(b0.cx, b0.cy);
		await a.page.mouse.down();
		await a.page.mouse.move(b0.cx + 60, b0.cy + 40, { steps: 8 });
		await a.page.mouse.up();
		await a.settle(400);
		const b1 = await body(a);
		report.ok(Math.abs(b1.cx - b0.cx - 60) < 2 && Math.abs(b1.cy - b0.cy - 40) < 2,
			'dragging the body moves the model with the pointer',
			`moved ${(b1.cx - b0.cx).toFixed(1)}, ${(b1.cy - b0.cy).toFixed(1)} for a 60, 40 drag`);
		report.ok(Math.abs(b1.w - b0.w) < 1 && Math.abs(b1.h - b0.h) < 1,
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

		// ---- 7. the two numbers -------------------------------------------------------------------
		const b2 = await body(a);
		// Read what the box SAYS first: the corner drag above has already moved the scale off 1, and
		// the box states the scale absolutely ("one drawing unit is ___ ft"), never a multiplier.
		const was = +(await a.page.inputValue('#lpn_georef_scale_in'));
		await a.page.fill('#lpn_georef_scale_in', '2');
		await a.page.dispatchEvent('#lpn_georef_scale_in', 'change');
		await a.settle(400);
		const b3 = await body(a);
		report.ok(Math.abs((b3.w / b2.w) / (2 / was) - 1) < 0.02,
			'"one drawing unit is 2 ft" sets the scale to 2 ft, whatever the drags before it left',
			`${was} -> 2 ft grew the box x${(b3.w / b2.w).toFixed(3)}`);
		report.ok(Math.abs(b3.cx - b2.cx) < 3 && Math.abs(b3.cy - b2.cy) < 3,
			'...about its own centre, which stays where it was');

		await a.page.fill('#lpn_georef_rot_in', '90');
		await a.page.dispatchEvent('#lpn_georef_rot_in', 'change');
		await a.settle(400);
		const b4 = await body(a);
		// A quarter turn swaps the model's GROUND extents, and the screen does not simply swap with
		// them: the display is unprojected, so a degree of longitude and a degree of latitude are the
		// same number of pixels while a metre east-west is 1/cos(latitude) degrees. Turning therefore
		// takes the aspect w/h to cos²(lat) · h/w. The tiles carry the identical stretch, so this is
		// the picture the user is meant to see — it is Task 145's remaining projection seam, on screen.
		const cos2 = Math.pow(Math.cos(38.106 * Math.PI / 180), 2);
		report.ok(b4.h > b4.w && Math.abs((b4.h / b4.w) / (cos2 * b3.w / b3.h) - 1) < 0.03,
			'turning 90 degrees stands the model on end, stretched east-west as everything on this map is',
			`${b4.w.toFixed(0)} x ${b4.h.toFixed(0)} px, aspect ${(b4.h / b4.w).toFixed(3)} for a predicted ${(cos2 * b3.w / b3.h).toFixed(3)}`);
		report.ok(Math.abs(b4.cx - b3.cx) < 3 && Math.abs(b4.cy - b3.cy) < 3,
			'...about its centre as well');

		// ---- 7b. A handle is the same size at every zoom -----------------------------------------
		// Anything sized in screen pixels has to be redrawn when the scale changes, or it is a
		// constant in WORLD units instead. A grab target that doubles when you zoom in and vanishes
		// when you zoom out is unusable at one end of the range.
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

		// ---- 8. Cancel is exact ---------------------------------------------------------------
		await a.page.click('#lpn_georef_cancel');
		await a.settle(800);
		report.eq(JSON.stringify(await nodePos(a)), JSON.stringify(original),
			'Cancel puts every coordinate back EXACTLY, after a drag, a resize, a scale and a turn');
		report.ok(await a.page.evaluate(() => document.getElementById('lpn_georef_bar').style.display === 'none'),
			'...and the bar goes away');
		report.ok(/^X:/.test((await readout(a)).trim()), '...and it is an XY project again');
		report.ok(!(await fileRow(a, ROW)).disabled, '...so the command is live once more');


		// ---- 9. Finish commits ------------------------------------------------------------------
		await a.menuClick(ROW);
		await a.settle(700);
		await wheelIn(a, 12);
		await a.page.click('#lpn_georef_drop');
		await a.settle(400);
		const before = await a.nodeCount();
		await a.page.click('#lpn_georef_finish');
		await a.settle(900);
		report.ok(a.lastDialog() && a.lastDialog().type === 'confirm', 'Finish asks first — it is not undoable');
		report.ok(await a.page.evaluate(() => document.getElementById('lpn_georef_bar').style.display === 'none'),
			'...and the bar goes away when it is done');
		const read = await readout(a);
		report.ok(/Longitude/.test(read) && /Latitude/.test(read),
			'the project is geographic afterwards: the readout speaks in degrees', read);
		report.eq(await a.nodeCount(), before, '...with the same network still drawn');
		report.has(await a.notice(), 'GeoMap project now', '...and it says so');
		const onMap = await fileRow(a, ROW);
		report.ok(!!onMap, 'a project already on the map still SHOWS the command',
			'hidden once, and Tom could not find it at all — absent says "there is no such command"');
		report.ok(onMap && onMap.disabled, '...greyed, because there is nothing left to convert');

		report.eq(a.errors.length, 0, 'no uncaught JavaScript', a.errors[0] || '');
	} finally {
		await a.close();
	}

	// ---- and again with the bottom pane open (Task 434) -----------------------------------------
	// The pane is in normal flow below the canvas, so opening it changes the canvas's height and its
	// position on the screen — and every number in this tool is a screen coordinate that has been
	// through `screenToWorld()`. A fresh profile, because a project that has been through Finish is
	// a GeoMap one and a new XY tab made after it inherits the geographic view (see section 1).
	const b = await Session.open(browser, 'B');
	try {
		await b.page.route(/tile\.openstreetmap\.org/, (route) => route.abort());
		await b.goto();
		await b.dismissGallery();
		await b.toolbarClick('Bottom panel');
		await b.settle(600);
		const paneOpen = await b.page.evaluate(() =>
			document.getElementById('lpn_pane').style.display !== 'none');
		report.ok(paneOpen, 'set up: the bottom pane is open, so the canvas is shorter and lower');

		await drawL(b);
		await b.menuClick(ROW);
		await b.settle(700);
		await wheelIn(b, 24);
		const ghostB = await body(b), canvasB = await canvasRect(b);
		report.ok(ghostB && ghostB.w > 0 && ghostB.h > 0 &&
			ghostB.cy > canvasB.y && ghostB.cy < canvasB.y + canvasB.h,
		'the ghost box is on the shortened canvas, not behind the pane',
		ghostB && `centre ${ghostB.cy.toFixed(0)} in a canvas of ${canvasB.y.toFixed(0)}..${(canvasB.y + canvasB.h).toFixed(0)}`);

		await b.page.click('#lpn_georef_drop');
		await b.settle(500);
		const handsB = await b.page.evaluate(() => [...document.querySelectorAll('.lpn-georef-handle')].map(h => {
			const r = h.getBoundingClientRect();
			const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
			return { self: hit === h, size: r.width };
		}));
		report.eq(handsB.length, 5, 'the handles are all there with the pane open');
		report.ok(handsB.every(h => h.self && Math.abs(h.size - 18) < 1.5),
			'...and still hit-testable at their own centres', handsB[0] && handsB[0].size.toFixed(1) + ' px');

		const g0 = await body(b);
		await b.page.mouse.move(g0.cx, g0.cy);
		await b.page.mouse.down();
		await b.page.mouse.move(g0.cx - 50, g0.cy - 30, { steps: 8 });
		await b.page.mouse.up();
		await b.settle(400);
		const g1 = await body(b);
		report.ok(Math.abs(g1.cx - g0.cx + 50) < 2 && Math.abs(g1.cy - g0.cy + 30) < 2,
			'...and a body drag still lands where the pointer went, with the canvas offset by the pane',
			`moved ${(g1.cx - g0.cx).toFixed(1)}, ${(g1.cy - g0.cy).toFixed(1)} for a -50, -30 drag`);

		await b.page.click('#lpn_georef_cancel');
		await b.settle(600);
		report.eq(b.errors.length, 0, 'no uncaught JavaScript with the pane open', b.errors[0] || '');
	} finally {
		await b.close();
	}
};
