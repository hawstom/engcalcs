// §20 — the clean map (ROADMAP Task 253).
//
// One presentation mode, ONE door — the View menu row (Tom, 2026-08-20: "Relegate Hide map readouts
// to the View menu"; the toolbar's camera button is gone) — and its whole promise is a negative: **it hides `#lpn_mode_hint` and `#lpn_coords` and NOTHING ELSE.** A
// negative like that is exactly what a browser is for; from inside the page every readout still
// exists either way. So this counts what is on the screen before and after, and names the difference.
//
// Two properties the design record insists on, both checked here:
//   * **the units and scenario readouts STAY.** A screenshot of bare numbers that does not say what
//     they are is worse than one with a coordinate tracker in it.
//   * **it is not stored.** It is a mode you hold while taking pictures; persisting it would let a
//     user lose the mode line permanently with nothing to blame. A reload brings everything back.

const { Session } = require('../lib/session');

// **THE ROW NAMES THE ACT, SO ITS NAME FLIPS**, and BOTH halves are asked of the language file.
// This constant held the English twice over: "Clean map" first, then "Reduce map clutter" after a
// wave-0 rename, and it broke on each — the second time on 2026-09-09, when a later wave-0 pass
// settled the pair as `lpn_clean_map` / `lpn_clean_map_off` ("Hide map readouts" / "Show map
// readouts") so the two rows use one vocabulary. What this spec is about is the FLIP and what the
// row hides, neither of which is a set of words: dev/session-handoff.md §4.
//
// (Reported outward, not fixed here: the comment above `lpn_clean_map` in lib/lang.ec.en.php still
// argues for "Reduce map clutter" against the value it now guards.)
let CLEAN_ON = null, CLEAN_OFF = null;

exports.title = '20. The clean map';

const GONE = ['lpn_mode_hint', 'lpn_coords'];

// Every element the map footer strip carries, and whether the user can see it. Read by id rather
// than by walking the DOM so that "nothing else went away" is a statement about named readouts.
async function strip(a) {
	return a.page.evaluate(() => {
		const out = {};
		document.querySelectorAll('#lpn_map_footer [id], #lpn_map_footer, #lpn_mode_hint, #lpn_coords')
			.forEach((e) => {
				if (!e.id) { return; }
				const r = e.getBoundingClientRect();
				out[e.id] = r.width > 0 && r.height > 0;
			});
		return out;
	});
}
async function viewRow(a, startsWith) {
	return (await a.menuRows('map')).find(r => r.label.indexOf(startsWith) === 0) || null;
}

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		await a.dismissGallery();
		CLEAN_ON = await a.lang('lpn_clean_map');
		CLEAN_OFF = await a.lang('lpn_clean_map_off');
		await a.makeEdit();

		const before = await strip(a);
		report.ok(GONE.every(id => before[id]), 'set up: the mode line and the coordinate tracker are on screen',
			JSON.stringify(before));
		report.ok(!(await a.toolbarNames()).some(n => n.indexOf('map readouts') >= 0),
			'the toolbar does not carry it — it is a once-before-a-screenshot command, not a high-use one',
			'Tom, 2026-08-20: "Relegate Hide map readouts to the View menu."');

		// ---- the View menu says what it will DO --------------------------------------------------
		let row = await viewRow(a, CLEAN_ON);
		report.ok(!!row, 'the View menu offers it', row ? row.label : `no row starting "${CLEAN_ON}"`);
		if (!row) { throw new Error(`the Map menu has no "${CLEAN_ON}" row`); }
		await a.menuClick(row.label, 'map');
		await a.settle(300);
		const clean = await strip(a);
		report.ok(GONE.every(id => !clean[id]), 'it takes the mode line and the tracker away',
			JSON.stringify(clean));

		const others = Object.keys(before).filter(id => GONE.indexOf(id) < 0);
		report.ok(others.length > 0, 'set up: there is something else on the strip to leave alone',
			others.join(', '));
		report.ok(others.every(id => clean[id] === before[id]),
			'...and NOTHING ELSE went with them — the units and scenario readouts stay',
			'bare numbers that do not say what they are is a worse screenshot, not a better one');
		report.eq(await a.nodeCount(), 1, 'the network is untouched — this is a readout mode, not a view');

		row = await viewRow(a, CLEAN_OFF);
		report.ok(!!row, `the row then reads "${CLEAN_OFF}" — it states what it will do`,
			'this menu has no checkmark column, so the label carries the state');
		await a.menuClick(row.label, 'map');
		await a.settle(300);
		report.eq(JSON.stringify(await strip(a)), JSON.stringify(before),
			'pressing it again puts every one of them back, and changes nothing else');

		// ---- it is not stored --------------------------------------------------------------------
		row = await viewRow(a, CLEAN_ON);
		await a.menuClick(row.label, 'map');
		await a.settle(300);
		const held = await strip(a);
		report.ok(GONE.every(id => !held[id]), 'set up: clean map is on');
		await a.reload();
		await a.settle(400);
		const after = await strip(a);
		report.ok(GONE.every(id => after[id]),
			'a reload brings the readouts back — the mode is NOT stored, and could not be lost for good',
			JSON.stringify(after));
		report.ok(!!(await viewRow(a, CLEAN_ON)),
			`...and the View row is back to "${CLEAN_ON}"`);

		report.eq(a.errors.length, 0, 'no uncaught JavaScript', a.errors[0] || '');
	} finally {
		await a.close();
	}
};
