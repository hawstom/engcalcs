// §21 — the window does not scroll (ROADMAP Task 432).
//
// Tom, 2026-08-18: *"Our bottom controls bar should be the hard bottom of the page."* On a
// full-window drawing surface anything that scrolls the WINDOW moves the whole application. He
// answered the CSS fix with "appears fixed; will observe", and this file is that observation, made
// every run instead of once.
//
// **WHAT IS NOT CHECKED, AND WHY.** `html:has(#lpn_canvas) { overflow: hidden }` makes
// "is there a scrollbar" unconditionally false and "does the window scroll under a wheel"
// unconditionally no — neither can fail, and the README's rule is that a check which cannot fail is
// worse than one that does. What CAN fail is the geometry the hidden overflow is hiding, so that is
// what is measured: **every box in normal flow ends inside the window.** The pane is in flow below
// the canvas and `flowBelowMap()` subtracts it BY MEASUREMENT, so the map's height and the pane's
// are one sum — which is why every size below is measured with the pane both ways and across a grip
// drag. The control at the foot of this file is an ordinary calculator page, whose content genuinely
// does run past the window; without it these checks would only be proving that nothing is there.
//
// **AND THE OVERFLOW IS STILL THERE — the two DEFECT lines.** `scrollHeight` is 15 px past
// `innerHeight` at a window with hundreds of pixels to spare, and the cause is the same SHAPE as the
// `form` margin the fix removed, in a different element: `echoFooter()` emits
// `<div class="left d-print-none">`, which this page calls with no nav and no legal row, so it is
// EMPTY — but `.left { float: left; margin: 0.5em }` floats it and gives it 8 px of margin. A float
// is not in `document.body`'s content box, so `flowBelowMap()` measures a body that does not contain
// it and hands the map a height that leaves no room for it. `overflow: hidden` then hides the
// consequence instead of removing it, which is the state the roadmap block set out to leave behind.

const { Session } = require('../lib/session');

exports.title = '21. No window scroll';

async function metrics(a) {
	return a.page.evaluate(() => {
		const p = document.getElementById('lpn_pane');
		return {
			innerHeight: window.innerHeight,
			scrollHeight: document.documentElement.scrollHeight,
			bodyBottom: Math.round(document.body.getBoundingClientRect().bottom),
			mapFooterBottom: Math.round(document.getElementById('lpn_map_footer').getBoundingClientRect().bottom),
			paneBottom: (p && p.style.display !== 'none') ? Math.round(p.getBoundingClientRect().bottom) : null
		};
	});
}
const SIZES = [
	{ width: 1400, height: 1200 },
	{ width: 1280, height: 900 },
	{ width: 1024, height: 760 },
	{ width: 1400, height: 1200 }   // and back again, because a resize is its own event
];

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		await a.dismissGallery();
		await a.makeEdit();

		report.eq(await a.page.evaluate(() => getComputedStyle(document.documentElement).overflow),
			'hidden', 'the map page tells the root not to scroll');
		report.eq(await a.page.evaluate(() => getComputedStyle(document.getElementById('formInput')).marginBottom),
			'0px', '...and the form margin that used to collapse into the scroll height is zeroed');

		for (const size of SIZES) {
			await a.page.setViewportSize(size);
			await a.settle(600);
			const tag = `${size.width}x${size.height}`;

			let m = await metrics(a);
			report.ok(m.bodyBottom <= m.innerHeight, `${tag}, pane closed: the page ends inside the window`,
				`body ends at ${m.bodyBottom} of ${m.innerHeight}`);
			report.ok(m.mapFooterBottom <= m.innerHeight, `${tag}: the map's own bottom strip is on screen`,
				`${m.mapFooterBottom} of ${m.innerHeight}`);

			await a.toolbarClick('Bottom panel');
			await a.settle(600);
			m = await metrics(a);
			report.ok(m.bodyBottom <= m.innerHeight, `${tag}, pane OPEN: the page still ends inside the window`,
				`body ends at ${m.bodyBottom} of ${m.innerHeight}`);
			report.ok(m.paneBottom !== null && m.paneBottom <= m.innerHeight,
				`${tag}: and the pane is the hard bottom — none of it is past the window`,
				`${m.paneBottom} of ${m.innerHeight}`);

			// The grip. The pane grows INTO the map, so a drag is the one gesture that moves both
			// halves of the sum at once, and the likeliest way to make a page taller than its window.
			const grip = await a.page.evaluate(() => {
				const g = document.getElementById('lpn_pane_grip').getBoundingClientRect();
				return { x: g.x + g.width / 2, y: g.y + g.height / 2 };
			});
			await a.page.mouse.move(grip.x, grip.y);
			await a.page.mouse.down();
			await a.page.mouse.move(grip.x, grip.y - 180, { steps: 10 });
			await a.settle(200);
			m = await metrics(a);
			report.ok(m.bodyBottom <= m.innerHeight && m.paneBottom <= m.innerHeight,
				`${tag}: nor DURING a grip drag, with the pane grown 180 px`,
				`pane ends at ${m.paneBottom} of ${m.innerHeight}`);
			await a.page.mouse.move(grip.x, grip.y + 120, { steps: 10 });
			await a.page.mouse.up();
			await a.settle(400);
			m = await metrics(a);
			report.ok(m.bodyBottom <= m.innerHeight && m.paneBottom <= m.innerHeight,
				`${tag}: nor after it, with the pane shrunk again`,
				`pane ends at ${m.paneBottom} of ${m.innerHeight}`);

			await a.toolbarClick('Bottom panel');
			await a.settle(400);
		}

		// ---- the overflow still under the hidden scrollbar ----------------------------------------
		await a.page.setViewportSize({ width: 1400, height: 1200 });
		await a.settle(600);
		const m = await metrics(a);
		report.ok(m.scrollHeight > m.innerHeight,
			'DEFECT (Task 432): the document is STILL taller than the window — overflow:hidden hides it',
			`${m.scrollHeight} against ${m.innerHeight}, with body ending at ${m.bodyBottom}`);
		const proof = await a.page.evaluate(() => {
			const el = document.querySelector('.left.d-print-none');
			if (!el) { return null; }
			const before = document.documentElement.scrollHeight;
			const floated = getComputedStyle(el).float, empty = !el.textContent.trim();
			el.remove();
			return { before, after: document.documentElement.scrollHeight, floated, empty, inner: window.innerHeight };
		});
		report.ok(proof && proof.floated === 'left' && proof.empty && proof.before > proof.inner && proof.after <= proof.inner,
			'DEFECT: and it is echoFooter()\'s EMPTY floated <div class="left d-print-none"> — delete it and the overflow is zero',
			proof && `scrollHeight ${proof.before} -> ${proof.after} for a window of ${proof.inner}`);

		report.eq(a.errors.length, 0, 'no uncaught JavaScript', a.errors[0] || '');
	} finally {
		await a.close();
	}

	// ---- the stated cost, and the control -------------------------------------------------------
	const b = await Session.open(browser, 'B');
	try {
		await b.goto();
		await b.dismissGallery();
		// Below the map's and the pane's floors there is no height left to give, and what does not
		// fit is CLIPPED rather than scrollable. That is Task 432's stated cost, not a surprise —
		// it is measured here so the size of it is on the record.
		// The pane is opened at the tall window this rig runs in and the window is shrunk AFTERWARDS:
		// a fresh profile has never answered the consent banner, which is `position: fixed; bottom: 0`
		// and lies across the toolbar in a 480-high window (see the VIEWPORT note in lib/session.js).
		await b.toolbarClick('Bottom panel');
		await b.settle(500);
		await b.page.setViewportSize({ width: 900, height: 480 });
		await b.settle(700);
		const tight = await metrics(b);
		report.ok(tight.bodyBottom > tight.innerHeight,
			'a window shorter than the two floors puts the pane past the bottom, and it is clipped',
			`body ends at ${tight.bodyBottom} of ${tight.innerHeight} — the stated cost of "hard bottom"`);

		// `html:has(#lpn_canvas)` is the scope, and the other fifteen calculators are a form and an
		// answer and must keep scrolling. This is also the control on every measurement above: they
		// are only worth having if the same measurement can see a page that does run over.
		await b.goto('Manning-Pipe-Flow.php?ec_nolog=1');
		await b.page.setViewportSize({ width: 900, height: 400 });
		await b.settle(500);
		const ordinary = await b.page.evaluate(() => ({
			overflow: getComputedStyle(document.documentElement).overflow,
			inner: window.innerHeight,
			bodyBottom: Math.round(document.body.getBoundingClientRect().bottom)
		}));
		report.eq(ordinary.overflow, 'visible', 'an ordinary calculator page is left alone');
		report.ok(ordinary.bodyBottom > ordinary.inner,
			'...and really does run past the window, which is what makes the checks above mean something',
			`body ends at ${ordinary.bodyBottom} of ${ordinary.inner}`);
		report.eq(b.errors.length, 0, 'no uncaught JavaScript on the ordinary page', b.errors[0] || '');
	} finally {
		await b.close();
	}
};
