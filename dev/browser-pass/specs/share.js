// §23 — "Copy link to this calculation" (ROADMAP Task 228).
//
// **NOT the `lpn_` page.** The control is emitted by `echoCalculatorForm()`, so every calculator has
// it and the map page — which has no printable-title row — is the one page that does not. This is
// the only spec in here that drives an ordinary calculator, and it does so through the same
// `Session`, which reaches any page of the suite.
//
// `dev/calc-spike/share-link-harness.js` already owns the LOGIC, and owns it better than a browser
// could: it separates "no clipboard object", "no writeText" and "a writeText that rejects", which
// are three different browsers and would otherwise look alike until somebody is standing in front of
// the third. None of that is repeated here. What a browser adds, and a jsdom cannot have:
//
//   1. **Where the control is.** Under the Printable Subtitle, because naming a calculation is the
//      moment somebody means to put it in front of another person. Measured, not read off the source.
//   2. **A real clipboard.** The harness never touches one; here the copy path runs for real and the
//      link that lands on the system clipboard is compared with the address bar.
//   3. **Focus and selection are browser state.** "Reveals a focused, selected url box" cannot be
//      checked anywhere else — `document.activeElement` and an input's selection range only exist in
//      a browser, and they are the whole of the promise that the failure is not silent.
//   4. **`d-print-none` under real print media.** A class name in the markup is not a rule that fired.

const { Session } = require('../lib/session');
const { pageUrl } = require('../lib/env');

exports.title = '23. Copy link to this calculation';

const PAGE = 'Manning-Pipe-Flow.php?ec_nolog=1';

async function shareState(a) {
	return a.page.evaluate(() => {
		const box = document.getElementById('ec-copy-link-url');
		return {
			status: document.getElementById('ec-copy-link-btn').textContent,
			hidden: box.hidden,
			value: box.value,
			focused: document.activeElement === box,
			selection: [box.selectionStart, box.selectionEnd]
		};
	});
}

exports.run = async function ({ browser, report }) {
	// ---- the working clipboard ------------------------------------------------------------------
	const a = await Session.open(browser, 'A');
	try {
		// **BOTH clipboard permissions, and both are needed.** grantPermissions() REPLACES the list, so
		// asking for the read alone revokes the write and the page takes its refusal path instead —
		// which is a real browser state, and is what session B below reproduces deliberately. Chrome
		// gives a focused same-origin page the write by default, so granting both is the ordinary
		// visitor's state rather than an arrangement; the read is what lets the bytes be checked.
		await a.context.grantPermissions(['clipboard-read', 'clipboard-write'],
			{ origin: pageUrl().replace(/\/engcalcs\/.*$/, '') });
		await a.goto(PAGE);

		const where = await a.page.evaluate(() => {
			const btn = document.getElementById('ec-copy-link-btn');
			if (!btn) { return null; }
			const r = btn.getBoundingClientRect();
			return { visible: r.width > 0 && r.height > 0, label: btn.textContent.trim() };
		});
		report.ok(where && where.visible, 'the copy-link control is on the page and visible',
			where && where.label);

		// **BESIDE THE NAME FIELD IN THE NAVBAR** — which is where it has always been, and the reason
		// Task 228's second copy under the Printable Subtitle was removed on 2026-08-18. Naming the
		// calculation and taking its link are one gesture; the Printable Title names the printed
		// SHEET, which is a different intention.
		const beside = await a.page.evaluate(() => {
			const n = document.getElementById('ec_calc_name'), b = document.getElementById('ec-copy-link-btn');
			if (!n || !b) { return null; }
			const rn = n.getBoundingClientRect(), rb = b.getBoundingClientRect();
			return { sameRow: Math.abs(rn.top - rb.top) < 12, after: rb.left > rn.left };
		});
		report.ok(beside && beside.sameRow && beside.after,
			'...in the navbar, on the same row as and after the name field', JSON.stringify(beside));
		report.ok(await a.page.evaluate(() =>
			document.getElementById('ec-copy-link-url').hidden), 'the url box starts hidden — the button is the control');

		// The link is whatever updateUrl() has put in the address bar: the whole form, plus the name.
		await a.page.fill('#printable_title', 'Outfall B');
		await a.page.dispatchEvent('#printable_title', 'change');
		await a.settle(400);
		await a.page.click('#ec-copy-link-btn');
		await a.settle(400);
		let s = await shareState(a);
		report.has(s.status, 'Copied!', 'clicking it says the link was copied');
		report.ok(s.hidden, '...and does NOT show the url box, because there was nothing to fall back to');
		const copied = await a.page.evaluate(() => navigator.clipboard.readText()).catch(() => null);
		report.ok(copied !== null && copied === a.page.url(),
			'...and what is on the real system clipboard is the page\'s own address',
			copied ? copied.slice(0, 90) : '(clipboard unreadable)');
		report.ok(!!copied && /Outfall(\+|%20)B/.test(copied),
			'...carrying the name that was just typed, not the address as it was on arrival',
			copied ? copied.slice(-60) : '');

		// ---- print -------------------------------------------------------------------------------
		await a.page.emulateMedia({ media: 'print' });
		// The navbar as a whole is what leaves the printed sheet, not this control on its own —
		// asserting the button's own display would be asserting an implementation detail of Bootstrap.
		report.ok(await a.page.evaluate(() => {
			const nav = document.querySelector('nav.navbar');
			return !nav || getComputedStyle(nav).display === 'none';
		}), 'the navbar carrying it is not on the printed sheet');
		report.ok(await a.page.evaluate(() =>
			getComputedStyle(document.getElementById('printable_subtitle')).display !== 'none'),
		'...while the subtitle it sits under still prints, so this is the row and not the block');
		await a.page.emulateMedia({ media: 'screen' });

		report.eq(a.errors.length, 0, 'no uncaught JavaScript', a.errors[0] || '');
	} finally {
		await a.close();
	}

	// ---- a context where the clipboard REFUSES ---------------------------------------------------
	// A rejecting `writeText` is what a browser that will not treat the click as user-initiated, or
	// that has clipboard writes blocked, actually does — and unlike deleting the object it keeps the
	// promise path, which is where the page's `.then(copied, manual)` lives. The three failing shapes
	// are separated in dev/calc-spike/share-link-harness.js; the one here is chosen because it is the
	// one a permission produces.
	const context = await browser.newContext({ viewport: Session.VIEWPORT });
	await context.addInitScript(() => {
		Object.defineProperty(navigator, 'clipboard', {
			configurable: true,
			value: { writeText: function () { return Promise.reject(new DOMException('Write permission denied.', 'NotAllowedError')); } }
		});
	});
	const page = await context.newPage();
	const b = new Session(context, page, 'B');
	page.on('pageerror', (e) => b.errors.push(String(e.stack || e)));
	try {
		await page.goto(pageUrl(PAGE), { waitUntil: 'load' });
		await b.settle();
		await page.click('#ec-copy-link-btn');
		await b.settle(400);
		const s = await shareState(b);
		report.ok(!s.hidden, 'a clipboard that refuses reveals the url box instead of failing silently');
		report.has(s.status, 'Copy this link', '...and says what to do with it');
		report.eq(s.value, page.url(), '...with the same link in it the clipboard would have had');
		report.ok(s.focused, '...the box has the FOCUS, so the next keystroke reaches it');
		report.ok(s.selection[0] === 0 && s.selection[1] === s.value.length,
			'...and the whole of it is SELECTED, so Ctrl-C alone is enough',
			`selection ${s.selection[0]}..${s.selection[1]} of ${s.value.length}`);
		report.eq(b.errors.length, 0, 'no uncaught JavaScript on the refusing browser', b.errors[0] || '');
	} finally {
		await context.close();
	}
};
