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
//   3. **IT PLAYS WITH THE BOTTOM PANE SHUT.** The transport is on the toolbar as of 2026-08-18
//      precisely so it can, and the pane tab's old pause-on-hide hook would silently undo that.
//   4. **THERE IS NO TIME TAB.** Tom, 2026-08-19: "No need for this to have a tab in the bottom
//      pane. Remove the tab and what's on it."
//   5. **WHAT AN EDIT COSTS.** The one claim behind the 2026-08-19 change is a COUNT of engine
//      calls provoked by a hand on a mouse, and there is no way to count that outside a browser.
//      dev/lpn-spike/time-harness.js owns the rule those counts follow.
//
// **WHAT WENT WITH THE TAB WAS THE ONLY READOUT OF A TANK FILLING**, which this file used to check
// on the page ("the tanks are at different levels — they filled"). The claim is not dropped, it has
// moved to where the numbers now live: the frames themselves, through EngCalcs.lpnTimeFrameResult.
// Put it back on the page as a column of a tank table and this check should read the table again.
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

		// **THE TAB IS GONE, PANEL AND ALL.** The pane is opened and its whole tab strip read: a
		// removal has to be checked on the strip the user actually sees, not by asking whether one
		// id happens to be absent.
		await a.toolbarClick('Bottom panel');
		await a.settle(600);
		const strip = await a.page.evaluate(() => ({
			tabs: [...document.querySelectorAll('#lpn_pane_tabs [role="tab"], .lpn-pane-tab')]
				.map(b => (b.textContent || '').trim()).filter(Boolean),
			panel: !!document.getElementById('lpn_pane_time'),
			tab: !!document.getElementById('lpn_pane_tab_time')
		}));
		report.ok(!strip.tab && !strip.panel, 'the bottom pane has no Time tab and no Time panel',
			strip.tabs.join(' | '));
		report.ok(strip.tabs.length > 0, '...and the other tabs are still there', strip.tabs.join(' | '));

		// ---- 1. the settings, and the file's own text ----
		//
		// **THE SEVEN FIELDS ARE IN THE SETTINGS BOX** (ROADMAP Task 441). A run duration is a
		// property of the whole project; the transport, which changes only which moment you are
		// looking at, is on the toolbar. Those two homes are why the tab had nothing left to be.
		await a.toolbarClick('Settings');
		await a.settle(600);
		report.ok(await a.page.evaluate(() =>
			document.getElementById('lpn_settings_box').style.display === 'flex'),
			'the Settings box opens on the toolbar button');

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

		// ---- 2. the transport moves the map, and a tank fills ----
		//
		// The tank levels are read out of the RUN rather than off the page: nothing draws them since
		// the tab went. Same claim, one layer lower.
		function readState() {
			return a.page.evaluate(() => {
				const sel = document.getElementById('lpn_time_step');
				const out = sel && sel.options[sel.selectedIndex];
				const f = window.EngCalcs.lpnTimeCurrentFrame();
				const lv = (f && f.levels) || {};
				// **A FRAME ANSWERS IN SI**, like every other result; the tank's own stored level is
				// in the elevation/head unit the user typed it in. Converted through the page's own
				// unit select and factor table, so this reads the level the way the document does --
				// which is what makes the comparison with the stored number below meaningful.
				const uSel = document.querySelector('[name="lpn_u_elevhead"]');
				const fac = window.EngCalcs.unitFactor(uSel);
				const tanks = Object.keys(lv).sort()
					.map(k => k + '=' + (+lv[k] * fac).toFixed(2)).join(' ');
				// A label on the map, so this is what is DRAWN and not what is stored.
				const labels = [...document.querySelectorAll('#lpn_canvas text')].map(t => t.textContent).join('|');
				return { clock: out ? out.textContent : '', tanks, labels };
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

		// ---- 5. WHEN A PERIOD RUN HAPPENS (Task 248, 2026-08-19) ----
		//
		// Until this change every edit re-ran the whole period through EPANET, and the cost is per
		// FRAME: measured on this very network, 40-250 ms at its own 1 hour report step and 2972 ms
		// at a 1 minute one (dev/lpn-spike/eps-cost-bench.js). Tom, 2026-08-19: "the multiplied
		// burden of recalculating every time step at every value change ... not good for data entry
		// efficiency."
		//
		// **THE ENGINE CALLS ARE COUNTED, NOT INFERRED.** EngCalcs.lpnEpanetRun is wrapped in the
		// page and real gestures are performed against it, because every claim here is a claim about
		// a number. dev/lpn-spike/time-harness.js owns the rule those numbers follow; this owns the
		// one thing only the real page can answer -- what a hand on a mouse actually provokes.
		await a.page.evaluate(() => {
			const EC = window.EngCalcs;
			window.__runs = 0;
			const orig = EC.lpnEpanetRun;
			window.__runAt = [];
			EC.lpnEpanetRun = function () { window.__runs++; window.__runAt.push(Date.now()); return orig.apply(this, arguments); };
		});

		// **THE NODE IS CHOSEN BY WHAT IS ACTUALLY AT THE POINT**, the way Session.makeEdit() does
		// and for the same reason: a drag that lands on nothing makes "no run was provoked" pass
		// for the worst possible reason. `[data-node]` is the circle the page's own hit test reads
		// (js/looped-network.js) -- the drawn SYMBOL beside it is not draggable, and a drag that
		// starts on it PANS THE MAP, which moves every element on screen without touching the
		// document. That near-miss is exactly how this section first passed while testing nothing.
		const box = await a.page.evaluate(() => {
			const canvas = document.getElementById('lpn_canvas');
			const cr = canvas.getBoundingClientRect();
			for (const el of canvas.querySelectorAll('[data-node]')) {
				const r = el.getBoundingClientRect();
				const x = r.x + r.width / 2, y = r.y + r.height / 2;
				if (r.width < 2 || x < cr.x + 60 || x > cr.right - 60) { continue; }
				if (y < cr.y + 60 || y > cr.bottom - 60) { continue; }
				if (document.elementFromPoint(x, y) !== el) { continue; }
				return { x, y, id: el.getAttribute('data-node') };
			}
			return null;
		});
		report.ok(!!box, 'a draggable element is reachable on the map');
		let at = { x: box.x, y: box.y };
		async function dragOnce() {
			await a.page.mouse.move(at.x, at.y);
			await a.page.mouse.down();
			await a.page.mouse.move(at.x + 5, at.y + 2, { steps: 2 });
			await a.page.mouse.move(at.x + 10, at.y + 5, { steps: 3 });
			await a.page.mouse.up();
			at = { x: at.x + 10, y: at.y + 5 };
		}
		// A hydraulic edit, through the page's own controls: the run duration is a number every
		// frame depends on. Chosen over placing a junction because an isolated new node is a
		// DIAGNOSTIC, and a network that fails lpnDiagnose() never reaches the run at all.
		async function editDuration(text) {
			await a.toolbarClick('Settings');
			await a.settle(400);
			await a.page.evaluate((v) => {
				const i = document.querySelector('#lpn_set_time_fields input[type="text"]');
				i.value = v;
				window.__editAt = Date.now();
				i.dispatchEvent(new Event('change', { bubbles: true }));
			}, text);
			await a.page.evaluate(() => { document.getElementById('lpn_setbox_close').click(); });
			await a.settle(200);
		}

		// **THREE DRAGS AT A HAND'S CADENCE COST NOTHING AT ALL** -- half a second apart, which is
		// longer than the 300 ms solve debounce and therefore the case a debounce does nothing for.
		// Measured against the code as it stood before this change: three drags, three full 25-frame
		// runs through EPANET, one per drag. A drag cannot change one flow, so the page now asks
		// whether the model it would hand the solver actually changed, and it has not.
		for (let i = 0; i < 3; i++) { await dragOnce(); await a.settle(500); }
		await a.settle(1500);
		const dragged = await a.page.evaluate((id) => {
			const r = document.querySelector('[data-node="' + id + '"]').getBoundingClientRect();
			return {
				runs: window.__runs, x: r.x + r.width / 2, y: r.y + r.height / 2,
				frames: window.EngCalcs.lpnTimeRunState().frames,
				frame: !!window.EngCalcs.lpnTimeCurrentFrame()
			};
		}, box.id);
		report.ok(Math.abs(dragged.x - box.x) > 4, 'the drags moved an element -- these are real edits',
			`${box.x.toFixed(0)},${box.y.toFixed(0)} -> ${dragged.x.toFixed(0)},${dragged.y.toFixed(0)}`);
		report.eq(dragged.runs, 0, 'THREE DRAGS PROVOKE NO PERIOD RUN AT ALL -- it was three, one per drag',
			String(dragged.runs));
		report.ok(dragged.frames > 0 && dragged.frame,
			'...and the run is KEPT, because nothing the solver reads changed', `${dragged.frames} frames`);

		// **A HYDRAULIC EDIT IS A DIFFERENT MATTER.** The frames describe a network that no longer
		// exists, so they go, and what is drawn falls back to the first reporting time of the
		// document as it now stands.
		// The idle wait is stretched for this one read, so "did the edit itself run the period?" is
		// answered by the code rather than by a race between two timers. It goes back to a short one
		// immediately below, where the automatic run is what is being checked.
		await a.page.evaluate(() => { window.__runs = 0; window.EngCalcs.LPN_TIME_AUTO.idleMs = 4000; });
		await editDuration('10:00');
		// Read after the 300 ms solve debounce and well before the idle re-run: whether the frames
		// still match is a question about the MODEL, and the model is not assembled until that
		// solve. For those 300 ms the frames are exactly as stale as every label on the map, which
		// is the property that matters -- see the note in js/lpn-time.js where the eager
		// invalidation used to be.
		await a.settle(300);
		const edited = await a.page.evaluate(() => ({
			runs: window.__runs,
			frame: !!window.EngCalcs.lpnTimeCurrentFrame(),
			state: window.EngCalcs.lpnTimeRunState()
		}));
		report.eq(edited.runs, 0, 'a hydraulic edit does not run the period as it lands',
			String(edited.runs) + ' at ' + JSON.stringify(await a.page.evaluate(() => window.__runAt.map(t => t - window.__editAt))));
		report.ok(!edited.frame, 'and the frames of the network that no longer exists are gone',
			JSON.stringify(edited.state));
		report.eq(edited.state.t, 0,
			'the transport is back at the first reporting time, which is the one moment that HAS been worked out');

		// ...and it comes back by itself, because this network is cheap enough to be worth running
		// unasked. That is the measurement talking: see EC.LPN_TIME_AUTO.
		await a.page.evaluate(() => { window.EngCalcs.LPN_TIME_AUTO.idleMs = 900; });
		await editDuration('11:00');
		await a.settle(2500);
		const settled = await a.page.evaluate(() => ({
			runs: window.__runs,
			frames: window.EngCalcs.lpnTimeRunState().frames,
			ms: Math.round(window.EngCalcs.lpnTimeRunState().lastRunMs),
			note: window.EngCalcs.lpnTimeStatusNote()
		}));
		report.eq(settled.runs, 1, 'ONE run once the editing stops', String(settled.runs));
		report.ok(settled.frames > 0, 'the period is worked out again without anybody asking',
			settled.frames + ' frames, last run ' + settled.ms + ' ms');
		report.eq(settled.note, '', 'and the page says nothing, because there is nothing out of date');

		// **AN EXPENSIVE NETWORK STOPS VOLUNTEERING.** The budget is dropped to zero rather than a
		// 1-minute report step being typed in, so the check takes a second instead of a minute and
		// tests the branch rather than the arithmetic that reaches it (which time-harness.js owns).
		await a.page.evaluate(() => {
			window.EngCalcs.LPN_TIME_AUTO.budgetMs = 0;
			window.__runs = 0;
		});
		await editDuration('9:00');
		await a.settle(2500);
		const manual = await a.page.evaluate(() => ({
			runs: window.__runs,
			frame: !!window.EngCalcs.lpnTimeCurrentFrame(),
			note: window.EngCalcs.lpnTimeStatusNote(),
			status: (document.getElementById('lpn_status') || {}).textContent || ''
		}));
		report.eq(manual.runs, 0, 'a network that costs more than the budget does not re-run itself at all');
		report.ok(!manual.frame, 'and still never leaves a stale frame behind');
		report.ok(manual.note.length > 0 && manual.status.indexOf(manual.note) >= 0,
			'the status bar SAYS the later times are not being kept up to date', manual.status);

		// ...and the button is what brings them back. It is on the toolbar, in the transport's own
		// group, named Run because EPANET's own command is Run Analysis.
		await a.toolbarClick('Run');
		await a.settle(2500);
		const ran = await a.page.evaluate(() => ({
			runs: window.__runs,
			frames: window.EngCalcs.lpnTimeRunState().frames,
			note: window.EngCalcs.lpnTimeStatusNote()
		}));
		report.eq(ran.runs, 1, 'Run works the whole period out');
		report.ok(ran.frames > 0, 'the frames are back', String(ran.frames));
		report.eq(ran.note, '', 'and the page stops warning about them');
		await a.page.evaluate(() => { window.EngCalcs.LPN_TIME_AUTO.budgetMs = 400; });
	} finally {
		await a.close();
	}
};
