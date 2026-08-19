// §13 — the units strip is two groups (ROADMAP Task 422).
//
// Tom switched Net3's flow unit from gpm to cfs and a 6,104 gpm main read 1,338 cfs. Nothing was
// broken: the demands he typed were REINTERPRETED as cfs, so the network became 449x bigger and the
// solver answered honestly. But "I changed how I read the answers" and "I changed what the model is"
// had the same control, and only one of them was what he meant.
//
// `dev/lpn-spike/unit-split-harness.js` proves the conversion arithmetic and the twin defaults. What
// only a browser can show is the part a person operates: two labelled groups, one that changes
// silently and one that stops and asks — with the select PUT BACK until the question is answered.

const { Session } = require('../lib/session');

exports.title = '13. Units: inputs and results';

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto();
		await a.dismissGallery();

		const strip = await a.page.evaluate(() => [...document.querySelectorAll('#lpn_units_strip .lpn-units-group')]
			.map(x => ({ head: x.querySelector('.lpn-units-head').textContent,
				selects: [...x.querySelectorAll('select')].map(s => s.name) })));

		report.eq(strip.length, 2, 'the strip is two labelled groups');
		// Matched on INPUT/RESULT rather than on the sentence, so the wording can be improved without
		// the spec objecting -- it did, the day the headings became "Input units" / "Results units".
		report.ok(/input/i.test(strip[0].head) && /result/i.test(strip[1].head),
			'...one for the inputs, one for the results', strip.map(g => g.head).join(' | '));

		// **EACH SELECTOR IS TWO LINES: NAME ABOVE, CONTROL BELOW** (ROADMAP Task 424, Tom twice:
		// "the units strip is too wide"). Measured rather than asserted from the markup, because the
		// claim is about LAYOUT: the name's box must sit entirely above the select's, and a stacked
		// pair must be no wider than its own wider half. Side by side, eleven pairs made the widest
		// thing in the Settings box and forced the box to be as wide as the strip.
		//
		// The strip is measured INSIDE the Settings box, where it actually renders — in its parking
		// holder it is display:none and every rect is zero.
		await a.makeEdit();
		await a.toolbarClick('Settings');
		await a.settle(500);
		const items = await a.page.evaluate(() =>
			[...document.querySelectorAll('#lpn_units_strip .lpn-units-item')].map((it) => {
				const name = it.querySelector('.lpn-units-name').getBoundingClientRect();
				const sel = it.querySelector('select').getBoundingClientRect();
				const box = it.getBoundingClientRect();
				return {
					stacked: name.bottom <= sel.top + 1,
					width: box.width,
					widest: Math.max(name.width, sel.width)
				};
			}));
		report.ok(items.length === 11, 'every selector is wrapped as its own item', String(items.length));
		report.ok(items.every(i => i.stacked), 'the name sits ABOVE its control, not beside it',
			String(items.filter(i => !i.stacked).length) + ' still side by side');
		report.ok(items.every(i => i.width <= i.widest + 2),
			'...so a pair is as wide as its wider half, not as wide as both added together');
		// And the strip therefore fits the box it is in, with no sideways scroll of its own.
		report.ok(await a.page.evaluate(() => {
			const c = document.getElementById('lpn_setbox_content');
			return c.scrollWidth <= c.clientWidth + 2;
		}), 'the Settings box does not scroll sideways to show the strip');
		await a.page.evaluate(() => { document.getElementById('lpn_setbox_close').click(); });
		await a.settle(200);
		// The three quantities that serve both sides appear on BOTH rows. That duplication is the
		// whole shape of the task, so it is asserted rather than left to the eye.
		['lpn_u_elevhead', 'lpn_u_pressure', 'lpn_u_flow'].forEach((n) => {
			report.ok(strip[0].selects.indexOf(n) >= 0, n + ' is an input unit');
			report.ok(strip[1].selects.indexOf('lpn_u_r' + n.slice(5)) >= 0,
				'...and has its own result unit beside it');
		});
		report.ok(strip[1].selects.indexOf('lpn_u_velocity') >= 0 &&
			strip[0].selects.indexOf('lpn_u_velocity') < 0,
			'velocity is a result only -- it was never an input');

		// A RESULT unit changes with no fanfare: the solve is untouched and the reading converts.
		await a.page.evaluate(() => {
			const s = document.querySelector('select[name="lpn_u_r_flow"]');
			s.value = 'ft3ps';
			s.dispatchEvent(new Event('change', { bubbles: true }));
		});
		await a.settle(400);
		const afterResult = await a.page.evaluate(() => ({
			dialog: document.getElementById('lpn_dialog').style.display,
			unit: document.querySelector('select[name="lpn_u_r_flow"]').value
		}));
		report.eq(afterResult.dialog, 'none', 'changing a RESULT unit asks nothing');
		report.eq(afterResult.unit, 'ft3ps', '...and takes effect immediately');

		// An INPUT unit is a model change wearing a display control's clothes, so it stops and asks.
		await a.page.evaluate(() => {
			const s = document.querySelector('select[name="lpn_u_flow"]');
			s.value = 'ft3ps';
			s.dispatchEvent(new Event('change', { bubbles: true }));
		});
		await a.settle(400);
		const asked = await a.page.evaluate(() => ({
			dialog: document.getElementById('lpn_dialog').style.display,
			text: document.getElementById('lpn_dialog_body').textContent || '',
			buttons: [...document.querySelectorAll('#lpn_dialog_buttons button')].map(b => b.textContent),
			unit: document.querySelector('select[name="lpn_u_flow"]').value
		}));
		report.eq(asked.dialog, 'block', 'changing an INPUT unit asks first');
		report.eq(asked.buttons.length, 2, '...with two answers');
		report.ok(/Reinterpret/.test(asked.buttons[0]) && /Convert/.test(asked.buttons[1]),
			'...Reinterpret and Convert, in that order', asked.buttons.join(' | '));
		// The fields it decides are NAMED, because that is what makes the question answerable.
		report.ok(/Demand/.test(asked.text), '...naming the fields that unit decides',
			asked.text.replace(/\s+/g, ' ').slice(0, 110));
		// **AND THE SELECT IS PUT BACK UNTIL IT IS ANSWERED.** Nothing acts on the new unit before
		// the choice, which is what makes cancelling possible at all.
		report.eq(asked.unit, 'gpm', 'the select stays on the old unit until the question is answered');

		report.eq(a.errors.length, 0, 'no uncaught JavaScript');
	} finally {
		await a.close();
	}
};
