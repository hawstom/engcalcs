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
		await a.reload();
		report.ok(await galleryShowing(a),
			'DEFECT (Task 431): a RELOAD asks again — the case Tom reported twice',
			'initLibrary() reads only projects and openId out of lpn_index, so galleryDismissed is dropped');
		report.ok(!(await storedFlag(a)),
			'DEFECT: and the stored answer is gone from lpn_index after the reload that dropped it',
			'it was true one line above the reload — this is a read that is missing, not a write');

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
		report.ok(await galleryShowing(b),
			'DEFECT (Task 431): the same reload loses that answer too', 'same missing read');
		await b.newProject();
		await b.settle(400);
		report.ok(await galleryShowing(b),
			'DEFECT (Task 431): and then every new empty tab asks again',
			'"Still happens when I switch to each new project tab after page reload" — Tom, verbatim');

		report.eq(b.errors.length, 0, 'no uncaught JavaScript in B', b.errors[0] || '');
	} finally {
		await b.close();
	}
};
