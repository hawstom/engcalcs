// §14 — colour by value, and THE RAMP PICKER (ROADMAP Tasks 427, 429 and 441).
//
// The mode shipped with Task 384 inside Settings, and Task 327 pulled it onto the toolbar as ONE
// select doing both fields. Tom, 2026-08-18: "I do see the beauty of the one control ... but it's
// not the expectation" — EPANET and epanet-js both give nodes and links a dropdown each, and the
// single control's habit of clearing the other field is what made it surprising. The two dropdowns
// then went into the **Coloring section of the Settings box**, which also killed the duplicate copy
// of these controls that had been living in the Settings panel.
//
// **AND THEN THE PICKER ITSELF WAS REJECTED**, in these words: *"our ramp selector is neither fun
// nor pretty; the color boxes are not uniform widths, the dropdown has names instead of colors"*,
// and *"I expected 7 colors per ramp, dozens of ramps, graphics in the dropdown, 5 range allocation
// modes, and a choice of number of ranges."* So it is no longer a <select> — a <select> cannot hold
// a picture — but a button showing one swatch bar over a popup that is a scrolling column of them.
//
// **AND THEN THE ONE SCHEME BECAME TWO** (Tom, 2026-08-19, of each symbology group in turn: move
// the field dropdown below the label columns, and "put a colour-ramp picker at the bottom of this
// group"). Nodes and links now own a ramp, a class count, a reverse flag and a mode selector each,
// which is what EPANET and epanet-js do and what a field dropdown each already implied. The
// migration -- an older project opening on exactly the colours it was saved in -- is asserted in
// dev/lpn-spike/color-ramp-harness.js, where a saved file can be built by hand.
//
// This is a browser check because every claim below is about what is PAINTED and what is
// REACHABLE: equal widths are a fact about layout that only a real layout can answer, and a picker
// that cannot be opened from the keyboard is not a picker for everybody.

const { Session } = require('../lib/session');

exports.title = '14. Colour by value and the ramp picker';

async function storedSettings(a) {
	return a.page.evaluate(() => {
		let out = null;
		for (let i = 0; i < localStorage.length; i++) {
			const k = localStorage.key(i);
			if (!/^lpn_proj/.test(k)) { continue; }
			try {
				const d = JSON.parse(localStorage.getItem(k));
				if (d.settings) { out = d.settings; }
			} catch (e) { /* not ours */ }
		}
		return out || {};
	});
}

async function pick(a, id, value) {
	await a.page.evaluate(([sel, v]) => {
		const s = document.getElementById(sel);
		s.value = v;
		s.dispatchEvent(new Event('change', { bubbles: true }));
	}, [id, value]);
	await a.settle(400);
}

// Painted widths of one bar. The only place a flex rule and a percentage can be told apart.
async function barWidths(a, sel) {
	return a.page.evaluate((s) => {
		const host = document.querySelector(s);
		if (!host) { return null; }
		return [...host.querySelectorAll('.lpn-color-swatch')]
			.map(sw => +sw.getBoundingClientRect().width.toFixed(2));
	}, sel);
}

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		await a.dismissGallery();
		await a.makeEdit();

		const shut = await a.page.evaluate(() =>
			document.getElementById('lpn_settings_box').style.display === 'none');
		report.ok(shut, 'the Settings box starts closed');
		// The toolbar's Settings button. Named by its aria-label, because the strip is icons only.
		await a.toolbarClick('Settings');
		await a.settle(400);
		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_settings_box').style.display === 'flex'),
			'the toolbar button opens it');

		const opts = await a.page.evaluate(() => {
			const read = (id) => {
				const s = document.getElementById(id);
				return s ? [...s.options].map(o => ({ v: o.value, t: o.textContent })) : null;
			};
			return { node: read('lpn_set_color_node'), link: read('lpn_set_color_link') };
		});
		report.ok(!!opts.node && !!opts.link, 'nodes and links have a dropdown each');
		report.ok(opts.node && opts.node[0].v === '', 'nodes start at no colour', opts.node && opts.node[0].t);
		report.ok(opts.link && opts.link[0].v === '', 'links start at no colour', opts.link && opts.link[0].t);
		// Pressure and velocity are the two a distribution network is actually asked about, so they
		// lead their own lists.
		report.eq(opts.node[1].v, 'pressure', 'pressure is the first node field offered');
		report.eq(opts.link[1].v, 'velocity', 'velocity is the first link field offered');
		report.ok(opts.node.every(o => o.t && o.t.trim()) && opts.link.every(o => o.t && o.t.trim()),
			'every option is named, none blank');

		// **ONE COLOUR EDITOR, NOT TWO** (Task 441). The Settings panel used to carry a second copy
		// of these controls over the same settings, and the two had already drifted apart. Asserted
		// by counting the node-field select in the whole document: a second editor is a second one.
		report.eq(await a.page.evaluate(() =>
			document.querySelectorAll('#lpn_settings_box select[id$="_color_node"]').length), 1,
			'there is exactly one node-colour dropdown in the box');

		await pick(a, 'lpn_set_color_node', 'pressure');
		report.eq((await storedSettings(a)).colorNodeField, 'pressure',
			'choosing a node field stores it on the project');

		// **THE WHOLE POINT OF TASK 427**: the link field does NOT clear the node field. Both can be
		// coloured at once, and renderColorLegend() draws a block for each.
		await pick(a, 'lpn_set_color_link', 'velocity');
		const both = await storedSettings(a);
		report.eq(both.colorLinkField, 'velocity', 'choosing a link field stores that too');
		report.eq(both.colorNodeField, 'pressure',
			'...and leaves the node field alone — one each, not one between them');
		report.eq(await a.page.evaluate(() =>
			document.querySelectorAll('#lpn_set_colors_node select[id^="lpn_set_color_"]').length), 2,
			'the node dropdown and its range mode are under Node symbology');
		report.eq(await a.page.evaluate(() =>
			document.querySelectorAll('#lpn_set_colors_link select[id^="lpn_set_color_"]').length), 2,
			'the link dropdown and its range mode are under Link symbology');

		// ---- THE SHAPE OF A SYMBOLOGY GROUP (Tom, 2026-08-19) -------------------------------
		//
		// Read down the page, a group is now: what is PRINTED beside the element, then what decides
		// its COLOUR, then the scheme that colour comes from. Asserted by painted position, because
		// the order is the whole of what he asked for and DOM order alone can lie about it.
		const order = await a.page.evaluate(() => {
			const top = (id) => {
				const e = document.getElementById(id);
				return e ? e.getBoundingClientRect().top : null;
			};
			return {
				nodeLabels: top('lpn_labels_node_fields'), nodeColors: top('lpn_set_colors_node'),
				linkLabels: top('lpn_labels_link_fields'), linkColors: top('lpn_set_colors_link'),
				nodeField: top('lpn_set_color_node'), nodeRamp: top('lpn_set_ramp_node'),
				nodeMode: top('lpn_set_color_mode_node'),
				nodeLink: top('lpn_set_sub_nodeLink'), mapDisplay: top('lpn_set_sub_mapDisplay'),
				textSize: (() => {
					const rows = [...document.querySelectorAll('#lpn_set_map_fields .lpn-set-row')];
					return rows.length ? rows[0].getBoundingClientRect().top : null;
				})()
			};
		});
		report.ok(order.nodeLabels < order.nodeColors,
			'"Color nodes by" sits AFTER the label columns');
		report.ok(order.linkLabels < order.linkColors,
			'...and "Color pipes by" after the link ones');
		report.ok(order.nodeField < order.nodeRamp,
			'...with that group\'s ramp picker at the bottom of it');
		report.ok(Math.abs(order.nodeMode - order.nodeRamp) < 60,
			'the range-allocation modes sit right beside the picker, where they can be found',
			`ramp at ${order.nodeRamp}, mode at ${order.nodeMode}`);
		// **A THIRD SUB-HEADING FOR THE TWO CONTROLS THAT ARE ABOUT BOTH KINDS AT ONCE.**
		report.ok(order.nodeLink !== null && order.nodeLink > order.linkColors && order.nodeLink < order.mapDisplay,
			'"Node and link" stands between Link symbology and Map appearance');
		report.ok(await a.page.evaluate(() => {
			const body = document.getElementById('lpn_labels_options');
			const sub = document.getElementById('lpn_set_sub_nodeLink');
			if (!body || !sub) { return false; }
			const t = body.textContent.toLowerCase();
			return body.getBoundingClientRect().top > sub.getBoundingClientRect().top &&
				/highest/.test(t) && /between/.test(t);
		}), '...and holds the high/low mark and the text between values');
		report.ok(order.mapDisplay < order.textSize && order.textSize - order.mapDisplay < 60,
			'the Map appearance heading sits immediately before Text size',
			`heading at ${order.mapDisplay}, first row at ${order.textSize}`);
		// EACH GROUP'S PICKER IS ITS OWN. Two buttons, two lists, and choosing in one leaves the
		// other showing what it was showing.
		report.eq(await a.page.evaluate(() =>
			document.querySelectorAll('#lpn_settings_box .lpn-ramp-picker').length), 2,
			'there is a ramp picker in each symbology group, and only there');

		// ---- THE CLOSED PICKER ---------------------------------------------------------------
		const btn = await a.page.evaluate(() => {
			const b = document.getElementById('lpn_set_ramp_node');
			return b ? {
				tag: b.tagName, pop: b.getAttribute('aria-haspopup'),
				expanded: b.getAttribute('aria-expanded'), label: b.getAttribute('aria-label'),
				text: b.textContent.trim()
			} : null;
		});
		report.eq(btn && btn.tag, 'BUTTON', 'the picker is a button, not a select — a select cannot hold a picture');
		report.eq(btn && btn.pop, 'listbox', '...that says it opens a listbox');
		report.eq(btn && btn.expanded, 'false', '...and starts closed');
		report.eq(btn && btn.text, '', 'the closed state shows COLOUR and no name');
		report.ok(btn && /\S/.test(btn.label || ''),
			'...with the scheme name as its accessible name instead', btn && btn.label);

		// **EVERY SWATCH IS EXACTLY THE SAME WIDTH** (Tom: "The colour palette does not show
		// nicely. First color expands to use all space"). It did: the strip wore a labelled row's
		// class, whose first child takes all the slack.
		const closed = await barWidths(a, '#lpn_set_ramp_node');
		report.eq(closed && closed.length, 7, 'the closed bar draws one box per class, seven by default',
			closed && closed.join(', '));
		report.ok(closed && Math.max(...closed) - Math.min(...closed) <= 1,
			'...and every one is the same width, to within sub-pixel rounding',
			closed && `widest ${Math.max(...closed)}, narrowest ${Math.min(...closed)}`);

		// ---- THE OPEN PICKER -------------------------------------------------------------------
		await a.page.click('#lpn_set_ramp_node');
		await a.settle(250);
		const open = await a.page.evaluate(() => {
			const pop = document.getElementById('lpn_set_ramp_list_node');
			const rows = [...pop.querySelectorAll('[role="option"]')];
			const heads = [...pop.querySelectorAll('.lpn-ramp-fam')];
			return {
				shown: getComputedStyle(pop).display !== 'none',
				role: pop.getAttribute('role'),
				rows: rows.length,
				named: rows.every(r => (r.getAttribute('aria-label') || '').trim().length > 0),
				silent: rows.every(r => r.textContent.trim() === ''),
				swatches: rows.map(r => r.querySelectorAll('.lpn-color-swatch').length),
				selected: rows.filter(r => r.getAttribute('aria-selected') === 'true')
					.map(r => r.getAttribute('data-ramp')),
				heads: heads.map(h => h.textContent),
				scrolls: pop.scrollHeight > pop.clientHeight
			};
		});
		report.ok(open.shown, 'clicking it opens the list');
		report.eq(open.role, 'listbox', '...as a listbox');
		report.ok(open.rows >= 40, 'dozens of ramps, as Tom expected', open.rows + ' rows');
		report.ok(open.silent, 'every row is a PICTURE — no names anywhere in the list');
		report.ok(open.named, '...with the name in aria-label, where a screen reader finds it');
		report.ok(open.swatches.every(n => n === 7),
			'...and every row draws the CURRENT class count, not always seven by accident',
			[...new Set(open.swatches)].join(','));
		report.eq(open.selected.length, 1, 'exactly one row is marked selected', open.selected.join(','));
		report.ok(open.scrolls, 'the list scrolls inside itself rather than growing the page');
		const headText = open.heads.join(' | ');
		report.has(headText.toLowerCase(), 'sequential', 'the standard word, not epanet-js\'s "continuous"');
		report.has(headText.toLowerCase(), 'diverging', 'and diverging beside it');
		report.has(headText.toLowerCase(), 'qualitative', 'and qualitative, which the five-ramp era had none of');
		report.ok(!/continuous/i.test(headText), 'and nothing calls a family "Continuous"', headText);
		// **EACH HEADING CARRIES AN ABBREVIATED EXAMPLE**, because which family suits the data is
		// the one thing the pictures cannot say. Tom: "No suggest family. Simply put examples with
		// headings" — so every heading has one and none of them is marked as recommended.
		report.ok(open.heads.every(h => /\(.+\)/.test(h)), 'every family heading carries an example', headText);
		report.ok(/epanet/i.test(open.heads[open.heads.length - 1]),
			'the rainbow is last, in a group of its own, and says what it is for',
			open.heads[open.heads.length - 1]);
		// **CLAUSES 4 AND 5 OF THE LICENCE**: the name may not appear on a control. It appears once,
		// inside the acknowledgement clause 2 fixes the wording of, and nowhere else. ONE copy for
		// the two pickers -- it acknowledges the CATALOGUE they both draw from, so it stands under
		// Map appearance rather than being printed twice in one box.
		const brewer = await a.page.evaluate(() => {
			const box = document.getElementById('lpn_settings_box');
			const credit = document.getElementById('lpn_set_ramp_credits');
			return {
				credit: credit ? credit.textContent : '',
				elsewhere: box.textContent.split('ColorBrewer').length - 1,
				labels: [...box.querySelectorAll('[aria-label]')]
					.map(e => e.getAttribute('aria-label')).join(' | ')
			};
		});
		report.has(brewer.credit,
			'This product includes color specifications and designs developed by Cynthia Brewer (http://colorbrewer.org/).',
			'the acknowledgement appears verbatim, once, in the box that offers the ramps');
		report.eq(brewer.elsewhere, 0, 'and the word "ColorBrewer" appears on no control at all');
		report.ok(!/ColorBrewer/.test(brewer.labels), '...nor in any accessible name');

		// Choosing a row stores it, repaints the button, and shuts the list.
		const target = await a.page.evaluate(() => {
			const rows = [...document.querySelectorAll('#lpn_set_ramp_list_node [role="option"]')];
			const other = rows.find(r => r.getAttribute('aria-selected') !== 'true');
			other.click();
			return other.getAttribute('data-ramp');
		});
		await a.settle(400);
		report.eq((await storedSettings(a)).colorRampNode, target, 'clicking a row stores that ramp on the project');
		report.ok((await storedSettings(a)).colorRampLink !== target,
			'...on THAT group only — the link scheme is the user\'s other choice, not a copy of this one');
		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_set_ramp_list_node').style.display === 'none'),
			'...and the list closes behind the choice');

		// **KEYBOARD-OPERABLE**, which a picture-only control has to be or it is nobody's picker.
		await a.page.focus('#lpn_set_ramp_node');
		await a.page.keyboard.press('ArrowDown');
		await a.settle(250);
		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_set_ramp_node').getAttribute('aria-expanded') === 'true'),
			'Down opens the list from the keyboard');
		report.ok(await a.page.evaluate(() =>
			(document.activeElement.getAttribute('role') === 'option')),
			'...with a row focused, so the arrows walk the list');
		const walked = await a.page.evaluate(() => {
			const before = document.activeElement.getAttribute('data-ramp');
			return before;
		});
		await a.page.keyboard.press('ArrowDown');
		await a.settle(150);
		report.ok(await a.page.evaluate((b) =>
			document.activeElement.getAttribute('data-ramp') !== b, walked),
			'...and Down moves to the next ramp');
		await a.page.keyboard.press('Escape');
		await a.settle(200);
		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_set_ramp_node').getAttribute('aria-expanded') === 'false' &&
			document.activeElement.id === 'lpn_set_ramp_node'),
			'Escape closes it and hands the focus back to the button');
		// **INNERMOST FIRST.** The document's Escape handler closes the whole Settings box; an
		// Escape aimed at an open list must cost the list and not the box, which is the same
		// convention the box's own filter field follows while it holds text.
		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_settings_box').style.display === 'flex'),
			'...and the Settings box behind it stays open');

		// ---- HOW MANY RANGES -------------------------------------------------------------------
		await pick(a, 'lpn_set_ramp_classes_node', '4');
		report.eq((await storedSettings(a)).colorClassesNode, 4, 'the count picker stores 3 to 7');
		const four = await barWidths(a, '#lpn_set_ramp_node');
		report.eq(four.length, 4, '...and the swatch follows it, so the picture cannot lie about the map',
			four.join(', '));
		report.ok(Math.max(...four) - Math.min(...four) <= 1, '...still exactly equal widths');
		report.eq(await a.page.evaluate(() =>
			document.querySelectorAll('#lpn_set_colors_node input[type="number"]').length), 3,
			'four ranges are separated by three limits');
		await pick(a, 'lpn_set_ramp_classes_node', '7');

		// ---- THE MODES -------------------------------------------------------------------------
		const modes = await a.page.evaluate(() => {
			const read = (id) => [...document.getElementById(id).options].map(o => o.value);
			return { node: read('lpn_set_color_mode_node'), link: read('lpn_set_color_mode_link') };
		});
		report.ok(modes.link.length >= 5, 'a link field offers the algorithmic modes', modes.link.join(','));
		report.ok(modes.node.indexOf('pressure') >= 0,
			'colouring by pressure adds the mode named Pressure', modes.node.join(','));
		report.ok(modes.link.indexOf('pressure') < 0,
			'...and colouring by velocity does not — a Pressure mode there invites a wrong map');
		// A CRITERION MODE DECIDES THE CLASS COUNT: four thresholds are five classes, and the count
		// picker must not offer to disagree with them.
		await pick(a, 'lpn_set_color_mode_node', 'pressure');
		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_set_ramp_classes_node').disabled), 'a criterion mode fixes the count');
		// ...FOR ITS OWN GROUP. Before the schemes split, a criterion chosen for the nodes redrew
		// the link map in five classes too, silently.
		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_set_ramp_classes_link').disabled === false),
			'...and leaves the link count picker alone');
		report.eq((await barWidths(a, '#lpn_set_ramp_node')).length, 5,
			'...at five, which is what four thresholds are');
		await pick(a, 'lpn_set_color_mode_node', 'equal');

		// ---- THE LIMITS ARE EDITABLE, AND A BAD ONE IS REFUSED ----------------------------------
		const filled = await a.page.evaluate(() =>
			[...document.querySelectorAll('#lpn_set_colors_node input[type="number"]')].map(b => b.value));
		report.ok(filled.length === 6 && filled.every(v => v !== '' && isFinite(+v)),
			'the limits arrive filled in by the mode, not blank', filled.join(', '));
		// Out of order. validateBreaks() refuses it, names the box, and NOTHING is written — the
		// user's numbers are never sorted into shape behind their back.
		const beforeBad = (await storedSettings(a)).colorBreaks || {};
		await a.page.evaluate(() => {
			const boxes = [...document.querySelectorAll('#lpn_set_colors_node input[type="number"]')];
			boxes[2].value = String(+boxes[0].value - 1);
			boxes[2].dispatchEvent(new Event('change', { bubbles: true }));
		});
		await a.settle(300);
		const refused = await a.page.evaluate(() => {
			const msg = document.querySelector('#lpn_set_colors_node .lpn-color-msg');
			const bad = document.querySelectorAll('#lpn_set_colors_node input.lpn-bad');
			return { text: msg ? msg.textContent : '', shown: msg && msg.style.display !== 'none',
				marked: bad.length, aria: bad[0] && bad[0].getAttribute('aria-invalid') };
		});
		report.ok(refused.shown && /\S/.test(refused.text), 'an out-of-order limit is refused in words',
			refused.text);
		report.eq(refused.marked, 1, '...with the offending box marked, so no message carries a number');
		report.eq(refused.aria, 'true', '...and marked for a screen reader too');
		report.eq(JSON.stringify((await storedSettings(a)).colorBreaks || {}), JSON.stringify(beforeBad),
			'...and nothing was written — the map is exactly as it was');
		// A good edit does land.
		await a.page.evaluate(() => {
			const boxes = [...document.querySelectorAll('#lpn_set_colors_node input[type="number"]')];
			boxes.forEach((b, i) => { b.value = String(10 * (i + 1)); });
			boxes[boxes.length - 1].dispatchEvent(new Event('change', { bubbles: true }));
		});
		await a.settle(400);
		report.eq(JSON.stringify(((await storedSettings(a)).colorBreaks || {})['node.pressure']),
			'[10,20,30,40,50,60]', 'a valid set of limits is stored exactly as typed');

		// The legend is the second door in — it is the chrome already telling the user what the
		// colours mean — and since Task 441 it opens the box on its Coloring section.
		await a.page.evaluate(() => { document.getElementById('lpn_setbox_close').click(); });
		await a.settle(200);
		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_settings_box').style.display === 'none'), 'the X closes the box');
		await a.page.evaluate(() => { document.getElementById('lpn_color_legend').click(); });
		await a.settle(400);
		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_settings_box').style.display === 'flex'),
			'clicking the legend opens it again');
		// It lands ON the colour controls rather than merely opening. There is no Coloring section
		// any more, so the target is the Node symbology sub-heading — and the check that matters is
		// that it is VISIBLE, not merely scrolled to: `block: 'start'` puts a sub-heading exactly
		// where the sticky section heading is about to be, which is the defect Tom reported as "the
		// scroll target lands UNDER the level-1 heading".
		report.ok(await a.page.evaluate(() => {
			const pane = document.getElementById('lpn_setbox_content');
			const sub = document.getElementById('lpn_set_sub_nodeSym');
			const head = document.querySelector('#lpn_set_sec_map .lpn-set-head');
			if (!pane || !sub || !head) { return false; }
			const s = sub.getBoundingClientRect(), h = head.getBoundingClientRect();
			return s.top - h.bottom >= -1 && s.top - pane.getBoundingClientRect().top < 60;
		}), '...scrolled to the colour controls, clear of the sticky heading');

		// ---- ONE ALIGNMENT RULE FOR THE WHOLE BOX (Tom: "Some inputs are right justified. Others
		// are not. Standardize with an eye for design") -------------------------------------------
		//
		// Numbers right, words left, and a box with its own spinner arrows centred because the
		// arrows own its right edge. Measured as COMPUTED style, because the rule is a stylesheet
		// claim and an inline style set anywhere would quietly beat it.
		const aligns = await a.page.evaluate(() => {
			const out = { number: [], text: [], spin: [], select: [] };
			[...document.querySelectorAll('#lpn_settings_box .lpn-set-secbody input')].forEach((i) => {
				const ta = getComputedStyle(i).textAlign;
				if (i.classList.contains('ec-spin')) { out.spin.push(ta); }
				else if (i.type === 'number' || i.classList.contains('lpn-set-num')) { out.number.push(ta); }
				else if (i.type === 'text') { out.text.push(ta); }
			});
			[...document.querySelectorAll('#lpn_settings_box .lpn-set-secbody select')]
				.forEach(sl => out.select.push(getComputedStyle(sl).textAlign));
			return out;
		});
		report.ok(aligns.number.length > 3 && aligns.number.every(t => t === 'right'),
			'every number in the box is right-aligned, so digits line up down the column',
			[...new Set(aligns.number)].join(',') + ` over ${aligns.number.length} boxes`);
		report.ok(aligns.text.every(t => t !== 'right'),
			'...and every box holding WORDS keeps its natural start alignment',
			[...new Set(aligns.text)].join(','));
		report.ok(aligns.spin.length > 0 && aligns.spin.every(t => t === 'center'),
			'...and the two spinner columns are centred, under their centred headings',
			[...new Set(aligns.spin)].join(','));

		report.eq(a.errors.length, 0, 'no uncaught JavaScript');
	} finally {
		await a.close();
	}
};
