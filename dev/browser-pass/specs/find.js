// §10 — Find (ROADMAP Tasks 420 and 353), and the one thing no headless harness can check.
//
// WHY THIS IS A BROWSER SPEC AND NOT A HARNESS. `dev/lpn-spike/find-harness.js` proves the query is
// right: the scopes, the conditions, the units, the re-resolution of a stale result. Every one of
// those passed while the feature was, in Tom's words, *"in the menu, where I expected. But it
// doesn't bring up anything."*
//
// The panel was built, populated and `display: block` — at its STATIC position, 1,200 px down the
// document, because a `position: fixed` box whose `left`/`top` are never set does not stay where you
// think it does. There is no layout in the stub, so no harness in this repo could have seen it, and
// no assertion about the query could have been affected by it.
//
// **So what this spec checks is not the search. It is that the box is on the screen.** That is the
// class of defect a browser pass exists for.

const { Session } = require('../lib/session');


exports.title = '10. Find';

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();

		const rows = await a.menuRows('edit');
		// The row is called by the standard name (Task 389, Tom 2026-08-24) -- "Find and replace",
		// under Edit, because that is what every editor calls it and nobody should have to be told.
		report.ok(rows.some(r => r.label === 'Find and replace'), 'Edit carries a Find and replace row');

		// Something to find. makeEdit() places one junction at a spot it has measured to be clear.
		await a.makeEdit();

		await a.menuClick('Find and replace', 'edit');
		const box = await a.page.evaluate(() => {
			const p = document.getElementById('lpn_find_popup');
			if (!p) { return null; }
			const r = p.getBoundingClientRect();
			return { shown: p.style.display === 'block', x: r.x, y: r.y, w: r.width, h: r.height,
				vw: window.innerWidth, vh: window.innerHeight };
		});
		report.ok(box && box.shown, 'the panel opens');
		// **THE ASSERTION THAT WOULD HAVE CAUGHT IT.** Not "is it displayed" — it always was — but
		// "is it where a person can see it".
		report.ok(box && box.x >= 0 && box.y >= 0 && box.x + box.w <= box.vw && box.y + box.h <= box.vh,
			'...fully inside the window, not at some static position down the page',
			box && JSON.stringify(box));
		report.ok(box && box.w > 100 && box.h > 60, 'and it has real size', box && (box.w + 'x' + box.h));

		// **A DRAG THAT STARTS IN THE VALUE BOX AND ENDS OUTSIDE MUST NOT CLOSE THE PANEL.**
		// Tom, 2026-08-18: he drags right-to-left across the value to select it -- because starting
		// at the left edge needs a precise click -- and the button comes up past the box. The `click`
		// that follows is reported on the nearest COMMON ANCESTOR of down and up, which is <body>,
		// so every "is this inside the popover" test said no and the box vanished mid-edit.
		//
		// **THIS IS A BROWSER-ONLY FACT.** Nothing headless synthesises a click target from two
		// different pointer positions, so no harness in this repo could express the gesture at all.
		{
			// **THE SPEC PROVES THE GESTURE BEFORE IT JUDGES THE RESULT.** Two earlier versions of
			// this check passed with the fix REMOVED: one released off-screen and one ran later in
			// the sequence, and in both the browser fired no click at all -- so "the panel is still
			// open" was true for a reason that had nothing to do with the code. The click target is
			// therefore recorded and asserted to be outside the panel, and this block runs FIRST,
			// before any other interaction with the page. If the gesture ever stops posing the
			// question, this fails rather than flattering the code.
			const box = await a.page.evaluate(() => {
				window.__clicks = [];
				document.addEventListener('click', function (e) {
					var p = document.getElementById('lpn_find_popup');
					window.__clicks.push({ tag: e.target.tagName, inPanel: !!(p && p.contains(e.target)) });
				}, true);
				const i = document.querySelector('#lpn_find_popup input[type=text]');
				const r = i.getBoundingClientRect();
				return { x: r.x, y: r.y, w: r.width, h: r.height };
			});
			// Start inside, near the right edge, and release OUTSIDE the panel to the left -- Tom's
			// own direction, and the reason the panel sits close to the window edge matters: the
			// release point has to be a real on-screen point outside the box, or the browser fires
			// no click at all and the spec passes without ever posing the question.
			const panel = await a.page.evaluate(() => {
				const r = document.getElementById('lpn_find_popup').getBoundingClientRect();
				return { x: r.x, y: r.y, w: r.width, h: r.height };
			});
			// Released well clear of the panel, over open canvas. The DIRECTION is not what the
			// defect turns on -- the click is reported on the common ancestor either way -- and a
			// release point that is merely a few pixels outside can land on nothing at all, which
			// is how the first version of this check ended up vacuous.
			const releaseAt = panel.x + panel.w + 200;
			await a.page.mouse.move(box.x + box.w - 6, box.y + box.h / 2);
			await a.page.mouse.down();
			await a.page.mouse.move(releaseAt, box.y + box.h / 2, { steps: 8 });
			await a.page.mouse.up();
			await a.settle(120);
			const after = await a.page.evaluate(() => ({
				clicks: window.__clicks,
				open: document.getElementById('lpn_find_popup').style.display === 'block'
			}));
			report.ok(after.clicks.length > 0 && after.clicks.every(c => !c.inPanel),
				'the gesture really does report its click OUTSIDE the panel -- the question is posed',
				JSON.stringify(after.clicks));
			report.ok(after.open, 'selecting text by dragging out of the box leaves the box open');
		}

		// The three pull-downs and the value box are the whole control surface.
		const controls = await a.page.evaluate(() => {
			const p = document.getElementById('lpn_find_popup');
			return {
				selects: p.querySelectorAll('select').length,
				texts: p.querySelectorAll('input[type=text]').length,
				buttons: p.querySelectorAll('#lpn_find_form button').length
			};
		});
		report.eq(controls.selects, 3, 'three pull-downs: what to search, which property, which condition');
		// Two text boxes since Task 540 phase 2: the Value box, and the query input under it. Every
		// `querySelector('input[type=text]')` below therefore means the VALUE box, which comes first
		// in the panel exactly as it does on screen.
		report.eq(controls.texts, 2, 'the value box, and the query input');
		report.ok(controls.buttons >= 1, 'and a Find button');

		// A search that hits: the junction's own ID. One hit goes straight there, so the assertion is
		// that the element ends up SELECTED — the mark a user reads.
		const found = await a.page.evaluate(() => {
			const p = document.getElementById('lpn_find_popup');
			const input = p.querySelector('input[type=text]');
			const id = document.querySelector('#lpn_canvas [data-node]').dataset.node;
			input.value = id;
			input.dispatchEvent(new Event('input', { bubbles: true }));
			p.querySelector('#lpn_find_form button').click();
			return { id: id, selected: !!document.querySelector('#lpn_canvas .lpn-selected'),
				results: p.querySelector('#lpn_find_results').textContent };
		});
		report.ok(found.selected, 'finding an ID selects that element on the map', found.id);
		report.ok(/1/.test(found.results), '...and the panel says how many matched', found.results.trim());

		// A search that misses says so rather than saying nothing.
		const missed = await a.page.evaluate(() => {
			const p = document.getElementById('lpn_find_popup');
			const input = p.querySelector('input[type=text]');
			input.value = 'NOSUCHTHING';
			input.dispatchEvent(new Event('input', { bubbles: true }));
			p.querySelector('#lpn_find_form button').click();
			return p.querySelector('#lpn_find_results').textContent.trim();
		});
		// **A SEARCH THAT MATCHES NOTHING SAYS SO** (Task 540). It used to leave a blank box, which
		// reads as the button having done nothing -- harmless for a lookup and actively misleading
		// for the disconnected report, where "none" is the good news the user pressed Find for.
		report.eq(missed, 'Nothing matched.', 'a search that matches nothing says so');

		// **THE QUERY, WRITTEN OUT ABOVE THE BUTTON** (Task 540 phase 1, Tom 2026-08-26). Read in a
		// browser for the one thing no harness can see: that the line is actually visible, above the
		// Find button, and not clipped out of a 22rem popover.
		{
			const q = await a.page.evaluate(() => {
				const p = document.getElementById('lpn_find_popup');
				const line = p.querySelector('.lpn-find-query');
				if (!line) { return null; }
				const btn = p.querySelector('#lpn_find_form button');
				const lr = line.getBoundingClientRect(), br = btn.getBoundingClientRect();
				const pr = p.getBoundingClientRect();
				return { text: String(line.value).trim(), aboveButton: lr.bottom <= br.top + 2,
					inside: lr.left >= pr.left - 1 && lr.right <= pr.right + 1,
					visible: lr.width > 0 && lr.height > 0,
					tag: line.tagName, type: line.type,
					hint: (p.querySelector('.lpn-find-hint') || {}).textContent };
			});
			report.ok(q && q.visible && q.inside, 'the query line is drawn inside the panel',
				q && JSON.stringify(q));
			report.ok(q && q.aboveButton, '...right above the Find button, where Tom asked for it');
			report.ok(q && /NOSUCHTHING/.test(q.text), '...and it says what the controls just expressed',
				q && q.text);
			// **PHASE 2: IT IS AN INPUT** (Tom, 2026-08-26: *"The query string should be an input so
			// that eventually the user can try changing it and experimenting with AND, OR, and
			// parentheses."*). The grammar is proved in dev/lpn-spike/find-harness.js; what a browser
			// is needed for is that the thing on screen really does take a caret, and that the tip
			// under it is drawn.
			report.ok(q && q.tag === 'INPUT' && q.type === 'text', 'and it is an input, not a printed line',
				q && (q.tag + '/' + q.type));
			report.eq(q && q.hint, 'Expandable with AND, OR, and ()', 'Tom\'s tip is under it');
		}

		// **A COMPOUND QUERY, TYPED, IN A REAL BROWSER.** The set arithmetic is asserted against
		// hand-computed answers in the harness; here the question is whether typing one into the real
		// input runs it, and whether the pull-downs really do leave -- a control that stayed behind
		// would be describing a search that is not the one that ran.
		{
			const compound = await a.page.evaluate(() => {
				const p = document.getElementById('lpn_find_popup');
				const q = p.querySelector('.lpn-find-query');
				q.value = "Everything.ID contains 'J' OR Everything.ID contains 'L'";
				q.dispatchEvent(new Event('input', { bubbles: true }));
				const selects = p.querySelectorAll('#lpn_find_form select').length;
				const aside = p.querySelector('.lpn-find-aside');
				// **BY ID, NOT "the first button in the form".** With the controls set aside, the
				// first button is the one that brings them BACK -- pressing that would restore the
				// panel and never run the search, which is exactly how this check first failed.
				p.querySelector('#lpn_find_go').click();
				return { selects: selects, results: p.querySelector('#lpn_find_results').textContent,
					aside: aside ? aside.textContent : null };
			});
			report.eq(compound.selects, 0, 'a query the controls cannot write takes the pull-downs off');
			report.ok(compound.aside && /set aside/.test(compound.aside),
				'...and says why, where they were', compound.aside);
			report.ok(/found/.test(compound.results), '...and the OR really runs',
				compound.results.trim().slice(0, 60));

			// A query that cannot be read must report and search NOTHING -- never fall back to
			// "everything", which is a wrong answer wearing a confident face.
			const bad = await a.page.evaluate(() => {
				const p = document.getElementById('lpn_find_popup');
				const q = p.querySelector('.lpn-find-query');
				q.value = 'Everything.Nonsense contains 1';
				q.dispatchEvent(new Event('input', { bubbles: true }));
				const msg = p.querySelector('.lpn-find-msg').textContent;
				p.querySelector('#lpn_find_go').click();
				return { msg: msg, rows: p.querySelectorAll('#lpn_find_results button').length,
					results: p.querySelector('#lpn_find_results').textContent };
			});
			report.ok(/Nonsense/.test(bad.msg), 'an unreadable query says what it could not read', bad.msg);
			report.eq(bad.rows, 0, '...and searches nothing at all');

			// Back to a query the controls can write, so the rest of this spec runs on the panel it
			// expects.
			await a.page.evaluate(() => {
				const p = document.getElementById('lpn_find_popup');
				const q = p.querySelector('.lpn-find-query');
				q.value = "Everything.ID contains 'NOSUCHTHING'";
				q.dispatchEvent(new Event('input', { bubbles: true }));
			});
		}

		// **TOP n AND BOTTOM n ARE CONDITIONS, AND THE VALUE BOX HOLDS n** (Tom, 2026-08-18). Checked
		// in a browser because what is being verified is the control surface a person operates:
		// three pull-downs and ONE box, with the extremes reachable from the condition list rather
		// than from a second number field.
		//
		// The network comes from the dev-only "Draw large test network" row, which is the only way
		// to get a hundred pipes onto this page without a hundred clicks.
		await a.menuClick('[dev] Draw large test network', 'insert');
		await a.settle(500);
		await a.menuClick('Find and replace', 'edit');
		{
			const listed = await a.page.evaluate(() => {
				const p = document.getElementById('lpn_find_popup');
				function pick(i, v) {
					const sel = p.querySelectorAll('select')[i];
					sel.value = v;
					sel.dispatchEvent(new Event('change', { bubbles: true }));
				}
				pick(0, 'pipe');
				pick(1, 'length');
				pick(2, 'top');
				const input = p.querySelector('input[type=text]');
				input.value = '3';
				input.dispatchEvent(new Event('input', { bubbles: true }));
				p.querySelector('#lpn_find_form button').click();
				const res = p.querySelector('#lpn_find_results');
				return {
					text: res.textContent,
					rows: [...res.querySelectorAll('button')].map(b => b.textContent),
					numberBoxes: p.querySelectorAll('input[type=number]').length,
					ops: [...p.querySelectorAll('select')[2].options].map(o => o.value),
					props: [...p.querySelectorAll('select')[1].options].map(o => o.value)
				};
			});
			report.eq(listed.numberBoxes, 0, 'there is no second input -- the Value box holds n');
			report.ok(listed.ops.indexOf('top') >= 0 && listed.ops.indexOf('bottom') >= 0,
				'Top n and Bottom n are in the condition list', listed.ops.join(','));
			report.eq(listed.rows.length, 3, 'Top 3 lists exactly three');
			// **THE ORDERING IS NOT ASSERTED HERE, and that is deliberate.** Every pipe in the dev
			// grid is the same length, so "biggest first" would be vacuously true of any order --
			// the ordering is pinned against a controlled fixture in dev/lpn-spike/find-harness.js
			// instead. What a browser is needed for is that each row PRINTS the value it was
			// ranked by, which is what makes a top-n list readable at all.
			const nums = listed.rows.map(t => parseFloat(t.split(/\s+/)[1]));
			report.ok(nums.every(v => isFinite(v)),
				'...each row shows the value it was ranked by', listed.rows.join(' | ').slice(0, 90));
			report.ok(listed.props.indexOf('gradient') >= 0,
				'head loss gradient is offered as a searchable property', listed.props.join(','));
		}

		// **A STANDING BOX, NOT A PULL-DOWN** (Tom, 2026-08-18: *"Find is a standing box until
		// closed."*). A results list is read WHILE the map is worked, so clicking a pipe to look at
		// one must not throw the list away. Everything below is the difference between this box and
		// the Labels/Settings pull-downs beside it.
		const isOpen = () => a.page.evaluate(() =>
			document.getElementById('lpn_find_popup').style.display === 'block');

		await a.page.mouse.click(600, 500);          // a click out on the map
		await a.settle(150);
		report.ok(await isOpen(), 'clicking the map leaves it open');

		await a.page.keyboard.press('Escape');
		await a.settle(150);
		report.ok(await isOpen(), '...and so does Escape, which dismisses every pull-down but not this');

		// Project > Settings opens the Settings box (Task 441, moved under Project by Task 467),
		// which is a big two-pane box in the middle of the window -- so it is CLOSED again straight
		// away. Leaving it up would put it over Find, and every gesture below would be aimed at
		// whichever box happened to be on top, which measures the stacking order rather than the
		// thing under test. (The old door was View > Labels; that row is gone.)
		await a.menuClick('Settings', 'project');
		await a.settle(150);
		report.ok(await isOpen(), '...and so does opening another panel');
		await a.page.evaluate(() => { document.getElementById('lpn_setbox_close').click(); });
		await a.settle(150);

		// It DRAGS by its own chrome, the padded band above the body -- the property popup's gesture.
		const wasAt = await a.page.evaluate(() => {
			const r = document.getElementById('lpn_find_popup').getBoundingClientRect();
			return { x: r.x, y: r.y };
		});
		await a.page.mouse.move(wasAt.x + 60, wasAt.y + 8);
		await a.page.mouse.down();
		await a.page.mouse.move(wasAt.x + 200, wasAt.y + 108, { steps: 10 });
		await a.page.mouse.up();
		await a.settle(150);
		const nowAt = await a.page.evaluate(() => {
			const r = document.getElementById('lpn_find_popup').getBoundingClientRect();
			return { x: r.x, y: r.y };
		});
		report.ok(Math.abs(nowAt.x - wasAt.x - 140) < 8 && Math.abs(nowAt.y - wasAt.y - 100) < 8,
			'it drags by its own chrome', JSON.stringify(wasAt) + ' -> ' + JSON.stringify(nowAt));

		// Only the X closes it.
		await a.page.click('#lpn_find_close');
		await a.settle(150);
		report.ok(!(await isOpen()), 'the X closes it, and nothing else does');

		// And it comes back where it was left, not back at the menu's corner.
		await a.menuClick('Find and replace', 'edit');
		await a.settle(200);
		const backAt = await a.page.evaluate(() => {
			const r = document.getElementById('lpn_find_popup').getBoundingClientRect();
			return { x: r.x, y: r.y };
		});
		report.ok(Math.abs(backAt.x - nowAt.x) < 8 && Math.abs(backAt.y - nowAt.y) < 8,
			'...and re-opens where the user left it', JSON.stringify(backAt));

		report.eq(a.errors.length, 0, 'no uncaught JavaScript');
	} finally {
		await a.close();
	}
};
