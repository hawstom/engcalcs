// DOCKING THE STANDING BOXES, IN A REAL BROWSER (ROADMAP Task 441). Tom, 2026-10-03: *"the
// conventional docking, hide, autohide, etc icon buttons at the upper right corner of non-hog
// (non-modal) boxes right before (next to) the exit X"*. Nothing here can be seen by a stub: a column
// the map gives up, a box that must stay out of the drawing, a tab that flies out under a mouse.
//
//   1. THE ROW. Every standing box carries a corner row immediately before its X, offering Dock left
//      and Dock right while it floats, each a named button; the title stops short of the row.
//   2. DOCK. Settings docked right takes a column at the map's right edge and the canvas gives up
//      exactly that width (no overlap); the box offers Auto-hide, Dock left and Float instead. The
//      record `lpn_setbox` gains `dock` and `dockW` and nothing new appears in storage; a reload
//      brings it back docked. Find docked on the same side shares the column, stacked. Float hands
//      the box back to the corner it floated at and the map its width, and the fields go. A drag on a
//      docked box's title band floats it; a click there does not.
//   2b. Properties docks too (a page-load choice), and a click on a node fills the column.
//   3. AUTO-HIDE. The pin tucks the box into a tab on a strip at the map's edge (the box is still
//      open, only invisible), the map keeps the strip's width, hovering the tab flies it out over the
//      map, leaving tucks it, a click on the tab flies it out with the keyboard inside, Escape tucks
//      it and puts the keyboard on the tab, and a reload brings it back tucked.
//   4. Q5. Fire flow, Criticality and Demand scaling carry one `?` in the row, focusable, whose tip
//      is the tool's whole explanation (its intro, then its scope tip); no other box carries one.
//      Enter on the `?` opens it (Task 759: one door) and a click on the title bar closes it.
//   5. A PHONE (390 x 844). No dock buttons, and a box stored as docked opens filling the screen with
//      the map at full width.
//
//   node dev/lpn-spike/dock-browser-harness.js        (takes the browser lock itself)
// DOCK_SHOT=<dir> also writes a screenshot of each view there, for a person to look at.
'use strict';

const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = process.env.EC_BROWSER_LOCK || '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_DOCK_BROWSER_LOCKED';
const NAME = 'dock-browser-harness';

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* no flock */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '280', LOCK_FILE, process.execPath, __filename], {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error(NAME + ': flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error(NAME + ': NOT RUN -- another session held ' + LOCK_FILE + ' for 280 s. Lock contention, not a failure of what this measures; re-run it alone.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error(NAME + ': no `flock` binary found -- running WITHOUT the browser lock.');
}

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
async function shot(page, name) {
	if (!process.env.DOCK_SHOT) { return; }
	await page.screenshot({ path: path.join(process.env.DOCK_SHOT, name + '.png') });
}
const BOXES = ['lpn_popup', 'lpn_find_popup', 'lpn_settings_box', 'lpn_library_box', 'lpn_ff_box', 'lpn_crit_box',
	'lpn_ds_box', 'lpn_energy_box', 'lpn_contour_box', 'lpn_scncmp_box', 'lpn_rptbox', 'lpn_status_box', 'lpn_alt_box',
	'lpn_full_box', 'lpn_calib_box', 'lpn_notes_popup', 'lpn_hotkeys_popup'];
const HELP = { lpn_ff_box: ['lpn_ff_intro', 'lpn_ff_scope_tip'], lpn_crit_box: ['lpn_crit_intro', 'lpn_crit_scope_tip'],
	lpn_ds_box: ['lpn_ds_intro', 'lpn_ds_scope_tip'] };

async function openNet3(Session, browser, viewport, before) {
	const a = await Session.open(browser, NAME, { viewport: viewport || { width: 1400, height: 900 } });
	await a.page.route(/tile\.openstreetmap\.org|api\.mapbox\.com/, (route) => route.abort());
	await a.goto('Looped-Network.php');
	await a.answerTrainingPanel().catch(() => {});
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
	await a.settle(1200);
	if (before) { await before(a); }
	return a;
}
async function reload(a) {
	await a.reload();
	await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
	await a.settle(1500);
}
function geom(page, id) {
	return page.evaluate((i) => {
		const b = document.getElementById(i), s = document.getElementById('lpn_canvas'), w = s.parentNode;
		const r = b.getBoundingClientRect(), sr = s.getBoundingClientRect(), wr = w.getBoundingClientRect();
		const cs = getComputedStyle(b);
		return {
			box: { l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height },
			svg: { l: sr.left, t: sr.top, r: sr.right, b: sr.bottom, w: sr.width, h: sr.height },
			wrap: { l: wr.left, r: wr.right },
			open: b.style.display !== 'none' && b.style.display !== '',
			docked: b.classList.contains('lpn-docked'),
			visible: cs.visibility !== 'hidden',
			acts: Array.from(b.querySelectorAll('.lpn-box-corner [data-dock]')).map((x) => x.getAttribute('data-dock')),
			vw: window.innerWidth, vh: window.innerHeight
		};
	}, id);
}
function stored(page, key) {
	return page.evaluate((k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return 'BAD'; } }, key);
}
function storageKeys(page) {
	return page.evaluate(() => Object.keys(localStorage).sort());
}
async function corner(a, id, act) {
	await a.page.click('#' + id + ' .lpn-corner-btn[data-dock="' + act + '"]');
	await a.settle(400);
}
async function openSettings(a) {
	await a.toolbarClick(await a.lang('lpn_tool_settings'));
	await a.settle(500);
}
async function openFind(a) {
	await a.menuClick(await a.lang('lpn_find_menu'), 'edit');
	await a.settle(400);
}

// ---------------------------------------------------------------------------------------------
async function sectionRow(Session, browser) {
	console.log('\n--- 1. the corner row on every standing box ---');
	const a = await openNet3(Session, browser);
	try {
		const rows = await a.page.evaluate((ids) => ids.map((id) => {
			const b = document.getElementById(id);
			if (!b) { return { id, missing: true }; }
			const row = b.querySelector(':scope > .lpn-box-corner'), x = b.querySelector(':scope > .lpn-popover-x');
			const btns = row ? Array.from(row.querySelectorAll('button[data-dock]')) : [];
			return {
				id, row: !!row, beforeX: !!row && !!x && row.nextElementSibling === x,
				acts: btns.map((e) => e.getAttribute('data-dock')),
				named: btns.every((e) => (e.getAttribute('aria-label') || '').length > 2 && e.title === e.getAttribute('aria-label')),
				buttons: btns.every((e) => e.tagName === 'BUTTON' && e.type === 'button' && e.tabIndex === 0),
				pad: parseFloat(getComputedStyle(b.querySelector('.lpn-setbox-title')).paddingRight)
			};
		}), BOXES);
		const bad = rows.filter((r) => r.missing || !r.row || !r.beforeX);
		ok('all ' + BOXES.length + ' standing boxes carry a corner row immediately before their X', bad.length === 0, JSON.stringify(bad));
		ok('...each offering Dock left and Dock right while it floats',
			rows.every((r) => r.acts.join() === 'left,right'), JSON.stringify(rows.filter((r) => r.acts.join() !== 'left,right').map((r) => r.id + ':' + r.acts)));
		ok('...as real, keyboard-reachable buttons, each named by its aria-label and its tip',
			rows.every((r) => r.named && r.buttons));
		ok('...and the title stops short of the row and the X', rows.every((r) => r.pad >= 40 + 2 * 28 - 0.5),
			JSON.stringify(rows.map((r) => r.pad)));
		const names = await a.page.evaluate(() => Array.from(document.querySelectorAll('#lpn_settings_box .lpn-corner-btn')).map((b) => b.getAttribute('aria-label')));
		ok('the names come from the language file', names[0] === await a.lang('lpn_dock_left') && names[1] === await a.lang('lpn_dock_right'), JSON.stringify(names));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally {
		await a.close();
	}
}

// ---------------------------------------------------------------------------------------------
async function sectionDock(Session, browser) {
	console.log('\n--- 2. dock right, share the column, float, drag out ---');
	const a = await openNet3(Session, browser);
	try {
		const keysBefore = await storageKeys(a.page);
		await openSettings(a);
		const floatG = await geom(a.page, 'lpn_settings_box');
		const fullW = floatG.svg.w;
		await corner(a, 'lpn_settings_box', 'right');
		let g = await geom(a.page, 'lpn_settings_box');
		await shot(a.page, 'dock-right');
		ok('Dock right: the box is docked', g.docked && g.open);
		ok('...flush with the right edge of the window the map spans', Math.abs(g.box.r - (g.wrap.r + g.box.w)) <= 1.5 && g.box.r <= g.vw + 0.5,
			JSON.stringify({ box: g.box, wrap: g.wrap }));
		ok('...the map gives up exactly the column, so nothing of the drawing is under the box',
			g.svg.r <= g.box.l + 1 && Math.abs((fullW - g.svg.w) - g.box.w) <= 2, JSON.stringify({ full: fullW, now: g.svg.w, box: g.box.w }));
		ok('...top to bottom of the map', Math.abs(g.box.t - g.svg.t) <= 1.5 && Math.abs(g.box.b - Math.min(g.svg.b, g.vh)) <= 1.5,
			JSON.stringify({ box: g.box, svg: g.svg }));
		ok('...at the width it floated at', Math.abs(g.box.w - floatG.box.w) <= 2, g.box.w + ' vs ' + floatG.box.w);
		ok('...and its row now offers Auto-hide, Dock left and Float', g.acts.join() === 'autohide,left,float', g.acts.join());
		const rec = await stored(a.page, 'lpn_setbox');
		ok('lpn_setbox records dock "right" and the docked width', rec && rec.dock === 'right' && rec.dockW > 200 && rec.autohide === undefined,
			JSON.stringify(rec));
		const keysAfter = await storageKeys(a.page);
		ok('...and docking wrote no new key', keysAfter.filter((k) => keysBefore.indexOf(k) < 0).every((k) => /^lpn_(setbox|project_|index)/.test(k)),
			JSON.stringify(keysAfter.filter((k) => keysBefore.indexOf(k) < 0)));

		console.log('\n--- 2a. a reload brings it back docked ---');
		await reload(a);
		g = await geom(a.page, 'lpn_settings_box');
		ok('reopened docked at the right, and the map still gives it room', g.open && g.docked && g.svg.r <= g.box.l + 1, JSON.stringify(g.box));

		console.log('\n--- 2b. a second box on the same side shares the column ---');
		await openFind(a);
		await corner(a, 'lpn_find_popup', 'right');
		const s = await geom(a.page, 'lpn_settings_box'), f = await geom(a.page, 'lpn_find_popup');
		await shot(a.page, 'dock-two-right');
		ok('Find docked right too', f.docked);
		ok('...the two share one column: same left edge, same width', Math.abs(s.box.l - f.box.l) <= 1 && Math.abs(s.box.w - f.box.w) <= 1,
			JSON.stringify({ s: s.box, f: f.box }));
		ok('...stacked, without overlapping, filling the map\'s height between them',
			Math.min(s.box.b, f.box.b) <= Math.max(s.box.t, f.box.t) + 1 &&
			Math.abs((s.box.h + f.box.h) - (Math.min(s.svg.b, s.vh) - s.svg.t)) <= 3, JSON.stringify({ s: s.box, f: f.box }));
		const frec = await stored(a.page, 'lpn_findbox');
		ok('lpn_findbox records its dock too', frec && frec.dock === 'right', JSON.stringify(frec));
		await a.page.click('#lpn_find_close');
		await a.settle(300);
		const s2 = await geom(a.page, 'lpn_settings_box');
		ok('closing Find gives Settings the whole column back', Math.abs(s2.box.h - (Math.min(s2.svg.b, s2.vh) - s2.svg.t)) <= 2, JSON.stringify(s2.box));

		console.log('\n--- 2c. float ---');
		await corner(a, 'lpn_settings_box', 'float');
		g = await geom(a.page, 'lpn_settings_box');
		ok('Float: the box floats again', g.open && !g.docked);
		ok('...and the map has its whole width back', Math.abs(g.svg.w - fullW) <= 1.5, g.svg.w + ' vs ' + fullW);
		const rec2 = await stored(a.page, 'lpn_setbox');
		ok('...and the dock field is gone from the record', rec2 && rec2.dock === undefined, JSON.stringify(rec2));

		console.log('\n--- 2d. a drag on a docked box floats it; a click does not ---');
		await corner(a, 'lpn_settings_box', 'left');
		g = await geom(a.page, 'lpn_settings_box');
		ok('Dock left: the box sits at the map\'s left, and the map starts after it', g.docked && g.box.l <= 2 && g.svg.l >= g.box.r - 1,
			JSON.stringify({ box: g.box, svg: g.svg }));
		const bandX = g.box.l + 30, bandY = g.box.t + 4;
		await a.page.mouse.click(bandX, bandY);
		await a.settle(200);
		ok('a click on the title band leaves it docked', (await geom(a.page, 'lpn_settings_box')).docked);
		await a.page.mouse.move(bandX, bandY);
		await a.page.mouse.down();
		await a.page.mouse.move(bandX + 150, bandY + 60, { steps: 6 });
		await a.page.mouse.up();
		await a.settle(300);
		g = await geom(a.page, 'lpn_settings_box');
		ok('a drag floats it, under the pointer', !g.docked && g.box.l < bandX + 150 && g.box.r > bandX + 150 && g.box.t < bandY + 62,
			JSON.stringify(g.box));
		ok('...and the map has its whole width back', Math.abs(g.svg.w - fullW) <= 1.5);
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally {
		await a.close();
	}
}

// ---------------------------------------------------------------------------------------------
async function sectionProperties(Session, browser) {
	console.log('\n--- 2e. the Properties box docks, for this page load ---');
	const a = await openNet3(Session, browser);
	try {
		const keysBefore = await storageKeys(a.page);
		const clickNode = async (k) => {
			const at = await a.page.evaluate((i) => {
				const ns = Array.from(document.querySelectorAll('#lpn_canvas .lpn-symbols circle:not(.lpn-node-hit)'))
					.filter((c) => { const r = c.getBoundingClientRect(); return r.width > 0; });
				const r = ns[i].getBoundingClientRect();
				return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
			}, k);
			await a.page.mouse.click(at.x, at.y);
			await a.settle(700);
		};
		await clickNode(10);
		let g = await geom(a.page, 'lpn_popup');
		ok('a click on a junction opens Properties', g.open);
		await corner(a, 'lpn_popup', 'left');
		g = await geom(a.page, 'lpn_popup');
		ok('Dock left: Properties takes the left column', g.docked && g.box.l <= 2 && g.svg.l >= g.box.r - 1, JSON.stringify({ box: g.box, svg: g.svg }));
		await clickNode(20);
		g = await geom(a.page, 'lpn_popup');
		await shot(a.page, 'dock-properties');
		ok('...and the next junction clicked opens in the column, not beside the junction', g.open && g.docked && g.box.l <= 2);
		ok('...with nothing written to storage for it', (await storageKeys(a.page)).filter((k) => keysBefore.indexOf(k) < 0 && !/^lpn_(project_|index)/.test(k)).length === 0);
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally {
		await a.close();
	}
}

// ---------------------------------------------------------------------------------------------
async function sectionAutohide(Session, browser) {
	console.log('\n--- 3. auto-hide ---');
	const a = await openNet3(Session, browser);
	try {
		await openSettings(a);
		const fullW = (await geom(a.page, 'lpn_settings_box')).svg.w;
		await corner(a, 'lpn_settings_box', 'right');
		await corner(a, 'lpn_settings_box', 'autohide');
		let g = await geom(a.page, 'lpn_settings_box');
		const strip = () => a.page.evaluate(() => {
			const s = document.getElementById('lpn_dock_strip_right'), r = s ? s.getBoundingClientRect() : null;
			const tabs = s ? Array.from(s.querySelectorAll('.lpn-dock-tab')) : [];
			return { shown: !!s && getComputedStyle(s).display !== 'none', l: r && r.left, r: r && r.right, w: r && r.width,
				tabs: tabs.map((t) => t.textContent), expanded: tabs.map((t) => t.getAttribute('aria-expanded')),
				focusOnTab: tabs.indexOf(document.activeElement) >= 0 };
		});
		let st = await strip();
		await shot(a.page, 'autohide-tucked');
		ok('Auto-hide: the box is still open but tucked out of sight', g.open && g.docked && !g.visible);
		ok('...into a tab on a strip at the map\'s right edge, reading the box\'s title',
			st.shown && st.tabs.length === 1 && st.tabs[0] === await a.lang('lpn_tool_settings') && st.r <= g.vw + 0.5, JSON.stringify(st));
		ok('...the keyboard lands on that tab', st.focusOnTab);
		ok('...and the map gives up only the strip', Math.abs((fullW - g.svg.w) - st.w) <= 2 && g.svg.r <= st.l + 1,
			JSON.stringify({ full: fullW, now: g.svg.w, strip: st.w }));
		const rec = await stored(a.page, 'lpn_setbox');
		ok('lpn_setbox records autohide', rec && rec.autohide === true && rec.dock === 'right', JSON.stringify(rec));

		const tab = await a.page.$('#lpn_dock_strip_right .lpn-dock-tab');
		const tb = await tab.boundingBox();
		await a.page.mouse.move(tb.x - 300, tb.y + 10);
		await a.settle(100);
		await a.page.mouse.move(tb.x + tb.width / 2, tb.y + tb.height / 2, { steps: 3 });
		await a.settle(450);
		g = await geom(a.page, 'lpn_settings_box');
		await shot(a.page, 'autohide-out');
		ok('hovering the tab flies the box out', g.visible);
		ok('...over the map, beside the strip', g.box.r <= (await strip()).l + 1 && g.box.l < g.svg.r, JSON.stringify({ box: g.box, svg: g.svg }));
		ok('...without moving the map', Math.abs((fullW - g.svg.w) - (await strip()).w) <= 2);
		await a.page.mouse.move(g.box.l + 60, g.box.t + 200, { steps: 4 });
		await a.settle(600);
		ok('...it stays out while the pointer is on it', (await geom(a.page, 'lpn_settings_box')).visible);
		const gripBox = async () => a.page.evaluate(() => {
			const e = document.getElementById('lpn_dock_grip_right'), r = e ? e.getBoundingClientRect() : null;
			return { live: !!e && e.classList.contains('lpn-dock-grip-live') && getComputedStyle(e).display !== 'none',
				x: r && r.left + r.width / 2, y: r && r.top + r.height / 2, w: r && r.width };
		});
		const gb = await gripBox();
		const wBefore = (await geom(a.page, 'lpn_settings_box')).box.r - (await geom(a.page, 'lpn_settings_box')).box.l;
		const hit = await a.page.evaluate((p) => { const e = document.elementFromPoint(p.x, p.y); return e && e.id; }, gb);
		ok('a flown-out box shows its width grip, in front, on its inner edge', gb.live && hit === 'lpn_dock_grip_right', JSON.stringify({ gb, hit }));
		await a.page.mouse.move(gb.x, gb.y, { steps: 3 });
		await a.page.mouse.down();
		await a.page.mouse.move(gb.x - 80, gb.y, { steps: 5 });
		await a.settle(700);
		ok('...a drag on it widens the box and the box stays out', (await geom(a.page, 'lpn_settings_box')).visible);
		await a.page.mouse.up();
		await a.settle(200);
		g = await geom(a.page, 'lpn_settings_box');
		ok('...by the distance dragged', Math.abs((g.box.r - g.box.l) - (wBefore + 80)) <= 4, String(g.box.r - g.box.l) + ' from ' + wBefore);
		ok('...and the width is recorded', (await stored(a.page, 'lpn_setbox')).dockW === Math.round(g.box.r - g.box.l));
		await a.page.mouse.move(200, 400, { steps: 4 });
		await a.settle(800);
		ok('...and tucks away once the pointer has left it', !(await geom(a.page, 'lpn_settings_box')).visible);

		await tab.click();
		await a.settle(300);
		g = await geom(a.page, 'lpn_settings_box');
		const inside = await a.page.evaluate(() => document.getElementById('lpn_settings_box').contains(document.activeElement));
		ok('a click on the tab flies it out with the keyboard inside it', g.visible && inside);
		await a.page.keyboard.press('Escape');
		await a.settle(300);
		g = await geom(a.page, 'lpn_settings_box');
		st = await strip();
		ok('Escape tucks it, leaves it open, and puts the keyboard back on its tab', !g.visible && g.open && st.focusOnTab);
		await a.page.keyboard.press('Enter');
		await a.settle(300);
		ok('Enter on the tab brings it out again', (await geom(a.page, 'lpn_settings_box')).visible);
		await a.page.mouse.click(300, 500);
		await a.settle(300);
		ok('a press on the map tucks it', !(await geom(a.page, 'lpn_settings_box')).visible);
		await openSettings(a);
		g = await geom(a.page, 'lpn_settings_box');
		ok('the gear, which toggles Settings, brings a tucked box out rather than closing it', g.open && g.visible);

		console.log('\n--- 3a. a reload brings it back tucked ---');
		await reload(a);
		g = await geom(a.page, 'lpn_settings_box');
		st = await strip();
		ok('the box reopens tucked behind its tab', g.open && g.docked && !g.visible && st.tabs.length === 1, JSON.stringify(st));

		console.log('\n--- 3b. pinning it again ---');
		await a.page.click('#lpn_dock_strip_right .lpn-dock-tab');
		await a.settle(300);
		await corner(a, 'lpn_settings_box', 'autohide');
		g = await geom(a.page, 'lpn_settings_box');
		st = await strip();
		ok('the pin puts it back in its column, and the strip goes', g.visible && g.docked && !st.shown && g.svg.r <= g.box.l + 1, JSON.stringify(st));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally {
		await a.close();
	}
}

// ---------------------------------------------------------------------------------------------
async function sectionHelp(Session, browser) {
	console.log('\n--- 4. one ? beside the X of the three Analyze tools (Q5) ---');
	const a = await openNet3(Session, browser);
	try {
		const facts = await a.page.evaluate((ids) => ids.map((id) => {
			const b = document.getElementById(id), row = b.querySelector('.lpn-box-corner');
			const glyphs = row.querySelectorAll('.ec-tip'), help = row.querySelector('.ec-help');
			return { id, glyphs: glyphs.length, tip: help ? (help.getAttribute('data-bs-original-title') || help.title) : null,
				focusable: glyphs.length === 1 && glyphs[0].tabIndex === 0, last: !!help && row.lastElementChild === help };
		}), BOXES);
		for (const id of Object.keys(HELP)) {
			const f = facts.find((x) => x.id === id);
			ok(id + ': exactly one ?, the last thing before the X, focusable', f.glyphs === 1 && f.last && f.focusable, JSON.stringify(f));
			const want = [];
			for (const k of HELP[id]) { want.push(await a.lang(k)); }
			ok(id + ': ...its tip is the tool\'s intro and then its scope tip', f.tip === want.join(' '), String(f.tip).slice(0, 60));
		}
		ok('no other box carries a ? in its corner', facts.filter((f) => !HELP[f.id]).every((f) => f.glyphs === 0));
		await a.menuClickSub(await a.lang('lpn_analyze_menu'), await a.lang('lpn_ff_menu'), 'project');
		await a.settle(400);
		await a.page.focus('#lpn_ff_box .lpn-corner-help .ec-tip');
		await a.page.keyboard.press('Enter');
		await a.settle(700);
		const shown = await a.page.evaluate(() => {
			const h = document.querySelector('#lpn_ff_box .lpn-corner-help'), id = h.getAttribute('aria-describedby');
			const t = id && document.getElementById(id);
			return t ? t.textContent : null;
		});
		await shot(a.page, 'q5-help');
		const tb = await a.page.evaluate(() => { const r = document.querySelector('#lpn_ff_box .lpn-setbox-title').getBoundingClientRect(); return { x: r.left + 8, y: r.top + r.height / 2 }; });
		await a.page.mouse.click(tb.x, tb.y);
		await a.settle(400);
		const still = await a.page.evaluate(() => { const h = document.querySelector('#lpn_ff_box .lpn-corner-help'); return !!h.getAttribute('aria-describedby') && !!document.getElementById(h.getAttribute('aria-describedby')); });
		ok('a click on the box title bar closes the ? tip', !still);
		ok('Enter on the ? shows the tip', !!shown && shown.indexOf((await a.lang('lpn_ff_intro')).slice(0, 20)) >= 0, String(shown).slice(0, 60));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally {
		await a.close();
	}
}

// ---------------------------------------------------------------------------------------------
async function sectionPhone(Session, browser) {
	console.log('\n--- 5. a phone in tall mode ---');
	const a = await openNet3(Session, browser, { width: 390, height: 844 });
	try {
		await a.page.evaluate(() => {
			localStorage.setItem('lpn_setbox', JSON.stringify({ left: 900, top: 120, w: 420, h: 700, ix: null, open: true, dock: 'right', dockW: 420 }));
		});
		await reload(a);
		const g = await geom(a.page, 'lpn_settings_box');
		await shot(a.page, 'dock-phone');
		ok('a box stored as docked opens on a phone', g.open);
		ok('...filling the screen, not docked', !g.docked && g.box.l >= -0.5 && g.box.r <= g.vw + 0.5, JSON.stringify(g.box));
		ok('...with the map at full width', Math.abs(g.svg.r - g.wrap.r) <= 1 && g.wrap.l <= 2 && g.wrap.r >= g.vw - 3, JSON.stringify(g.wrap));
		ok('...and no dock buttons offered', g.acts.length === 0, g.acts.join());
		const rec = await stored(a.page, 'lpn_setbox');
		ok('...while the docking is kept for a wider window', rec && rec.dock === 'right', JSON.stringify(rec));
		ok('no uncaught page errors', a.errors.length === 0, a.errors.slice(0, 2).join(' | '));
	} finally {
		await a.close();
	}
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error(NAME + ': no Chromium found (set CHROME_PATH). SKIPPING rather than failing the build on an environment gap.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	const only = process.env.DOCK_ONLY ? process.env.DOCK_ONLY.split(',') : null;
	const run = (k, f) => (!only || only.indexOf(k) >= 0) ? f(Session, browser) : null;
	try {
		await run('row', sectionRow);
		await run('dock', sectionDock);
		await run('props', sectionProperties);
		await run('auto', sectionAutohide);
		await run('help', sectionHelp);
		await run('phone', sectionPhone);
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}

main().catch((e) => { console.error(e); process.exitCode = 1; }).finally(() => { process.exit(process.exitCode || 0); });
