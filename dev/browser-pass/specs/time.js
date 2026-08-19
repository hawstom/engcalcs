// §26 — time modelling: the clock is editable and the run moves (ROADMAP Task 248).
//
// WHAT IS HERE AND WHY IT IS NOT IN A HARNESS. `dev/lpn-spike/eps-net3-harness.js` owns the
// physics: it runs Net3 against EPA's own published 24-hour report at every reporting step, and
// nothing a browser can do checks a number better than that. `dev/lpn-spike/time-harness.js` owns
// the arithmetic of an edit. What is left is three facts about a real page, and only a real page
// has them:
//
//   1. **A TIME SETTING IS EDITABLE AND ITS OWN TEXT SURVIVES THE EDIT.** `24:00` must still read
//      `24:00` after the box has been through a round trip, not `86400` and not `24`.
//   2. **THE TRANSPORT MOVES THE MAP.** Stepping the clock has to change what is drawn. A step
//      selector that changes only its own readout looks identical in every screenshot.
//   3. **A TANK FILLS.** The one number that separates a run from a series of instants, seen the
//      way a user sees it — on the page, at two different times.
//   4. **IT PLAYS WITH THE BOTTOM PANE SHUT.** The transport is on the toolbar as of 2026-08-18
//      precisely so it can, and the pane tab's old pause-on-hide hook would silently undo that.
//
// Every check here is skipped rather than failed while `js/lpn-time.js` is not loaded by
// Looped-Network.php, because "the page does not have this feature yet" and "the feature is broken"
// are different sentences and a red line must only ever mean the second.

const { Session } = require('../lib/session');

exports.title = '26. Time modelling';

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();

		const wired = await a.page.evaluate(() => !!(window.EngCalcs && window.EngCalcs.lpnTimeRun));
		if (!wired) {
			report.skip('the clock is on the page', 'Looped-Network.php does not load js/lpn-time.js yet');
			return;
		}

		// Net3 is the network with a duration, patterns, controls and three tanks in it.
		const opened = await a.page.evaluate(async () => {
			const cards = [...document.querySelectorAll('#lpn_examples_pane .lpn-example-card')];
			const card = cards.find(c => /Net3/.test(c.textContent));
			if (!card) { return false; }
			card.click();
			return true;
		});
		report.ok(opened, 'the examples gallery offers Net3');
		await a.settle(1500);

		// **THE PANE HAS TO BE OPEN FIRST.** Its tab strip and panels are built when it opens, so
		// clicking a tab id while it is closed reaches nothing — which is what a spec that only
		// clicked the tab discovered, as three failures that looked like a missing feature.
		await a.toolbarClick('Bottom panel');
		await a.settle(500);
		await a.page.evaluate(() => {
			const b = document.getElementById('lpn_pane_tab_time');
			if (b) { b.click(); }
		});
		await a.settle(600);
		report.ok(await a.page.evaluate(() => !!document.getElementById('lpn_pane_time')),
			'the pane offers a Time tab');

		// ---- 1. the settings, and the file's own text ----
		//
		// **THE SEVEN FIELDS ARE IN THE SETTINGS BOX NOW** (ROADMAP Task 441). Tom moved them out of
		// this tab because a run duration is a property of the whole project; the tab kept the
		// TRANSPORT, which changes only which moment you are looking at. So the tab must offer a
		// door to them, and this uses that door rather than reaching for the box directly — a door
		// nobody can find is the actual risk of the move.
		await a.page.evaluate(() => {
			const b = [...document.querySelectorAll('#lpn_pane_time button')]
				.find(x => /setting/i.test(x.textContent + ' ' + (x.title || '')));
			if (b) { b.click(); }
		});
		await a.settle(600);
		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_settings_box').style.display === 'flex'),
			'the Time tab has a door to the time settings, and it opens the Settings box');

		const fields = await a.page.evaluate(() =>
			[...document.querySelectorAll('#lpn_set_time_fields input[type="text"]')].map(i => i.value));
		report.ok(fields.length === 7, 'all seven time settings are on the page', fields.join(' | '));
		report.ok(fields[0] === '24:00', "Net3's duration reads as the file wrote it, 24:00", fields[0]);

		// Type a new one and read it back. THE TYPED TEXT IS WHAT COMES BACK, not a reformatting of
		// it: `36:00` must not return as `36` and `129600` must not appear anywhere.
		await a.page.evaluate(() => {
			const i = document.querySelector('#lpn_set_time_fields input[type="text"]');
			i.value = '12:00';
			i.dispatchEvent(new Event('change', { bubbles: true }));
		});
		await a.settle(1500);
		const after = await a.page.evaluate(() =>
			document.querySelector('#lpn_set_time_fields input[type="text"]').value);
		report.ok(after === '12:00', 'an edited duration comes back exactly as typed', after);
		// The box is closed again before the transport is worked: it is a big box in the middle of
		// the window, and the readouts below are in the pane underneath it.
		await a.page.evaluate(() => { document.getElementById('lpn_setbox_close').click(); });
		await a.settle(300);

		// **THE TRANSPORT IS ON THE TOOLBAR NOW** (Tom, 2026-08-18: "so you can hide the bottom pane
		// or watch a profile during animation"), and the step selector is the ONE control that says
		// which moment is showing -- the pane's slider is gone rather than mirrored, because two
		// controls for one current step are two controls that can disagree.
		const stops = await a.page.evaluate(() => {
			const s = document.getElementById('lpn_time_step');
			return s ? s.options.length : 0;
		});
		report.ok(stops === 13, 'a 12 hour run at a 1 hour report step gives 13 stops', String(stops));

		// ---- 2 and 3. the transport moves the map, and a tank fills ----
		function readState() {
			return a.page.evaluate(() => {
				const sel = document.getElementById('lpn_time_step');
				const out = sel && sel.options[sel.selectedIndex];
				const rows = [...document.querySelectorAll('#lpn_pane_time table tr')].slice(1)
					.map(r => [...r.children].map(c => c.textContent).join('='));
				// A label on the map, so this is what is DRAWN and not what is stored.
				const labels = [...document.querySelectorAll('#lpn_canvas text')].map(t => t.textContent).join('|');
				return { clock: out ? out.textContent : '', tanks: rows.join(' '), labels };
			});
		}
		const t0 = await readState();
		report.ok(/0:00/.test(t0.clock), 'the transport opens at the start of the run', t0.clock);
		report.ok(t0.tanks.length > 0, 'and the tank levels are listed', t0.tanks);

		await a.page.evaluate(() => {
			const s = document.getElementById('lpn_time_step');
			s.value = String(s.options.length - 1);
			s.dispatchEvent(new Event('change', { bubbles: true }));
		});
		await a.settle(700);
		const t1 = await readState();
		report.ok(t1.clock !== t0.clock, 'choosing another step moves the clock', t0.clock + ' → ' + t1.clock);
		report.ok(t1.tanks !== t0.tanks, 'and the tanks are at different levels — they filled',
			t0.tanks + '  →  ' + t1.tanks);
		report.ok(t1.labels !== t0.labels, 'and the map itself is redrawn, not just the readout');

		// **THE DOCUMENT IS NOT TOUCHED BY A RUN.** A tank's stored level is the user's initial
		// condition; the level at hour 12 is a result. If the run has written one into the other,
		// re-opening the file would start the network somewhere it never was.
		// **THE OPEN project, found through the index** — `Object.keys(localStorage).find(/^lpn_project/)`
		// returns whichever key the browser happens to enumerate first, which is the empty tab this
		// session opened with; the check then read three tanks out of a network that has none and
		// failed with an empty string that looked exactly like a write-back.
		// A tank's level is `_level`, not `level`: it is scenario-overridable, so it carries the
		// leading underscore effective() reads through.
		const stored = await a.page.evaluate(() => {
			const idx = JSON.parse(localStorage.getItem('lpn_index') || 'null');
			if (!idx || !idx.openId) { return null; }
			const raw = localStorage.getItem('lpn_project_' + idx.openId);
			if (!raw) { return null; }
			return JSON.parse(raw).nodes.filter(n => n.type === 'tank')
				.map(n => (n._level === undefined ? '?' : n._level)).join(',');
		});
		// Compared as NUMBERS. The readout prints 13.10 and the document holds 13.1 — the same level,
		// two decimals apart, and a string comparison calls that a write-back.
		const num = (t) => (t || '').match(/-?\d+(?:\.\d+)?/g).map(Number);
		const same = stored !== null &&
			num(stored).length === num(t0.tanks).length / 2 - 0 &&
			num(stored).every((v, i) => Math.abs(v - num(t0.tanks).filter((_, k) => k % 2 === 1)[i]) < 1e-9);
		// ---- 4. IT PLAYS WITH THE PANE SHUT, which is the whole reason it moved ----
		//
		// Tom, 2026-08-18: "so you can hide the bottom pane or watch a profile during animation."
		// The Time tab used to pause the run when it stopped being the tab showing; with the
		// transport on the toolbar that hook is exactly backwards, and only a real page can tell
		// whether it is still there. Speed is turned up first so a few frames pass in well under a
		// second — which also exercises the speed control being a real control.
		await a.toolbarClick('Bottom panel');   // shut it
		await a.settle(300);
		const before = await a.page.evaluate(() => {
			const sp = document.getElementById('lpn_time_speed');
			sp.value = '4';
			sp.dispatchEvent(new Event('change', { bubbles: true }));
			const s = document.getElementById('lpn_time_step');
			s.value = '0';
			s.dispatchEvent(new Event('change', { bubbles: true }));
			return s.value;
		});
		await a.settle(400);
		await a.page.evaluate(() => {
			const b = [...document.querySelectorAll('#lpn_toolbar button')]
				.find(x => x.getAttribute('aria-label') === 'Play');
			if (b) { b.click(); }
		});
		await a.settle(900);
		const moved = await a.page.evaluate(() => ({
			step: document.getElementById('lpn_time_step').value,
			pressed: [...document.querySelectorAll('#lpn_toolbar button')]
				.find(x => x.getAttribute('aria-label') === 'Play').getAttribute('aria-pressed')
		}));
		report.ok(moved.pressed === 'true', 'Play reports itself pressed while it runs');
		report.ok(moved.step !== before, 'and the run advances with the bottom pane shut',
			before + ' → ' + moved.step);
		await a.page.evaluate(() => {
			const b = [...document.querySelectorAll('#lpn_toolbar button')]
				.find(x => x.getAttribute('aria-label') === 'Play');
			if (b) { b.click(); }
		});
		await a.settle(500);
		const stopped = await a.page.evaluate(() => document.getElementById('lpn_time_step').value);
		await a.settle(600);
		report.eq(await a.page.evaluate(() => document.getElementById('lpn_time_step').value), stopped,
			'and the same button stops it');

		report.ok(same, 'the stored tank levels are still the ones the run STARTED from',
			String(stored) + '  vs start ' + t0.tanks);
	} finally {
		await a.close();
	}
};
