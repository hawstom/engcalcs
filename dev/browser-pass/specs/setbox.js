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
//
// **THE SECOND EXEMPTION IS THE COLOUR BAND BOUNDARIES, AND IT IS A FLOOR RATHER THAN A CEILING**
// (Tom, 2026-08-20: "They are too wide. They could be about half as wide"). Those boxes are not a
// column of settings at all -- they are the numbers on a legend, stacked beside the colours they
// separate -- so they are measured on their own terms below, at half the width, and are read out of
// .lpn-color-breaks rather than out of a .lpn-set-row.
const NUM_MAX = 80;
// **--lpn-set-numsm, WHICH IS 3.125rem = 50 px, NOT HALF OF --lpn-set-num** (Task 511). Tom's
// 2026-08-20 "they could be about half as wide" took it to 2.5rem; his 2026-08-21 re-read widened it
// 25% again, because half was a shade too tight for a five-digit head in metres (commit 0df11c95).
// The claim that survives a re-tune is the COMPARISON — a boundary box is materially narrower than a
// setting's own number box — so that is what is asserted, with the current token as the ceiling.
const BAND_BOX_MAX = 52;

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		await a.dismissGallery();
		await a.makeEdit();
		// **OPENED ON THE TOOLBAR BUTTON.** This used to be View > Labels, a row Tom removed on
		// 2026-08-21 — the box is reached from its own gear, from Project > Settings and from a click
		// on the colour key, and a third menu door to a button that is always on the strip was one
		// too many. The stale row THREW out of menuClick(), which took this whole spec and the five
		// after it out of the pass (Task 511); nothing below cares which section is showing, only
		// that the box is open and laid out.
		await a.toolbarClick('Settings');
		await a.settle(300);
		// ...and jumped to the Labels section through the box's OWN INDEX, which is the door that
		// replaced the menu row. The labels rows are what several checks below measure.
		await a.page.evaluate(() => {
			const row = [...document.querySelectorAll('#lpn_setbox_index button')]
				.find(b => /^\s*labels\s*$/i.test(b.textContent));
			if (row) { row.click(); }
		});
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
		// **MEASURED UNDER A SQUEEZE, and that is the point.** Measuring only at the shipped width
		// would assert nothing about the case Tom reported -- the same trap labelcols.js names.
		//
		// **THE SQUEEZE IS 33rem, NOT 27rem** (Task 511). The container query that stacks the two
		// columns is on `.lpn-setbox-content` at 24rem = 384 px, and the content pane is NOT the box:
		// the box carries the index pane beside it, so the pane runs ~134 px narrower than the box.
		// 27rem of box is 298 px of pane, well past the stack, and every check below was quietly
		// measuring a ONE-column layout -- reporting no wrapped names at all and a control 31 px
		// "below its first line" when the control was simply on the next row, which is what stacking
		// means. Measured across the range: 33rem -> 394 px pane, two columns, ten names wrapped;
		// 32rem -> 378 px, stacked. So 33rem is the narrowest two-column width, and the pane is
		// asserted rather than assumed so this cannot silently slide across the threshold again.
		const STACK_PX = 384;   // the @container lpnset (max-width: 24rem) rule, in pixels
		const at = async (w) => {
			await a.page.evaluate((width) => { document.getElementById('lpn_settings_box').style.width = width; }, w);
			await a.settle(200);
			return measure();
		};
		const squeezed = await at('33rem');
		report.ok(squeezed.pane > STACK_PX,
			'squeezed to 33rem, the rows still have their two columns — below this the layout stacks',
			`pane ${squeezed.pane} px against the ${STACK_PX} px container query`);
		const wrapped = squeezed.rows.filter(r => r.lines > 1);
		report.ok(wrapped.length > 2, 'and several names really do wrap to a second line',
			`pane ${squeezed.pane} px: ` + wrapped.map(r => r.name).join('; '));
		for (const set of [{ what: 'at the shipped width', d: seen }, { what: 'and squeezed to 33rem', d: squeezed }]) {
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
		// **NO LABELS-LIST NAME WRAPS ANY MORE, at any width that keeps two columns** (Task 511).
		// These are field names -- ID, Head, Flow, Roughness C -- and the widest of them measures
		// 165 px in a 184 px cell at the 33rem squeeze; below that the list stacks and the name gets
		// the whole pane, so it cannot wrap there either. The setting rows above still wrap ten
		// names, so the first-line rule IS exercised; it is only this list that has nothing long
		// enough left in it.
		//
		// **SKIPPED, NOT ASSERTED AWAY.** This check used to reduce() over the wrapped rows and
		// therefore THREW on an empty list, which took the whole spec down. A condition this
		// environment cannot produce is what report.skip() is for; if a long field name is ever
		// added the assertion comes back by itself.
		const wrap2 = lab.filter(r => r.lines > 1);
		const badBox = lab.reduce((acc, r) => Math.abs(r.cbVsBox) > Math.abs(acc.cbVsBox) ? r : acc, lab[0]);
		report.ok(Math.abs(badBox.cbVsBox) < 3,
			'a labels checkbox is even with the boxes on its row',
			`worst is ${badBox.cbVsBox} px on "${badBox.name}"`);
		if (wrap2.length) {
			const badLine = wrap2.reduce((acc, r) => Math.abs(r.boxVsLine) > Math.abs(acc.boxVsLine) ? r : acc, wrap2[0]);
			report.ok(Math.abs(badLine.boxVsLine) < 3,
				'...and a name that wrapped does not drag either of them below its first line',
				`worst is ${badLine.boxVsLine} px on "${badLine.name}"`);
		} else {
			report.skip('...and a name that wrapped does not drag either of them below its first line',
				'no field name in either labels list is long enough to wrap at a two-column width');
		}
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
		// The count is a FLOOR, and it is there so an empty query cannot pass this check by
		// measuring nothing. It was 10 while the strip carried an input set and a result set;
		// Task 522 merged them into one set of eight, so eight is what a full strip now holds.
		// Left as a floor rather than pinned at 8 because roughness is conditional on the head
		// loss method, and specs/units.js is where the exact membership is asserted.
		report.ok(type.sels >= 8 && type.widest <= 144.5,
			'the unit selects respect the same 9rem control width as every select in the box',
			`${type.sels} selects, widest ${type.widest} px`);

		await a.page.evaluate(() => { document.getElementById('lpn_settings_box').style.width = ''; });
		await a.settle(200);

		// ---- THE COLOUR BAND BOUNDARIES ARE A LEGEND, NOT A ROW OF BOXES ----------------------
		//
		// Tom, 2026-08-20: *"Color band boundaries inputs: They are too wide. They could be about
		// half as wide. But the real problem is that they are not fitting in the width of the box,
		// and we should make them vertical, one row for each color."*
		//
		// Laid out left to right they overflowed the pane at every width the box ships at, and the
		// reader had to count boxes to learn which colour a number commanded. The claim now is
		// geometric and is measured as geometry: n colours, n-1 boxes, ONE column, the swatches
		// TOUCHING so the first column is a continuous ramp, and each box centred on the join
		// between the two bands it separates. Nothing here is checkable without a real layout --
		// the straddle is a transform resolved against a grid row's own height.
		await a.page.evaluate(() => {
			const s = document.getElementById('lpn_set_color_node');
			s.value = 'pressure'; s.dispatchEvent(new Event('change', { bubbles: true }));
		});
		await a.settle(400);
		const bands = await a.page.evaluate(() => {
			const g = document.querySelector('#lpn_set_colors_node .lpn-color-breaks');
			if (!g) { return null; }
			const kids = [...g.children];
			const sw = kids.filter(k => k.classList.contains('lpn-color-swatch')).map(k => k.getBoundingClientRect());
			const bx = kids.filter(k => k.tagName === 'INPUT').map(k => k.getBoundingClientRect());
			const pane = document.getElementById('lpn_setbox_content');
			return {
				swatches: sw.length, boxes: bx.length,
				columns: new Set(bx.map(r => +r.left.toFixed(1))).size,
				// A row per colour means every box is on its own line: no two share a top.
				lines: new Set(bx.map(r => +r.top.toFixed(1))).size,
				joins: sw.slice(1).map((r, i) => +(r.top - sw[i].bottom).toFixed(2)),
				straddle: bx.map((r, i) => +((r.top + r.height / 2) - sw[i].bottom).toFixed(1)),
				boxW: bx.length ? +bx[0].width.toFixed(1) : 0,
				widest: +g.getBoundingClientRect().width.toFixed(1),
				pane: pane.clientWidth, scroll: pane.scrollWidth
			};
		});
		report.ok(!!bands && bands.swatches >= 4, 'a coloured field puts its band legend on screen',
			bands && `${bands.swatches} colours, ${bands.boxes} boundaries`);
		report.eq(bands && bands.boxes, bands && bands.swatches - 1,
			'there is one fewer boundary than there are colours, and the legend shows both');
		report.ok(bands && bands.columns === 1 && bands.lines === bands.boxes,
			'VERTICAL — one row per colour, every box on its own line at one x',
			bands && `${bands.columns} x, ${bands.lines} lines for ${bands.boxes} boxes`);
		report.ok(bands && bands.joins.every(g => Math.abs(g) < 0.5),
			'...and the swatches touch, so the column reads as one continuous ramp',
			bands && `gaps ${bands.joins.join(', ')} px`);
		report.ok(bands && bands.straddle.every(d => Math.abs(d) < 1.5),
			'...with each box centred on the JOIN between the two bands it separates — nothing to count out',
			bands && bands.straddle.map(d => d + ' px').join(', '));
		report.ok(bands && bands.boxW <= BAND_BOX_MAX && bands.boxW < numW[0] * 0.8,
			'a boundary box is materially narrower than a setting box — Tom: "about half as wide"',
			bands && `${bands.boxW} px against ${numW[0]} px for a setting's own number box`);
		report.ok(bands && bands.widest < bands.pane && bands.scroll <= bands.pane + 0.5,
			'...and the whole legend fits the pane it is in, which is what it did not do',
			bands && `${bands.widest} px in ${bands.pane} px, scrollWidth ${bands.scroll}`);

		// ---- THE CONTROL COLUMN DOES NOT WALK RIGHT AS THE BOX GROWS -------------------------
		//
		// Tom, 2026-08-20, reporting it for the third time: *"ID prefixes: The inputs and buttons
		// are still floating right and wrapping paradoxically when the box is wide."*
		//
		// **MEASURED BEFORE IT WAS TOUCHED, because two guesses had already failed.** The name track
		// was `1fr` and the control track a fixed 9 rem, so every pixel the box was widened by went
		// to the NAME: 238 px of name at 34 rem and 974 px at 80 rem, dragging the control column
		// from x=1242 to x=1563 -- hard against the right edge -- while its own track never grew, so
		// "Apply to all" went on wrapping under its box at every width. That is the paradox, and it
		// is a right-edge rule (`1fr`) rather than anything in the row's own markup; moving the pair
		// into .lpn-set-ctlgroup, the previous attempt, could not have fixed it.
		//
		// So the assertion is the one Tom's sentence makes: WIDENING THE BOX DOES NOT MOVE THE
		// CONTROLS, and a box-plus-button is on one line at every width the box ships at or above.
		const drift = [];
		for (const w of ['34rem', '44rem', '80rem']) {
			await a.page.evaluate((width) => { document.getElementById('lpn_settings_box').style.width = width; }, w);
			await a.settle(200);
			drift.push(await a.page.evaluate((width) => {
				const pane = document.getElementById('lpn_setbox_content'), paneR = pane.getBoundingClientRect();
				const r = document.querySelector('#lpn_set_id_fields .lpn-set-row');
				const ctl = r.children[1], inp = ctl.querySelector('input'), btn = ctl.querySelector('button');
				const ir = inp.getBoundingClientRect(), br = btn.getBoundingClientRect();
				return {
					w: width, pane: pane.clientWidth,
					// Measured from the PANE's left edge, which is the only x that means anything
					// when the box itself is being moved and resized.
					x: +(ctl.getBoundingClientRect().left - paneR.left).toFixed(1),
					wrapped: br.top > ir.top + 2,
					lefts: new Set([...pane.querySelectorAll('.lpn-set-row')]
						.map(row => +row.children[1].getBoundingClientRect().left.toFixed(1))).size
				};
			}, w));
		}
		const spread = Math.max(...drift.map(d => d.x)) - Math.min(...drift.map(d => d.x));
		report.ok(spread <= 4,
			'widening the box from 34rem to 80rem leaves the control column where it was — it was 321 px of drift',
			drift.map(d => `${d.w}: pane ${d.pane}, x ${d.x}`).join('; ') + ` — spread ${spread.toFixed(1)} px`);
		report.ok(drift.every(d => !d.wrapped),
			'...and a box PLUS A BUTTON is on one line at every one of those widths',
			drift.map(d => `${d.w} ${d.wrapped ? 'wrapped' : 'one line'}`).join(', '));
		report.ok(drift.every(d => d.lefts === 1),
			'...with the one control column intact at the widest of them',
			drift.map(d => `${d.w}: ${d.lefts}`).join(', '));
		// ---- AND IT DOES NOT WRAP IN THE MIDDLE EITHER -------------------------------------
		//
		// Tom, 2026-08-20, the FOURTH report: *"At certain middle widths -- yes, paradoxically this
		// doesn't happen at the narrowest, and it doesn't happen at the widest -- the buttons wrap
		// under the inputs."* The sweep above starts at the shipped 34rem, so the band that was
		// actually broken -- 17 to 23rem, where the row kept two columns but shrank the control
		// column to 9rem while the pair needs about 190px -- was never measured. THIS is the check
		// that would have caught all four reports: at EVERY width, a box plus a button is on one
		// line. Not "at the widths we ship at".
		const sweep = [];
		for (const w of ['20rem', '22rem', '24rem', '26rem', '28rem', '30rem', '34rem', '40rem', '50rem', '64rem', '80rem']) {
			await a.page.evaluate((width) => { document.getElementById('lpn_settings_box').style.width = width; }, w);
			await a.settle(120);
			sweep.push(await a.page.evaluate((width) => {
				const r = document.querySelector('#lpn_set_id_fields .lpn-set-row');
				const ctl = r.children[1], inp = ctl.querySelector('input'), btn = ctl.querySelector('button');
				const ir = inp.getBoundingClientRect(), br = btn.getBoundingClientRect();
				return {
					w: width, wrapped: br.top > ir.top + 2,
					// Stacked means the control sits under its name rather than beside it -- the
					// legitimate narrow layout, and a different thing from the button wrapping.
					stacked: ctl.getBoundingClientRect().top > r.children[0].getBoundingClientRect().top + 2
				};
			}, w));
		}
		const bad = sweep.filter(d => d.wrapped);
		report.ok(bad.length === 0,
			'"Apply to all" stays beside its box at EVERY width from 20rem to 80rem, not just the shipped ones',
			bad.length ? bad.map(d => d.w).join(', ') + ' wrapped' : sweep.map(d => d.w + (d.stacked ? ' stacked' : '')).join(', '));
		report.ok(sweep.some(d => d.stacked) && sweep.some(d => !d.stacked),
			'...and the sweep really does cross the stacking breakpoint, so both layouts were measured',
			sweep.map(d => `${d.w}:${d.stacked ? 'stacked' : 'two-column'}`).join(', '));
		await a.page.evaluate(() => { document.getElementById('lpn_settings_box').style.width = ''; });
		await a.settle(200);

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

		// ---- ...AND IT IS REACHABLE FROM THE PICKER IT IS ABOUT -------------------------------
		//
		// Tom, 2026-08-20: *"Were we going to put a Credits link near the color pickers? Maybe under
		// the Color scheme label?"* A POINTER, never a second copy: Apache-2.0 clause 2 fixes the
		// wording, so the count of copies is itself an assertion here -- a "credits near the picker"
		// implemented by printing the sentence again would pass a weaker check and be wrong. The
		// label costs no new string: it is the suite's own About label, already translated
		// everywhere, and reused per CLAUDE.md's concept-level rule.
		const ptr = await a.page.evaluate(() => {
			const links = [...document.querySelectorAll('#lpn_setbox_content .lpn-set-creditlink a')];
			const ramp = document.getElementById('lpn_set_ramp_node');
			const first = links[0], fr = first && first.getBoundingClientRect(),
				rr = ramp && ramp.getBoundingClientRect();
			return {
				n: links.length, text: first ? first.textContent.trim() : '',
				href: first ? first.getAttribute('href') : '',
				// How far under the picker it sits: "near the color pickers" is a distance.
				gap: (fr && rr) ? +(fr.top - rr.bottom).toFixed(1) : null,
				copies: (document.getElementById('lpn_setbox_content').textContent.match(/Cynthia Brewer/g) || []).length
			};
		});
		report.eq(ptr.n, 2, 'each colour picker carries a pointer to the acknowledgement');
		report.ok(/\S/.test(ptr.text) && ptr.text.length < 24 && !/Brewer/.test(ptr.text),
			'...and it is a LINK, not the acknowledgement repeated', JSON.stringify(ptr.text));
		report.eq(ptr.href, '#lpn_set_ramp_credits', '...aimed at the footer copy');
		report.ok(ptr.gap !== null && ptr.gap >= 0 && ptr.gap < 40,
			'...sitting directly under the Color scheme control, which is where Tom put it',
			ptr.gap + ' px below the picker');
		report.eq(ptr.copies, 1, 'the acknowledgement is still rendered exactly ONCE in the box');
		const jump = await a.page.evaluate(async () => {
			const before = location.hash;
			document.getElementById('lpn_set_credits_link_node').click();
			return { before, after: location.hash,
				marked: document.getElementById('lpn_set_ramp_credits').classList.contains('lpn-set-flash') };
		});
		report.ok(jump.marked, 'clicking it takes the reader to the acknowledgement and marks it');
		report.eq(jump.after, jump.before, '...without navigating — a hash in the address bar is not what it means');

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
