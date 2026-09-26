// §46 — File, Convert as…: the Round converted values box's own horizontal alignment (R-217).
//
// Tom, 2026-09-24: "Horiz alignment is terrible. Water depth has a glyph that throws it left. All
// the rounding selectors are misaligned with each other and their label heading." Later: "No Depth
// glyph, because it's throwing out the alighment unless you can fix that."
//
// **WHY THIS NEEDS A REAL BROWSER.** The four rows read Diameter, Water depth, Demand and flow,
// Total dynamic head -- four different label widths -- and the old CSS put each row in a
// `justify-content: space-between` flex box with the label sized to its own content. That gives
// each row a DIFFERENT amount of leftover space to divide among its gaps, so the select's left edge
// lands somewhere different on every row: a fact about rendered pixel positions no static check of
// the CSS or the markup can see. This is the pure-geometry twin of specs/boxes.js.

const { Session } = require('../lib/session');

exports.title = '46. Convert as: rounding column alignment';

const ROUND_KEYS = ['diameter', 'depth', 'flow', 'head'];

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		await a.newProject();
		await a.dismissGallery();
		await a.makeEdit();
		await a.menuClick(await a.lang('lpn_file_convert_as'));
		await a.settle(300);

		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_convas_panel').style.display !== 'none'),
			'the box opened');

		const geo = await a.page.evaluate((keys) => {
			const rect = (el) => el ? el.getBoundingClientRect() : null;
			const head = document.querySelector('.lpn-convas-round-head');
			const headCols = head ? [...head.querySelectorAll('.lpn-convas-round-col')] : [];
			return {
				headRoundLeft: rect(headCols[0]) && rect(headCols[0]).left,
				headSuffixLeft: rect(headCols[1]) && rect(headCols[1]).left,
				headSuffixText: headCols[1] ? headCols[1].textContent.trim() : null,
				selects: keys.map((k) => {
					const r = rect(document.getElementById('lpn_convas_round_' + k));
					return r && r.left;
				}),
				suffixes: keys.map((k) => {
					const r = rect(document.getElementById('lpn_convas_suffix_' + k));
					return r && r.left;
				}),
				// The row's own children, counted as elements — the depth row's tip glyph used to be
				// a fourth one (a span.ec-help wrapping an empty label plus the "?" span), where every
				// other row has three: the <label>, the <select>, the suffix <input>.
				rowChildCounts: keys.map((k) => {
					const input = document.getElementById('lpn_convas_suffix_' + k);
					return input && input.parentElement ? input.parentElement.children.length : -1;
				}),
				depthTitle: (function () {
					const el = document.getElementById('lpn_convas_suffix_depth');
					return el ? el.getAttribute('title') : null;
				})(),
				depthHasTipGlyph: !!document.querySelector('#lpn_convas_panel .lpn-convas-round-row .ec-tip')
			};
		}, ROUND_KEYS);

		// **THE HEADING TEXT** (R-217 (2)): "Label it 'Suffix' to match its tip." `lpn_convas_label_col`
		// is not in pageConfig (nothing else on this page reads it in JS), so this reads the DOM the
		// same way a visitor does rather than pulling in a new export for one spec. It is wrapped in
		// ecTipLabel(), so the rendered text carries the tip's own trailing "?" glyph -- checked for
		// by prefix, not equality, the same as any other tipped label on this page.
		report.ok(geo.headSuffixText.indexOf('Suffix') === 0,
			'the suffix column heading says "Suffix"', geo.headSuffixText);

		// **ONE COLUMN, ONE LEFT EDGE.** Sub-pixel layout can differ by a fraction of a pixel between
		// rows that wrap differently; a `?` glyph that is thrown 6-10px out of line, which is what
		// Tom saw, fails this by two orders of magnitude more than any such rounding noise.
		const EPS = 0.5;
		const selectSpread = Math.max(...geo.selects) - Math.min(...geo.selects);
		const suffixSpread = Math.max(...geo.suffixes) - Math.min(...geo.suffixes);
		report.ok(selectSpread < EPS,
			'all four rounding selects share one left edge',
			JSON.stringify(geo.selects));
		report.ok(suffixSpread < EPS,
			'all four suffix boxes share one left edge',
			JSON.stringify(geo.suffixes));
		report.ok(Math.abs(geo.headRoundLeft - geo.selects[0]) < EPS,
			'the Round heading sits directly over the selects',
			`${geo.headRoundLeft} vs ${geo.selects[0]}`);
		report.ok(Math.abs(geo.headSuffixLeft - geo.suffixes[0]) < EPS,
			'the Suffix heading sits directly over the suffix boxes',
			`${geo.headSuffixLeft} vs ${geo.suffixes[0]}`);

		// **NO DEPTH GLYPH** (R-217, the second ruling): every row has the same three children, and
		// the depth row's tip is the box's own native title rather than a fourth flex child.
		report.ok(geo.rowChildCounts.every((n) => n === geo.rowChildCounts[0]),
			'every rounding row has the same number of children — no extra glyph on one row',
			JSON.stringify(geo.rowChildCounts));
		report.ok(!geo.depthHasTipGlyph,
			'the depth row carries no separate "?" tip glyph');
		report.ok(!!geo.depthTitle && geo.depthTitle.length > 0,
			'...and its box still explains itself, as a native title',
			geo.depthTitle);

		report.eq(a.errors.length, 0, 'no uncaught JavaScript', a.errors[0] || '');
	} finally {
		await a.close();
	}
};
