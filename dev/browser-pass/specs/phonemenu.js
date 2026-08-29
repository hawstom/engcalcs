// §  A SUBMENU HAS TO OPEN ON A PHONE, AND WATER > INSERT DOES NOT.
//
// Tom, 2026-08-29: *"Map.Insert menu is broken on phone. Does nothing. Until it's fixed, I can't
// test 417."* Every other spec in this folder runs at 1400x1200 — `Session.VIEWPORT`, deliberately,
// because this page is designed for a full window. **That is exactly why this defect could exist:
// nothing automated had ever opened a menu at a phone's width.**
//
// It is also not findable by reading the stylesheet, which is what `dev/lpn-spike/small-screen-
// harness.js` does. A fly-out is placed by arithmetic in openPanelAtAnchor() against
// `getBoundingClientRect()` and `window.innerWidth`, and the DOM stub in dev/lpn-spike has no
// layout at all — every rect there is zero. So this is a browser question and only a browser can
// answer it.
//
// WHAT IS ASSERTED, and the order matters because each later check is vacuous if an earlier one
// fails: the row exists; pressing it makes #lpn_menu_popup2 VISIBLE; the fly-out has a non-zero box
// ON SCREEN; and its rows can actually be pressed to arm a tool. "Does nothing" could be any of
// those, and the spec should say which.

const { Session } = require('../lib/session');

exports.title = 'Phone width: a submenu opens and can be used';

// A narrow phone in tall mode — the orientation Tom uses and the one the sanctioned claim names.
// 360x740 is the commonest Android viewport and is what dev/lpn-spike/small-screen-harness.js
// asserts the stylesheet at, so the two agree about what "a phone" means here.
const PHONE = { width: 360, height: 740 };

exports.run = async function ({ browser, report }) {
	const context = await browser.newContext({ viewport: PHONE });
	const page = await context.newPage();
	const errors = [];
	page.on('pageerror', (e) => errors.push(String(e.stack || e)));
	try {
		const a = new Session(context, page, 'phone');
		await a.goto();

		// The menu bar is icons at this width, so the button is found by its id, not its word. The
		// id is `lpn_menu_project` and the LABEL is Water: the menu was renamed under Task 543 and
		// the id was deliberately not, so nothing that keys on it had to move.
		await page.click('#lpn_menu_project');
		await page.waitForSelector('#lpn_menu_popup', { state: 'visible' });

		const rows = await page.$$eval('#lpn_menu_list button.lpn-menu-row',
			(els) => els.map(e => ({
				label: e.textContent.replace('▸', '').trim(),
				submenu: !!e.querySelector('.lpn-menu-arrow')
			})));
		const insert = rows.find(r => /Insert/i.test(r.label));
		report.ok(!!insert, 'Water > Insert is in the menu at 360px',
			JSON.stringify(rows.map(r => r.label)));
		report.ok(insert && insert.submenu, '...and is marked as leading to a fly-out');

		// **THE PRESS.** Not a synthetic event: a real click at the row's own coordinates, which is
		// what a finger produces and what the pointer/click pair on the row actually listens for.
		const handles = await page.$$('#lpn_menu_list button.lpn-menu-row');
		let target = null;
		for (const h of handles) {
			const t = (await h.textContent()).replace('▸', '').trim();
			if (/Insert/i.test(t)) { target = h; break; }
		}
		if (target) { await target.click(); }
		await page.waitForTimeout(150);

		const sub = await page.evaluate(() => {
			const p = document.getElementById('lpn_menu_popup2');
			if (!p) { return { exists: false }; }
			const r = p.getBoundingClientRect();
			return {
				exists: true,
				display: p.style.display,
				left: Math.round(r.left), top: Math.round(r.top),
				width: Math.round(r.width), height: Math.round(r.height),
				rows: p.querySelectorAll('button.lpn-menu-row').length,
				vw: window.innerWidth, vh: window.innerHeight
			};
		});

		report.ok(sub.exists && sub.display === 'block',
			'pressing Insert makes the fly-out visible', JSON.stringify(sub));
		report.ok(sub.width > 0 && sub.height > 0,
			'...with a real box, not a collapsed one', JSON.stringify(sub));
		// **ON SCREEN, which is the check the arithmetic can fail without erroring.** A fly-out is
		// placed BESIDE its row; at 360px there is no beside, so the flip-and-clamp has to land it
		// somewhere a thumb can reach rather than off the left edge or below the fold.
		report.ok(sub.left >= 0 && sub.left + sub.width <= sub.vw,
			'...horizontally within the viewport', JSON.stringify(sub));
		report.ok(sub.top >= 0 && sub.top < sub.vh,
			'...and its top is on screen', JSON.stringify(sub));
		report.ok(sub.rows >= 6, '...carrying the asset rows', JSON.stringify(sub));

		// **AND IT IS USABLE**, which is the whole of "does nothing": a fly-out that is visible but
		// whose rows do not arm a tool is the same failure to the person holding the phone.
		const armed = await page.evaluate(async () => {
			const rows = Array.from(document.querySelectorAll('#lpn_menu_list2 button.lpn-menu-row'));
			const j = rows.find(e => /junction/i.test(e.textContent));
			if (!j) { return 'no Junction row'; }
			j.click();
			await new Promise(r => setTimeout(r, 100));
			const btn = document.querySelector('#lpn_toolbar button[aria-pressed="true"]');
			return btn ? (btn.getAttribute('aria-label') || btn.title || 'pressed') : 'nothing armed';
		});
		report.ok(/junction/i.test(String(armed)),
			'...and choosing Junction arms the Add-junction tool', String(armed));

		report.eq(errors.length, 0, 'no page error while doing any of it', errors.join('\n'));
	} finally {
		await context.close();
	}
};
