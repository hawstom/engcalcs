// §19 — the examples gallery is asked ONCE (ROADMAP Task 431).
//
// Tom reported this twice, and the second report is the one that matters: *"Still happens when I
// switch to each new project tab after page reload."* Two wrong answers shipped before the current
// one, and each looked correct in the case it was written for — a page-level flag that opening an
// example cleared for everybody, then a per-PROJECT flag, which answers "has this project ever had
// content" and is honestly `no` for every empty tab, forever.
//
// The question the wall actually asks is **"is this person new here?"**, so the answer belongs in
// storage and has to survive a reload. **IT DOES NOT, AND THAT IS THIS SPEC'S HEADLINE FINDING:**
//
//   `dismissGalleryForGood()` sets `library.galleryDismissed` and calls `saveIndex()`, which writes
//   the whole `library` — and `lpn_index` really does come back reading
//   `{"v":8,…,"galleryDismissed":true}`. But `initLibrary()` (js/looped-network.js, the
//   `readJSON(LPN_INDEX_KEY)` branch) copies exactly two fields out of it, `projects` and `openId`.
//   The flag is dropped on READ, the next saveIndex() writes an index without it, and the wall is
//   back — on every reload, and then on every empty tab, which is the sentence Tom wrote.
//
// The three checks below marked DEFECT therefore pin what the page does TODAY, so that fixing it
// breaks this file and whoever fixes it reads this note. They are not a statement that the behaviour
// is wanted. Everything else here is a real check of the behaviour that IS right: within one page
// load the answer holds across tabs, across an emptied project, and per profile.

const { Session } = require('../lib/session');

exports.title = '19. The examples gallery, asked once';

async function galleryShowing(a) {
	return a.page.evaluate(() => {
		const h = document.getElementById('lpn_empty_hint');
		if (!h || h.style.display === 'none') { return false; }
		const r = h.getBoundingClientRect();
		return r.width > 0 && r.height > 0;
	});
}
// The stored answer, read straight out of the key that carries it.
async function storedFlag(a) {
	return a.page.evaluate(() => {
		try { return !!JSON.parse(localStorage.getItem('lpn_index') || '{}').galleryDismissed; }
		catch (e) { return null; }
	});
}

exports.run = async function ({ browser, report }) {
	// ---- a first visit is asked -----------------------------------------------------------------
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		report.ok(await galleryShowing(a), 'a first visit meets the examples gallery',
			'an empty canvas with no way in is worse than a shop window');

		// ---- dismissed, and it stays dismissed for this page load ---------------------------------
		await a.dismissGallery();
		report.ok(!(await galleryShowing(a)), 'waving it away closes it');
		report.ok(await storedFlag(a), '...and the answer is written to lpn_index, not merely held in a variable');

		await a.newProject();
		await a.settle(400);
		report.ok(!(await galleryShowing(a)),
			'a brand-new empty project does not ask again — the question was about the person, not the tab');

		// ---- still reachable on purpose ----------------------------------------------------------
		// Dismissed is not deleted. A user who wants the catalogue asks for it by name.
		await a.menuClick('Open example…');
		await a.settle(500);
		report.ok(await galleryShowing(a), 'File ▸ Open example… still opens the gallery on demand',
			'answered once is not removed — it stops being unsolicited, that is all');
		await a.dismissGallery();
		report.ok(!(await galleryShowing(a)), '...and closing it again closes it again');

		// ---- the reload ---------------------------------------------------------------------------
		// **THE RELOAD IS THE HEADLINE**, because it is the case Tom reported twice and the case two
		// earlier fixes both missed. The first fix was page-level, the second per-project; both were
		// answering the wrong question. The third stores the answer with the library — and even then
		// it did not work until `initLibrary()` was taught to READ the field, which it was not:
		// it copied `projects` and `openId` out of the saved index and dropped everything else, so
		// the flag was written, stored, read past, and overwritten as absent by the next save.
		await a.reload();
		report.ok(!(await galleryShowing(a)),
			'a RELOAD does not ask again — the case Tom reported twice');
		report.ok(await storedFlag(a),
			'...and the answer is still in lpn_index afterwards',
			'it was dropped on READ, not on write — the file held it the whole time');

		report.eq(a.errors.length, 0, 'no uncaught JavaScript in A', a.errors[0] || '');
	} finally {
		await a.close();
	}

	// ---- SEEING CONTENT IS THE ANSWER --------------------------------------------------------
	// A second profile, so this starts from a genuine first visit again. Nothing is dismissed here:
	// the user simply draws, which is the third of the three ways the answer is given and the one
	// that makes the behaviour feel right rather than merely correct.
	const b = await Session.open(browser, 'B');
	try {
		await b.goto();
		report.ok(await galleryShowing(b), 'a second, fresh profile is asked too — the answer is per person');
		await b.makeEdit();
		report.ok(!(await galleryShowing(b)), 'drawing something puts the wall away without being asked to');
		report.ok(await storedFlag(b), '...and that counts as the answer, in storage');

		// Deleting your network is not a request for the catalogue.
		await b.toolbarClick('Undo');
		await b.settle(400);
		report.eq(await b.nodeCount(), 0, 'set up: the network is emptied again');
		report.ok(!(await galleryShowing(b)),
			'emptying the project does NOT bring the wall back — you answered by drawing');

		await b.reload();
		report.ok(!(await galleryShowing(b)),
			'a reload keeps that answer too — drawing something is an answer that survives');
		await b.newProject();
		await b.settle(400);
		report.ok(!(await galleryShowing(b)),
			'...and a new empty tab after that reload does not ask',
			'"Still happens when I switch to each new project tab after page reload" — Tom, verbatim');

		report.eq(b.errors.length, 0, 'no uncaught JavaScript in B', b.errors[0] || '');
	} finally {
		await b.close();
	}

	// ---- THE WALL IS THE WHOLE MAP, SO NO LEGEND STANDS ON IT ----------------------------------
	// Tom, 2026-08-28: *"The examples gallery on the phone shows the Labels legend in conflict with
	// the welcome message."* placeLegends() dodges the top-left overlay and the footer, which is no
	// help here: the wall is `inset: 0`, so there is nowhere on the map to dodge TO. Both legends
	// stand down while it is up.
	//
	// **THE ORDER IS THE REPRODUCTION, and a wall met on a FIRST visit does not reproduce it** --
	// the legend has never been rendered then, so it is still hiding behind the inline `display:none`
	// in the markup and a check here would pass for the wrong reason. It takes a drawing first
	// (which renders the legend, four node fields being on by default) and the wall SECOND, off
	// File ▸ Open example… -- which is exactly the path Tom was on. 360px, because at desktop width
	// the legend and the centred welcome line simply miss each other.
	const c = await Session.open(browser, 'C');
	try {
		await c.goto();
		// The DRAWING is made at desktop width -- makeEdit() aims at a named toolbar button, and the
		// phone toolbar is icons. What is being checked is the layout, so only the wall has to be
		// met at 360px.
		await c.makeEdit();
		await c.page.setViewportSize({ width: 360, height: 740 });
		await c.settle(700);
		const drawn = await c.page.evaluate(() => {
			const box = document.getElementById('lpn_labels_legend'), r = box.getBoundingClientRect();
			return { display: box.style.display, w: Math.round(r.width), h: Math.round(r.height) };
		});
		report.ok(drawn.display !== 'none' && drawn.w > 0,
			'set up: a drawing puts the labels legend on the map', JSON.stringify(drawn));

		await c.menuClick('Open example…');
		await c.settle(800);
		report.ok(await galleryShowing(c), 'set up: and the wall comes back over it at 360px');

		const under = await c.page.evaluate(() => {
			const box = document.getElementById('lpn_labels_legend'), r = box.getBoundingClientRect();
			return { display: box.style.display, w: Math.round(r.width), h: Math.round(r.height) };
		});
		report.ok(under.display === 'none', 'THE LABELS LEGEND STANDS DOWN UNDER THE WALL',
			JSON.stringify(under));

		const welcome = await c.page.evaluate(() => {
			const w = document.querySelector('.lpn-examples-welcome'),
				box = document.getElementById('lpn_labels_legend');
			if (!w) { return null; }
			const a = w.getBoundingClientRect(), b = box.getBoundingClientRect();
			return { overlap: a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top,
				welcome: Math.round(a.width) + 'x' + Math.round(a.height) };
		});
		report.ok(welcome && !welcome.overlap, '...so nothing lies across the welcome line',
			welcome && welcome.welcome);

		// And it comes back with the drawing, or this traded one defect for a worse one.
		await c.dismissGallery();
		await c.settle(600);
		const back = await c.page.evaluate(() => {
			const box = document.getElementById('lpn_labels_legend'), r = box.getBoundingClientRect();
			return { display: box.style.display, w: Math.round(r.width) };
		});
		report.ok(back.display !== 'none' && back.w > 0, '...and comes straight back when the wall goes',
			JSON.stringify(back));

		report.eq(c.errors.length, 0, 'no uncaught JavaScript in C', c.errors[0] || '');
	} finally {
		await c.close();
	}
};