// §Print table (Task fix/table-print). Tom, verbatim:
//   (1) "Print table puts heading borders only around ID."
//   (2) "Print table does not respect column widths. It expands to 100% of printable area."
//
// Root causes, found by comparing the CSS a browser actually computes against what the print
// media block intends (dev/lpn-spike/pane-table-css.js answers that question for the static
// text; this spec answers it for the rendered page, which is the only place the two screen rules
// below actually collide):
//   (1) `.lpn-pane-table thead th:first-child` (css/engcalcs.css, the sticky-header seam) carries
//       no media condition, so it is not a screen-only rule -- it wins on paper too, and at equal
//       specificity to `.lpn-print-table thead th` it came SECOND in source order and lost nothing.
//       Fixed by restating `.lpn-print-table thead th:first-child { box-shadow: none }` inside the
//       print block, at matching specificity, later in the file.
//   (2) panePrintWidths() only measured and capped a table's columns once the reader had DRAGGED
//       at least one. An untouched table -- the ordinary case -- printed at the browser's own
//       auto-layout content width: no budget, no scaling, nothing holding a many-column table to a
//       sheet. Fixed by always reading every column's drawn width, dragged or not.
//
// **NO window.print() -- it is stubbed to a no-op**, because it would either open a real dialog
// (nothing here can answer) or, in a browser build that treats it as inert, do nothing observable.
// The DOM printPaneTable() builds and the @media print rules a real print job would use are both
// real; only the browser's own print pipeline past that DOM is out of reach here, which is why
// dev/browser-pass/run.js's own header still lists "print layout" (the physical PAGE, page breaks,
// margins) on the human list. Borders, box-shadow and column ratios are not that -- they are exactly
// what a headless page with `emulateMedia('print')` answers honestly.

const { Session } = require('../lib/session');

exports.title = 'Print table: heading borders and column widths';

async function openPipesTable(browser, name, colPrefs) {
	const a = await Session.open(browser, name);
	await a.goto('Looped-Network.php');
	if (colPrefs) {
		await a.page.evaluate((p) => { localStorage.setItem('lpn_panecols', JSON.stringify(p)); }, colPrefs);
		await a.reload();
	}
	await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
	await a.settle(1500);
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.page.evaluate(() => { const b = document.getElementById('lpn_pane_btn'); if (b) { b.click(); } });
	await a.settle(300);
	await a.page.evaluate(() => { const b = document.getElementById('lpn_pane_tab_pipes'); if (b) { b.click(); } });
	await a.settle(500);
	return a;
}

// Builds the print sheet (clicking the real button, with window.print() stubbed so nothing tries
// to open a native dialog) and switches the page into print media so @media print rules apply to
// the live DOM -- the same rules a real print job reads.
async function buildPrintSheet(a) {
	await a.page.evaluate(() => { window.print = function () {}; });
	const onScreen = await a.page.evaluate(() => {
		const ths = [...document.querySelectorAll('#lpn_pane_pipes table thead th')];
		return ths.map((th) => th.getBoundingClientRect().width);
	});
	const clicked = await a.page.evaluate(() => {
		const b = document.getElementById('lpn_pane_print');
		if (!b) { return false; }
		b.click();
		return true;
	});
	if (!clicked) { return null; }
	await a.page.emulateMedia({ media: 'print' });
	const info = await a.page.evaluate(() => {
		const area = document.getElementById('lpn_print_area');
		const table = area && area.querySelector('table');
		if (!table) { return null; }
		const ths = [...table.querySelectorAll('thead th')];
		const cols = [...table.querySelectorAll('col')].map((c) => parseFloat(c.style.width) || 0);
		return {
			tableClass: table.className,
			styleWidthEm: parseFloat(table.style.width) || 0,
			styleFontPt: parseFloat(table.style.fontSize) || 9,
			ths: ths.map((th) => {
				const cs = getComputedStyle(th);
				return { text: th.textContent.trim(), cls: th.className, borderBottom: cs.borderBottomWidth + ' ' + cs.borderBottomStyle + ' ' + cs.borderBottomColor, boxShadow: cs.boxShadow };
			}),
			cols
		};
	});
	return { onScreen, info };
}

exports.run = async function ({ browser, report }) {
	// ---- (1) every heading gets the same border, ID included ----------------------------------
	{
		const a = await openPipesTable(browser, 'A');
		const { info } = await buildPrintSheet(a);
		report.ok(!!info, 'the Print table button built a printable sheet');
		if (info) {
			const bottoms = new Set(info.ths.map((t) => t.borderBottom));
			report.ok(bottoms.size === 1, 'every heading has the same border-bottom in print', JSON.stringify([...bottoms]));
			const shadows = new Set(info.ths.map((t) => t.boxShadow));
			report.ok(shadows.size === 1 && [...shadows][0] === 'none',
				'no heading carries a box-shadow border in print (was: ID only, from the unguarded sticky-header rule)',
				JSON.stringify(info.ths.map((t) => t.cls + '=' + t.boxShadow)));
			const idTh = info.ths.find((t) => /lpn-pane-first/.test(t.cls));
			const otherTh = info.ths.find((t) => !/lpn-pane-first/.test(t.cls));
			report.ok(!!idTh && !!otherTh && idTh.boxShadow === otherTh.boxShadow,
				'R: "Print table puts heading borders only around ID" -- ID and a plain heading match',
				JSON.stringify({ id: idTh, other: otherTh }));
		}
		report.ok(a.errors.length === 0, 'no page error building the print sheet', a.errors.slice(0, 1).join(''));
		await a.close();
	}

	// ---- (2a) an UNTOUCHED table (nobody has dragged a column) still respects on-screen ratios
	//      and never simply expands past the page budget ----------------------------------------
	{
		const a = await openPipesTable(browser, 'B');
		const { onScreen, info } = await buildPrintSheet(a);
		if (info) {
			report.ok(/lpn-print-fixed/.test(info.tableClass),
				'an untouched table still gets the fixed-layout budget/scale path (R: "It expands to 100% of printable area")',
				info.tableClass);
			report.ok(info.cols.length === onScreen.length, 'one printed column per on-screen column',
				`${info.cols.length} vs ${onScreen.length}`);
			// Ratio check: printed column widths, converted to px at the sheet's own font-size, divide
			// out to the SAME shares as the on-screen widths, within 3% -- "respects column widths"
			// means the proportions travel, not the absolute pixels (a sheet is not a screen).
			const onSum = onScreen.reduce((s, w) => s + w, 0);
			const colSum = info.cols.reduce((s, w) => s + w, 0);
			let worst = 0;
			for (let i = 0; i < info.cols.length; i++) {
				const printedShare = colSum > 0 ? info.cols[i] / colSum : 0;
				const screenShare = onSum > 0 ? onScreen[i] / onSum : 0;
				worst = Math.max(worst, Math.abs(printedShare - screenShare));
			}
			report.ok(worst < 0.03, 'printed column widths follow on-screen widths (proportional shares within 3%)',
				'worst share delta ' + (worst * 100).toFixed(2) + '%');
			// Never wider than the assumed page budget -- either the sum stayed inside 60em, or the
			// font was scaled down so the effective width did.
			const effectiveEm = info.styleWidthEm * (info.styleFontPt / 9);
			report.ok(effectiveEm <= 60 + 0.5, 'the sheet never exceeds the assumed printable-page budget',
				`styleWidthEm=${info.styleWidthEm} at ${info.styleFontPt}pt -> effective ${effectiveEm.toFixed(1)}em of a 60em budget`);
		}
		report.ok(a.errors.length === 0, 'no page error on the untouched table', a.errors.slice(0, 1).join(''));
		await a.close();
	}

	// ---- (2b) a DRAGGED table: one column stored narrow, the rest read off the screen ----------
	{
		const a = await openPipesTable(browser, 'C', { pipes: { w: { length: 10 } } });
		const { info } = await buildPrintSheet(a);
		if (info) {
			report.ok(/lpn-print-fixed/.test(info.tableClass), 'a dragged table gets the fixed-layout path', info.tableClass);
			const lengthIdx = info.ths.findIndex((t) => /lpn-pane-col-length/.test(t.cls));
			report.ok(lengthIdx >= 0 && Math.abs(info.cols[lengthIdx] - 10) < 0.1,
				'the dragged column keeps its stored width on the sheet', JSON.stringify({ lengthIdx, em: info.cols[lengthIdx] }));
			const effectiveEm = info.styleWidthEm * (info.styleFontPt / 9);
			report.ok(effectiveEm <= 60 + 0.5, 'a wide dragged table is scaled to the page budget rather than stretched',
				`effective ${effectiveEm.toFixed(1)}em of a 60em budget`);
		}
		report.ok(a.errors.length === 0, 'no page error on the dragged table', a.errors.slice(0, 1).join(''));
		await a.close();
	}
};
