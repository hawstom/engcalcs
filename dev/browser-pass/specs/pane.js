// §17 — the bottom pane's ASSET TABLES (ROADMAP Task 455).
//
// WHAT IS HERE AND WHY IT IS NOT IN THE HARNESS. `dev/lpn-spike/pane-harness.js` owns everything
// with an exact answer against a stub: which tabs exist, which type each table lists, which cells
// are editable, that six sorts are six. Three things are left, and all three are facts about a real
// page rather than about the code:
//
//   1. **A TAB REALLY SHOWS ITS OWN PANEL.** Seven tabs, seven panel divs and one `.on` class: the
//      way that breaks is a mismatched id, which a stub with a hand-written element list cannot
//      see. Here the panels come from the real PHP.
//   2. **THE STRIP WRAPS WITHOUT COSTING ANYTHING.** Tom, 2026-08-19, choosing between wrapping and
//      hiding five tabs behind a type selector: *"Seven tabs and let them wrap: Yes."* Wrapping is
//      layout, so only a real layout can say whether the second line pushes the panel out of the
//      window, steals the pane's whole height, or gives the page a horizontal scrollbar it is not
//      allowed to have (Task 432). Measured, in pixels, at a narrow width.
//   3. **A RESULT CELL IS NOT A TEXT BOX**, in the DOM the user's pointer actually meets.
//
// The network is Elm Street Center, chosen because it is the only example carrying five of the six
// types at once (17 junctions, 1 reservoir, 16 pipes, 1 pump, 2 valves) — and NO tank, so the empty
// message gets exercised in the same pass rather than needing a second network.

const { Session } = require('../lib/session');

exports.title = '17. Bottom pane: the asset tables';

const TABS = ['profile', 'junctions', 'reservoirs', 'tanks', 'pipes', 'pumps', 'valves'];
// What Elm Street Center holds. Read off the example file, not off the page, so a table that
// listed every element would fail rather than agree with itself.
const ROWS = { junctions: 17, reservoirs: 1, tanks: 0, pipes: 16, pumps: 1, valves: 2 };

// The strip as the user sees it: the tab buttons in order, and which panel is showing.
async function strip(page) {
	return page.evaluate(() => {
		const tabs = [...document.querySelectorAll('#lpn_pane_tabs button.lpn-pane-tab')];
		const panels = [...document.querySelectorAll('#lpn_pane_body .lpn-pane-panel')];
		return {
			ids: tabs.map(t => t.id.replace('lpn_pane_tab_', '')),
			labels: tabs.map(t => t.textContent.trim()),
			// The tip may have been adopted by a bootstrap tooltip, which moves it off `title`.
			tips: tabs.map(t => t.title || t.getAttribute('data-bs-original-title') || ''),
			selected: tabs.filter(t => t.getAttribute('aria-selected') === 'true').map(t => t.id.replace('lpn_pane_tab_', '')),
			showing: panels.filter(p => p.classList.contains('on')).map(p => p.id.replace('lpn_pane_', '')),
			panels: panels.map(p => p.id.replace('lpn_pane_', ''))
		};
	});
}
// One table, read the way a reader reads it.
async function table(page, id) {
	return page.evaluate((pid) => {
		const host = document.getElementById('lpn_pane_' + pid);
		if (!host) { return null; }
		const t = host.querySelector('table');
		if (!t) { return { rows: 0, note: (host.textContent || '').trim(), headings: [], ids: [] }; }
		const headings = [...t.querySelectorAll('thead th')].map(th => th.textContent.replace(/[▲▼]/g, '').trim());
		const body = [...t.querySelectorAll('tbody tr')];
		return {
			rows: body.length,
			note: '',
			headings: headings,
			// The first column is the goto button; its text is the element's id.
			ids: body.map(r => (r.querySelector('td .lpn-pane-goto') || {}).textContent || ''),
			// Per column: how many cells in that column hold an <input>. A result column must be 0.
			inputsByCol: headings.map((h, i) => body.filter(r => r.children[i] && r.children[i].querySelector('input')).length),
			scrollable: host.scrollHeight > host.clientHeight + 1,
			overflowY: getComputedStyle(host).overflowY
		};
	}, id);
}

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();

		const opened = await a.page.evaluate(() => {
			const cards = [...document.querySelectorAll('#lpn_examples_pane .lpn-example-card')];
			const card = cards.find(c => /Elm Street/i.test(c.textContent));
			if (!card) { return false; }
			card.click();
			return true;
		});
		report.ok(opened, 'the examples gallery offers Elm Street Center');
		await a.settle(1200);

		await a.toolbarClick('Bottom panel');
		await a.settle(400);

		// ---- 1. SEVEN TABS, in the toolbar's own Add order -------------------------------------
		const s0 = await strip(a.page);
		report.eq(s0.ids.join(','), TABS.join(','), 'seven tabs, Profile first and then the six assets in Add order');
		report.eq(s0.labels.join(' | '),
			'Profile | Junctions | Reservoirs | Tanks | Pipes | Pumps | Valves',
			'...and each is named by its own plural');
		report.ok(s0.panels.join(',') === TABS.join(','),
			'there is exactly one panel per tab, in the same order', s0.panels.join(','));
		// One tip serves all six tables — the translation budget was the design decision (Task 455).
		const tableTips = new Set(s0.tips.slice(1));
		report.ok(tableTips.size === 1, 'one tip is shared by all six table tabs', [...tableTips].join(' / '));
		report.ok([...tableTips][0] && [...tableTips][0].length > 10, '...and it is a real sentence', [...tableTips][0]);

		// ---- 2. EVERY TAB OPENS ITS OWN PANEL, AND ONLY ITS OWN --------------------------------
		for (const id of TABS) {
			await a.page.click('#lpn_pane_tab_' + id);
			await a.settle(250);
			const s = await strip(a.page);
			report.ok(s.showing.length === 1 && s.showing[0] === id && s.selected.join(',') === id,
				`the ${id} tab shows the ${id} panel, and nothing else`,
				`selected ${s.selected.join(',')} / showing ${s.showing.join(',')}`);
		}

		// ---- 3. EACH TABLE LISTS EXACTLY ITS OWN TYPE ------------------------------------------
		const seen = {};
		for (const id of Object.keys(ROWS)) {
			await a.page.click('#lpn_pane_tab_' + id);
			await a.settle(250);
			const t = await table(a.page, id);
			report.eq(t.rows, ROWS[id], `${id}: ${ROWS[id]} row(s), which is what Elm Street Center holds`);
			t.ids.forEach(x => { seen[x] = (seen[x] || []).concat(id); });
		}
		const shared = Object.keys(seen).filter(k => seen[k].length > 1);
		report.ok(shared.length === 0, 'no element is listed by two tables',
			shared.slice(0, 5).map(k => k + ' in ' + seen[k].join('+')).join(', '));
		// The empty tab says so rather than showing a bare panel.
		await a.page.click('#lpn_pane_tab_tanks');
		await a.settle(250);
		const tanks = await table(a.page, 'tanks');
		report.ok(tanks.rows === 0 && tanks.note.length > 5,
			'a type this network has none of says so, in one message that serves all six', tanks.note);

		// ---- 4. A RESULT CELL IS NOT A TEXT BOX ------------------------------------------------
		await a.page.click('#lpn_pane_tab_pipes');
		await a.settle(300);
		const pipes = await table(a.page, 'pipes');
		report.has(pipes.headings.join(' | '), 'Flow', 'the pipe table reports flow');
		report.has(pipes.headings.join(' | '), 'Velocity', '...and velocity');
		report.has(pipes.headings.join(' | '), 'Head loss', '...and head loss');
		const inputsIn = (name) => pipes.inputsByCol[pipes.headings.findIndex(h => h.indexOf(name) === 0)];
		['Flow', 'Velocity', 'Head loss'].forEach((h) => {
			report.eq(inputsIn(h), 0, `no cell in the ${h} column is typeable — a computed number is not the user's`);
		});
		['Diameter', 'Length'].forEach((h) => {
			report.eq(inputsIn(h), ROWS.pipes, `...while every cell in the ${h} column is`);
		});
		// The endpoints are the drawing's, not a form's.
		report.eq(inputsIn('From'), 0, 'and From is read-only — re-drawing the pipe is how it changes');

		// ---- 5. SORTING ONE TAB LEAVES ANOTHER'S ORDER ALONE -----------------------------------
		const junctionOrder = async () => {
			await a.page.click('#lpn_pane_tab_junctions');
			await a.settle(250);
			return (await table(a.page, 'junctions')).ids.join(',');
		};
		const jBefore = await junctionOrder();
		await a.page.click('#lpn_pane_tab_pipes');
		await a.settle(250);
		const pBefore = (await table(a.page, 'pipes')).ids.join(',');
		// Click the Velocity heading on Pipes, which is the case the task names by hand.
		const sorted = await a.page.evaluate(() => {
			const btns = [...document.querySelectorAll('#lpn_pane_pipes thead .lpn-pane-sort')];
			const b = btns.find(x => /Velocity/.test(x.textContent));
			if (!b) { return false; }
			b.click();
			return true;
		});
		report.ok(sorted, 'the Velocity heading on Pipes is clickable');
		await a.settle(400);
		const pAfter = (await table(a.page, 'pipes')).ids.join(',');
		report.ok(pAfter !== pBefore, 'sorting Pipes by velocity re-orders the pipes',
			pBefore.slice(0, 40) + '  →  ' + pAfter.slice(0, 40));
		const jAfter = await junctionOrder();
		report.eq(jAfter, jBefore, '...and leaves the Junctions order exactly where it was');

		// ---- 6. THE STRIP WRAPS, AND NOTHING ELSE GIVES ----------------------------------------
		// A narrow window is the whole point of the question Tom answered. Measured: the strip
		// really does take a second line, the panel keeps its own scroll, the page does not scroll
		// in either direction, and the map still has a canvas worth looking at.
		await a.page.click('#lpn_pane_tab_junctions');
		await a.settle(250);
		const wide = await a.page.evaluate(() => {
			const strip = document.getElementById('lpn_pane_tabs');
			return strip.getBoundingClientRect().height;
		});
		await a.page.setViewportSize({ width: 520, height: 900 });
		await a.settle(700);
		const narrow = await a.page.evaluate(() => {
			const stripEl = document.getElementById('lpn_pane_tabs'),
				pane = document.getElementById('lpn_pane'),
				body = document.getElementById('lpn_pane_body'),
				panel = document.getElementById('lpn_pane_junctions'),
				canvas = document.getElementById('lpn_canvas'),
				docEl = document.documentElement;
			const tabs = [...stripEl.querySelectorAll('button.lpn-pane-tab')];
			// How many distinct rows the tabs landed on, by their top edge. This is what "wrapped"
			// means, and it is a number rather than a picture.
			const tops = new Set(tabs.map(t => Math.round(t.getBoundingClientRect().top)));
			return {
				stripH: stripEl.getBoundingClientRect().height,
				lines: tops.size,
				paneH: pane.getBoundingClientRect().height,
				bodyH: body.getBoundingClientRect().height,
				panelH: panel.getBoundingClientRect().height,
				panelScroll: panel.scrollHeight,
				canvasH: canvas.getBoundingClientRect().height,
				paneTop: pane.getBoundingClientRect().top,
				paneBottom: pane.getBoundingClientRect().bottom,
				canvasBottom: canvas.getBoundingClientRect().bottom,
				bodyBottom: document.body.getBoundingClientRect().bottom,
				scrollW: docEl.scrollWidth,
				vw: window.innerWidth, vh: window.innerHeight
			};
		});
		report.ok(narrow.lines >= 2, 'at 520px the seven tabs wrap onto more than one line',
			narrow.lines + ' line(s), strip ' + Math.round(wide) + ' → ' + Math.round(narrow.stripH) + 'px');
		report.ok(narrow.stripH > wide + 8, '...and the strip really is taller for it',
			Math.round(wide) + ' → ' + Math.round(narrow.stripH));
		report.ok(narrow.canvasBottom <= narrow.paneTop + 1,
			'the strip does not overlap the map — the pane still begins where the canvas ends',
			Math.round(narrow.canvasBottom) + ' / ' + Math.round(narrow.paneTop));
		report.ok(narrow.panelH > 60, 'the panel below the strip keeps a usable height',
			Math.round(narrow.panelH) + 'px of a ' + Math.round(narrow.paneH) + 'px pane');
		report.ok(narrow.bodyH >= narrow.paneH - narrow.stripH - 20,
			'...and the strip has not eaten the pane\'s body',
			'body ' + Math.round(narrow.bodyH) + ' of pane ' + Math.round(narrow.paneH));
		report.ok(narrow.panelScroll > narrow.panelH,
			'the 17-row table still scrolls INSIDE its panel',
			Math.round(narrow.panelScroll) + ' of ' + Math.round(narrow.panelH));
		report.ok(narrow.paneBottom <= narrow.vh + 1 && narrow.bodyBottom <= narrow.vh + 1,
			'the page still ends inside the window', Math.round(narrow.bodyBottom) + ' of ' + narrow.vh);
		report.ok(narrow.scrollW <= narrow.vw + 1, 'and the page has gained no HORIZONTAL scrollbar',
			narrow.scrollW + ' of ' + narrow.vw);
		// 520 px leaves only 342 px under this page's own chrome (the menu bar and the toolbar wrap
		// too), so the map is genuinely squeezed here -- what matters is that it never goes under its
		// declared floor and never disappears.
		report.ok(narrow.canvasH >= 80, 'the map is still drawn, at or above its floor', Math.round(narrow.canvasH));

		// **AND THE HEIGHT COMES BACK.** The clamp is a fact about the WINDOW and the stored height
		// is the user's, so widening again must return the pane to the size it was dragged to, not
		// leave it at whatever a narrow window could afford.
		await a.page.setViewportSize(Session.VIEWPORT);
		await a.settle(700);
		const back = await a.page.evaluate(() => ({
			body: document.getElementById('lpn_pane_body').getBoundingClientRect().height,
			strip: document.getElementById('lpn_pane_tabs').getBoundingClientRect().height,
			bodyBottom: document.body.getBoundingClientRect().bottom, vh: window.innerHeight
		}));
		report.ok(Math.abs(back.body - narrow.bodyH) < 1 || back.body > narrow.bodyH,
			'widening the window gives the pane its height back', Math.round(narrow.bodyH) + ' → ' + Math.round(back.body));
		report.ok(Math.abs(back.strip - wide) < 2, '...and the strip is one line again',
			Math.round(narrow.stripH) + ' → ' + Math.round(back.strip));
		report.ok(back.bodyBottom <= back.vh + 1, '...with the page still ending inside the window',
			Math.round(back.bodyBottom) + ' of ' + back.vh);

		report.ok(a.errors.length === 0, 'no uncaught page errors', a.errors.slice(0, 1).join(''));
	} finally {
		await a.context.close();
	}
};
