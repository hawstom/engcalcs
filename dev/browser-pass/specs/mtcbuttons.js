// §37 — Manning Trapezoidal Channel: typing a number turns its button off, and KEEPS the number.
//
// Tom, 2026-08-25, reporting it as urgent: *"Manning is broken related to the n buttons"*, and then
// precisely: *"It eats the first digit typed when the buttons are on, using the first digit typed to
// blank the button."*
//
// **THIS IS AN EVENT-ORDER DEFECT AND NO HEADLESS HARNESS CAN SEE IT.** `dev/calc-spike/` calls
// `EngCalcs.pageCalculator(objForm)` directly, so it exercises the arithmetic with the form already
// in whatever state the test set — there is no typing, no `input` event and therefore no ordering to
// get wrong. Every headless check passed while the page ate keystrokes. The cause:
//
//   * `n_in` carries `oninput="EngCalcs.submitForm();"` as an INLINE ATTRIBUTE, registered when the
//     element is parsed;
//   * `js/manning-trap.js` registered its "un-check the radio" listener at DOMContentLoaded, LATER;
//   * both fire on `input`, in registration order, so the calculator ran while the radio was still
//     checked, saw `n_radio !== ''`, and overwrote the box with the computed n.
//
// The digit was gone before the radio ever un-checked. The fix un-checks on `beforeinput`, which
// fires before the value changes and so before either `input` handler.
//
// **WHAT THIS GUARDS THAT A UNIT TEST CANNOT:** that the user's own keystroke survives a page which
// is also writing into the same box. That is `mtc_`'s local form of the suite's absolute rule — a
// calculator stores what the user typed.

const { Session } = require('../lib/session');

exports.title = '37. Manning Trap: buttons vs. typing';

const PAGE = 'Manning-Trap.php?ec_nolog=1';

async function state(page) {
	return page.evaluate(() => {
		const f = document.forms['formInput'];
		return {
			n: f['n_in'].value, nRadio: f['n_radio'].value,
			d50: f['d50_in'].value, d50Radio: f['d50_radio'].value,
			q: (document.getElementById('q') || {}).innerHTML
		};
	});
}
const numeric = (v) => v !== '' && isFinite(parseFloat(v));

async function retype(page, id, text) {
	await page.click('#' + id);
	await page.keyboard.press('Control+A');
	await page.keyboard.type(text);
	await page.waitForTimeout(500);
}

exports.run = async function ({ browser, report }) {
	const a = await Session.open(browser, 'A');
	try {
		await a.goto(PAGE);
		await a.settle(400);

		const fresh = await state(a.page);
		report.eq(fresh.nRadio, '', 'the page opens with no roughness button chosen');
		report.ok(numeric(fresh.n) && numeric(fresh.q), 'and it opens on numbers', JSON.stringify(fresh));

		// ---- the buttons themselves still work, both of them, together --------------------------
		await a.page.click('#n_radio_bb');
		await a.settle(350);
		await a.page.click('#d50_radio_isbash');
		await a.settle(350);
		const both = await state(a.page);
		report.eq(both.nRadio, 'bb', 'B/B stays chosen when the rock-size button is chosen after it');
		report.eq(both.d50Radio, 'isbash', '...and the rock-size button is chosen too');
		report.ok(numeric(both.n) && numeric(both.d50) && numeric(both.q),
			'...and nothing is blank with both buttons on', JSON.stringify(both));

		// ---- THE DEFECT: the first digit typed --------------------------------------------------
		await retype(a.page, 'n_in', '0.030');
		const typedN = await state(a.page);
		report.eq(typedN.n, '0.030', 'the roughness a user types SURVIVES -- it is not eaten');
		report.eq(typedN.nRadio, '', '...and typing it turns its own button off');
		report.eq(typedN.d50Radio, 'isbash', '...while the OTHER button is left alone');
		report.ok(numeric(typedN.d50) && numeric(typedN.q),
			'...and the page still answers', JSON.stringify(typedN));

		await retype(a.page, 'd50_in', '6');
		const typedD = await state(a.page);
		report.eq(typedD.d50, '6', 'the rock size a user types survives too');
		report.eq(typedD.d50Radio, '', '...and turns its own button off');
		report.eq(typedD.n, '0.030', '...and does NOT disturb the roughness already typed');

		// ---- and a button chosen AFTER typing still overrides, which is the whole point of it ----
		await a.page.click('#n_radio_strickler');
		await a.settle(400);
		const after = await state(a.page);
		report.eq(after.nRadio, 'strickler', 'choosing a button after typing still selects it');
		report.ok(numeric(after.n) && after.n !== '0.030',
			'...and it does replace the typed number, which is what the button is for', after.n);

		report.eq(a.errors.length, 0, 'no uncaught JavaScript');
	} finally {
		await a.close();
	}
};
