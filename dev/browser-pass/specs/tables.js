// §46 -- Tom's fifth pass over the bottom-pane TABLES (Task 690, 2026-09-21), measured in a real
// Chromium because every one of these is layout, focus or timing, which the stub does not do.
//
//   R-109  *"The page loads with the current table blank. I have to switch away and back to see
//          that table."*  -- reproduced with Recalculate OFF: nothing refreshed the pane but a solve.
//   R-110  *"Sometimes the column widths are unreasonable. For example, Pumps.Date installed,
//          width = 1em; Pumps.Pump head curve, width = 2 em (due to selector?)..."*  -- every column
//          of every table on two examples is held to a floor derived from its own heading and, for a
//          pull-down, from the option it is showing. (The drag that could store such a width is
//          dev/lpn-spike/pane-column-drag-harness.js's business: a stub can drive it exactly.)
//   R-111  *"Switching to Junctions the first time and some subsequent times delayed about 3
//          seconds or more."*  -- a table shown again is the SAME table, and a hidden one keeps its
//          layout. The milliseconds are printed, never asserted: absolute times belong to the
//          machine, and dev/browser-pass/tables-probe.js is the instrument for them.
//   R-112  the heading's bottom edge and the top row's top edge coincide, to the pixel, at every
//          step of an arrow walk down and back up, at three device scale factors.
//   R-113  *"Switching tables (tabs) leaves the tab selected instead of the currently highlighted
//          cell."*  -- after a tab click the keyboard is in the table, on its current cell.
//   R-115  the right-click row that zooms to and selects the element says so, by key.

const { Session } = require('../lib/session');

exports.title = '46. Bottom pane tables: blank on load, widths, switch cost, heading seam, focus';

const TABLES = ['junctions', 'reservoirs', 'tanks', 'pipes', 'pumps', 'valves', 'customers'];

async function openExample(browser, title, extra) {
	const a = await Session.open(browser, 'A', extra);
	await a.goto('Looped-Network.php');
	await a.openExampleCard(title);
	await a.settle(1500);
	// The consent banner lies across the bottom of the window, which is where the pane is.
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	return a;
}
async function showTab(a, id) {
	await a.page.evaluate((t) => document.getElementById('lpn_pane_tab_' + t).click(), id);
	await a.settle(250);
}
async function openPane(a) {
	await a.page.evaluate(() => {
		const b = document.getElementById('lpn_pane_btn');
		if (b && b.getAttribute('aria-pressed') !== 'true') { b.click(); }
	});
	await a.settle(250);
}

// In the page: every column of the table on show, against the floor its own content sets.
// The heading may wrap between words and never inside one, so its floor is its LONGEST WORD; a
// pull-down's floor is the text of the option it is showing, because a pull-down that clips its
// own choice is the "due to selector?" Tom suspected. An input's width is a declared, approved em
// and a long value scrolls inside it (his own rule: "inputs are flexible"), so it sets no floor.
const COLUMN_FLOORS = (id) => {
	const host = document.getElementById('lpn_pane_' + id);
	const table = host && host.querySelector('table');
	if (!table) { return { id, rows: 0, cols: [] }; }
	const cv = document.createElement('canvas').getContext('2d');
	const textW = (el, text) => { const cs = getComputedStyle(el); cv.font = cs.font; return cv.measureText(text).width; };
	const ths = [...table.querySelectorAll('thead th')];
	const body = [...table.querySelectorAll('tbody tr')];
	const cols = ths.map((th, i) => {
		const btn = th.querySelector('button') || th;
		const words = btn.textContent.replace(/[▲▼]/g, '').trim().split(/\s+/);
		const word = Math.max(...words.map((w) => textW(btn, w)));
		let pick = 0, pickText = '';
		body.forEach((tr) => {
			const sel = tr.children[i] && tr.children[i].querySelector('select');
			if (!sel || sel.selectedIndex < 0) { return; }
			const t = sel.options[sel.selectedIndex].textContent;
			const w = textW(sel, t);
			if (w > pick) { pick = w; pickText = t; }
		});
		// A PLAIN cell (a result, an identity) has no box to scroll inside and `overflow: hidden`
		// on the cell, so a value wider than its column is simply cut off: that is a floor too.
		let clipped = '';
		body.forEach((tr) => {
			const td = tr.children[i];
			if (!td || clipped || td.querySelector('input, select, button')) { return; }
			if (td.scrollWidth > td.clientWidth + 1) { clipped = td.textContent; }
		});
		const cellW = (body[0] && body[0].children[i]) ? body[0].children[i].getBoundingClientRect().width : 0;
		const selW = (() => {
			const s = body[0] && body[0].children[i] && body[0].children[i].querySelector('select');
			return s ? s.getBoundingClientRect().width : 0;
		})();
		return {
			head: btn.textContent.trim(), w: th.getBoundingClientRect().width, cellW,
			word, pick, pickText, selW, clipped,
			em: parseFloat(getComputedStyle(table).fontSize)
		};
	});
	return { id, rows: body.length, cols };
};

exports.run = async function ({ browser, report }) {
	// ---- R-109: blank on load --------------------------------------------------------------
	{
		const a = await openExample(browser, 'EPANET Net3');
		await openPane(a);
		await showTab(a, 'junctions');
		// Recalculate OFF, written into the stored project the way the Settings box writes it, so
		// the reload below arrives with no solve behind it -- the case in which nothing else would
		// ever refresh the pane.
		const patched = await a.page.evaluate(() => {
			let n = 0;
			for (let i = 0; i < localStorage.length; i++) {
				const k = localStorage.key(i);
				try {
					const v = JSON.parse(localStorage.getItem(k));
					if (v && v.settings && Array.isArray(v.nodes)) {
						v.settings.autoRun = false; localStorage.setItem(k, JSON.stringify(v)); n++;
					}
				} catch (e) { /* not a project */ }
			}
			return n;
		});
		report.ok(patched > 0, 'R-109: the stored project is switched to Recalculate off', patched + ' project(s)');
		await a.page.reload({ waitUntil: 'load' });
		await a.page.waitForTimeout(2500);
		const r = await a.page.evaluate(() => {
			const h = document.getElementById('lpn_pane_junctions');
			return { on: h.classList.contains('on'), rows: h.querySelectorAll('tbody tr').length };
		});
		report.ok(r.on && r.rows === 92,
			'R-109: after a reload with Recalculate off, the table on show lists all 92 junctions without a tab switch',
			JSON.stringify(r));
		report.ok(a.errors.length === 0, 'R-109: no page error on the way', a.errors.slice(0, 1).join(''));
		await a.close();
	}

	// ---- R-110: every column of every table meets its floor ----------------------------------
	for (const ex of ['EPANET Net3, lat/lon', 'EPANET Net3', 'Elm Street Center']) {
		const a = await openExample(browser, ex);
		await openPane(a);
		const bad = [], seen = [];
		let columns = 0;
		for (const t of TABLES) {
			await showTab(a, t);
			const m = await a.page.evaluate(COLUMN_FLOORS, t);
			if (!m.rows) { continue; }
			seen.push(t + ' ' + m.cols.length);
			m.cols.forEach((c) => {
				columns++;
				// 1px of slack for sub-pixel rounding of the measurement against the layout.
				if (c.w + 1 < c.word) { bad.push(`${t}.${c.head}: ${(c.w / c.em).toFixed(1)}em < longest heading word ${(c.word / c.em).toFixed(1)}em`); }
				if (c.pick && c.selW + 1 < c.pick) { bad.push(`${t}.${c.head}: pull-down ${(c.selW / c.em).toFixed(1)}em clips "${c.pickText}" (${(c.pick / c.em).toFixed(1)}em)`); }
				if (c.clipped) { bad.push(`${t}.${c.head}: plain cell cuts off "${c.clipped}"`); }
				// And an absolute floor under all of it, in the size Tom called unreasonable: nothing
				// here is a one-character column unless somebody dragged it there.
				if (c.w < 1.5 * c.em) { bad.push(`${t}.${c.head}: ${(c.w / c.em).toFixed(1)}em is under 1.5em`); }
			});
		}
		report.ok(bad.length === 0 && columns > 0,
			`R-110 ${ex}: all ${columns} columns are at least their longest heading word, their plain values, 1.5em, and any pull-down's shown option`,
			bad.length ? bad.slice(0, 4).join('; ') : seen.join(', '));
		await a.close();
	}

	// ---- R-110 (his second pass): no heading word in more than three pieces --------------------
	// Tom, 2026-09-21: *"some of the initial column widths are unreasonable. We talked about
	// limiting words to breaking into three pieces (just an idea), but I see words broken into five
	// pieces of one or two characters each."* A heading only breaks inside a word in a column with
	// a STORED width, so every column of two tables is stored at one em -- what a browser still
	// carrying the old defects' widths holds -- and the page is reloaded to read them back.
	{
		const a = await openExample(browser, 'EPANET Net3, lat/lon');
		await openPane(a);
		const tabs = ['pipes', 'pumps', 'junctions'];
		const prefs = {};
		for (const t of tabs) {
			await showTab(a, t);
			prefs[t] = { w: await a.page.evaluate((id) => {
				const w = {};
				document.querySelectorAll('#lpn_pane_' + id + ' thead th').forEach((th) => { if (th._lpnColKey) { w[th._lpnColKey] = 1; } });
				return w;
			}, t) };
		}
		await a.page.evaluate((p) => localStorage.setItem('lpn_panecols', JSON.stringify(p)), prefs);
		await a.page.reload({ waitUntil: 'load' });
		await a.settle(2500);
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await openPane(a);
		const bad = [];
		let words = 0;
		for (const t of tabs) {
			await showTab(a, t);
			const r = await a.page.evaluate((id) => {
				const cv = document.createElement('canvas').getContext('2d'), out = [];
				let n = 0;
				document.querySelectorAll('#lpn_pane_' + id + ' thead th').forEach((th) => {
					const b = th.querySelector('button'), cs = getComputedStyle(b);
					cv.font = cs.font;
					const inner = b.clientWidth;
					b.textContent.replace(/[▲▼]/g, '').trim().split(/\s+/).forEach((w) => {
						n++;
						const pieces = Math.ceil((cv.measureText(w).width - 0.5) / inner);
						if (pieces > 3) { out.push(`${id}."${w}" in ${pieces} pieces (${inner.toFixed(0)}px)`); }
					});
				});
				return { out, n };
			}, t);
			words += r.n;
			bad.push(...r.out);
		}
		report.ok(words > 0 && bad.length === 0,
			`R-110: with every column of three tables stored at 1 em, none of ${words} heading words is broken into more than three pieces`,
			bad.slice(0, 4).join('; '));
		await a.page.evaluate(() => localStorage.removeItem('lpn_panecols'));
		await a.close();
	}

	// ---- R-111, R-113, R-115 on one page ----------------------------------------------------
	{
		const a = await openExample(browser, 'EPANET Net3');
		await openPane(a);
		await showTab(a, 'junctions');
		await showTab(a, 'pipes');
		// R-111: the same <table> element comes back, and the hidden one keeps its rendering.
		const same = await a.page.evaluate(() => {
			const h = document.getElementById('lpn_pane_junctions');
			window.__lpnJunctionTable = h.querySelector('table');
			return getComputedStyle(h).contentVisibility;
		});
		report.eq(same, 'hidden', 'R-111: a table that is not on show keeps its layout (content-visibility: hidden)');
		const ms = await a.page.evaluate(async () => {
			const t0 = performance.now();
			document.getElementById('lpn_pane_tab_junctions').click();
			await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
			return Math.round(performance.now() - t0);
		});
		const back = await a.page.evaluate(() =>
			document.getElementById('lpn_pane_junctions').querySelector('table') === window.__lpnJunctionTable);
		report.ok(back, 'R-111: switching back to Junctions shows the same table, refilled rather than rebuilt');
		report.note(`R-111: Pipes -> Junctions took ${ms} ms to the second frame on this machine (not asserted)`);

		// R-113: the keyboard is in the table, on its current cell, straight after the tab click.
		const f = await a.page.evaluate(() => {
			const el = document.activeElement, td = el && el.closest && el.closest('td');
			return { inTable: !!(td && td.closest('#lpn_pane_junctions')), cur: !!(td && td.classList.contains('lpn-pane-cur')),
				row: td ? td._lpnPaneId : null, key: td ? td._lpnPaneKey : null, tag: el ? el.tagName : null };
		});
		report.ok(f.inTable && f.cur, 'R-113: after a tab click the focus is on the table’s current cell, not the tab', JSON.stringify(f));
		await a.page.keyboard.press('ArrowDown');
		await a.page.keyboard.press('ArrowRight');
		const g = await a.page.evaluate(() => {
			const td = document.activeElement && document.activeElement.closest && document.activeElement.closest('td');
			return td ? { row: td._lpnPaneId, key: td._lpnPaneKey } : null;
		});
		report.ok(!!g && (g.row !== f.row) && (g.key !== f.key),
			'R-113: ...so Down and Right move the cell at once, with no click first', JSON.stringify(f) + ' -> ' + JSON.stringify(g));
		// And a selection made before the switch is still the one standing after it.
		await showTab(a, 'pipes');
		await showTab(a, 'junctions');
		const h = await a.page.evaluate(() => {
			const td = document.activeElement && document.activeElement.closest && document.activeElement.closest('td');
			return td ? { row: td._lpnPaneId, key: td._lpnPaneKey } : null;
		});
		report.ok(!!h && h.row === g.row && h.key === g.key, 'R-113: coming back, the caret is where it was left',
			JSON.stringify(h));

		// R-115: the right-click row that runs findGoTo() says Zoom & select, by key.
		const want = await a.lang('lpn_pane_goto_tip');
		const rows = await a.page.evaluate(() => {
			const td = document.activeElement.closest('td');
			const r = td.getBoundingClientRect();
			td.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: r.left + 5, clientY: r.top + 5, button: 2 }));
			const m = document.querySelector('.lpn-pane-ctxmenu');
			return m ? [...m.querySelectorAll('button')].map((b) => b.textContent) : null;
		});
		report.ok(!!rows && rows.indexOf(want) >= 0, 'R-115: the right-click menu carries the Zoom & select row', JSON.stringify(rows));
		report.ok(a.errors.length === 0, 'R-111/113/115: no page error', a.errors.slice(0, 1).join(''));
		await a.close();
	}

	// ---- R-112: the heading and the top row share one edge, at three scale factors ------------
	for (const dsf of [1, 1.25, 1.5]) {
		const a = await openExample(browser, 'EPANET Net3', { deviceScaleFactor: dsf });
		await openPane(a);
		await showTab(a, 'junctions');
		await a.page.evaluate(() => {
			document.querySelector('#lpn_pane_junctions tbody tr:nth-child(1) td:nth-child(7) input').focus();
		});
		const gaps = [];
		const gap = () => a.page.evaluate(() => {
			const host = document.getElementById('lpn_pane_junctions');
			const hb = host.querySelector('thead tr').getBoundingClientRect().bottom;
			const r = [...host.querySelectorAll('tbody tr')].find((x) => x.getBoundingClientRect().bottom > hb + 1);
			return +(r.getBoundingClientRect().top - hb).toFixed(2);
		});
		for (let i = 0; i < 30; i++) { await a.page.keyboard.press('ArrowDown'); gaps.push(await gap()); }
		for (let i = 0; i < 30; i++) { await a.page.keyboard.press('ArrowUp'); gaps.push(await gap()); }
		const worst = Math.max(...gaps.map(Math.abs));
		report.ok(worst < 0.05, `R-112 at device scale ${dsf}: the top row meets the heading exactly at all 60 steps of an arrow walk`,
			'worst ' + worst + ' px' + (worst ? '; ' + gaps.join(' ') : ''));
		await a.close();
	}
};
