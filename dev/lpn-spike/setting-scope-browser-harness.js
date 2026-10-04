// WHERE EACH SETTING IS KEPT -- ROADMAP Task 739. Run with:
//   node dev/lpn-spike/setting-scope-browser-harness.js            (compare with dev/setting-scope.md)
//   node dev/lpn-spike/setting-scope-browser-harness.js --write    (rewrite its inventory table)
// (it takes /tmp/engcalcs-browser.lock itself; never wrap it in that lock).
//
// Tom, 2026-09-28, on learning that dragged column widths live in the browser: *"Systematically
// disclose to users where things are stored. Autodesk does this so well that I, a user, can cite
// by memory that variables are stored in the drawing (project), session, or user profile. Every
// sysvar listing includes 'Where it's stored.'"*
//
// THREE THINGS, AND THE THIRD IS WHY THIS IS A BROWSER HARNESS AND NOT A GREP.
//   1. The markers render: every Settings sub-heading says Saved with the project / in this
//      browser, inside the box body, and the index and search still read the heading's own words.
//   2. THE DISCLOSURE CANNOT LIE. Every value control in the Settings box is DRIVEN, and where the
//      change landed is read back: a changed `lpn_project_*` record is "project", a changed other
//      `lpn_*` key is "browser", and a change that reached neither is "session". That observed
//      class must equal the class the marker declares for the control (its own row marker, else its
//      sub-heading's). A new control that is stored somewhere its heading does not say fails here,
//      and so does one stored nowhere (an unclassified control is a control nobody can find the
//      home of).
//   3. The Tables pane's column width: the Manage columns box has a Width entry with the tip, and
//      the divider carries the delayed (1 s) tip, on a pointer device only.
//
// The inventory table in dev/setting-scope.md is GENERATED from step 2 (--write), so what it says
// is what the page does. dev/scripts/setting_scope_check.php holds the static half (every
// sub-heading is classified, every browser key is in the inventory).
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3 or later
'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync, spawnSync } = require('child_process');

const REPO = path.resolve(__dirname, '..', '..');
const LOCK_FILE = '/tmp/engcalcs-browser.lock';
const LOCK_ENV = 'EC_SETSCOPE_LOCKED';
const MD = path.join(REPO, 'dev', 'setting-scope.md');
const WRITE = process.argv.includes('--write');

if (process.env[LOCK_ENV] !== '1') {
	let hasFlock = false;
	try { execFileSync('which', ['flock'], { stdio: 'ignore' }); hasFlock = true; } catch (e) { /* none */ }
	if (hasFlock) {
		const r = spawnSync('flock', ['-E', '75', '-w', '180', LOCK_FILE, process.execPath, __filename].concat(process.argv.slice(2)), {
			stdio: 'inherit', env: Object.assign({}, process.env, { [LOCK_ENV]: '1' })
		});
		if (r.error) { console.error('setting-scope-browser-harness: flock re-exec failed: ' + r.error.message); process.exit(1); }
		if (r.status === 75) {
			console.error('setting-scope-browser-harness: NOT RUN -- another session held ' + LOCK_FILE + ' for 180 s.');
			process.exit(1);
		}
		process.exit(r.status === null ? 1 : r.status);
	}
	console.error('setting-scope-browser-harness: no `flock` binary found -- running WITHOUT the browser lock.');
}

let fails = 0;
function ok(name, cond, extra) {
	console.log((cond ? '  ok   ' : '  FAIL ') + name + (extra === undefined ? '' : '   ' + extra));
	if (!cond) { fails++; }
}

// What the page can see of "where did that go": every lpn_ localStorage record, split into the
// project store (the library index and one record per project) and everything else.
const SNAPSHOT = () => {
	const proj = {}, other = {};
	for (let i = 0; i < localStorage.length; i++) {
		const k = localStorage.key(i);
		if (!/^lpn_/.test(k)) { continue; }
		((/^lpn_project_/.test(k) || k === 'lpn_index') ? proj : other)[k] = localStorage.getItem(k);
	}
	return { proj, other };
};
// The project record also carries WHERE THE READER WAS LOOKING (`view`), which rides along on any save
// and moves when a box opens; and the library index carries a timestamp. Neither is a setting, so a
// project-side difference is read with both set aside.
function plain(o) {
	const out = {};
	Object.keys(o).forEach((k) => {
		if (k === 'lpn_index') { return; }
		try { const d = JSON.parse(o[k]); delete d.view; out[k] = d; } catch (e) { out[k] = o[k]; }
	});
	return out;
}
function differs(a, b) { return JSON.stringify(plain(a)) !== JSON.stringify(plain(b)); }

// The value controls of the Settings box, tagged in document order so a rebuild that replaces the
// elements can still be found again by position. Buttons, the filter, files and the colour-band
// boxes' hidden helpers are not value controls.
const TAG = () => {
	const els = [...document.querySelectorAll('#lpn_setbox_content input, #lpn_setbox_content select')]
		.filter((e) => !/^(button|submit|file|hidden|search|reset|image|color)$/.test(e.type) && !e.disabled &&
			!e.closest('[style*="display: none"]'));
	const seen = {}, out = [];
	els.forEach((e) => {
		const row = e.closest('.lpn-set-row[data-saved]');
		const body = e.closest('.lpn-set-subbody');
		const sub = body && body.previousElementSibling;
		const holder = e.closest('.lpn-set-row, tr, label') || e.parentNode;
		const clone = holder.cloneNode(true);
		clone.querySelectorAll('.lpn-saved, .ec-tip, input, select, button').forEach((x) => x.remove());
		const label = clone.textContent.replace(/\s+/g, ' ').replace(/\s*\([^)]*\)/g, '').trim().slice(0, 60) || e.type;
		const key = (sub ? sub.id : '') + ' | ' + label;
		seen[key] = (seen[key] || 0) + 1;
		const id = key + ' #' + seen[key];
		e.setAttribute('data-probe', id);
		out.push({
			id, key, first: seen[key] === 1, type: e.type, label, sub: sub ? sub.id : '',
			declared: row ? row.getAttribute('data-saved') : (sub ? sub.getAttribute('data-saved') : '')
		});
	});
	return out;
};

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	let chromium;
	try { chromium = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core')).chromium; }
	catch (err) { console.error('playwright-core is not installed (cd dev/browser-pass && npm install).'); process.exit(1); }
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) {
		console.error('setting-scope-browser-harness: no Chromium found (set CHROME_PATH). SKIPPING.');
		env.stopServer();
		process.exit(0);
	}
	const browser = await chromium.launch({ executablePath });
	const inventory = [];   // { sub, label, declared, observed }
	try {
		const a = await Session.open(browser, 'setting-scope');
		await a.goto('Looped-Network.php');
		await a.page.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await a.openExampleCard(await a.lang('lpn_ex_net3_title'));
		await a.settle(800);
		const P = (fn, arg) => a.page.evaluate(fn, arg);
		// A dialog button is pressed from inside the page: Playwright's own click waits for the
		// button to be stable and unobscured, and a dialog opened by a rebuild can stay neither.
		const press = (i) => P((n) => { const b = document.querySelectorAll('#lpn_dialog_buttons button')[n]; if (b) { b.click(); } }, i);
		const classes = ['project', 'browser', 'session'];
		const words = {};
		for (const c of classes) { words[c] = await a.lang('lpn_saved_' + c); }
		ok('the three class words are three different strings', new Set(Object.values(words)).size === 3, JSON.stringify(words));

		await a.toolbarClick(await a.lang('lpn_tool_settings'));
		await a.page.waitForSelector('#lpn_settings_box', { state: 'visible' });
		await a.settle(600);

		console.log('\n--- the markers render ---');
		const subs = await P(() => [...document.querySelectorAll('#lpn_setbox_content .lpn-set-sub')].map((s) => {
			const m = s.querySelector(':scope > .lpn-saved');
			return {
				id: s.id, declared: s.getAttribute('data-saved'),
				markClass: m && m.getAttribute('data-saved-class'), markText: m && m.textContent,
				inBody: !!(m && m.closest('.lpn-setbox-body') && !m.closest('#lpn_setbox_title'))
			};
		}));
		ok('the box has sub-headings', subs.length >= 10, subs.length);
		subs.forEach((s) => {
			ok(`${s.id} is classified and its marker says so, in the box body`,
				classes.includes(s.declared) && s.markClass === s.declared && s.markText === words[s.declared] && s.inBody,
				JSON.stringify(s));
		});
		const indexText = await P(() => [...document.querySelectorAll('#lpn_setbox_index button')].map((b) => b.textContent).join('|'));
		ok('the index names the headings alone, without the marker words',
			classes.every((c) => !indexText.includes(words[c])), indexText.slice(0, 120));
		const rowMarks = await P(() => [...document.querySelectorAll('#lpn_setbox_content .lpn-set-row .lpn-saved')].map((m) => {
			const row = m.closest('.lpn-set-row'), sub = row.closest('.lpn-set-subbody').previousElementSibling;
			return { cls: m.getAttribute('data-saved-class'), row: row.getAttribute('data-saved'), heading: sub.getAttribute('data-saved') };
		}));
		ok('a row carries its own marker only where its home differs from its heading\'s',
			rowMarks.length >= 1 && rowMarks.every((r) => r.cls === r.row && r.cls !== r.heading), JSON.stringify(rowMarks));

		console.log('\n--- every value control is stored where its marker says ---');
		const allControls = await P(TAG);
		ok('the box has value controls', allControls.length >= 40, allControls.length);
		const unclassified = allControls.filter((c) => !classes.includes(c.declared));
		ok('every value control sits under a classified heading or carries its own marker', unclassified.length === 0,
			unclassified.map((c) => c.id).join('; '));
		// One control per row is driven: a row of ten checkboxes is one setting in ten columns and
		// they are written by one handler into one place.
		const controls = allControls.filter((c) => c.first && (!process.env.PROBE_ONLY || c.id.includes(process.env.PROBE_ONLY)));
		const before = await P(SNAPSHOT);
		for (const c of controls) {
			if (process.env.TRACE) { console.log('  .. ' + c.id); }
			await P(TAG);
			const sel = `[data-probe="${c.id.replace(/"/g, '\\"')}"]`;
			const loc = a.page.locator(sel);
			if (!(await loc.count())) { ok(`${c.label} is still in the box`, false); inventory.push({ sub: c.sub, label: c.label, declared: c.declared, observed: 'not driven' }); continue; }
			let observed = 'session', tried = [];
			const snap0 = await P(SNAPSHOT);
			const was = await loc.evaluate((e) => ({ checked: e.checked, value: e.value }));
			const attempts = [];
			if (c.type === 'checkbox') { attempts.push({ kind: 'click' }); }
			else if (c.type === 'radio') { attempts.push({ kind: 'click' }); }
			else if (loc && (await loc.evaluate((e) => e.tagName)) === 'SELECT') {
				const n = await loc.evaluate((e) => e.options.length);
				const cur = await loc.evaluate((e) => e.selectedIndex);
				for (let k = 0; k < Math.min(n, 4); k++) { if (k !== cur) { attempts.push({ kind: 'select', k }); } }
			} else if (c.type === 'number') {
				const v = parseFloat(await loc.inputValue());
				[v + 1, v * 0.5, 0.5, v + 0.1].forEach((x) => attempts.push({ kind: 'fill', v: String(Math.round(x * 1e6) / 1e6) }));
			} else {
				// A clock field (`24:00`) refuses words, so a clock-shaped value is given a later clock.
				const v = await loc.inputValue();
				if (/^\d+(:\d+)*$/.test(v)) { attempts.push({ kind: 'fill', v: v.replace(/^\d+/, (n) => String(+n + 1)) }); }
				if (v === '') { attempts.push({ kind: 'fill', v: '6:00' }, { kind: 'fill', v: '6:00 AM' }); }
				if (/^\d+(:\d\d)?\s*[ap]m$/i.test(v)) { attempts.push({ kind: 'fill', v: v.replace(/^\d+/, (n) => String(+n % 12 + 1)) }); }
				attempts.push({ kind: 'fill', v: 'Z' + Date.now() % 997 });
			}
			for (const t of attempts) {
				await P(TAG);
				try {
					const el = a.page.locator(sel);
					if (t.kind === 'click') { await el.evaluate((e) => e.click()); }
					else if (t.kind === 'select') { await el.evaluate((e, k) => { e.selectedIndex = k; e.dispatchEvent(new Event('change', { bubbles: true })); }, t.k); }
					else { await el.evaluate((e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); }, t.v); }
				} catch (err) { tried.push('threw ' + String(err.message).split('\n')[0]); continue; }
				// A change may open a confirm or a notice; the harness answers none of them and goes on.
				// A saved change may wait on the debounced solve behind it (a unit, the engine), so the
				// answer is polled for rather than read once.
				// A unit that already decides typed numbers asks first (onUnitChange); the harness gives
				// the dialog its first answer, Non-destructive, which is the suite's standing behaviour.
				const dlg0 = await a.dialog();
				if (dlg0 && dlg0.buttons.length) { await press(0); await a.settle(250); tried.push('answered a dialog: ' + dlg0.buttons[0]); }
				let landed = false;
				for (let w = 0; w < 4 && !landed; w++) {
					await a.settle(250);
					const snap1 = await P(SNAPSHOT);
					const dO = differs(snap0.other, snap1.other), dP = differs(snap0.proj, snap1.proj);
					// BOTH is the defect CLAUDE.md names: a setting belongs to the project or to the
					// browser, never both. It is a class of its own here so that it can never pass.
					if (dO && dP) { observed = 'both'; landed = true; }
					else if (dO) { observed = 'browser'; landed = true; }
					else if (dP) { observed = 'project'; landed = true; }
				}
				if (landed) { break; }
			}
			// Put the control back as it was, so one row's change does not remove or reshape the rows
			// that follow it (the engine decides which accuracy rows exist).
			await P((a2) => {
				const e = document.querySelector('[data-probe="' + a2.id.replace(/"/g, '\\"') + '"]');
				if (!e) { return; }
				if (e.type === 'checkbox' || e.type === 'radio') { if (e.checked !== a2.was.checked) { e.click(); } }
				else { e.value = a2.was.value; e.dispatchEvent(new Event('change', { bubbles: true })); }
			}, { id: c.id, was });
			await a.settle(300);
			{ const d2 = await a.dialog(); if (d2 && d2.buttons.length) { await press(0); await a.settle(300); } }
			if (process.env.PROBE_ONLY) { console.log('    debug', c.id, JSON.stringify({ observed, attempts, tried, was })); }
			// Put the box back: a dialog the change opened, and the box itself if it was closed.
			{ const d1 = await a.dialog(); if (d1 && d1.buttons.length) { await press(d1.buttons.length - 1); await a.settle(200); } }
			const open = await P(() => document.getElementById('lpn_settings_box').style.display !== 'none');
			if (!open) { await a.toolbarClick(await a.lang('lpn_tool_settings')); await a.settle(300); }
			inventory.push({ sub: c.sub, label: c.label, declared: c.declared, observed });
			if (observed !== c.declared) {
				ok(`${c.sub} / ${c.label}: marker says ${c.declared}, the page stores it as ${observed}`, false, tried.join('; '));
			}
		}
		ok(`${controls.length} rows driven, each stored where its marker says`, inventory.every((r) => r.observed === r.declared));

		console.log('\n--- the Tables pane: Width, and the tip on the divider ---');
		await P(() => { document.getElementById('lpn_pane_btn').click(); });
		await a.settle(300);
		await P(() => { document.getElementById('lpn_pane_tab_junctions').click(); });
		await a.settle(500);
		const widthTip = await a.lang('lpn_pane_width_tip');
		const grip = await P(() => {
			const g = document.querySelector('#lpn_pane_junctions table thead th .lpn-pane-colgrip');
			return g ? { delay: g.getAttribute('data-ec-tip-delay'), tip: g.getAttribute('data-bs-original-title') || g.getAttribute('title'), help: g.classList.contains('ec-help') } : null;
		});
		ok('the divider carries the width tip with a 1 s delay', !!grip && grip.delay === '1000' && grip.tip === widthTip && grip.help, JSON.stringify(grip));
		const g0 = a.page.locator('#lpn_pane_junctions table thead th:nth-child(2) .lpn-pane-colgrip');
		const box = await g0.boundingBox();
		if (box) {
			await a.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
			await a.page.waitForTimeout(650);
			const early = await P(() => document.querySelectorAll('.tooltip.show').length);
			await a.page.waitForTimeout(700);
			const late = await P(() => [...document.querySelectorAll('.tooltip.show')].map((t) => t.textContent));
			ok('no tip at 0.65 s over the divider', early === 0, early);
			ok('the tip is up by 1.35 s and says the width is this browser\'s', late.some((t) => t.includes(widthTip)), JSON.stringify(late));
			await a.page.mouse.move(5, 5);
		} else { ok('the divider has a box to hover', false); }
		// A touch device gets no tip on the divider at all.
		const touch = await browser.newContext({ hasTouch: true, isMobile: true, viewport: { width: 420, height: 800 } });
		const tp = await touch.newPage();
		await tp.goto(env.pageUrl ? env.pageUrl('Looped-Network.php') : a.page.url());
		await tp.waitForTimeout(1500);
		await tp.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } });
		await tp.evaluate(() => { const card = document.querySelector('#lpn_examples_pane .lpn-example-card'); if (card) { card.click(); } });
		await tp.waitForTimeout(2500);
		await tp.evaluate(() => { document.getElementById('lpn_pane_btn').click(); });
		await tp.waitForTimeout(300);
		await tp.evaluate(() => { document.getElementById('lpn_pane_tab_junctions').click(); });
		await tp.waitForTimeout(600);
		const touchGrips = await tp.evaluate(() => [...document.querySelectorAll('.lpn-pane-colgrip')].map((g) => g.getAttribute('data-ec-tip-delay') || g.title || ''));
		ok('on a touch device the table has dividers and none carries the tip', touchGrips.length > 0 && touchGrips.every((t) => t === ''), touchGrips.length + ' dividers');
		await touch.close();

		await P(() => {
			const th = document.querySelector('#lpn_pane_junctions table thead th:nth-child(2) .lpn-pane-colmenu');
			th.click();
		});
		await a.settle(200);
		await a.page.evaluate(([t]) => { [...document.querySelectorAll('.lpn-pane-ctxmenu button')].find((b) => b.textContent === t).click(); }, [await a.lang('lpn_pane_manage_cols')]);
		await a.settle(300);
		const dlg = await P(() => {
			const w = document.querySelector('.lpn-managecols-width');
			return w ? { label: w.textContent, tip: !!w.querySelector('.ec-help[data-bs-original-title], .ec-help[title]'), disabled: w.querySelector('input').disabled } : null;
		});
		ok('Manage columns has a Width entry with a tip glyph', !!dlg && dlg.tip && dlg.label.includes(await a.lang('lpn_pane_manage_cols_width')), JSON.stringify(dlg));
		ok('...disabled until a column is selected', !!dlg && dlg.disabled === true);
		await P(() => { document.querySelectorAll('.lpn-managecols-row')[2].click(); });
		await a.settle(150);
		const w0 = await P(() => document.querySelector('.lpn-managecols-width input').value);
		ok('...and shows the selected column\'s width', parseFloat(w0) > 0, w0);
		await a.settle(1500);
		const before2 = await P(SNAPSHOT);
		await P(() => { const i = document.querySelector('.lpn-managecols-width input'); i.value = '11'; i.dispatchEvent(new Event('change', { bubbles: true })); });
		const unstaged = await P(SNAPSHOT);
		ok('...a typed width stages and writes nothing until OK', !differs(before2, unstaged));
		await P((t) => { const b = [...document.querySelectorAll('#lpn_dialog_buttons button')].find((x) => x.textContent.trim() === t); if (b) { b.click(); } }, await a.lang('lpn_dialog_ok'));
		await a.settle(200);
		await a.settle(300);
		const after2 = await P(SNAPSHOT);
		// The project record may move for its own reasons while the dialog is open, so the claim made
		// is the one that matters: the width is in lpn_panecols and nowhere in a project record.
		ok('...OK stores it in this browser (lpn_panecols) and not in any project record',
			differs(before2.other, after2.other) && /"axis2":11/.test(after2.other.lpn_panecols || '') &&
			!/"axis2":11/.test(JSON.stringify(after2.proj)));
	} finally {
		await browser.close();
		env.stopServer();
	}

	// ---- the inventory --------------------------------------------------------------------------
	const groups = {};
	inventory.forEach((r) => { (groups[r.sub] = groups[r.sub] || []).push(r); });
	const counts = { project: 0, browser: 0, session: 0, both: 0 };
	inventory.forEach((r) => { counts[r.observed] = (counts[r.observed] || 0) + 1; });
	const lines = ['| Sub-heading | Controls | Project | This browser | This session |', '|---|---|---|---|---|'];
	Object.keys(groups).forEach((g) => {
		const rs = groups[g], n = (c) => rs.filter((r) => r.observed === c).length;
		lines.push(`| \`${g}\` | ${rs.length} | ${n('project')} | ${n('browser')} | ${n('session')} |`);
	});
	lines.push(`| **Total** | ${inventory.length} | ${counts.project} | ${counts.browser} | ${counts.session} |`);
	const odd = inventory.filter((r) => r.observed !== 'project');
	const table = lines.join('\n') + '\n\nControls whose home is not their heading\'s default, as observed:\n\n' +
		(odd.length ? odd.map((r) => `- \`${r.sub}\`: ${r.label} -- ${r.observed}`).join('\n') : '- none') + '\n';
	const BEGIN = '<!-- INVENTORY:BEGIN (generated by dev/lpn-spike/setting-scope-browser-harness.js --write) -->';
	const END = '<!-- INVENTORY:END -->';
	let md = fs.readFileSync(MD, 'utf8');
	const re = new RegExp(BEGIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' + END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
	if (!re.test(md)) { ok('dev/setting-scope.md has the inventory markers', false); }
	else if (WRITE) {
		fs.writeFileSync(MD, md.replace(re, () => BEGIN + '\n' + table + END));
		console.log('  wrote the inventory table into dev/setting-scope.md');
	} else {
		const have = re.exec(md)[0];
		ok('dev/setting-scope.md\'s inventory table is what the page does (rerun with --write)',
			have === BEGIN + '\n' + table + END);
	}

	console.log(fails ? `\nsetting-scope: ${fails} FAILED` : '\nsetting-scope: all ok');
	process.exit(fails ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
