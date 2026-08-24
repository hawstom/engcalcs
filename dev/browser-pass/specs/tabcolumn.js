// Tab order on the four dynamic-table calculators, measured by actually pressing Tab.
//
// Tom, 2026-08-23, having used the Task 478 field grid at prod dev: *"The four dynamic tables -- at
// mi, wi, bpn, and ip -- are not tabbed by column. I still think that column-wise is most
// predictable and helpful for the user... the top inputs should tab straight down to the dynamic
// table column 1 with no detour to X etc."*
//
// **WHY THIS IS A BROWSER SPEC AND NOT A STATIC CHECK.** `focus_order_check.php` reads DOM order,
// which is the whole mechanism Task 478 used for the top fields -- and it is therefore blind to what
// ships here, which is a Tab key handler (EngCalcs.wireColumnTabOrder in js/Calculators.lib.js). The
// DOM of `#CalcsTable` is unchanged and row-major on purpose; only where focus GOES is different. A
// static reader would report this page as unfixed and a DOM-order harness would agree with it. The
// only honest measurement is to press Tab and write down where focus landed.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later

const { pageUrl } = require('../lib/env');

exports.title = '35. Tab walks the dynamic table by column';

// The four pages that build rows through EngCalcs.addCalcRow(), and for each the column count its
// table really has. Read from the page rather than typed: a spec that hard-codes "seventeen columns"
// is asserting the page it was written against, not the page that ships.
const PAGES = [
	['Manning-Irregular.php', 'mi'],
	['Weir-Flow-Irregular.php', 'wi'],
	['Branched-Network.php', 'bpn'],
	['Irrigation-Pressure.php', 'ip']
];

// Identifies wherever focus is, in the vocabulary this spec is allowed to use: which region, and
// which cell of it. Never a selector -- see lib/session.js on why.
const WHERE = () => {
	const el = document.activeElement;
	if (!el) { return { region: 'none' }; }
	const cell = el.closest && el.closest('#CalcsTable td');
	if (cell) {
		const row = cell.parentNode, ci = [...row.cells].indexOf(cell);
		// `nth` is the position among the FOCUSABLE cells of this column, and it is not the same as
		// the table row: Branched-Network's second column has no control on its first row (the
		// source node's inflow is not typed), so that column's top cell is table row 1. Asserting
		// the table row there would be asserting a property of bpn's markup, not of the tab order.
		const col = [...row.parentNode.rows]
			.map((r) => r.cells[ci] && r.cells[ci].querySelector('input, select, textarea'))
			.filter((c) => c && c.offsetParent !== null);
		return {
			region: 'table',
			col: ci,
			row: [...row.parentNode.rows].indexOf(row),
			nth: col.indexOf(el),
			of: col.length
		};
	}
	if (el.closest && el.closest('.ec-fieldgrid .ec-fg-input')) { return { region: 'field' }; }
	if (el.closest && el.closest('.ec-fieldgrid .ec-fg-units')) { return { region: 'units' }; }
	if (el.closest && el.closest('.ec-fieldgrid .ec-fg-x')) { return { region: 'x' }; }
	return { region: 'other', tag: el.tagName, id: el.id || el.name || '' };
};

exports.run = async function ({ browser, report }) {
	const context = await browser.newContext({ viewport: { width: 1400, height: 1200 } });
	const page = await context.newPage();
	const errors = [];
	page.on('pageerror', (e) => errors.push(String(e.stack || e)));
	try {
		for (const [file, prefix] of PAGES) {
			await page.goto(pageUrl(file + '?ec_nolog=1'), { waitUntil: 'load' });

			// The shape of the table as it actually rendered, so every expectation below is derived.
			const shape = await page.evaluate(() => {
				const t = document.getElementById('CalcsTable');
				const body = t && t.tBodies[0];
				if (!body) { return null; }
				const cols = [];
				[...body.rows].forEach((r) => [...r.cells].forEach((c, i) => {
					const ctl = c.querySelector('input, select, textarea');
					if (ctl && ctl.offsetParent !== null) { cols[i] = (cols[i] || 0) + 1; }
				}));
				return { rows: body.rows.length, cols: cols.filter(Boolean) };
			});
			report.ok(!!shape && shape.cols.length > 0, `${prefix}: the dynamic table rendered rows`,
				JSON.stringify(shape));
			if (!shape || !shape.cols.length) { continue; }

			// 1. FROM THE LAST TOP INPUT, ONE TAB REACHES THE TABLE. The detour Tom named -- the
			// unit selects and the X's -- is what used to sit here.
			await page.evaluate(() => {
				const inputs = [...document.querySelectorAll('#formInput .ec-fieldgrid .ec-fg-input input')]
					.filter((el) => el.offsetParent !== null);
				inputs[inputs.length - 1].focus();
			});
			await page.keyboard.press('Tab');
			let at = await page.evaluate(WHERE);
			report.ok(at.region === 'table' && at.col === 0 && at.row === 0,
				`${prefix}: the last top input tabs straight into the table's first cell`,
				JSON.stringify(at));

			// 2. AND THEN STRAIGHT DOWN THE COLUMN. One Tab per row, and the column must not change.
			const walk = [];
			for (let i = 1; i < shape.cols[0]; i++) {
				await page.keyboard.press('Tab');
				walk.push(await page.evaluate(WHERE));
			}
			report.ok(walk.every((w, i) => w.region === 'table' && w.col === 0 && w.nth === i + 1),
				`${prefix}: Tab walks down column 1, one cell per press`, JSON.stringify(walk));

			// 3. OUT OF THE BOTTOM OF A COLUMN IS THE TOP OF THE NEXT, not the row beside it.
			await page.keyboard.press('Tab');
			at = await page.evaluate(WHERE);
			report.ok(at.region === 'table' && at.col > 0 && at.nth === 0,
				`${prefix}: past the last row, focus is the top of the next column`, JSON.stringify(at));

			// 4. SHIFT+TAB IS THE EXACT INVERSE AT EVERY SEAM. A one-way chain is a focus trap with
			// extra steps -- a person who overshoots must be able to come back the way they went.
			await page.keyboard.press('Shift+Tab');
			const back1 = await page.evaluate(WHERE);
			report.ok(back1.region === 'table' && back1.col === 0 && back1.nth === shape.cols[0] - 1,
				`${prefix}: Shift+Tab returns to the bottom of the previous column`, JSON.stringify(back1));
			for (let i = 0; i < shape.cols[0] - 1; i++) { await page.keyboard.press('Shift+Tab'); }
			const back2 = await page.evaluate(WHERE);
			report.ok(back2.region === 'table' && back2.col === 0 && back2.nth === 0,
				`${prefix}: ...and back up column 1 to its first cell`, JSON.stringify(back2));
			await page.keyboard.press('Shift+Tab');
			const back3 = await page.evaluate(WHERE);
			report.ok(back3.region === 'field',
				`${prefix}: ...and out of the table into the top inputs again`, JSON.stringify(back3));

			// 5. NOTHING IS TAKEN OFF THE KEYBOARD (WCAG 2.1.1). The unit selects and the X's are not
			// skipped, only moved: out of the bottom of the LAST column, they are what comes next.
			await page.evaluate(() => {
				const t = document.getElementById('CalcsTable'), body = t.tBodies[0];
				const rows = [...body.rows];
				const last = rows[rows.length - 1];
				const ctls = [...last.cells].map((c) => c.querySelector('input, select, textarea'))
					.filter((c) => c && c.offsetParent !== null);
				ctls[ctls.length - 1].focus();
			});
			await page.keyboard.press('Tab');
			const after = await page.evaluate(WHERE);
			report.ok(after.region === 'units' || after.region === 'other',
				`${prefix}: out of the last cell, the unit selects are still reachable`,
				JSON.stringify(after));
		}
		// 6. THE PRINTABLE TITLES ARE ALREADY TAB STOPS, and Tom asked whether they should be
		// (2026-08-23: *"Should we include the Printable titles in the tab order? I think that would
		// be nice."*). They are, and they are the FIRST two stops in the form -- but four controls
		// sit between the subtitle and the first field input (Restore defaults, SI, US, and the
		// units row's own X), which is very likely what he actually met. Measured here rather than
		// argued, and left as it is: removing those four would take Restore defaults and the preset
		// buttons off the keyboard path, which is the WCAG 2.1.1 trade Task 478 already declined
		// once. If he wants them moved, this check is where the new expectation goes.
		await page.goto(pageUrl('Manning-Trap.php?ec_nolog=1'), { waitUntil: 'load' });
		const fromTitle = await page.evaluate(() => {
			const t = document.getElementById('printable_title');
			return { present: !!t, tabbable: !!t && t.tabIndex >= 0 && t.offsetParent !== null };
		});
		report.ok(fromTitle.present && fromTitle.tabbable,
			'the Printable Title is a tab stop already', JSON.stringify(fromTitle));
		await page.focus('#printable_title');
		await page.keyboard.press('Tab');
		report.ok(await page.evaluate(() => document.activeElement.id === 'printable_subtitle'),
			'...and Tab from it reaches the Printable Subtitle');
		// How many stops from the subtitle to the first number a person types. Reported as a NUMBER
		// rather than asserted against a threshold: it is the size of the detour, and Tom is the one
		// who decides whether it is too many.
		const detour = await page.evaluate(async () => {
			const first = [...document.querySelectorAll('#formInput .ec-fieldgrid .ec-fg-input input')]
				.filter((el) => el.offsetParent !== null)[0];
			const all = [...document.querySelectorAll('input, select, button, a[href], textarea')]
				.filter((el) => el.offsetParent !== null && el.tabIndex >= 0);
			return all.indexOf(first) - all.indexOf(document.getElementById('printable_subtitle')) - 1;
		});
		report.ok(detour >= 0, `Manning-Trap: ${detour} stops sit between the Printable Subtitle `
			+ 'and the first field input (reported, not judged)', String(detour));

		report.ok(errors.length === 0, 'no page threw while tabbing', errors.join(' | ').slice(0, 300));
	} finally {
		await context.close();
	}
};
