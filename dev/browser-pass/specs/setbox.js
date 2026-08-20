// §30 — the Settings box is ONE design, and it is measured (ROADMAP Task 441 follow-ups).
//
// Tom, 2026-08-19, after using the box: *"the units labels are not uniform with the rest of the box.
// I like them ... but everything needs to be uniformly designed. Audit all and apply uniform
// styling"*, *"Some inputs are gratuitously wide"*, *"the labels checkboxes need to stay vertically
// aligned with their other inputs even if their label wraps below them"*, and *"we may ship the box
// too narrow, and the width does not reduce gracefully."*
//
// **UNIFORMITY IS A NUMBER, NOT AN OPINION**, which is the whole reason this spec exists rather than
// a rule in a comment. Three of the four complaints are a coordinate:
//   * every control starts at the same x  -- the control column;
//   * a number box is one width everywhere -- Chrome sizes an `input[type=number]` from its own
//     min/max, so the shipped box had 144 px, 78 px and 62 px boxes for three-or-fewer digits and
//     nothing in the source said so;
//   * a control sits on the FIRST line of a name that wrapped -- centre alignment dropped it half a
//     line, which is what "checkbox even with inputs" is about.
// and the fourth is a comparison of two computed styles rather than of two stylesheet rules.
// None of them is reachable without a real browser: they are `rem`, Reboot, flex and the browser's
// own intrinsic sizing resolved against each other. Same lesson as Task 435.

const { Session } = require('../lib/session');

exports.title = '30. The Settings box, one design';

// A number box holds a pixel size, an opacity, a tolerance or `24:00`. 5rem is the ceiling that
// leaves; --lpn-set-num is 4.5rem, so a box that has quietly gone back to sizing itself off its own
// max attribute (144 px) fails here. THE ONE EXEMPTION IS A BOX WITH A PLACEHOLDER, because a
// placeholder is a sentence rather than a number and needs the room to be read. Exempted by the
// placeholder itself rather than by name, so any such box inherits the reason instead of the
// exception. (The box that earned it -- the Label view width one, whose placeholder carried the
// blank-means-always-show rule -- was removed with the zoom threshold on 2026-08-19.)
const NUM_MAX = 80;

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		await a.dismissGallery();
		await a.makeEdit();
		await a.menuClick('Labels', 'view');
		await a.settle(500);

		// ---- THE CONTROL COLUMN --------------------------------------------------------------
		// Read at whatever width the box currently has, so the same measurement can be taken again
		// under a squeeze -- see the wrapped-name pass below.
		const measure = () => a.page.evaluate(() => {
			const rows = [...document.querySelectorAll('#lpn_setbox_content .lpn-set-row')];
			const read = (r) => {
				const first = r.children[0], ctl = r.children[1];
				const fr = first.getBoundingClientRect(), cr = ctl.getBoundingClientRect();
				// The inner box of a control that is a box plus a button ("Apply to all", "Use
				// current view"): the column is about where the BOX starts, not the wrapper.
				const inner = ctl.tagName === 'SPAN' ? ctl.querySelector('input') : ctl;
				const ir = inner.getBoundingClientRect();
				// The name's own line height, READ rather than assumed: the box's names are .85em
				// since Tom's audit, so a hard-coded 24 px would count every row as one line and the
				// wrapped-name check would quietly measure nothing.
				const lh = parseFloat(getComputedStyle(first).lineHeight) || 24;
				return {
					sec: (r.closest('section') || {}).id || '',
					name: (first.textContent || '').trim().slice(0, 30),
					kind: inner.tagName.toLowerCase() + (inner.type ? ':' + inner.type : ''),
					numberish: inner.type === 'number' || (inner.classList && inner.classList.contains('lpn-set-num')),
					placeholder: !!inner.placeholder,
					left: +ir.left.toFixed(1), width: +ir.width.toFixed(1),
					// Where the control's middle sits against the middle of the name's FIRST line.
					// A name that wrapped has height 48 at a 24 px line, and it is exactly those rows
					// that used to drag their control down.
					lines: Math.round(fr.height / lh),
					offFirstLine: +((ir.top + ir.height / 2) - (fr.top + lh / 2)).toFixed(1)
				};
			};
			return { box: document.getElementById('lpn_settings_box').getBoundingClientRect().width,
				pane: document.getElementById('lpn_setbox_content').clientWidth, rows: rows.map(read) };
		});
		const seen = await measure();

		report.ok(seen.rows.length > 30, 'the box is built and full of setting rows', seen.rows.length + ' rows');
		// **THE SHIPPED WIDTH.** 29rem -> 34rem: at 29 the content pane was 316 px and the labels
		// lists spend 186 of it on four fixed columns.
		report.ok(seen.box >= 540 && seen.pane >= 390,
			'the box ships wide enough to read a name in — 34rem, 396 px of content pane',
			`box ${seen.box} px, pane ${seen.pane} px`);

		const lefts = [...new Set(seen.rows.map(r => r.left))];
		report.ok(lefts.length === 1,
			'EVERY control in the box starts at the same x — one column, checkbox and select alike',
			lefts.length === 1 ? `x = ${lefts[0]}` : `${lefts.length} different x: ${lefts.sort((p, q) => p - q).join(', ')}`);

		const wide = seen.rows.filter(r => r.numberish && !r.placeholder && r.width > NUM_MAX);
		report.ok(wide.length === 0,
			'no number box is wider than the numbers it holds',
			wide.length ? wide.map(r => `${r.name} ${r.width}px`).join('; ')
				: `${seen.rows.filter(r => r.numberish).length} number boxes, all ≤ ${NUM_MAX} px`);
		// Tom named four sections; every one of them must actually contain a number box, or the
		// check above passes by measuring nothing.
		for (const [what, key] of [['Map appearance', 'lpn_set_sec_map'], ['New elements', 'lpn_set_sec_elements'],
			['Time and convergence', 'lpn_set_sec_calc']]) {
			const n = seen.rows.filter(r => r.sec === key && r.numberish);
			report.ok(n.length > 0, `${what}: its number boxes are in the measurement`,
				n.map(r => r.width).join(', ') + ' px');
		}
		const numW = [...new Set(seen.rows.filter(r => r.numberish && !r.placeholder).map(r => r.width))];
		report.ok(numW.length === 1,
			'...and they are ONE width, not one per browser guess at the max attribute',
			numW.join(' / ') + ' px');

		// ---- THE FIRST LINE (Tom: "checkbox even with inputs") --------------------------------
		//
		// **MEASURED UNDER A SQUEEZE, and that is the point.** At the shipped 34rem no name wraps at
		// all, so measuring only there would assert nothing about the case Tom reported -- the same
		// trap labelcols.js names. 27rem is the narrowest the box gets while the rows still have two
		// columns (below ~26rem the container query stacks them, which is a different layout).
		const at = async (w) => {
			await a.page.evaluate((width) => { document.getElementById('lpn_settings_box').style.width = width; }, w);
			await a.settle(200);
			return measure();
		};
		const squeezed = await at('27rem');
		const wrapped = squeezed.rows.filter(r => r.lines > 1);
		report.ok(wrapped.length > 2, 'squeezed to 27rem, several names really do wrap to a second line',
			`pane ${squeezed.pane} px: ` + wrapped.map(r => r.name).join('; '));
		for (const set of [{ what: 'at the shipped width', d: seen }, { what: 'and squeezed to 27rem', d: squeezed }]) {
			const worst = set.d.rows.reduce((acc, r) => Math.abs(r.offFirstLine) > Math.abs(acc.offFirstLine) ? r : acc, set.d.rows[0]);
			report.ok(Math.abs(worst.offFirstLine) < 3,
				`every control sits on the FIRST line of its name — ${set.what}`,
				`worst is ${worst.offFirstLine} px on "${worst.name}" (${worst.lines} lines)`);
		}
		const lefts2 = [...new Set(squeezed.rows.map(r => r.left))];
		report.ok(lefts2.length === 1, '...and the control column survives the squeeze',
			lefts2.length === 1 ? `x = ${lefts2[0]}` : lefts2.join(', '));

		// ---- THE LABELS LISTS, which are the rows Tom was looking at --------------------------
		const lab = await a.page.evaluate(() => {
			const out = [];
			for (const id of ['lpn_labels_node_fields', 'lpn_labels_link_fields']) {
				[...document.getElementById(id).children].slice(1).forEach((r) => {
					const nameCell = r.children[0], cb = nameCell.querySelector('input[type="checkbox"]');
					const nr = nameCell.getBoundingClientRect(), cr = cb.getBoundingClientRect();
					const first = r.children[1].getBoundingClientRect();
					const lh = parseFloat(getComputedStyle(nameCell).lineHeight) || 24;
					out.push({ list: id.indexOf('node') >= 0 ? 'node' : 'link',
						name: (nameCell.textContent || '').trim().slice(0, 24),
						lines: Math.round(nr.height / lh),
						cbLeft: +cr.left.toFixed(1),
						// The checkbox against the boxes on its own row, and both against the first
						// line of the name.
						cbVsBox: +((cr.top + cr.height / 2) - (first.top + first.height / 2)).toFixed(1),
						boxVsLine: +((first.top + first.height / 2) - (nr.top + lh / 2)).toFixed(1) });
				});
			}
			return out;
		});
		const wrap2 = lab.filter(r => r.lines > 1);
		report.ok(wrap2.length > 0, 'a labels row with a name long enough to wrap is on screen (still at 27rem)',
			wrap2.map(r => r.name).join('; '));
		const badBox = lab.reduce((acc, r) => Math.abs(r.cbVsBox) > Math.abs(acc.cbVsBox) ? r : acc, lab[0]);
		report.ok(Math.abs(badBox.cbVsBox) < 3,
			'a labels checkbox is even with the boxes on its row',
			`worst is ${badBox.cbVsBox} px on "${badBox.name}"`);
		const badLine = wrap2.reduce((acc, r) => Math.abs(r.boxVsLine) > Math.abs(acc.boxVsLine) ? r : acc, wrap2[0]);
		report.ok(Math.abs(badLine.boxVsLine) < 3,
			'...and a name that wrapped does not drag either of them below its first line',
			`worst is ${badLine.boxVsLine} px on "${badLine.name}"`);
		report.ok(new Set(lab.map(r => r.cbLeft)).size === 1, 'and every checkbox in a list shares one x',
			[...new Set(lab.map(r => r.cbLeft))].join(', '));

		// ---- ONE TYPE SCALE (Tom: "the units labels are not uniform with the rest of the box") ----
		//
		// **THE UNITS STRIP IS THE REFERENCE, NOT THE ODD ONE OUT.** Tom, 2026-08-18: "I like the
		// styling of the Input units section"; 2026-08-19: "I like them (and I think they are great
		// for saving width), but everything needs to be uniformly designed." So the strip's field
		// names keep .85em at .8 opacity and every OTHER name in the box was pulled to match --
		// setting rows and labels-list rows alike, which were the only text naming a control that
		// did not wear it. Asserted as a comparison, never as a number: the claim is that they
		// agree, not that either is 13.6 px.
		const type = await a.page.evaluate(() => {
			const px = (el) => el ? parseFloat(getComputedStyle(el).fontSize) : 0;
			const op = (el) => el ? +getComputedStyle(el).opacity : 0;
			const rowName = document.querySelector('#lpn_setbox_content .lpn-set-row > :first-child');
			const listName = document.querySelector('#lpn_labels_link_fields .lpn-set-name');
			const unitName = document.querySelector('#lpn_set_units_fields .lpn-units-name');
			const note = document.querySelector('#lpn_setbox_content .lpn-set-note');
			const sel = [...document.querySelectorAll('#lpn_set_units_fields .lpn-units-item > select')]
				.map(s => +s.getBoundingClientRect().width.toFixed(1));
			return { row: px(rowName), unit: px(unitName), note: px(note), list: px(listName),
				rowOp: op(rowName), unitOp: op(unitName), noteOp: op(note), listOp: op(listName),
				sub: px(document.querySelector('#lpn_setbox_content .lpn-set-sub')),
				widest: Math.max(...sel), sels: sel.length };
		});
		report.ok(type.unit > 0 && type.row === type.unit && type.rowOp === type.unitOp,
			'a setting row\'s name is drawn exactly like a unit selector\'s name — the treatment Tom named',
			`row ${type.row}px @${type.rowOp}, unit ${type.unit}px @${type.unitOp}`);
		report.ok(type.list === type.unit && type.listOp === type.unitOp,
			'...and so is a field name in the labels lists',
			`list ${type.list}px @${type.listOp}`);
		report.ok(type.note === type.unit && type.sub > type.unit,
			'...while a sub-heading still stands above all of them',
			`note ${type.note}px, sub ${type.sub}px`);
		report.ok(type.sels >= 10 && type.widest <= 144.5,
			'the unit selects respect the same 9rem control width as every select in the box',
			`${type.sels} selects, widest ${type.widest} px`);

		// ---- THE CREDITS ARE THE FOOTER (Tom: "It's a bit long for this place") ---------------
		const cred = await a.page.evaluate(() => {
			const c = document.getElementById('lpn_set_ramp_credits'),
				page = document.getElementById('lpn_set_sub_page'),
				content = document.getElementById('lpn_setbox_content');
			return c ? {
				text: c.textContent.trim(),
				parent: c.parentNode.id,
				last: content.lastElementChild === c,
				belowPage: c.getBoundingClientRect().top > page.getBoundingClientRect().top,
				inSection: !!c.closest('.lpn-set-sec')
			} : null;
		});
		report.ok(!!cred && cred.last && cred.parent === 'lpn_setbox_content',
			'the colour-scheme acknowledgement is the LAST thing in the content pane, not a row above Page',
			cred && `${cred.parent}, last=${cred.last}`);
		report.ok(!!cred && !cred.inSection && cred.belowPage,
			'...below every section, so nothing has to be read past it — and outside what the search hides',
			cred && cred.text.slice(0, 60));
		report.has(cred && cred.text, 'Cynthia Brewer',
			'...and it is still the verbatim acknowledgement the licence requires');

		await a.page.evaluate(() => { document.getElementById('lpn_settings_box').style.width = ''; });
		await a.settle(200);

		// ---- IT REDUCES GRACEFULLY (Tom: "the width does not reduce gracefully") --------------
		//
		// Dragged to the stylesheet's own floor, which is the narrowest a user can make it. Two
		// questions, and they are different: does anything spill sideways, and do the rows give up
		// their second column rather than squeezing the name to nothing?
		const narrow = await a.page.evaluate(() => {
			const box = document.getElementById('lpn_settings_box'),
				pane = document.getElementById('lpn_setbox_content');
			const was = box.style.width;
			box.style.width = '25rem';
			const rows = [...pane.querySelectorAll('.lpn-set-row')].map((r) => {
				const f = r.children[0].getBoundingClientRect(), c = r.children[1].getBoundingClientRect();
				return { stacked: c.top > f.top + 4, nameW: +f.width.toFixed(1) };
			});
			const out = {
				pane: pane.clientWidth, scroll: pane.scrollWidth,
				stacked: rows.filter(r => r.stacked).length, rows: rows.length,
				narrowestName: Math.min(...rows.map(r => r.nameW))
			};
			box.style.width = was;
			return out;
		});
		report.ok(narrow.scroll <= narrow.pane + 0.5,
			'at the box\'s narrowest the content still never scrolls sideways',
			`needs ${narrow.scroll} px in ${narrow.pane} px`);
		report.ok(narrow.stacked === narrow.rows,
			'and every setting row has STACKED — name, then its control under it',
			`${narrow.stacked} of ${narrow.rows}, narrowest name column ${narrow.narrowestName} px`);

		report.eq(a.errors.length, 0, 'no uncaught JavaScript', a.errors[0] || '');
	} finally {
		await a.close();
	}
};
