// §Print table (R-162, R-201, R-215). Tom, 2026-09-24, retesting the previous fix:
//   "Not fixed on master or on feat/table-editing. No heading borders, Widths seem to be trying,
//    but not succeeding (tighter fit on print than on screen), and the print horiz alignments are
//    differen than the on-screen alighments (all centered except ID)."
//
// **WHY THE PREVIOUS VERSION OF THIS SPEC PASSED OVER ALL THREE.** It read the `<col>` elements'
// declared em widths and compared their SHARES, so it held what the code wrote, not what the
// browser drew; it asserted that every heading had the SAME border-bottom and no box-shadow, which
// a heading with a bottom rule and nothing else satisfies; and it never looked at alignment. This
// one compares the printed sheet with the table on screen, cell by cell, in the browser's own
// computed layout under print media:
//   (1) every heading cell has a border on all four sides;
//   (2) every printed column is its on-screen width times ONE common factor, within 2px, and the
//       sheet is no wider than the page it is laid out on;
//   (3) every heading and every cell of the first row has the text-align it has on screen;
//   (4) every heading wraps onto the same number of lines as on screen -- the "tighter fit".
// Each is checked at two paper widths: US Letter and A4, portrait, at Chromium's default margins.
//
// It was reproduced first as a real PDF (page.pdf(), rasterised with pdf.js): Net3's Junctions
// sheet had a bottom rule under the headings and no other heading border, "Elevation" and "Base
// demand" broken mid-word, and every column but ID right- or left-aligned.
//
// **window.print() is stubbed to a no-op**, because it would open a real dialog nothing here can
// answer. Everything up to it is the page's own path: the Print table button, the sheet it builds,
// and the @media print rules a print job reads.

const { Session } = require('../lib/session');

exports.title = 'Print table: the sheet is the screen table at one scale';

// Printable width in CSS px at 96/in, less Chromium's default ~0.4in margin each side.
const PAPERS = [{ name: 'Letter', w: Math.round((8.5 - 0.8) * 96) }, { name: 'A4', w: Math.round((8.27 - 0.8) * 96) }];

async function openTable(browser, name, tab, colPrefs) {
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
	await a.page.evaluate((t) => { const b = document.getElementById('lpn_pane_tab_' + t); if (b) { b.click(); } }, tab);
	await a.settle(500);
	return a;
}

// Lines a cell's text occupies: distinct line boxes of its text nodes.
const LINES_FN = `(function (el) {
	var r = document.createRange(), tops = {}, n = 0, w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), t;
	while ((t = w.nextNode())) {
		if (!t.textContent.trim()) { continue; }
		r.selectNodeContents(t);
		Array.prototype.forEach.call(r.getClientRects(), function (q) {
			if (q.width < 0.5) { return; }
			var k = Math.round(q.top); if (!tops[k] && !tops[k - 1] && !tops[k + 1]) { tops[k] = 1; n++; }
		});
	}
	return n;
})`;

async function measureScreen(a, tab) {
	return a.page.evaluate(({ tab, LINES }) => {
		const lines = eval(LINES);
		const t = document.querySelector('#lpn_pane_' + tab + ' table');
		const ths = [...t.querySelectorAll('thead th')];
		const row = [...t.querySelector('tbody tr').children];
		return {
			th: ths.map((e) => ({ text: e.textContent.trim(), w: e.getBoundingClientRect().width, ta: getComputedStyle(e).textAlign, lines: lines(e) })),
			// A value may sit inside an input, which inherits its cell's alignment; the cell's own
			// computed value is what the reader sees either way.
			td: row.map((e) => ({ ta: getComputedStyle(e).textAlign }))
		};
	}, { tab, LINES: LINES_FN });
}

async function measurePrint(a, paperW) {
	await a.page.setViewportSize({ width: paperW, height: 1000 });
	await a.page.emulateMedia({ media: 'print' });
	await a.settle(150);
	const m = await a.page.evaluate((LINES) => {
		const lines = eval(LINES);
		const area = document.getElementById('lpn_print_area');
		const t = area && area.querySelector('table');
		if (!t) { return null; }
		const side = (cs, s) => parseFloat(cs['border' + s + 'Width']) > 0 && !/^(none|hidden)$/.test(cs['border' + s + 'Style']);
		return {
			areaW: area.getBoundingClientRect().width,
			tableW: t.getBoundingClientRect().width,
			th: [...t.querySelectorAll('thead th')].map((e) => {
				const cs = getComputedStyle(e);
				return { text: e.textContent.trim(), w: e.getBoundingClientRect().width, ta: cs.textAlign, lines: lines(e),
					borders: ['Top', 'Right', 'Bottom', 'Left'].filter((s) => side(cs, s)).length };
			}),
			td: [...t.querySelector('tbody tr').children].map((e) => ({ ta: getComputedStyle(e).textAlign }))
		};
	}, LINES_FN);
	await a.page.emulateMedia({ media: 'screen' });
	return m;
}

async function checkTable(browser, report, name, tab, colPrefs) {
	const a = await openTable(browser, name, tab, colPrefs);
	const scr = await measureScreen(a, tab);
	await a.page.evaluate(() => { window.print = function () {}; document.getElementById('lpn_pane_print').click(); });
	const label = tab + (colPrefs ? ' (a column dragged)' : '');
	for (const paper of PAPERS) {
		const pr = await measurePrint(a, paper.w);
		const at = `${label}, ${paper.name}`;
		report.ok(!!pr, `${at}: the Print table button built a sheet`);
		if (!pr) { continue; }
		report.ok(pr.th.length === scr.th.length, `${at}: one printed column per on-screen column`, `${pr.th.length} vs ${scr.th.length}`);

		// (1) "No heading borders"
		const open = pr.th.filter((h) => h.borders !== 4).map((h) => h.text + ':' + h.borders);
		report.ok(open.length === 0, `${at}: every heading cell has a border on all four sides`, open.join(', '));

		// (2) "Widths seem to be trying, but not succeeding"
		const sScr = scr.th.reduce((s, h) => s + h.w, 0), sPr = pr.th.reduce((s, h) => s + h.w, 0);
		const k = sPr / sScr;
		const off = pr.th.map((h, i) => ({ t: h.text, d: h.w - k * scr.th[i].w })).filter((x) => Math.abs(x.d) > 2);
		report.ok(off.length === 0, `${at}: every printed column is its screen width x ${k.toFixed(3)}, within 2px`,
			off.map((x) => x.t + ' ' + x.d.toFixed(1) + 'px').join(', '));
		report.ok(pr.tableW <= pr.areaW + 1, `${at}: the sheet fits the page`, `${pr.tableW.toFixed(1)} of ${pr.areaW.toFixed(1)}px`);

		// (3) "the print horiz alignments are differen than the on-screen alighments"
		const badTh = pr.th.map((h, i) => h.ta === scr.th[i].ta ? null : `${h.text}: ${scr.th[i].ta} -> ${h.ta}`).filter(Boolean);
		const badTd = pr.td.map((d, i) => d.ta === scr.td[i].ta ? null : `${scr.th[i].text}: ${scr.td[i].ta} -> ${d.ta}`).filter(Boolean);
		report.ok(badTh.length === 0, `${at}: every heading is aligned as on screen`, badTh.join('; '));
		report.ok(badTd.length === 0, `${at}: every cell is aligned as on screen`, badTd.join('; '));

		// (4) "tighter fit on print than on screen"
		const wrap = pr.th.map((h, i) => h.lines === scr.th[i].lines ? null : `${h.text}: ${scr.th[i].lines} -> ${h.lines} lines`).filter(Boolean);
		report.ok(wrap.length === 0, `${at}: every heading wraps as it does on screen`, wrap.join('; '));
	}
	report.ok(a.errors.length === 0, `${label}: no page error`, a.errors.slice(0, 1).join(''));
	await a.close();
}

exports.run = async function ({ browser, report }) {
	await checkTable(browser, report, 'A', 'pipes');
	await checkTable(browser, report, 'B', 'junctions');
	// A dragged column prints at the width it is drawn at, like every other one.
	await checkTable(browser, report, 'C', 'pipes', { pipes: { w: { length: 10 } } });
};
