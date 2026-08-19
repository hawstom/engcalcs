// §22 — the Labels panel's column headings sit on their columns (ROADMAP Task 435).
//
// Tom reported this twice, and after the second pass said the headings were *still* too far right.
// Both causes were box-model arithmetic that is invisible in the source: an `<input>` is content-box
// by default, so a declared 3.5em renders wider than a heading span at the same 3.5em; and Bootstrap
// Reboot gives form controls `font-size: inherit` while `columnHeadings()` draws its row at
// `0.85em`, so the SAME declared `em` resolved against two different font sizes and every heading
// came out ~15% narrow. The flex spacer at the left absorbed the whole shortfall, which is why every
// heading slid right, worst at the left — the signature of accumulated drift rather than one wrong
// width.
//
// Neither cause is visible from the CSS or the JS alone, and neither is reachable headlessly: the
// numbers only exist once a real browser has resolved `rem`, `em`, Reboot and flex against each
// other. So the check is the only one that can be honest here — **measure where each heading is
// actually painted and where the control it names is actually painted, and compare the two.**
//
// Both lists are measured, because they have different rows, and **the ID rows in particular**: they
// are the rows that hold a numeric column open with a SPACER rather than a spinner, which is where a
// heading and a column can drift apart with no control looking wrong. The node ID row reserves both
// numeric columns that way and the link ID row only the first — a node's labels are ordered against
// each other as whole labels, while the rows inside one link label are ordered against each other.

const { Session } = require('../lib/session');

exports.title = '22. The Labels panel column headings';

const LISTS = [
	{ id: 'lpn_labels_node_fields', what: 'Node labels' },
	{ id: 'lpn_labels_link_fields', what: 'Link labels' }
];
// The last two headings are no longer words (Task 441, restructured): the decimals column shows an
// EXAMPLE of what it does, translatable because the decimal separator is a locale fact, and the
// priority column shows the 123 icon with the word in its tip. So the fourth is asserted as
// "carries something", not as a string -- which is also what keeps this check honest the day the
// icon lands and the word goes away.
const COLUMNS = ['Before', 'After', '0.000', 'Rank'];

// The heading row and every field row of one list, as painted. Column 1 is the field's name and is
// a flex spacer, not a column of values, so only children 2..5 are read.
async function columns(a, listId) {
	return a.page.evaluate((id) => {
		const box = document.getElementById(id);
		if (!box) { return null; }
		const rows = [...box.children].map((row) => {
			const cells = [...row.children].slice(1).map((c) => {
				const r = c.getBoundingClientRect();
				return {
					tag: c.tagName.toLowerCase(), text: (c.textContent || '').trim(),
					// **BOOTSTRAP MOVES A TITLE IT HAS TAKEN OVER.** EngCalcs.initTips() hands every
					// .ec-help to Bootstrap, which empties `title` into `data-bs-original-title` --
					// so reading `title` alone says a tipped control has no tip.
					icon: !!c.querySelector('svg'),
					tip: c.getAttribute('title') || c.getAttribute('data-bs-original-title') ||
						c.getAttribute('aria-label') || '',
					left: +r.left.toFixed(2), width: +r.width.toFixed(2), mid: +(r.left + r.width / 2).toFixed(2)
				};
			});
			return { name: (row.children[0].textContent || '').trim(), cells };
		});
		return { head: rows[0], fields: rows.slice(1) };
	}, listId);
}

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		await a.dismissGallery();
		await a.makeEdit();
		// The Labels button opened a pull-down, then the Visibility panel (Task 427), and since Task
		// 441 it opens the Settings box on its Labels section. The columns being measured travelled
		// through all three moves unchanged, which is the point of measuring them here rather than
		// asserting a stylesheet rule.
		await a.toolbarClick('Labels');
		await a.settle(500);
		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_settings_box').style.display === 'flex' &&
			!!document.querySelector('#lpn_set_sec_map #lpn_labels_node_fields')),
			'the node labels open in the Settings box, under Map and page');

		for (const list of LISTS) {
			const got = await columns(a, list.id);
			report.ok(!!got && got.fields.length > 0, `${list.what}: the list has rows`,
				got && got.fields.map(f => f.name).join(', '));
			if (!got) { continue; }

			report.eq(got.head.cells.slice(0, 3).map(c => c.text).join('|'), COLUMNS.slice(0, 3).join('|'),
				`${list.what}: the first three headings, in the order the row lays its controls out`);
			// **THE PRIORITY HEADING SAYS "PRIORITY" SOMEWHERE.** Whether it draws the icon or falls
			// back to the word, the term of art has to be reachable, and for an icon the tip is the
			// only place it can be.
			const rank = got.head.cells[3];
			report.ok(rank.icon || rank.text.length > 0,
				`${list.what}: the priority column has a heading at all`, rank.text || 'icon');
			report.has(rank.tip.toLowerCase(), 'priorit',
				`${list.what}: ...and its tip carries the word "priority"`, rank.tip.slice(0, 40));
			report.ok(got.fields.every(f => f.cells.length === 4),
				`${list.what}: every field row reserves all four columns, used or not`,
				'a row that reserves only the columns it uses staggers every row beside it');

			// The measurement. Half a pixel is sub-pixel rounding; anything a reader could see is
			// several pixels, and the reported drift was 11 to 38.
			for (let i = 0; i < COLUMNS.length; i++) {
				const head = got.head.cells[i];
				const worst = got.fields.reduce((acc, f) => {
					const d = Math.abs(f.cells[i].mid - head.mid);
					return d > acc.d ? { d, row: f.name, mid: f.cells[i].mid } : acc;
				}, { d: 0, row: '', mid: head.mid });
				report.ok(worst.d < 0.75,
					`${list.what}: "${COLUMNS[i]}" sits over the control it names, on every row`,
					`worst is ${worst.d.toFixed(2)} px, on "${worst.row}"`);
				const wid = got.fields.reduce((acc, f) => Math.max(acc, Math.abs(f.cells[i].width - head.width)), 0);
				report.ok(wid < 0.75,
					`${list.what}: ...and is the same WIDTH as it, which is what stops the drift accumulating`,
					`heading ${head.width} px, worst control differs by ${wid.toFixed(2)} px`);
			}

			// **THE ID ROW**, which is where a column can be held open by nothing at all and drift
			// without any control looking wrong. It is checked by name, because "every row" above
			// would still pass if the ID row carried no columns.
			//
			// The two lists differ here on purpose and the difference is the point: a NODE's ID takes
			// no priority (the node's labels are ordered against each other as whole labels), while a
			// LINK's ID does (the rows inside one link label are ordered against each other). So a
			// node ID row reserves BOTH numeric columns with spacers and a link ID row only the first.
			const idRow = got.fields[0];
			const spacers = list.id.indexOf('node') >= 0 ? [2, 3] : [2];
			report.eq(idRow.name, 'ID', `${list.what}: the first row is the ID`);
			report.ok(spacers.every(k => idRow.cells[k].tag === 'span' && !idRow.cells[k].text),
				`${list.what}: it holds ${spacers.length === 2 ? 'Decimals and Priority' : 'Decimals'} open with a spacer`,
				'an ID is not a number, so it has no decimal places');
			report.ok(spacers.every(k => Math.abs(idRow.cells[k].mid - got.head.cells[k].mid) < 0.75),
				`${list.what}: and the spacer still lines up under its heading`,
				spacers.map(k => idRow.cells[k].mid).join(', '));
		}

		report.eq(a.errors.length, 0, 'no uncaught JavaScript', a.errors[0] || '');
	} finally {
		await a.close();
	}
};
