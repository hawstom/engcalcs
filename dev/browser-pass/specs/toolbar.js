// §15 — the icon-only toolbar (dev/toolbar-icons.md).
//
// Tom, 2026-08-18: "I need to admit defeat about text toolbar buttons; they are taking up too much
// room ... drop the words from all the toolbar row; move them to the beginning of their tips."
//
// **A BUTTON WHOSE ONLY CONTENT IS AN aria-hidden <svg> HAS NO ACCESSIBLE NAME AT ALL** — it is
// announced as "button", full stop. Every toolbar button's name used to come from its text node,
// and that text node is what this change deleted, so the whole strip loses its names at once if
// anything goes through setLabel() instead of setIconLabel(). That is the one invariant here, and
// it is asserted in the real browser rather than against the source, because it is a property of
// the rendered strip and not of any one line of code.

const { Session } = require('../lib/session');

exports.title = '15. The icon-only toolbar';

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		await a.dismissGallery();

		const btns = await a.page.evaluate(() => [...document.querySelectorAll('#lpn_toolbar button')].map((b) => ({
			label: b.getAttribute('aria-label') || '',
			// Bootstrap MOVES the title to data-bs-original-title the moment initTips() wires a
			// tooltip on the element, so the tip has two possible homes and only one of them is
			// ever occupied. Reading both is reading what the user actually gets.
			title: b.getAttribute('title') || b.getAttribute('data-bs-original-title') || '',
			cls: b.className || '',
			// Only the direct text nodes: the <svg> is a child element and does not count.
			text: [...b.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim(),
			icons: b.querySelectorAll('svg').length
		})));

		report.ok(btns.length >= 15, 'the toolbar has its buttons', String(btns.length));
		const noName = btns.filter(b => !b.label);
		report.eq(noName.length, 0, 'every button carries an accessible name',
			JSON.stringify(noName));
		const noTitle = btns.filter(b => !b.title);
		report.eq(noTitle.length, 0, 'every button carries a tip', JSON.stringify(noTitle.map(b => b.label)));
		const worded = btns.filter(b => b.text);
		report.eq(worded.length, 0, 'and none of them carries a word on the strip',
			JSON.stringify(worded.map(b => b.text)));
		const noIcon = btns.filter(b => !b.icons);
		report.eq(noIcon.length, 0, 'each is drawn as an icon', JSON.stringify(noIcon.map(b => b.label)));
		// .ec-help is the ONLY selector initTips() wires. A title without it is a tip that a touch
		// user can never reach — invisible while a word was on the button, fatal now.
		const unwired = btns.filter(b => b.cls.indexOf('ec-help') < 0);
		report.eq(unwired.length, 0, 'every tip is wired for touch (.ec-help)',
			JSON.stringify(unwired.map(b => b.label)));
		// The name is the HEAD of the tip, not the whole of it, and never the other way round.
		const badJoin = btns.filter(b => b.title.indexOf(b.label) !== 0);
		report.eq(badJoin.length, 0, 'the tip begins with the name',
			JSON.stringify(badJoin.map(b => [b.label, b.title])));
		// The strip is not one wide row of identical mystery: at least the seven drawing tools plus
		// save/undo/zoom carry a real explanation after the name.
		const explained = btns.filter(b => b.title.length > b.label.length + 3);
		report.ok(explained.length >= 12, 'most of them explain themselves as well as naming themselves',
			`${explained.length} of ${btns.length}`);

		// ---- what is on the strip, by name (2026-08-18) ----
		const names = btns.map(b => b.label);
		// **THE LABELS BUTTON IS GONE.** Tom: "We can remove this button now. Everything is simpler
		// than EPANET or epanetjs because all project settings are in (tada!) Settings." Its other
		// doors are covered in specs/visibility.js and specs/labelcols.js.
		report.ok(names.indexOf('Labels') < 0, 'no Labels button — the box it opened has its own',
			names.join(' | '));
		// Two doors, one implementation: this and View > Profile, which Tom kept.
		report.ok(names.indexOf('Profile') >= 0, 'the profile has a door on the strip');

		// **THE TIME TRANSPORT IS ON THE STRIP AT ALL TIMES.** This page has just been opened on an
		// empty project with no duration, which is the state most visitors are in and exactly the
		// case Tom ruled on: "We can show the time play controls at all times even if there is only
		// one time step." So the controls are here, and the step selector holds that one step rather
		// than the transport hiding itself.
		report.ok(['Step back', 'Play', 'Step forward'].every(n => names.indexOf(n) >= 0),
			'play and the two step buttons are on the strip, with no run loaded', names.join(' | '));
		const pickers = await a.page.evaluate(() => [...document.querySelectorAll('#lpn_toolbar select')]
			.map(s => ({ id: s.id, name: s.getAttribute('aria-label') || '', opts: s.options.length, cap: s.style.maxWidth })));
		report.eq(pickers.length, 2, 'and exactly two dropdowns: the step selector and the speed',
			JSON.stringify(pickers));
		report.ok(pickers.every(p => p.name && p.cap),
			'each dropdown is named and width-capped — a wide control is what got the last one removed',
			JSON.stringify(pickers));
		const step = pickers.find(p => p.id === 'lpn_time_step');
		report.ok(!!step && step.opts === 1,
			'a network with no duration shows its single step rather than an empty or hidden transport',
			JSON.stringify(step));

		// THE DISCOVERY ROUTE THAT IS NOT A TOOLTIP. A first-time mouse user who does not think to
		// hover, and a touch user who must press and hold, both need one list of what the icons
		// mean — and it has to be DERIVED from the strip or it rots.
		await a.page.evaluate(() => { document.getElementById('lpn_menu_help').click(); });
		await a.settle(200);
		const rows = await a.page.evaluate(() =>
			[...document.querySelectorAll('#lpn_menu_list button')].map(b => b.textContent.trim()));
		const guide = rows.find(r => /icon/i.test(r));
		report.ok(!!guide, 'Help offers a list of what the icons mean', rows.join(' | '));
		await a.page.evaluate(() => {
			const b = [...document.querySelectorAll('#lpn_menu_list button')].find(x => /icon/i.test(x.textContent));
			if (b) { b.click(); }
		});
		await a.settle(300);
		// **THE GUIDE IS A FLY-OUT, so it is in the SECOND menu popup** (Task 441). As a level-0
		// menu it re-opened on the Help button the parent menu was already anchored to, hit
		// openMenu()'s same-anchor toggle branch, and closed the menu instead — Tom's "it does
		// nothing". This spec read the parent list and therefore could not see the difference; it
		// reads the fly-out now, which is where the rows really are.
		const guideRows = await a.page.evaluate(() =>
			[...document.querySelectorAll('#lpn_menu_list2 button')].map(b => b.textContent.trim()));
		report.eq(guideRows.length, btns.length, 'and it lists exactly the buttons on the strip',
			`${guideRows.length} rows vs ${btns.length} buttons`);
		report.has(guideRows.join(' | '), 'Zoom to fit', 'naming them the way the toolbar names them');

		report.ok(a.errors.length === 0, 'no uncaught JavaScript', a.errors.join(' | '));
	} finally {
		await a.close();
	}
};
