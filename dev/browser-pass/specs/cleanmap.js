// §20 — the clean map (ROADMAP Task 253).
//
// One presentation mode, two doors — the View menu row and the toolbar's camera button — and its
// whole promise is a negative: **it hides `#lpn_mode_hint` and `#lpn_coords` and NOTHING ELSE.** A
// negative like that is exactly what a browser is for; from inside the page every readout still
// exists either way. So this counts what is on the screen before and after, and names the difference.
//
// Two properties the design record insists on, both checked here:
//   * **the units and scenario readouts STAY.** A screenshot of bare numbers that does not say what
//     they are is worse than one with a coordinate tracker in it.
//   * **it is not stored.** It is a mode you hold while taking pictures; persisting it would let a
//     user lose the mode line permanently with nothing to blame. A reload brings everything back.

const { Session } = require('../lib/session');

// **THE BUTTON NAMES THE ACT, SO ITS NAME FLIPS** -- "Hide map readouts" / "Show map
// readouts". That is the one documented exception to dev/toolbar-icons.md's rule that a
// toggle keeps one name, and it is why the label lives here once: a spec that typed
// "Clean map" inline broke the day Wave 0 gave the control a name that says what it does.
const CLEAN_ON = 'Hide map readouts';

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
async function pressed(a) {
	return a.page.evaluate(() => {
		const b = document.getElementById('lpn_clean_map_btn');
		return b ? b.getAttribute('aria-pressed') : null;
	});
}
async function viewRow(a, startsWith) {
	return (await a.menuRows('view')).find(r => r.label.indexOf(startsWith) === 0) || null;
}

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		await a.dismissGallery();
		await a.makeEdit();

		const before = await strip(a);
		report.ok(GONE.every(id => before[id]), 'set up: the mode line and the coordinate tracker are on screen',
			JSON.stringify(before));
		report.eq(await pressed(a), 'false', 'the toolbar button starts unpressed');

		// ---- the toolbar button ------------------------------------------------------------------
		await a.toolbarClick(CLEAN_ON);
		await a.settle(300);
		const clean = await strip(a);
		report.ok(GONE.every(id => !clean[id]), 'the camera button takes the mode line and the tracker away',
			JSON.stringify(clean));
		report.eq(await pressed(a), 'true', '...and says so, because the mode is invisible on the map itself');

		const others = Object.keys(before).filter(id => GONE.indexOf(id) < 0);
		report.ok(others.length > 0, 'set up: there is something else on the strip to leave alone',
			others.join(', '));
		report.ok(others.every(id => clean[id] === before[id]),
			'...and NOTHING ELSE went with them — the units and scenario readouts stay',
			'bare numbers that do not say what they are is a worse screenshot, not a better one');
		report.eq(await a.nodeCount(), 1, 'the network is untouched — this is a readout mode, not a view');

		// ---- and back again ----------------------------------------------------------------------
		await a.toolbarClick(CLEAN_ON);
		await a.settle(300);
		report.eq(JSON.stringify(await strip(a)), JSON.stringify(before),
			'pressing it again puts every one of them back, and changes nothing else');
		report.eq(await pressed(a), 'false', '...and the button unpresses');

		// ---- the View menu says what it will DO --------------------------------------------------
		let row = await viewRow(a, CLEAN_ON);
		report.ok(!!row, 'the View menu offers it too', row && row.label);
		await a.menuClick(row.label, 'view');
		await a.settle(300);
		const viaMenu = await strip(a);
		report.ok(GONE.every(id => !viaMenu[id]), '...and the menu row is the same toggle, not a second one');
		report.eq(await pressed(a), 'true', '...so the toolbar button follows it');
		row = await viewRow(a, 'Show map readouts');
		report.ok(!!row, 'the row then reads "Show map readouts" — it states what it will do',
			'this menu has no checkmark column, so the label carries the state');
		await a.menuClick(row.label, 'view');
		await a.settle(300);
		const back = await strip(a);
		report.ok(GONE.every(id => back[id]), '...and it toggles back', JSON.stringify(back));

		// ---- it is not stored --------------------------------------------------------------------
		await a.toolbarClick(CLEAN_ON);
		await a.settle(300);
		report.eq(await pressed(a), 'true', 'set up: clean map is on');
		await a.reload();
		await a.settle(400);
		const after = await strip(a);
		report.ok(GONE.every(id => after[id]),
			'a reload brings the readouts back — the mode is NOT stored, and could not be lost for good',
			JSON.stringify(after));
		report.eq(await pressed(a), 'false', '...and the button is unpressed again');

		report.eq(a.errors.length, 0, 'no uncaught JavaScript', a.errors[0] || '');
	} finally {
		await a.close();
	}
};
