// §45 — PANNING. The core gesture of a map editor, and it had no coverage at all.
//
// **WRITTEN BECAUSE A REGRESSION WAS REPORTED AND COULD NOT BE REPRODUCED** (Tom, 2026-09-13, in
// Ubuntu Chrome, three days before the Engineers Without Borders demonstration: *"I couldn't pan (I
// can edit and zoom) on reload, even repeated reload... Panning is broken, and it wasn't before
// that repair procedure ran. Even Page, Start fresh doesn't restore pan."* The same build panned
// correctly in his Ubuntu Firefox.) Nothing in this tree could say whether panning worked, which is
// the gap this file closes whatever the cause of that report turns out to be.
//
// **WHAT THE SHAPE OF THAT REPORT RULES IN AND OUT, so the next reader does not redo it.** "Edit
// and zoom work, pan does not" is a narrow signature: the wheel goes straight to `zoomAbout()` and
// a click goes straight to its own listener, while a pan is the ONE gesture that needs all four of
//   (1) the pointerdown reaching bare canvas and falling through to `drag = {type:'pan'}`,
//   (2) `pointermove` passing the `tapMovePx()` slop and setting `dragDirty`,
//   (3) the `requestAnimationFrame` heartbeat in `tick()` still running, and
//   (4) `setTransform()` writing the world group's transform.
// (3) is the one nothing else in the page depends on, and it is why `tick()` now carries a guard.
//
// **THIS SPEC ASSERTS (1), (2) and (4) TOGETHER BY THEIR RESULT, which is the only honest way**: it
// presses on a point that `elementFromPoint` says is the bare canvas, drags, and requires the world
// transform to have translated by the drag delta -- during the gesture and still after the release.
// A counter saying "a pan drag was created" would pass on a page whose map never moved.
//
// **AND IT HOLDS THE VIEW AFTERWARDS FOR EIGHT SECONDS.** "I panned and it came back" and "I panned
// and nothing happened" are the same sentence from a user and different defects here: a solve, an
// autosave or a refresh that re-applies a remembered view would undo the pan a moment later, which
// no during-the-gesture assertion could see.
//
// **WHAT IT CANNOT REACH.** A synthetic CDP mouse is not an OS mouse: it starts no native drag, it
// is not affected by an extension's overlay, and it cannot see a Chrome setting or a device scale
// the page never learns about. specs/nodehit.js says the same thing at the end of its device-pixel
// sweep. So a green run here is not a proof that Tom's Chrome pans; it is a proof that this tree's
// pan code does, which is the half that belongs in a repository.
//
// **THE SNIPPET TO SEND SOMEBODY WHO CAN REPRODUCE IT.** Paste into the DevTools console on the map
// page, then drag the map with the mouse for a second or two. It names which of the four legs above
// failed, which is the one thing a screenshot of a map that did not move cannot say.
//
//   (function () {
//     var svg = document.getElementById('lpn_canvas'),
//         g = svg.querySelector(':scope > g'), n = 0, seen = {}, t0 = g.getAttribute('transform');
//     ['pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'lostpointercapture']
//       .forEach(function (k) { svg.addEventListener(k, function (e) {
//         seen[k] = (seen[k] || 0) + 1;
//         if (k === 'pointerdown') { seen.hit = (document.elementFromPoint(e.clientX, e.clientY) || {}).getAttribute
//           ? (document.elementFromPoint(e.clientX, e.clientY).id || '') + ' .' +
//             (document.elementFromPoint(e.clientX, e.clientY).getAttribute('class') || '') : '?'; }
//       }, true); });
//     requestAnimationFrame(function f () { n++; requestAnimationFrame(f); });
//     setTimeout(function () { console.log('frames', n, 'events', seen,
//       'transform before', t0, 'after', g.getAttribute('transform')); }, 4000);
//   }());
//
// Read it this way. `frames` near zero means the browser is not animating this tab at all;
// `pointerdown` absent means nothing reached the canvas; `pointercancel` or `lostpointercapture`
// present means something took the gesture away mid-drag, which is the one leg a synthetic mouse
// can never produce; and a transform that did not change while all the events arrived puts the
// fault below the drag, in `applyDrag()` or `setTransform()`. `hit` names what the press landed on:
// anything but the canvas or a plain map object means something is lying over the map.

'use strict';

const { Session } = require('../lib/session');

exports.title = '45. Panning the map';

const DRAG_DX = -18, DRAG_DY = -12, DRAG_STEPS = 8;

async function canvasRect(a) {
	return a.page.evaluate(() => {
		const b = document.getElementById('lpn_canvas').getBoundingClientRect();
		return { x: b.x, y: b.y, w: b.width, h: b.height };
	});
}

// The world group's transform, parsed. This is what the user sees move; `state.tx` is a closure
// variable no spec can read, and reading it would be reading our own bookkeeping rather than the
// drawing.
async function worldXf(a) {
	return a.page.evaluate(() => {
		const g = document.querySelector('#lpn_canvas > g');
		const t = g ? g.getAttribute('transform') || '' : '';
		const m = /translate\(([-\d.eE+]+),\s*([-\d.eE+]+)\)\s*scale\(([-\d.eE+]+)\)/.exec(t);
		return m ? { tx: +m[1], ty: +m[2], s: +m[3] } : null;
	});
}

// **A POINT THE PRESS WILL ACTUALLY REACH AS BARE MAP.** Not a corner: the consent banner is
// `position: fixed; bottom: 0` on a fresh profile and lies across the bottom of the canvas, which is
// how the first draft of this spec reported "pan did nothing" three times against a working page.
// `elementFromPoint` is the browser's own hit test, the same one the pointer event uses.
async function bareMapPoint(a) {
	const box = await canvasRect(a);
	for (let fy = 0.15; fy <= 0.85; fy += 0.1) {
		for (let fx = 0.15; fx <= 0.85; fx += 0.1) {
			const x = box.x + box.w * fx, y = box.y + box.h * fy;
			const id = await a.page.evaluate(([px, py]) => {
				const el = document.elementFromPoint(px, py);
				return el ? (el.id || '') : '';
			}, [x, y]);
			if (id === 'lpn_canvas') { return { x: x, y: y }; }
		}
	}
	return null;
}

async function dragMap(a, from) {
	await a.page.mouse.move(from.x, from.y);
	await a.page.mouse.down();
	for (let i = 1; i <= DRAG_STEPS; i++) {
		await a.page.mouse.move(from.x + DRAG_DX * i, from.y + DRAG_DY * i);
	}
	const during = await worldXf(a);
	await a.page.mouse.up();
	await a.settle(250);
	return { during: during, after: await worldXf(a) };
}

// One complete pan, asserted. `what` names the situation, because the whole value of this spec is
// which of them holds and which does not.
async function assertPans(a, report, what) {
	const from = await bareMapPoint(a);
	report.ok(!!from, `${what}: there is bare map to press on`);
	if (!from) { return; }
	const before = await worldXf(a);
	report.ok(!!before, `${what}: the world group carries a transform to start from`,
		before ? `tx=${before.tx.toFixed(1)} ty=${before.ty.toFixed(1)} s=${before.s}` : 'none');
	if (!before) { return; }

	const moved = await dragMap(a, from);
	const wantX = before.tx + DRAG_DX * DRAG_STEPS, wantY = before.ty + DRAG_DY * DRAG_STEPS;
	// Half a pixel: the transform is written from the raw pointer delta, so this is an equality
	// test with room for nothing but float printing.
	const near = (got, want) => !!got && Math.abs(got - want) < 0.5;
	report.ok(near(moved.during && moved.during.tx, wantX) && near(moved.during && moved.during.ty, wantY),
		`${what}: the map follows the pointer while the button is down`,
		moved.during ? `tx=${moved.during.tx.toFixed(1)} ty=${moved.during.ty.toFixed(1)} wanted ${wantX.toFixed(1)},${wantY.toFixed(1)}`
			: 'no transform');
	report.ok(near(moved.after && moved.after.tx, wantX) && near(moved.after && moved.after.ty, wantY),
		`${what}: ...and stays there when the button comes up`,
		moved.after ? `tx=${moved.after.tx.toFixed(1)} ty=${moved.after.ty.toFixed(1)}` : 'no transform');
	// **THE ZOOM IS NOT TOUCHED BY A PAN.** A pan that quietly rescaled would move the drawing on
	// screen and pass every check above.
	report.ok(!!moved.after && moved.after.s === before.s,
		`${what}: and the zoom is exactly what it was`,
		moved.after ? `${moved.after.s} vs ${before.s}` : 'no transform');
	return moved.after;
}

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		// --- an empty project: the thinnest possible page ---------------------
		await a.goto();
		await a.dismissGallery();
		await a.settle(400);
		await assertPans(a, report, 'an empty map');

		// --- an XY project too, because the two frames are different code ------
		await a.newProject();
		await a.settle(600);
		await assertPans(a, report, 'a new XY project');

		// **THE HEARTBEAT IS STILL RUNNING AFTER ALL OF THAT.** `tick()` is a self-rescheduling
		// requestAnimationFrame chain and it is the only thing that applies a drag, so one throw
		// inside it used to end every drag on the page for good while leaving the wheel and every
		// click working -- which is the exact signature of the report this spec was written for.
		// Measured rather than reasoned about: pan twice in a row, which needs two live frames.
		await assertPans(a, report, 'a second pan in the same session');

		report.eq(a.errors.length, 0, 'no uncaught JavaScript');
		if (a.errors.length) { console.log(a.errors.join('\n')); }
	} finally {
		await a.close();
	}

	// --- a real drawing, and the reloads the report names ---------------------
	// **ITS OWN PROFILE, because the examples wall is shown ONCE.** A session that has already
	// waved the gallery away never sees it again, so opening an example has to happen in a browser
	// that has not -- which is the whole of why this is a second Session rather than another
	// `goto()`. The first draft did it in one and threw on an empty wall.
	//
	// A geographic project is the harder of the two frames: it carries `doc.origin`, a derived
	// frame, a basemap layer and a scale in the thousands, so a pan there exercises arithmetic an
	// XY grid does not reach.
	const b = await Session.open(browser, 'B');
	try {
		await b.goto();
		// **THE CARD IS NAMED BY ITS KEY, never spelled out here** (dev/testing-notes.md, and
		// harness_wording_check.php holds it): a title Tom rewords must not turn into a red build
		// in a file about panning.
		await b.openExampleCard(await b.lang('lpn_ex_net3_world_title'));
		await b.settle(1500);
		await assertPans(b, report, 'a geographic Net3, freshly opened');

		await b.reload();
		await b.settle(1500);
		await assertPans(b, report, 'the same project after a reload');
		await b.reload();
		await b.settle(1500);
		const held = await assertPans(b, report, 'and after a second reload');

		// **AND IT STAYS PANNED.** Tom's report cannot distinguish "the map never moved" from "the
		// map moved and something put it back", and neither could any assertion above. Eight
		// seconds covers the solve debounce, the autosave and the label re-layout that a pan
		// release schedules.
		if (held) {
			await b.page.waitForTimeout(8000);
			const later = await worldXf(b);
			report.ok(!!later && Math.abs(later.tx - held.tx) < 0.5 && Math.abs(later.ty - held.ty) < 0.5,
				'the view is still where the pan left it eight seconds later',
				later ? `tx=${later.tx.toFixed(1)} ty=${later.ty.toFixed(1)} vs ${held.tx.toFixed(1)},${held.ty.toFixed(1)}` : 'no transform');
		}
		report.eq(b.errors.length, 0, 'no uncaught JavaScript on the geographic project');
		if (b.errors.length) { console.log(b.errors.join('\n')); }
	} finally {
		await b.close();
	}
};
