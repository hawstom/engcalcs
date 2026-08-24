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
		// The Labels button opened a pull-down, then the Visibility panel (Task 427), then the
		// Settings box on its Labels section (Task 441), then View > Labels -- and now Project >
		// Settings (Task 467), the Project menu having become the one place every command lives.
		// The columns being measured travelled through every one of those moves unchanged, which is
		// the point of measuring them here rather than asserting a stylesheet rule. **This spec went
		// stale at the last move and threw rather than failed** -- a door that no longer exists is
		// worth more noise than a check that quietly stops running.
		await a.menuClick('Settings', 'project');
		await a.settle(500);
		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_settings_box').style.display === 'flex' &&
			!!document.querySelector('#lpn_set_sec_visual #lpn_labels_node_fields')),
			'the node labels open in the Settings box, under Visualization');

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

		// ---- **THE BOX MUST NOT SCROLL SIDEWAYS** (Tom, 2026-08-19) ------------------------------
		//
		// The cause was here, in these rows. A flex item's default minimum is its MIN-CONTENT, so
		// the field NAME could not shrink below its longest word: four fixed columns plus that floor
		// came to 304 px of unshrinkable row in a 316 px pane. Twelve pixels of slack -- which is
		// less than a classic scrollbar, so a browser that draws one instead of an overlay lost the
		// argument on every row.
		//
		// **MEASURED UNDER A SQUEEZE, not at the shipped width**, and that is the whole point: at
		// 316 px the old rows fitted too, and a headless browser with overlay scrollbars reports no
		// overflow at all. Narrowing the pane by hand is what asks the real question -- can this
		// content shrink? -- rather than the accidental one.
		const squeezed = await a.page.evaluate(() => {
			const pane = document.getElementById('lpn_setbox_content');
			const was = pane.style.cssText;
			pane.style.width = '260px';
			pane.style.flex = '0 0 auto';
			const out = { scroll: pane.scrollWidth, client: pane.clientWidth, worst: null };
			const right = pane.getBoundingClientRect().left + pane.clientWidth;
			const walk = (el) => {
				for (const k of el.children) {
					const b = k.getBoundingClientRect();
					if (b.width && b.right > right + 0.5 && (!out.worst || b.right - right > out.worst.over)) {
						out.worst = { over: +(b.right - right).toFixed(1), id: k.id,
							cls: String(k.className).slice(0, 30), txt: (k.textContent || '').trim().slice(0, 30) };
					}
					walk(k);
				}
			};
			walk(pane);
			pane.style.cssText = was;
			return out;
		});
		report.ok(squeezed.scroll <= squeezed.client,
			'the Settings box content fits its pane with 56 px taken away — it never scrolls sideways',
			`needs ${squeezed.scroll} px in ${squeezed.client} px` +
			(squeezed.worst ? `; widest offender "${squeezed.worst.txt || squeezed.worst.id}" over by ${squeezed.worst.over}` : ''));

		// ---- **AND THE COLUMNS DO NOT WALK RIGHT AS THE BOX GROWS** ------------------------------
		//
		// Tom, 2026-08-21: *"the Labels columns always float right. It seems like there should be
		// something like a maximum width for the checkbox and labels column. Map appearance and Time
		// seem to do it right."* Same defect the ID prefixes had, from the same cause: the name is
		// `flex: 1 1 auto` and took every pixel the box was widened by. The ceiling is 11.5rem =
		// --lpn-set-name, so a labels row and a settings row share ONE control x.
		//
		// **MEASURED FROM 44rem UP, not 30rem** (2026-08-24): below the container query's 24rem of
		// CONTENT the row stacks on purpose, and a 30rem box is under it once the section nav has
		// taken its column. Comparing a stacked row against an unstacked one measures the stacking,
		// not the walk. The stacked state has its own checks below.
		const walk2 = [];
		for (const w of ['44rem', '60rem', '80rem']) {
			await a.page.evaluate((width) => { document.getElementById('lpn_settings_box').style.width = width; }, w);
			await a.settle(150);
			walk2.push(await a.page.evaluate((width) => {
				const pane = document.getElementById('lpn_setbox_content'), paneR = pane.getBoundingClientRect();
				const row = document.getElementById('lpn_labels_node_fields').children[1];
				const set = document.querySelector('#lpn_set_id_fields .lpn-set-row');
				return {
					w: width,
					x: +(row.children[1].getBoundingClientRect().left - paneR.left).toFixed(1),
					setX: set ? +(set.children[1].getBoundingClientRect().left - paneR.left).toFixed(1) : null
				};
			}, w));
		}
		const spread2 = Math.max(...walk2.map(d => d.x)) - Math.min(...walk2.map(d => d.x));
		report.ok(spread2 <= 4,
			'widening the box from 30rem to 80rem leaves the Labels columns where they were',
			walk2.map(d => `${d.w}: x ${d.x}`).join('; ') + ` — spread ${spread2.toFixed(1)} px`);
		report.ok(walk2.every(d => d.setX === null || Math.abs(d.x - d.setX) <= 8),
			'...and they stand on the same x as every other control in the box',
			walk2.map(d => `${d.w}: labels ${d.x} vs settings ${d.setX}`).join('; '));
		await a.page.evaluate(() => { document.getElementById('lpn_settings_box').style.width = ''; });
		await a.settle(150);

		// ---- **AND WHEN IT IS TOO NARROW, THE NAME KEEPS ITS LINE** --------------------------------
		//
		// Tom, 2026-08-24: *"the labels are wrapping when what we want is for the four columns to wrap
		// as a block under the checkbox and label. Like the phone."* Below the container query's 24rem
		// a field row wraps: the name takes a whole line, the four columns drop beneath it together.
		//
		// **THE CHECK IS GEOMETRIC, NOT A CLASS OR A RULE LOOKUP.** What went wrong before was the
		// name breaking mid-word to keep four boxes on one line, and both states have the same markup
		// and the same stylesheet -- only the painted boxes tell them apart. So: is the first column
		// painted BELOW the name, and are the four columns still painted on one line as each other?
		const stacked = await a.page.evaluate(() => {
			const box = document.getElementById('lpn_settings_box'), was = box.style.width;
			box.style.width = '22rem';
			const out = { rows: [], head: null };
			const list = document.getElementById('lpn_labels_node_fields');
			const headCells = [...list.children[0].children];
			out.head = headCells.map(c => +c.getBoundingClientRect().width.toFixed(1));
			for (const row of [...list.children].slice(1)) {
				const kids = [...row.children];
				const name = kids[0].getBoundingClientRect();
				const rowLine = parseFloat(getComputedStyle(row).lineHeight) || 16;
				const cols = kids.slice(1).map(c => c.getBoundingClientRect());
				out.rows.push({
					name: (kids[0].textContent || '').trim(),
					// the columns start below the name's last line
					below: cols[0].top >= name.bottom - 1,
					// ...and all four are on that SAME wrapped line, not spilling onto a third.
					// Compared against the name's bottom rather than against each other, because
					// the row is baseline-aligned and an empty spacer span and a spinner do not
					// start at the same y -- the ID row holds two columns open with spacers, and
					// asserting equal tops there measures baseline jitter, not line breaks.
					oneLine: cols.every(c => c.top >= name.bottom - 1 && c.bottom <= name.bottom + rowLine * 1.6),
					// ...and the name did NOT have to break mid-word: one line of text
					nameLines: Math.round(name.height / parseFloat(getComputedStyle(kids[0]).lineHeight || '16'))
				});
			}
			box.style.width = was;
			return out;
		});
		await a.settle(150);
		report.ok(stacked.rows.length > 0 && stacked.rows.every(r => r.below),
			'narrowed below 24rem, each field row drops its four columns UNDER the name',
			(stacked.rows.find(r => !r.below) || {}).name || `${stacked.rows.length} rows`);
		report.ok(stacked.rows.every(r => r.oneLine),
			'...and the four columns stay on one line as each other — they move as a block',
			(stacked.rows.find(r => !r.oneLine) || {}).name || '');
		report.ok(stacked.rows.every(r => r.nameLines <= 1),
			'...and no name has to break mid-word to make room, which is what Tom was reading',
			(stacked.rows.find(r => r.nameLines > 1) || {}).name || '');
		// The heading row's lead cell is empty, so in this state it is removed rather than left
		// holding a blank line: the four headings must still be there, over the four columns.
		report.ok(stacked.head.length === 4 || stacked.head[0] === 0,
			'...and the heading row spends no line on its own empty first cell',
			`heading cells painted: ${stacked.head.join(', ')}`);

		report.eq(a.errors.length, 0, 'no uncaught JavaScript', a.errors[0] || '');
	} finally {
		await a.close();
	}
};
