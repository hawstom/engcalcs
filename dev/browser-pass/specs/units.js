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
		report.ok(/enter/i.test(strip[0].head) && /answer/i.test(strip[1].head),
			'...one for what you enter, one for the answers', strip.map(g => g.head).join(' | '));
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
