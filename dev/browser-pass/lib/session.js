// One browser PROFILE, and the vocabulary a spec is allowed to use.
//
// A spec talks about menus, banners, tabs and dialogs — never about selectors. That is not tidiness:
// when Task 211 renamed half these controls, every check in the punch list that named one silently
// became a check of something that no longer existed. Keeping the names in one file means the next
// rename breaks the pass loudly, in one place, instead of quietly everywhere.
//
// A `Session` is a separate browser context, which is what the punch list means by "a separate
// profile": its own localStorage, so its own identity token, so a lock genuinely reads as somebody
// else's. Two tabs of one context would share the token and see no contention at all.

const { INIT_SCRIPT } = require('./pickers');
const { pageUrl } = require('./env');

class Session {
	constructor(context, page, name) {
		this.context = context;
		this.page = page;
		this.name = name;              // 'A' / 'B', used in failure messages
		this.errors = [];              // uncaught page errors; any one of them fails the pass
		this.dialogs = [];             // native alert()/confirm() text, in order
		this._confirmAnswer = true;    // what the next confirm() should answer
	}

	static async open(browser, name) {
		const context = await browser.newContext();
		await context.addInitScript(INIT_SCRIPT);
		const page = await context.newPage();
		const s = new Session(context, page, name);
		page.on('pageerror', (e) => s.errors.push(String(e.stack || e)));
		// **Native dialogs are answered here, and remembered.** `alert()` and `confirm()` block the
		// page; Playwright auto-dismisses them, which would silently answer "Cancel" to every
		// confirm and make destructive paths look like they refused. So they are answered
		// deliberately, and their text is kept — the text IS the check in several places.
		page.on('dialog', async (d) => {
			s.dialogs.push({ type: d.type(), message: d.message() });
			if (d.type() === 'confirm' && !s._confirmAnswer) { await d.dismiss(); return; }
			await d.accept();
		});
		return s;
	}

	// ---- navigation -------------------------------------------------------
	async goto() {
		await this.page.goto(pageUrl(), { waitUntil: 'load' });
		await this.settle();
	}
	async reload() {
		await this.page.reload({ waitUntil: 'load' });
		await this.settle();
	}
	// Boot does real work after `load`: restoring handles out of IndexedDB, re-acquiring locks over
	// the network, then repainting the banner. Waiting on a fixed delay would be flaky in both
	// directions, so wait for the page to stop having work in flight.
	async settle(ms = 350) {
		await this.page.waitForTimeout(ms);
		await this.page.evaluate(() => new Promise(r => requestAnimationFrame(() => r())));
	}

	// ---- the menu bar -----------------------------------------------------
	async openMenu(which = 'file') {
		await this.page.click(`#lpn_menu_${which}`);
		await this.page.waitForSelector('#lpn_menu_popup', { state: 'visible' });
	}
	// Every row as the user sees it: its label, and whether it is greyed. Save all being PRESENT but
	// disabled is a different fact from Save all being absent, and Tom read the second as a missing
	// feature — so the pass has to be able to tell them apart.
	async menuRows(which = 'file') {
		await this.openMenu(which);
		const rows = await this.page.$$eval('#lpn_menu_list button.lpn-menu-row',
			(els) => els.map(e => ({ label: e.textContent.trim(), disabled: e.disabled })));
		await this.closeMenu();
		return rows;
	}
	async menuClick(label, which = 'file') {
		await this.openMenu(which);
		const rows = await this.page.$$('#lpn_menu_list button.lpn-menu-row');
		for (const r of rows) {
			if ((await r.textContent()).trim() === label) {
				if (await r.isDisabled()) { throw new Error(`${this.name}: menu row "${label}" is disabled`); }
				await r.click();
				await this.settle();
				return;
			}
		}
		throw new Error(`${this.name}: no menu row "${label}"`);
	}
	async closeMenu() {
		await this.page.evaluate(() => {
			const p = document.getElementById('lpn_menu_popup');
			if (p) { p.style.display = 'none'; }
		});
	}

	// ---- the banner -------------------------------------------------------
	async banner() {
		return this.page.evaluate(() => {
			const b = document.getElementById('lpn_lock_banner');
			if (!b || b.style.display === 'none') { return null; }
			return {
				text: (b.querySelector('span') || {}).textContent || '',
				buttons: Array.from(b.querySelectorAll('button')).map(x => x.textContent.trim()),
				readOnly: b.style.borderColor === 'rgb(170, 0, 0)' || b.style.borderColor === '#a00'
			};
		});
	}
	async bannerClick(label) {
		const btns = await this.page.$$('#lpn_lock_banner button');
		for (const b of btns) {
			if ((await b.textContent()).trim() === label) { await b.click(); await this.settle(); return; }
		}
		throw new Error(`${this.name}: no banner button "${label}"`);
	}

	// ---- tabs -------------------------------------------------------------
	async tabs() {
		return this.page.$$eval('#lpn_tabs .lpn-tab', (els) => els.map(e => ({
			label: (e.querySelector('.lpn-tab-name') || {}).textContent || '',
			current: e.classList.contains('lpn-tab-current'),
			star: !!e.querySelector('.lpn-tab-star'),
			title: (e.querySelector('.lpn-tab-name') || {}).title || ''
		})));
	}
	async status() {
		return this.page.evaluate(() => (document.getElementById('lpn_status') || {}).textContent || '');
	}

	// Poll for a condition rather than sleeping a guessed amount. Opening a file reads the file AND
	// asks the broker over the network, so "is the dialog up?" is a question with a variable answer
	// time — a fixed wait is either flaky or slow, and a flaky pass is worse than no pass.
	async waitFor(fn, what, ms = 4000) {
		const deadline = Date.now() + ms;
		for (;;) {
			const v = await fn();
			if (v) { return v; }
			if (Date.now() > deadline) { return null; }
			await this.page.waitForTimeout(60);
		}
	}
	async waitDialog(ms) { return this.waitFor(() => this.dialog(), 'dialog', ms); }
	async waitBanner(ms) { return this.waitFor(() => this.banner(), 'banner', ms); }

	// ---- the in-page dialog (openDialog) ----------------------------------
	async dialog() {
		return this.page.evaluate(() => {
			const d = document.getElementById('lpn_dialog');
			if (!d || d.style.display === 'none') { return null; }
			return {
				text: (document.getElementById('lpn_dialog_body') || {}).textContent || '',
				buttons: Array.from(document.querySelectorAll('#lpn_dialog_buttons button')).map(b => b.textContent.trim())
			};
		});
	}
	async dialogClick(label) {
		const btns = await this.page.$$('#lpn_dialog_buttons button');
		for (const b of btns) {
			if ((await b.textContent()).trim() === label) { await b.click(); await this.settle(); return; }
		}
		throw new Error(`${this.name}: no dialog button "${label}"`);
	}
	// The first-run training panel, which stands between a fresh profile and any file operation. Not
	// skipped or stubbed: it is a real step of the real flow, and answering it is how a session earns
	// the identity every lock is keyed on.
	async answerTrainingPanel(initials) {
		const d = await this.dialog();
		if (!d) { return false; }
		await this.page.fill('#lpn_dialog_body input[type=text]', initials);
		await this.dialogClick('Continue');
		return true;
	}

	// What the next native confirm() should answer. Playwright auto-dismisses dialogs, which would
	// silently answer Cancel to every confirm and make a destructive path look like it refused; the
	// default here is Accept for the same reason, so a spec that means "the user said no" has to say
	// so out loud.
	answerConfirmsWith(yes) { this._confirmAnswer = !!yes; }
	lastDialog() { return this.dialogs[this.dialogs.length - 1] || null; }

	// ---- the picker ------------------------------------------------------
	async queuePick(name) { await this.page.evaluate((n) => window.__lpn.queue(n), name); }
	async cancelNextPicker() { await this.page.evaluate(() => window.__lpn.cancelNextPicker()); }
	// Hand out handles whose writes are discarded — see lib/pickers.js. The only way to reproduce a
	// real folder's "the write went nowhere" from inside OPFS.
	async sabotageWrites(on = true) { await this.page.evaluate((v) => window.__lpn.sabotageWrites(v), on); }
	// Hand out a handle that reports a file which is not there — see lib/pickers.js.
	async phantomFiles(on = true) { await this.page.evaluate((v) => window.__lpn.phantomNext(v), on); }
	async pickerCalls() { return this.page.evaluate(() => window.__lpn.calls()); }

	// ---- this profile's view of the disk ---------------------------------
	async readFile(name) { return this.page.evaluate((n) => window.__lpn.read(n), name); }
	async writeFile(name, text) { return this.page.evaluate(([n, t]) => window.__lpn.write(n, t), [name, text]); }
	async removeFile(name) { return this.page.evaluate((n) => window.__lpn.remove(n), name); }
	async statFile(name) { return this.page.evaluate((n) => window.__lpn.stat(n), name); }
	async listFiles() { return this.page.evaluate(() => window.__lpn.list()); }

	// ---- the network ------------------------------------------------------
	// Cutting the broker off is one line, and it is the state half of §6 and all of §9 are about:
	// the page must keep working, and every guarantee that claims to hold without a server must
	// still hold. `abort` rather than a 500 on purpose — an unreachable server and a broken one are
	// different states, and the page says different things about them.
	async blockBroker() {
		await this.page.route('**/lpn-lock.php', (route) => route.abort());
	}
	async unblockBroker() {
		await this.page.unroute('**/lpn-lock.php');
	}
	// A server that ANSWERS a fault reads completely differently from one that is not there, and only
	// one of the two is somebody's to go and fix. This makes the broker reply with a real error body
	// rather than vanish — the distinction the page was flattening until 2026-08-05.
	async brokerReplies(status, body) {
		await this.page.route('**/lpn-lock.php', (route) => route.fulfill({
			status,
			contentType: 'application/json',
			body: JSON.stringify(body)
		}));
	}

	// ---- editing the network ----------------------------------------------
	// Enough of a change to make the project dirty and worth saving, without depending on the map's
	// pointer geometry: the page's own example network is one toolbar click, is what a user would
	// actually draw, and goes through the same edit path as drawing by hand.
	async drawExample() {
		const btns = await this.page.$$('#lpn_toolbar button');
		for (const b of btns) {
			if ((await b.textContent()).trim() === 'Draw example network') {
				await b.click();
				await this.settle(600);   // it schedules a solve
				return;
			}
		}
		throw new Error(`${this.name}: no "Draw example network" button in the toolbar`);
	}
	// Is this project marked as having unsaved changes? The asterisk on its tab is the whole
	// convention, so the pass reads exactly what the user reads.
	async currentTabDirty() {
		const t = (await this.tabs()).find(x => x.current);
		return !!(t && t.star);
	}

	async close() { await this.context.close(); }
}

// The shared network drive, played by the runner.
//
// OPFS is scoped to an origin AND a profile, so profile B genuinely cannot see profile A's files —
// which is right for the browser and wrong for the office, where both are looking at one file on a
// server. So the runner moves the bytes, and a spec says when: `share.from(A)` then `share.to(B)`
// reads as, and is, "A saved it, B opened it".
//
// **Only writes when the content actually differs.** Pushing identical bytes would advance the
// file's modified time, which is exactly what the freshness check watches — a sync that did nothing
// would make the next Save refuse, and the pass would be testing itself.
class Share {
	constructor() { this.files = new Map(); }
	async from(session) {
		for (const name of await session.listFiles()) {
			this.files.set(name, await session.readFile(name));
		}
	}
	async to(session) {
		for (const [name, text] of this.files) {
			if (await session.readFile(name) === text) { continue; }
			await session.writeFile(name, text);
		}
	}
	async sync(a, b) { await this.from(a); await this.to(b); }
}

module.exports = { Session, Share };
