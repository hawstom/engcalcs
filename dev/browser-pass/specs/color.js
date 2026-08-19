// §14 — colour by value: a dropdown for nodes and one for links (ROADMAP Task 427).
//
// The mode shipped with Task 384 inside Settings, and Task 327 pulled it onto the toolbar as ONE
// select doing both fields. Tom, 2026-08-18: "I do see the beauty of the one control ... but it's
// not the expectation" — EPANET and epanet-js both give nodes and links a dropdown each, and the
// single control's habit of clearing the other field is what made it surprising.
//
// So the two dropdowns live in the Visibility panel at the right of the map, and this is a browser
// check because every claim here is about REACHABILITY: the button that opens the panel exists, the
// legend is a second way in, and the two fields no longer clear each other.

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

		// The button Tom could not find, at the right end of the strip beside the bottom-pane
		// toggle. Named by its aria-label, because the strip is icons only now.
		const paneShut = await a.page.evaluate(() =>
			document.getElementById('lpn_rpane').style.display === 'none');
		report.ok(paneShut, 'the Visibility panel starts closed');
		await a.toolbarClick('Visibility');
		await a.settle(300);
		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_rpane').style.display === 'flex'), 'the toolbar button opens it');

		const opts = await a.page.evaluate(() => {
			const read = (id) => {
				const s = document.getElementById(id);
				return s ? [...s.options].map(o => ({ v: o.value, t: o.textContent })) : null;
			};
			return { node: read('lpn_rp_color_node'), link: read('lpn_rp_color_link') };
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
			[...document.querySelectorAll('#lpn_rp_ramp optgroup')].map(g => g.label));
		report.eq(families.length, 2, 'the ramps are grouped into families', families.join(' | '));
		report.has(families.join(' | ').toLowerCase(), 'sequential', 'the standard word, not "continuous"');
		report.has(families.join(' | ').toLowerCase(), 'diverging', 'and diverging beside it');

		await pick(a, 'lpn_rp_color_node', 'pressure');
		report.eq((await storedFields(a)).node, 'pressure', 'choosing a node field stores it on the project');

		// **THE WHOLE POINT OF TASK 427**: the link field does NOT clear the node field. Both can be
		// coloured at once, and renderColorLegend() draws a block for each.
		await pick(a, 'lpn_rp_color_link', 'velocity');
		const both = await storedFields(a);
		report.eq(both.link, 'velocity', 'choosing a link field stores that too');
		report.eq(both.node, 'pressure', '...and leaves the node field alone — one each, not one between them');
		// ...and the panel gives each of them its own range editor, which is the other half of
		// "one each": a single set of band limits over two different quantities would be nonsense.
		// Asserted on the RANGES rather than on the legend, because the legend only draws a block
		// for a field that has values on the map, and a one-junction network before a solve has
		// none — which is a fact about the network, not about this feature.
		const ranges = await a.page.evaluate(() =>
			[...document.querySelectorAll('#lpn_rp_colors div')]
				.filter(d => d.style.fontWeight === 'bold').map(d => d.textContent));
		report.eq(ranges.length, 2, 'each coloured field gets its own band limits', ranges.join(' | '));

		// The legend is the second door in — it is the chrome already telling the user what the
		// colours mean.
		await a.page.evaluate(() => { document.getElementById('lpn_rpane_close').click(); });
		await a.settle(200);
		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_rpane').style.display === 'none'), 'the X closes the panel');
		await a.page.evaluate(() => { document.getElementById('lpn_color_legend').click(); });
		await a.settle(300);
		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_rpane').style.display === 'flex'), 'clicking the legend opens it again');
		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_rp_colors_sec').open), '...on the colours section');

		// Labels moved here too, and this is the door the toolbar's Labels button now uses.
		report.ok(await a.page.evaluate(() =>
			!!document.querySelector('#lpn_rpane #lpn_labels_node_fields')), 'the label checkboxes live here now');

		report.eq(a.errors.length, 0, 'no uncaught JavaScript');
	} finally {
		await a.close();
	}
};
