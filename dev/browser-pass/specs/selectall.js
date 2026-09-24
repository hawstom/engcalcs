// §-- select-all-on-focus (R-207, review queue; specified by the interface designer, 2026-09-24
// journal entry): a click or Tab into a short, single-value field selects its whole contents, so
// typing overwrites it -- the browser address bar's own convention. Tom's friend's report: *"was
// startled that when he clicked on a text input, he got a cursor instead of the entire contents
// highlighted."*
//
// WHY THIS IS A BROWSER SPEC. The mechanism (js/Calculators.lib.js, EngCalcs.wireSelectAllOnFocus)
// is a delegated mousedown/mouseup/pointerdown/pointerup/focus listener, so what has to be proved
// is a real pointer gesture's effect on real DOM selection -- invisible to a stub or a jsdom
// harness. It also has to be shown on the shared script's OTHER audience: an ordinary calculator
// page, not just the looped-network map, since js/Calculators.lib.js loads on every one of them
// (lib/HeadersFooters.lib.php).
//
// **WHY TYPING, NOT selectionStart/selectionEnd.** Chromium answers `null` for both on
// `input[type=number]` and `[type=search]` -- "does not support selection" is correct per spec, but
// it means the read-the-DOM-property check this spec started with is silently blind on exactly the
// input type most calculator fields use. Typing a digit and reading the resulting VALUE is the
// user-observable fact Tom's friend actually reported ("overwriting"), and it works identically on
// every input type this feature touches.
//
// **THE SPEC RECORDS A DELIBERATE DEVIATION FROM THE WRITTEN BRIEF.** Ida's brief called for
// `preventDefault()` on `mousedown` itself. Measured directly against a real `<input
// class="ec-spin" type="number">` (the only calculator number fields with a VISIBLE spin button --
// css/engcalcs.css hides it suite-wide otherwise): `preventDefault()` on `mousedown` also cancels
// the spinner's own increment, because Chromium resolves the step against that same event.
// Deferring the `preventDefault()`/`select()` pair to `mouseup` instead reproduces every externally
// observable behaviour Ida asked for (first arrival selects all; a second click on an
// already-focused field just moves the caret) without taking the spinner down with it -- proved
// below, on the one settings field that still carries a visible spinner.

const { Session } = require('../lib/session');
const { pageUrl } = require('../lib/env');

exports.title = 'select-all on focus (R-207)';

function rectOf(page, selector) {
	return page.evaluate((s) => {
		const e = document.querySelector(s);
		if (!e) { return null; }
		const r = e.getBoundingClientRect();
		return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height, left: r.x, top: r.y };
	}, selector);
}

/**
 * The real, observable proof (see file header): type a digit after a click and see whether it
 * REPLACED the field's contents (fully selected) or was INSERTED into them (a bare caret). `value`
 * is a multi-character digit string on purpose -- '12345' -- so a false match against a
 * single-character original is impossible, and it is valid content for every input type this
 * feature touches, including type="number" and type="search".
 */
async function typeAfterClick(page, selector, x, y, value) {
	await page.evaluate(([s, v]) => { document.querySelector(s).value = v; }, [selector, value]);
	await page.mouse.click(x, y);
	await page.keyboard.type('9');
	return page.evaluate((s) => document.querySelector(s).value, selector);
}

exports.run = async function ({ browser, report }) {
	// ---- 1. An ordinary calculator page's own number field --------------------------------------
	// Darcy-Weisbach's roughness field, id="e", type="number", built by inputHtml() in
	// lib/Calculators.lib.php -- proving the shared script reaches a page that is not lpn_ at all.
	{
		const a = await Session.open(browser, 'dw');
		try {
			await a.page.goto(pageUrl('Darcy-Weisbach.php?ec_nolog=1'), { waitUntil: 'load' });
			await a.settle();

			const r = await rectOf(a.page, '#e');
			report.ok(!!r, 'Darcy-Weisbach has a roughness field, id="e"');
			await a.page.evaluate(() => document.body.focus());   // start unfocused

			const first = await typeAfterClick(a.page, '#e', r.x, r.y, '12345');
			report.eq(first, '9', 'the FIRST click into a number field selects the whole value, so typing overwrites it');

			// Second click, field already focused from the line above -> caret only, address-bar
			// style: typing INSERTS rather than replaces.
			await a.page.evaluate(() => { document.getElementById('e').value = '12345'; });
			await a.page.mouse.click(r.x, r.y);
			await a.page.keyboard.type('9');
			const second = await a.page.evaluate(() => document.getElementById('e').value);
			report.ok(second !== '9' && second.length === 6,
				'...a SECOND click on the already-focused field just moves the caret (insert, not replace)',
				`12345 -> ${second}`);

			// Tab from a neighbouring field selects all too.
			await a.page.evaluate(() => { document.getElementById('v').value = '54321'; document.getElementById('e').blur(); });
			await a.page.focus('#v');
			await a.page.keyboard.press('Tab');   // lands on #km, the next field in the form
			await a.page.keyboard.type('9');
			const tabbed = await a.page.evaluate(() => document.getElementById('km').value);
			report.eq(tabbed, '9', 'Tab into the next field selects its whole value too');

			report.eq(a.errors.length, 0, 'no script error on the calculator page');
		} finally { await a.close(); }
	}

	// ---- 1b. Touch (pointerdown/pointerup for pointerType "touch") -------------------------------
	// A REAL touch-capable context, not a mouse click relabelled -- Ida's brief asked specifically
	// that mobile emulation not come out worse. The touch->focus sequence is asynchronous in
	// Chromium (touchstart, pointerdown, pointerup, THEN focus, touchend, the synthetic mousedown/
	// mouseup/click) -- a check that reads the result before that settles sees a false failure, so
	// this waits past it exactly the way the mouse path does not need to.
	{
		const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
		const page = await context.newPage();
		const errors = [];
		page.on('pageerror', (e) => errors.push(String(e.stack || e)));
		try {
			await page.goto(pageUrl('Darcy-Weisbach.php?ec_nolog=1'), { waitUntil: 'load' });
			await page.waitForTimeout(500);

			await page.evaluate(() => { document.getElementById('e').value = '12345'; });
			await page.tap('#e');
			await page.waitForTimeout(150);
			await page.keyboard.type('9');
			const t1 = await page.$eval('#e', (el) => el.value);
			report.eq(t1, '9', 'touch: the first tap selects the whole value, so typing overwrites it');

			await page.evaluate(() => { document.getElementById('e').value = '12345'; });
			await page.tap('#e');   // second tap, already focused
			await page.waitForTimeout(150);
			await page.keyboard.type('9');
			const t2 = await page.$eval('#e', (el) => el.value);
			report.ok(t2 !== '9' && t2.length === 6,
				'touch: a SECOND tap on the already-focused field just moves the caret', `12345 -> ${t2}`);

			report.eq(errors.length, 0, 'no script error under touch emulation');
		} finally { await context.close(); }
	}

	// ---- 2. Looped-network: Properties, Settings (incl. the spinner), Find, a Text label's
	// textarea, a pane cell --------------------------------------------------------------------
	{
		const a = await Session.open(browser, 'lpn');
		try {
			await a.goto();
			await a.makeEdit();   // one junction, placed and reselected to Select

			// ---- Properties: click the node to open its popup, then its ID field ----------------
			const nodeSpot = await a.page.evaluate(() => {
				const n = document.querySelector('#lpn_canvas .lpn-node');
				if (!n) { return null; }
				const r = n.getBoundingClientRect();
				return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
			});
			report.ok(!!nodeSpot, 'a junction is on the canvas to open Properties on');
			await a.page.mouse.click(nodeSpot.x, nodeSpot.y);
			await a.settle(300);
			const propSel = '#lpn_popup_fields input[type="text"], #lpn_popup_fields input[type="number"]';
			const propField = await rectOf(a.page, propSel);
			report.ok(!!propField, 'the Properties popup offers a text or number field');
			if (propField) {
				await a.page.evaluate(() => document.getElementById('lpn_popup_close').focus());
				const p1 = await typeAfterClick(a.page, propSel, propField.x, propField.y, '12345');
				report.eq(p1, '9', 'Properties: first click selects the whole value, so typing overwrites it');
				await a.page.evaluate((s) => { document.querySelector(s).value = '12345'; }, propSel);
				await a.page.mouse.click(propField.x, propField.y);
				await a.page.keyboard.type('9');
				const p2 = await a.page.evaluate((s) => document.querySelector(s).value, propSel);
				report.ok(p2 !== '9' && p2.length === 6, 'Properties: second click just moves the caret',
					`12345 -> ${p2}`);
			}

			// ---- Settings: the search/filter box, and the one field with a real spin button -------
			await a.page.mouse.click(600, 500);   // close the popup, click bare map
			await a.settle(200);
			await a.toolbarClick('Settings');
			await a.settle(300);
			const filterSel = '#lpn_setbox_filter';
			const filterRect = await rectOf(a.page, filterSel);
			report.ok(!!filterRect, 'Settings offers its search/filter box');
			if (filterRect) {
				await a.page.evaluate(() => document.getElementById('lpn_settings_box').focus());
				const f1 = await typeAfterClick(a.page, filterSel, filterRect.x, filterRect.y, 'abcde');
				report.eq(f1, '9', 'Settings: the search box selects all on first click too');
				// Clear it and tell the box so -- a leftover "9" filters most of the index out of
				// existence for every check that follows, per filterSetboxFields() in
				// js/looped-network.js.
				await a.page.evaluate(() => {
					var input = document.getElementById('lpn_setbox_filter');
					input.value = '';
					input.dispatchEvent(new Event('input', { bubbles: true }));
				});
				await a.settle(200);
			}

			// The Map appearance section's Text size / Symbol size fields are the suite's own
			// `.ec-spin` fields -- the one place a calculator-style number field keeps a VISIBLE
			// spin button (css/engcalcs.css hides it everywhere else). This is the field the
			// deviation in the file header is measured against.
			await a.page.evaluate(() => {
				const row = [...document.querySelectorAll('#lpn_setbox_index button')]
					.find((b) => b.getAttribute('data-sec') === 'lpn_set_sec_map');
				if (row) { row.click(); }
			});
			await a.settle(400);
			const spinSel = '#lpn_set_map_fields input.ec-spin';
			const spinRect = await rectOf(a.page, spinSel);
			report.ok(!!spinRect, 'the Map appearance section offers an .ec-spin field (Text size)');
			if (spinRect) {
				await a.page.evaluate(() => document.getElementById('lpn_settings_box').focus());
				const s1 = await typeAfterClick(a.page, spinSel, spinRect.x, spinRect.y, '12345');
				report.eq(s1, '9', 'Settings: the .ec-spin field selects all on first click too');

				// **THE SPINNER.** preventDefault() on the wrong event breaks this; see file header.
				await a.page.evaluate((s) => { document.querySelector(s).blur(); document.querySelector(s).value = '5'; }, spinSel);
				const sr = await rectOf(a.page, spinSel);
				// The spin buttons occupy the input's own right edge in Chromium; the up half is
				// the top quarter of the control's height.
				await a.page.mouse.click(sr.left + sr.w - 6, sr.top + sr.h * 0.25);
				await a.settle(100);
				const afterSpin = await a.page.$eval(spinSel, (el) => el.value);
				report.ok(afterSpin !== '5', 'the .ec-spin field\'s own spin button still changes its value',
					`5 -> ${afterSpin}`);
			}

			// ---- Find and replace ------------------------------------------------------------
			await a.page.keyboard.press('Escape');
			await a.settle(200);
			await a.menuClick('Find and replace', 'edit');
			await a.settle(300);
			const findSel = '#lpn_find_form input[type="text"], #lpn_find_form input[type="number"]';
			const findField = await rectOf(a.page, findSel);
			if (findField) {
				// **THE DIALOG AUTOFOCUSES ITS OWN QUERY FIELD ON OPEN** -- exactly the "programmatic
				// focus" case Ida's spec already covers with a plain .select(), which is why
				// document.activeElement is already this field before any click ever lands (measured
				// with `dev/browser-pass/_debugfind4.js`, not kept). A click on an ALREADY-focused
				// field is deliberately a no-op per the spec's own "second click" rule, so proving
				// the CLICK path here means blurring it first -- .focus() on the popup's own close
				// button, which does not close it.
				await a.page.evaluate(() => document.getElementById('lpn_find_close').focus());
				const g1 = await typeAfterClick(a.page, findSel, findField.x, findField.y, '12345');
				report.eq(g1, '9', 'Find and replace: its own field selects all on first click');
			} else {
				report.skip('Find and replace selects all', 'no text/number field showing before a scope is picked');
			}
			await a.page.keyboard.press('Escape');
			await a.settle(200);

			// ---- Excluded: a Text label's textarea ------------------------------------------------
			await a.toolbarClick('Text');
			await a.settle(150);
			const spot2 = await a.page.evaluate(() => {
				const canvas = document.getElementById('lpn_canvas'), r = canvas.getBoundingClientRect();
				return { x: r.x + r.width * 0.75, y: r.y + r.height * 0.75 };
			});
			await a.page.mouse.click(spot2.x, spot2.y);
			await a.settle(300);
			// add-text puts the tool down and switches to Select on its own; the new Text is not
			// open yet, so click it (its hit shape carries data-lbl) to open Properties on it.
			const lblSpot = await rectOf(a.page, '[data-lbl]');
			if (lblSpot) { await a.page.mouse.click(lblSpot.x, lblSpot.y); await a.settle(300); }
			const taSel = '#lpn_popup_fields textarea';
			const taRect = await rectOf(a.page, taSel);
			if (taRect) {
				await a.page.evaluate(() => document.getElementById('lpn_popup_close').focus());
				const t1 = await typeAfterClick(a.page, taSel, taRect.x, taRect.y, '12345');
				report.ok(t1 !== '9' && t1.length === 6,
					'EXCLUDED: a Text label\'s textarea is never select-all\'d (typing inserts, not replaces)',
					`12345 -> ${t1}`);
			} else {
				report.skip('a textarea is excluded', 'the Text tool did not open a textarea popup');
			}
			await a.page.keyboard.press('Escape');
			await a.settle(200);

			// ---- Excluded: a spreadsheet-mode cell in the Tables pane -----------------------------
			await a.toolbarClick('Select');
			await a.toolbarClick('Bottom panel');
			await a.settle(400);
			const cellSel = '#lpn_pane_junctions td input[type="text"], #lpn_pane_junctions td input[type="number"]';
			const cellRect = await rectOf(a.page, cellSel);
			if (cellRect) {
				// **A CELL IS readOnly UNTIL EDIT MODE IS ENTERED** (paneEnterEdit(), which needs a
				// double-click, F2 or a keystroke -- Tom, 2026-09-19: "arriving at a cell selects no
				// characters"). Typing after a single click is therefore the WRONG probe here: this
				// page's own paneEnterEdit(input, true) already wipes and replaces a cell's contents
				// on the first keystroke (a spreadsheet's own "just start typing to overwrite"
				// convention) -- a mechanism this feature must stay out of, not one it should be
				// mistaken for. The direct proof that OUR code never touched this cell is that a
				// single click leaves it exactly where paneFocusCell() would: readOnly, ENTRY mode
				// not yet begun.
				await a.page.evaluate(() => document.getElementById('lpn_pane_close').focus());
				await a.page.mouse.click(cellRect.x, cellRect.y);
				const stillReadOnly = await a.page.evaluate((s) => document.querySelector(s).readOnly, cellSel);
				report.ok(stillReadOnly,
					'EXCLUDED: a single click on a Tables-pane cell leaves it read-only (READY, not ENTRY) -- select-all never ran');
				const inCandidate = await a.page.evaluate((s) =>
					EngCalcs.selectAllCandidate(document.querySelector(s)), cellSel);
				report.ok(!inCandidate, '...and the guard itself says so: selectAllCandidate() is false inside #lpn_pane_body');
			} else {
				report.skip('a Tables-pane cell is excluded', 'no editable cell in the junctions table');
			}

			report.eq(a.errors.length, 0, 'no script error on the looped-network page');
		} finally { await a.close(); }
	}
};
