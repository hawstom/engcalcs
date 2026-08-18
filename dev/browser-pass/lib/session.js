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

	// **A TALL WINDOW, and it is load-bearing rather than cosmetic.** The consent banner is
	// `position: fixed; bottom: 0` and every session here is a fresh profile that has never answered
	// it, so in a default 720-high window it lies across the map — and the map slides further under
	// it every time a lock banner appears above. Clicks meant for the canvas then land on the banner
	// and nothing happens, silently. Nothing is stubbed or hidden to fix that: the window is simply
	// big enough for the page it is showing, which is also the window this page is designed for
	// (a full-window drawing surface; see CLAUDE.md on not reasoning about it from a phone).
	static VIEWPORT = { width: 1400, height: 1200 };

	static async open(browser, name) {
		const context = await browser.newContext({ viewport: Session.VIEWPORT });
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
	// The label is what the row SAYS, with the fly-out arrow reported separately: "▸" is not part of
	// any row's name, it is the mark that the row leads somewhere, and folding it into the text makes
	// every spec that names the row carry a glyph it does not mean.
	async menuRows(which = 'file') {
		await this.openMenu(which);
		const rows = await this.page.$$eval('#lpn_menu_list button.lpn-menu-row',
			(els) => els.map(e => {
				const arrow = e.querySelector('.lpn-menu-arrow');
				return {
					label: (arrow ? e.textContent.replace(arrow.textContent, '') : e.textContent).trim(),
					disabled: e.disabled,
					submenu: !!arrow
				};
			}));
		await this.closeMenu();
		return rows;
	}
	async menuClick(label, which = 'file') {
		await this.openMenu(which);
		await this._clickRow('#lpn_menu_list', label);
		await this.settle();
	}
	// A row in the FLY-OUT (Task 264): "New project…" opens a second popup beside the first, and the
	// command is in there. Two clicks in the page, one sentence in a spec.
	async menuClickSub(parent, child, which = 'file') {
		await this.openMenu(which);
		await this._clickRow('#lpn_menu_list', parent);
		await this.page.waitForSelector('#lpn_menu_popup2', { state: 'visible' });
		await this._clickRow('#lpn_menu_list2', child);
		await this.settle();
	}
	async _clickRow(listSel, label) {
		const rows = await this.page.$$(`${listSel} button.lpn-menu-row`);
		const seen = [];
		for (const r of rows) {
			const text = (await r.evaluate((e) => {
				const arrow = e.querySelector('.lpn-menu-arrow');
				return (arrow ? e.textContent.replace(arrow.textContent, '') : e.textContent).trim();
			}));
			seen.push(text);
			if (text === label) {
				if (await r.isDisabled()) { throw new Error(`${this.name}: menu row "${label}" is disabled`); }
				await r.click();
				return;
			}
		}
		throw new Error(`${this.name}: no menu row "${label}" in ${listSel} — rows are ${JSON.stringify(seen)}`);
	}
	async closeMenu() {
		await this.page.evaluate(() => {
			['lpn_menu_popup', 'lpn_menu_popup2'].forEach((id) => {
				const p = document.getElementById(id);
				if (p) { p.style.display = 'none'; }
			});
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
			// A faint asterisk means "this project lives only in the browser"; a full-strength one
			// means "there are changes the file does not have". Two different facts, one glyph.
			faded: !!e.querySelector('.lpn-tab-star-faint'),
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
	// **The one thing every spec below needs: an edit made, no file written, this tab dirty.** It was
	// the "Draw example network" toolbar button until Task 264 retired it, and the substitute is a
	// judgement rather than a rename, because the two flows examples moved to are neither of them
	// this:
	//   * File ▸ Open example… lands a project that is SAVED (stampProjectSaved) in a NEW tab — no
	//     asterisk, and a tab count every spec here measures;
	//   * File ▸ New project… ▸ Blank project makes an empty, clean tab, which is `newProject()` below
	//     and is a different sentence.
	// So the substitute is the other thing the retired button was: one ordinary edit to the project
	// in front of you. Placing a junction is the smallest such edit a user can make, it goes through
	// the same addNode/undo/autosave path as any drawing, and it leaves the tab exactly as the button
	// did.
	//
	// It VERIFIES that the node landed. The old helper threw when its button vanished, which is why
	// Task 264 was noticed at all; this one can fail more quietly — a click that hits the examples
	// gallery, or lands within NODE_SNAP_PX of a node already there, silently makes no edit and every
	// assertion after it would then be about an unchanged project.
	async makeEdit() {
		await this.dismissGallery();
		await this.toolbarClick('Junction');
		const before = await this.nodeCount();
		// **A CLEAR SPOT, MEASURED, not a counter**, and clear in both of the ways a spot can fail to
		// be:
		//   * something is ON TOP of the map there — the consent banner along the bottom of a fresh
		//     profile's window is the one that bites, and the map moves under it whenever a lock
		//     banner appears, so no fixed point is safe;
		//   * a node is already within NODE_SNAP_PX (14), where the page deliberately opens that node
		//     instead of placing one (the fat-finger rule) — and a profile that OPENED somebody
		//     else's file inherits their nodes at their coordinates, which no counter here can know.
		// Both are silent from out here, which is why the point is chosen by asking the page what is
		// actually at it rather than by arithmetic.
		const spot = await this.page.evaluate(() => {
			const canvas = document.getElementById('lpn_canvas');
			const r = canvas.getBoundingClientRect();
			const taken = Array.from(canvas.querySelectorAll('.lpn-symbols > *'))
				.map(e => e.getBoundingClientRect())
				.map(b => ({ x: b.x + b.width / 2, y: b.y + b.height / 2 }));
			for (let row = 0; row < 3; row++) {
				for (let col = 0; col < 9; col++) {
					const p = { x: r.x + r.width * (0.1 + col * 0.1), y: r.y + r.height * (0.25 + row * 0.25) };
					if (!taken.every(t => Math.hypot(t.x - p.x, t.y - p.y) > 40)) { continue; }
					const hit = document.elementFromPoint(p.x, p.y);
					if (hit && canvas.contains(hit)) { return p; }
				}
			}
			return null;
		});
		if (!spot) { throw new Error(`${this.name}: no clear spot left on the canvas to place a node`); }
		await this.page.mouse.click(spot.x, spot.y);
		await this.settle(400);   // it schedules a solve
		// Back to Select, so a later click meant for something else cannot place a node.
		await this.toolbarClick('Select');
		const after = await this.nodeCount();
		if (after <= before) {
			throw new Error(`${this.name}: the edit did not land — ${before} nodes before, ${after} after`);
		}
	}
	// How many elements the map is drawing. Read from the DOM rather than the page's own `doc`, which
	// is inside a closure — and the DOM is what the user is looking at anyway.
	async nodeCount() {
		return this.page.evaluate(() => document.querySelectorAll('#lpn_canvas .lpn-symbols > *').length);
	}
	async toolbarClick(label) {
		const btns = await this.page.$$('#lpn_toolbar button');
		const seen = [];
		for (const b of btns) {
			const t = (await b.textContent()).trim();
			seen.push(t);
			if (t === label) { await b.click(); return; }
		}
		throw new Error(`${this.name}: no "${label}" button in the toolbar — it holds ${JSON.stringify(seen)}`);
	}
	// The examples gallery covers an empty canvas, and its panel takes pointer events back from the
	// transparent wrapper — so a click meant for the map lands on the wall. Waved away the way a user
	// waves it away: the button that says so. Harmless when it is not showing.
	async dismissGallery() {
		const showing = await this.page.$eval('#lpn_empty_hint', (e) => e.style.display !== 'none').catch(() => false);
		if (!showing) { return; }
		const btn = await this.page.$('#lpn_examples_pane button.lpn-examples-blank');
		if (btn) { await btn.click(); await this.settle(200); }
	}
	// File ▸ New project… ▸ Blank project — the act the single "New project" row used to be before
	// Task 264 turned it into a fly-out of templates. US units unless a spec says otherwise, because
	// a project's units are the project's since Task 263 and a spec should not inherit whatever the
	// strip happened to hold.
	async newProject(system = 'us') {
		const label = system === 'si' ? 'Blank project, SI units (l/s)' : 'Blank project, US units (gpm)';
		await this.menuClickSub('New project…', label);
	}
	// Is this project marked as having unsaved changes? The asterisk on its tab is the whole
	// convention, so the pass reads exactly what the user reads.
	async currentTabDirty() {
		const t = (await this.tabs()).find(x => x.current);
		return !!(t && t.star);
	}
	// `null` when there is no asterisk, otherwise which one it is.
	async currentTabStar() {
		const t = (await this.tabs()).find(x => x.current);
		return (t && t.star) ? { faded: t.faded } : null;
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
