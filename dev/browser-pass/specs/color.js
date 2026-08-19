// §14 — colour by value: a dropdown for nodes and one for links (ROADMAP Tasks 427 and 441).
//
// The mode shipped with Task 384 inside Settings, and Task 327 pulled it onto the toolbar as ONE
// select doing both fields. Tom, 2026-08-18: "I do see the beauty of the one control ... but it's
// not the expectation" — EPANET and epanet-js both give nodes and links a dropdown each, and the
// single control's habit of clearing the other field is what made it surprising.
//
// The two dropdowns went to the Visibility panel and then, the same day, into the **Coloring
// section of the Settings box** — Tom: "Combine Labels settings, present design Settings, Time
// settings ... and Coloring into the Settings box." That move also killed the duplicate copy of
// these controls that had been living inside the Settings panel, which is asserted here as a count.
//
// This is a browser check because every claim is about REACHABILITY: the buttons that open the box
// exist, the legend is a second way in, and the two fields no longer clear each other.

const { Session } = require('../lib/session');

exports.title = '14. Colour by value';

async function storedFields(a) {
	return a.page.evaluate(() => {
		let node = null, link = null;
		for (let i = 0; i < localStorage.length; i++) {
			const k = localStorage.key(i);
			if (!/^lpn_proj/.test(k)) { continue; }
			try {
				const d = JSON.parse(localStorage.getItem(k));
				if (d.settings) { node = d.settings.colorNodeField; link = d.settings.colorLinkField; }
			} catch (e) { /* not ours */ }
		}
		return { node: node, link: link };
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

		// The ramp picker speaks ColorBrewer: sequential and diverging, which is the vocabulary
		// matplotlib, d3, QGIS and ArcGIS all use. epanet-js says "Continuous"; we do not.
		const families = await a.page.evaluate(() =>
			[...document.querySelectorAll('#lpn_set_ramp optgroup')].map(g => g.label));
		report.eq(families.length, 2, 'the ramps are grouped into families', families.join(' | '));
		report.has(families.join(' | ').toLowerCase(), 'sequential', 'the standard word, not "continuous"');
		report.has(families.join(' | ').toLowerCase(), 'diverging', 'and diverging beside it');

		// **ONE COLOUR EDITOR, NOT TWO** (Task 441). The Settings panel used to carry a second copy
		// of these controls over the same settings, and the two had already drifted apart. Asserted
		// by counting the node-field select in the whole document: a second editor is a second one.
		report.eq(await a.page.evaluate(() =>
			document.querySelectorAll('#lpn_settings_box select[id$="_color_node"]').length), 1,
			'there is exactly one node-colour dropdown in the box');

		await pick(a, 'lpn_set_color_node', 'pressure');
		report.eq((await storedFields(a)).node, 'pressure', 'choosing a node field stores it on the project');

		// **THE WHOLE POINT OF TASK 427**: the link field does NOT clear the node field. Both can be
		// coloured at once, and renderColorLegend() draws a block for each.
		await pick(a, 'lpn_set_color_link', 'velocity');
		const both = await storedFields(a);
		report.eq(both.link, 'velocity', 'choosing a link field stores that too');
		report.eq(both.node, 'pressure', '...and leaves the node field alone — one each, not one between them');
		// ...and the section gives each of them its own range editor, which is the other half of
		// "one each": a single set of band limits over two different quantities would be nonsense.
		// Asserted on the RANGES rather than on the legend, because the legend only draws a block
		// for a field that has values on the map, and a one-junction network before a solve has
		// none — which is a fact about the network, not about this feature.
		const ranges = await a.page.evaluate(() =>
			[...document.querySelectorAll('#lpn_set_colors_node div, #lpn_set_colors_link div')]
				.filter(d => d.style.fontWeight === 'bold').map(d => d.textContent));
		report.eq(ranges.length, 2, 'each coloured field gets its own band limits', ranges.join(' | '));
		// **AND EACH ONE IS UNDER THE SUB-HEADING OF THE ELEMENT IT COLOURS** (Tom, 2026-08-18:
		// "Dissolve Color by value and put its items in Node symbology and Link symbology"). One
		// question — how is a junction drawn — used to be answered in two panels.
		report.eq(await a.page.evaluate(() =>
			document.querySelectorAll('#lpn_set_colors_node select').length), 1,
			'the node dropdown is under Node symbology');
		report.eq(await a.page.evaluate(() =>
			document.querySelectorAll('#lpn_set_colors_link select').length), 1,
			'the link dropdown is under Link symbology');

		// **EVERY SWATCH IS EXACTLY THE SAME WIDTH** (Tom: "The colour palette does not show
		// nicely. First color expands to use all space"). It did: the strip wore a labelled row's
		// class, whose first child takes all the slack. Measured as PAINTED widths, because that is
		// the only place a flex rule and a percentage can be told apart.
		const swatches = await a.page.evaluate(() =>
			[...document.querySelectorAll('#lpn_set_ramp_strip .lpn-color-swatch')]
				.map(sw => +sw.getBoundingClientRect().width.toFixed(2)));
		report.ok(swatches.length >= 3, 'the ramp is drawn as a strip of swatches',
			swatches.join(', '));
		const spread = Math.max(...swatches) - Math.min(...swatches);
		report.ok(spread <= 1, '...and every one is the same width, to within sub-pixel rounding',
			`widest ${Math.max(...swatches)}, narrowest ${Math.min(...swatches)}`);

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

		report.eq(a.errors.length, 0, 'no uncaught JavaScript');
	} finally {
		await a.close();
	}
};
