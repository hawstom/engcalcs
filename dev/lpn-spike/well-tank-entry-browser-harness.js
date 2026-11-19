// A WELL'S TANK INPUTS ARE TYPED ON THE WELL, AND EVERY ONE OF THEM WORKS, in a real Chrome. Run with:
//   node dev/lpn-spike/well-tank-entry-browser-harness.js   (takes the browser lock itself)
//
// Task 822, round 14 (Tom, round 13 pass: "We've disabled the Base Elevation, Tank diameter etc. entry. Please audit. This is non-functional.").
// Round 13 locked nine tank inputs on a Well's tank and moved their entry to the Well's box. For BOTH forms (Well with tank, open air; Well with
// pressure tank), through real typing, this checks for every input the Well's box offers on the tank:
//   1. the row is there, visible and typeable, in the tank's section of the Well's box (none went missing in the move);
//   2. typing a value stores it on the tank (the project as autosave wrote it);
//   3. the tank's own box shows it, read-only, with the Well's sentence at the top;
//   4. the tank's results follow it (head from the base and the initial depth; available volume from the diameter and the depths);
//   5. one Undo restores the last edit;
//   6. in a scenario, typing on the Well stores an override on the tank and leaves Base as it was, and the tank's own box shows the override;
//   7. a saved project reopens with the values on the Well's box;
//   8. the .inp export carries them, and reading that .inp back puts them on the Well's box again.
// The tee goes on a pipe, so the tank is drawn as itself and its own box can be opened from the map.
//
// Copyright 2009 Thomas Gail Haws
// Licensed under GNU GPL v3.0 or later
'use strict';

const path = require('path');
const fs = require('fs');
const U = require('./scenario-ui-helper.js');

const REPO = U.REPO;
const NAME = 'well-tank-entry-browser-harness';
U.takeBrowserLock(NAME, 'EC_WELL_TANK_ENTRY_LOCKED');

let checks = 0, failures = 0;
function ok(label, cond, detail) {
	checks++;
	if (!cond) { failures++; }
	console.log((cond ? '  ok   ' : '  FAIL ') + label + (detail === undefined ? '' : '   ' + detail));
}
const FILE = path.join(REPO, 'dev', 'lpn-spike', 'well-test-net1.lwn');
const near = (x, y) => typeof x === 'number' && typeof y === 'number' && Math.abs(x - y) < 1e-6;
const SENTENCE = /^Associated with Well W1\. Change volume and control properties there\.$/;

// The inputs the Well's box holds for the tank, with the value typed in Base, the value typed in the scenario, and the key the tank stores it under.
const OPEN = [
	['Elevation', '5', '6', 'elev'], ['Base elevation', '3', '4', 'bottomElev'], ['Initial depth', '12', '13', '_level'], ['Minimum depth', '2', '3', 'minLevel'],
	['Maximum depth', '40', '41', 'maxLevel'], ['Tank diameter', '60', '61', 'tankDiameter'], ['Minimum volume', '500', '501', 'minVolume'], ['Can overflow', 'YES', 'NO', 'overflow']
];
const PRESSURE = [['Elevation', '5', '6', 'elev'], ['Base elevation', '3', '4', 'bottomElev']];

async function openSession(browser, Session, project) {
	const a = await Session.open(browser, NAME, { viewport: { width: 1400, height: 1000 }, serviceWorkers: 'block' });
	const P = a.page;
	await P.route(/tile\.openstreetmap\.org|api\.mapbox\.com|nominatim/, (r) => r.abort());
	await a.goto('Looped-Network.php?ec_nolog=1');
	const text = typeof project === 'string' ? fs.readFileSync(project, 'utf8') : project && project.inp !== undefined ? null : JSON.stringify(project);
	await P.evaluate((t) => { localStorage.clear(); localStorage.setItem('lpn_hovercard', 'off'); if (t) { localStorage.setItem('lpn_project_hover', t); } }, text);
	await a.reload();
	await a.answerTrainingPanel().catch(() => {});
	await P.evaluate(() => { const c = document.getElementById('ec-consent'); if (c) { c.remove(); } delete window.lpnDialogAnswerer; });
	await a.settle(1500);
	if (!text) { await P.setInputFiles('#lpn_inp_file', { name: 'tank.inp', mimeType: 'text/plain', buffer: Buffer.from(project.inp) }); }
	await a.settle(2500);
	await closeDialogs(a);
	await a.settle(1000);
	return { a, P, strings: {} };
}
async function closeDialogs(s) {
	for (let k = 0; k < 6; k++) {
		const d = await s.dialog();
		if (!d) { return; }
		await s.dialogClick(d.buttons[0]);
		await s.settle(500);
	}
}
const stored = (P) => P.evaluate(() => {
	const i = JSON.parse(localStorage.getItem('lpn_index') || '{}').openId;
	return JSON.parse(localStorage.getItem('lpn_project_' + i) || 'null');
});
const centreOf = (P, id) => P.evaluate((i) => {
	const el = Array.from(document.querySelectorAll('#lpn_canvas [data-node="' + i + '"], #lpn_canvas [data-link="' + i + '"]')).filter((e) => e.getBoundingClientRect().width > 0)[0];
	if (!el) { return null; }
	const r = el.getBoundingClientRect();
	return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}, id);
// Open a box by pressing the element's symbol.
async function openBox(ctx, id) {
	await ctx.P.keyboard.press('Escape');
	const c = await centreOf(ctx.P, id);
	await ctx.P.mouse.click(c.x, c.y);
	await ctx.a.settle(900);
}
// The rows of the tank's section in the Well's box.
const tankSection = (P) => P.evaluate(() => {
	const sec = Array.from(document.querySelectorAll('#lpn_popup_fields section')).filter((s) => /^Tank /.test(s.textContent.trim()))[0];
	if (!sec) { return null; }
	return Array.from(sec.querySelectorAll('label')).map((l) => {
		const i = l.querySelector('input, select');
		const r = i ? i.getBoundingClientRect() : null;
		return { t: l.textContent.replace(/\s+/g, ' ').trim(), has: !!i, tag: i ? i.tagName : '', value: i ? i.value : '', visible: !!r && r.width > 0 && r.height > 0, disabled: !!i && (i.disabled || i.readOnly) };
	});
});
const rowIn = (rows, name) => (rows || []).filter((r) => r.t.indexOf(name) === 0)[0];
// Type into one row of the tank's section as a person does: click it, type, Enter; a select is chosen.
async function typeInSection(ctx, name, val) {
	const h = await ctx.P.evaluateHandle((n) => {
		const sec = Array.from(document.querySelectorAll('#lpn_popup_fields section')).filter((s) => /^Tank /.test(s.textContent.trim()))[0];
		return Array.from(sec.querySelectorAll('label')).filter((l) => l.textContent.replace(/\s+/g, ' ').trim().indexOf(n) === 0)[0].querySelector('input, select');
	}, name);
	const el = h.asElement();
	if ((await el.evaluate((e) => e.tagName)) === 'SELECT') { await el.selectOption(val); }
	else { await el.click({ clickCount: 3 }); await ctx.P.keyboard.type(String(val)); await ctx.P.keyboard.press('Enter'); }
	await ctx.a.settle(450);
}
// The tank's own box: every row's name, value and whether it is a form control.
const boxRows = (P) => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_popup_fields label')).map((l) => ({
	t: l.textContent.replace(/\s+/g, ' ').trim(), controls: l.querySelectorAll('input, select, textarea').length })));
const sentenceShown = (P) => P.evaluate(() => { const n = document.querySelector('#lpn_popup_fields .lpn-owned-note'); return n ? n.textContent.trim() : null; });
// A row's value off the label text ("Base elevation (ft H2O)? 3").
const rowValue = (rows, name) => { const r = rowIn(rows, name); const m = r && /(?:\)|\?)\s*([-\d.]+|Yes|No)\s*$/.exec(r.t); return m ? m[1] : undefined; };

const pipeArrow = (P) => P.evaluate(() => Array.from(document.querySelectorAll('#lpn_canvas path[data-link]')).map((e) => {
	const L = e.getTotalLength(), m = e.getScreenCTM(), p = e.getPointAtLength(L / 2);
	return { id: e.getAttribute('data-link'), x: m.a * p.x + m.c * p.y + m.e, y: m.b * p.x + m.d * p.y + m.f, L };
}).filter((q) => q.L > 5)[0]);
const freePoints = (P) => P.evaluate(() => {
	const out = [];
	for (let r = 0; r < 700 && out.length < 2; r += 20) {
		for (let k = 0; k < 24 && out.length < 2; k++) {
			const x = 1100 + r * Math.cos(k * Math.PI / 12), y = 800 + r * Math.sin(k * Math.PI / 12), e = document.elementFromPoint(x, y);
			if (e && e.closest && e.closest('#lpn_canvas') && !e.closest('[data-node],[data-link],.lpn-node-symbol-box,.lpn-link-symbol,text') && x > 40 && y > 200 && x < 1360 && y < 940 && out.every((o) => Math.hypot(o.x - x, o.y - y) > 120)) { out.push({ x, y }); }
		}
	}
	return out;
});
const clickRow = (P, sel, text) => P.evaluate(([q, t]) => {
	const r = Array.from(document.querySelectorAll(q)).find((b) => b.textContent.replace(/[▸\s]+$/, '').trim().indexOf(t) >= 0);
	if (r) { r.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 })); }
	return !!r;
}, [sel, text]);
async function exportInp(s) {
	const P = s.page, L = (k) => s.lang(k);
	let dl = null;
	const w = P.waitForEvent('download', { timeout: 8000 }).then((x) => { dl = x; }, () => {});
	await P.click('#lpn_menu_file');
	await P.waitForSelector('#lpn_menu_popup', { state: 'visible' });
	await clickRow(P, '#lpn_menu_list button.lpn-menu-row', (await L('lpn_file_export_menu')).trim());
	await P.waitForSelector('#lpn_menu_list2 button.lpn-menu-row', { state: 'attached' });
	const item = (await L('lpn_file_export_item_inp')).trim();
	if (!(await clickRow(P, '#lpn_menu_list2 button.lpn-menu-row', item))) {
		const groups = await P.$$eval('#lpn_menu_list2 button.lpn-menu-row', (els) => els.filter((e) => e.querySelector('.lpn-menu-arrow')).map((e) => e.textContent.replace(/[▸\s]+$/, '').trim()));
		for (const g of groups) {
			await clickRow(P, '#lpn_menu_list2 button.lpn-menu-row', g);
			await P.waitForSelector('#lpn_menu_list3 button.lpn-menu-row', { state: 'attached' });
			if (await clickRow(P, '#lpn_menu_list3 button.lpn-menu-row', item)) { break; }
		}
	}
	await s.settle(500);
	const asked = await s.dialog();
	if (asked) { await s.dialogClick(asked.buttons[0]); }
	await w; await s.settle(500);
	const dlg = await s.dialog();
	if (dlg) { await s.dialogClick((await L('lpn_dialog_ok')).trim()); }
	return dl ? fs.readFileSync(await dl.path(), 'utf8') : null;
}
// The [TANKS] row for a tank in an .inp.
function tanksRow(text, id) {
	let on = false;
	for (const line of String(text || '').split(/\r?\n/)) {
		const m = /^\s*\[(\w+)\]/.exec(line);
		if (m) { on = m[1].toUpperCase() === 'TANKS'; continue; }
		const t = line.replace(/;.*$/, '').trim();
		if (on && t) { const f = t.split(/\s+/); if (f[0] === id) { return f; } }
	}
	return null;
}

async function runForm(browser, Session, form) {
	const pressure = form === 'Well with pressure tank', INPUTS = pressure ? PRESSURE : OPEN;
	console.log('\n=== ' + form + ' ===');
	const ctx = await openSession(browser, Session, FILE);
	const { a, P } = ctx;
	const free = await freePoints(P), arrow = await pipeArrow(P);
	await a.menuClickSub('Insert', form, 'project');
	await P.mouse.click(free[0].x, free[0].y); await a.settle(600);
	await P.mouse.click(arrow.x, arrow.y); await a.settle(600);
	await P.mouse.click(free[1].x, free[1].y); await a.settle(900);
	await P.keyboard.press('Escape'); await P.keyboard.press('Escape'); await a.settle(500);
	await openBox(ctx, 'W1');
	let rows = await tankSection(P);
	ok('the Well\'s box has a tank section', !!rows);
	INPUTS.forEach((i) => {
		const r = rowIn(rows, i[0]);
		ok(form + ': the Well\'s box shows a typeable "' + i[0] + '" row in the tank\'s section', !!r && r.has && r.visible && !r.disabled, JSON.stringify(r));
	});
	const baseTank = (await stored(P)).nodes.find((n) => n.id === 'T1');
	// 2. typing
	for (const i of INPUTS) { await typeInSection(ctx, i[0], i[1]); }
	rows = await tankSection(P);
	INPUTS.forEach((i) => ok(form + ': "' + i[0] + '" still reads ' + i[1] + ' on the Well after typing', (rowIn(rows, i[0]) || {}).value === i[1], JSON.stringify(rowIn(rows, i[0]))));
	await a.settle(2400);
	let doc = await stored(P);
	let tank = doc.nodes.find((n) => n.id === 'T1');
	INPUTS.forEach((i) => {
		const want = i[3] === 'overflow' ? i[1] : +i[1];
		ok(form + ': the tank stores ' + i[3] + ' = ' + i[1], tank[i[3]] === want, JSON.stringify(tank[i[3]]) + ' (was ' + JSON.stringify(baseTank[i[3]]) + ')');
	});
	// 3. the tank's own box
	await openBox(ctx, 'T1');
	let own = await boxRows(P);
	ok(form + ': the tank\'s own box opens, with the Well\'s sentence at the top', (await sentenceShown(P)) !== null && SENTENCE.test(await sentenceShown(P)), String(await sentenceShown(P)));
	INPUTS.forEach((i) => {
		const r = rowIn(own, i[0]);
		const shown = rowValue(own, i[0]);
		const want = i[3] === 'overflow' ? 'Yes' : String(+i[1]);
		ok(form + ': the tank\'s own box shows ' + i[0] + ' = ' + want + ', read-only', !!r && r.controls === 0 && shown === want, JSON.stringify(r));
	});
	// 4. the results follow
	if (!pressure) {
		const head = rowValue(own, 'Head'), avail = rowValue(own, 'Available volume');
		const wantAvail = (Math.PI / 4 * 60 * 60 * (12 - 2)).toFixed(2);
		ok(form + ': the tank\'s head is its base plus its initial depth (3 + 12)', head === '15.00', head);
		ok(form + ': its available volume comes from the diameter and the depths (60 ft, 12 less 2 ft)', avail === wantAvail, avail + ' want ' + wantAvail);
	} else {
		const head = rowValue(own, 'Head');
		ok(form + ': the tank\'s head is its base plus its (derived) initial depth', head !== undefined && +head > 3, head);
	}
	// 5. Undo
	await P.keyboard.press('Escape');
	await openBox(ctx, 'W1');
	await P.keyboard.press('Escape'); await a.settle(300);
	const last = INPUTS[INPUTS.length - 1];
	await P.keyboard.press('Control+z'); await a.settle(2400);
	doc = await stored(P); tank = doc.nodes.find((n) => n.id === 'T1');
	ok(form + ': one Undo takes the last typed value (' + last[0] + ') back', tank[last[3]] !== (last[3] === 'overflow' ? last[1] : +last[1]) && INPUTS.slice(0, -1).every((i) => tank[i[3]] === (i[3] === 'overflow' ? i[1] : +i[1])), JSON.stringify(tank));
	await openBox(ctx, 'W1');
	await typeInSection(ctx, last[0], last[1]);
	// 6. a scenario
	const made = await U.createScenarioViaMenu(ctx);
	const scnId = made.scenario && made.scenario.id;
	ok(form + ': a scenario was made and is current', !!scnId);
	await openBox(ctx, 'W1');
	for (const i of INPUTS) { await typeInSection(ctx, i[0], i[2]); }
	await a.settle(2400);
	doc = await stored(P);
	const scn = (doc.scenarios || []).filter((s) => s.id === scnId)[0] || {};
	// Where a scenario keeps a node value: its own overrides, or its Physical alternative (the scenario's Basic mode decides).
	const heldBy = (prop0) => {
		const prop = prop0;
		const names = prop === '_level' ? ['_level', 'level'] : [prop];   // an override is keyed by the property (level), the node by its stored key (_level)
		const o = (scn.overrides || {})['n:T1'];
		for (const k of names) { if (o && Object.prototype.hasOwnProperty.call(o, k)) { return o[k]; } }
		const alt = (doc.alternatives || []).filter((x) => x.id === ((scn.alternatives || {}).physical))[0];
		const v = alt && alt.values && alt.values['n:T1'];
		for (const k of names) { if (v && Object.prototype.hasOwnProperty.call(v, k)) { return v[k]; } }
		return undefined;
	};
	tank = doc.nodes.find((n) => n.id === 'T1');
	INPUTS.forEach((i) => {
		const want = i[3] === 'overflow' ? i[2] : +i[2];
		const was = i[3] === 'overflow' ? i[1] : +i[1];
		ok(form + ': in the scenario, ' + i[0] + ' is an override of ' + i[2] + ' and Base still holds ' + i[1], heldBy(i[3]) === want && tank[i[3]] === was, 'override ' + JSON.stringify(heldBy(i[3])) + ', Base ' + JSON.stringify(tank[i[3]]));
	});
	await openBox(ctx, 'T1');
	own = await boxRows(P);
	INPUTS.forEach((i) => {
		const shown = rowValue(own, i[0]), want = i[3] === 'overflow' ? 'No' : String(+i[2]);
		ok(form + ': in the scenario the tank\'s own box shows ' + i[0] + ' = ' + want, shown === want, String(shown));
	});
	// 7. save and reopen
	const proj = await stored(P);
	await a.close();
	const R = await openSession(browser, Session, proj);
	await openBox(R, 'W1');
	rows = await tankSection(R.P);
	INPUTS.forEach((i) => ok(form + ': the reopened project shows ' + i[0] + ' = ' + i[2] + ' on the Well', (rowIn(rows, i[0]) || {}).value === i[2], JSON.stringify(rowIn(rows, i[0]))));
	// 8. .inp
	const inp = await exportInp(R.a);
	ok(form + ': the .inp export has a [TANKS] row for T1', !!inp && !!tanksRow(inp, 'T1'), inp ? '' : 'no download');
	const row = tanksRow(inp, 'T1') || [];
	console.log('        [TANKS] T1: ' + row.join(' '));
	if (!pressure) {
		// ID Elevation InitLevel MinLevel MaxLevel Diameter MinVol VolCurve Overflow; the .inp's Elevation is the tank's base (the Base elevation).
		ok(form + ': the row carries the base elevation, the three depths, the diameter, the minimum volume and the overflow', near(+row[1], 4) && near(+row[2], 13) && near(+row[3], 3) && near(+row[4], 41) && near(+row[5], 61) && near(+row[6], 501) && /^(NO|No|no)$/.test(String(row[8] || 'NO')), row.join(' '));
	} else {
		ok(form + ': the row carries the base elevation', near(+row[1], 4), row.join(' '));
	}
	await R.a.close();
	if (inp) {
		const Z = await openSession(browser, Session, { inp });
		await openBox(Z, 'W1');
		rows = await tankSection(Z.P);
		ok(form + ': the .inp read back has the Well with its tank section', !!rows, '');
		const want = INPUTS.filter((i) => ['Base elevation', 'Initial depth', 'Minimum depth', 'Maximum depth', 'Tank diameter', 'Minimum volume'].indexOf(i[0]) >= 0);
		want.forEach((i) => ok(form + ': the .inp read back shows ' + i[0] + ' = ' + i[2] + ' on the Well', (rowIn(rows, i[0]) || {}).value === i[2], JSON.stringify(rowIn(rows, i[0]))));
		ok(form + ': no uncaught page errors on the read-back', Z.a.errors.length === 0, Z.a.errors.slice(0, 2).join(' | '));
		await Z.a.close();
	}
}

async function main() {
	const env = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'env.js'));
	const { Session } = require(path.join(REPO, 'dev', 'browser-pass', 'lib', 'session.js'));
	const { chromium } = require(path.join(REPO, 'dev', 'browser-pass', 'node_modules', 'playwright-core'));
	await env.startServer();
	const executablePath = env.findChromium();
	if (!executablePath) { console.error(NAME + ': no Chromium found. SKIPPING.'); env.stopServer(); process.exit(0); }
	const browser = await chromium.launch({ executablePath });
	try {
		await runForm(browser, Session, 'Well with tank');
		await runForm(browser, Session, 'Well with pressure tank');
	} finally {
		await browser.close();
		env.stopServer();
	}
	console.log('\n' + NAME + ': ' + (checks - failures) + '/' + checks + ' checks passed');
	if (failures) { process.exitCode = 1; }
}
main().catch((e) => { console.error(e); process.exit(1); });
